package creator

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"encore.app/persistence"
	"encore.dev"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
	"encore.dev/storage/objects"
	"encore.dev/types/uuid"
)

// media holds creator images: avatars, covers and post images.
var media = objects.NewBucket("creator-media", objects.BucketConfig{Public: true})

const maxImageBytes = 5 << 20

var imageExts = map[string]string{
	"image/jpeg": "jpg",
	"image/png":  "png",
	"image/webp": "webp",
	"image/gif":  "gif",
}

func mediaURL(key *string) *string {
	if key == nil {
		return nil
	}
	u := media.PublicURL(*key).String()
	return &u
}

// mediaPrefix is where a creator's images of one kind live. Keys a client
// sends back (post images) must start with it, so nobody can attach
// another creator's file.
func mediaPrefix(creatorID uuid.UUID, kind string) string {
	return fmt.Sprintf("creators/%s/%s/", creatorID, kind)
}

type UploadResponse struct {
	Key string `json:"key"`
	URL string `json:"url"`
}

// UploadMedia stores an image sent as the raw request body.
// `kind` is "avatar" or "cover" (set on the page immediately, replacing the
// previous image), or "post" or "tier" (returned for use in a post or tier).
//
//encore:api auth raw method=POST path=/creator/me/media/:kind
func (s *Service) UploadMedia(w http.ResponseWriter, req *http.Request) {
	resp, err := s.uploadMedia(req)
	if err != nil {
		errs.HTTPError(w, err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (s *Service) uploadMedia(req *http.Request) (*UploadResponse, error) {
	ctx := req.Context()
	kind := encore.CurrentRequest().PathParams.Get("kind")
	if kind != "avatar" && kind != "cover" && kind != "post" && kind != "tier" {
		return nil, invalid("kind must be avatar, cover, post or tier")
	}
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}

	data, err := io.ReadAll(http.MaxBytesReader(nil, req.Body, maxImageBytes))
	var tooLarge *http.MaxBytesError
	if errors.As(err, &tooLarge) {
		return nil, invalid("image must be 5 MB or smaller")
	} else if err != nil {
		return nil, err
	}
	// Sniff the bytes rather than trusting the client's Content-Type.
	contentType := http.DetectContentType(data)
	ext, ok := imageExts[contentType]
	if !ok {
		return nil, invalid("image must be JPEG, PNG, WebP or GIF")
	}

	key := mediaPrefix(c.ID, kind) + uuid.Must(uuid.NewV4()).String() + "." + ext
	wr := media.Upload(ctx, key, objects.WithUploadAttrs(objects.UploadAttrs{ContentType: contentType}))
	if _, err := io.Copy(wr, bytes.NewReader(data)); err != nil {
		wr.Abort(err)
		return nil, err
	}
	if err := wr.Close(); err != nil {
		return nil, err
	}

	var old *string
	switch kind {
	case "avatar":
		old = c.AvatarKey
		_, err = s.q.SetCreatorAvatar(ctx, persistence.SetCreatorAvatarParams{ID: c.ID, AvatarKey: &key})
	case "cover":
		old = c.CoverKey
		_, err = s.q.SetCreatorCover(ctx, persistence.SetCreatorCoverParams{ID: c.ID, CoverKey: &key})
	}
	if err != nil {
		return nil, err
	}
	deleteObject(ctx, old)
	if kind == "avatar" || kind == "cover" {
	}

	return &UploadResponse{Key: key, URL: media.PublicURL(key).String()}, nil
}

// RemoveMedia clears the page's avatar or cover image.
//
//encore:api auth method=DELETE path=/creator/me/media/:kind
func (s *Service) RemoveMedia(ctx context.Context, kind string) (*Creator, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	var old *string
	switch kind {
	case "avatar":
		old = c.AvatarKey
		c, err = s.q.SetCreatorAvatar(ctx, persistence.SetCreatorAvatarParams{ID: c.ID})
	case "cover":
		old = c.CoverKey
		c, err = s.q.SetCreatorCover(ctx, persistence.SetCreatorCoverParams{ID: c.ID})
	default:
		return nil, invalid("kind must be avatar or cover")
	}
	if err != nil {
		return nil, err
	}
	deleteObject(ctx, old)
	return s.toCreator(ctx, c)
}

// deleteReplaced removes the old image when an edit swapped or cleared it.
func deleteReplaced(ctx context.Context, old, current *string) {
	if old != nil && (current == nil || *current != *old) {
		deleteObject(ctx, old)
	}
}

// deleteObject removes a replaced image. Failure only leaves an orphaned
// file, so it is logged rather than returned.
func deleteObject(ctx context.Context, key *string) {
	if key == nil || !strings.HasPrefix(*key, "creators/") {
		return
	}
	if err := media.Remove(ctx, *key); err != nil && !errors.Is(err, objects.ErrObjectNotFound) {
		rlog.Warn("failed to remove media", "key", *key, "err", err)
	}
}
