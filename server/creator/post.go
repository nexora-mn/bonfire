package creator

import (
	"context"
	"strings"
	"time"

	"encore.app/events"
	"encore.app/persistence"
	"encore.dev/beta/errs"
	"encore.dev/types/uuid"
)

type Post struct {
	ID         string    `json:"id"`
	Title      string    `json:"title"`
	Body       string    `json:"body"`
	ImageKey   *string   `json:"imageKey"`
	ImageURL   *string   `json:"imageUrl"`
	Visibility string    `json:"visibility"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

func toPost(p persistence.Post) Post {
	return Post{
		ID:         p.ID.String(),
		Title:      p.Title,
		Body:       p.Body,
		ImageKey:   p.ImageKey,
		ImageURL:   mediaURL(p.ImageKey),
		Visibility: p.Visibility,
		CreatedAt:  p.CreatedAt,
		UpdatedAt:  p.UpdatedAt,
	}
}

type PostList struct {
	Posts []Post `json:"posts"`
}

// ListPosts returns all of the page's posts, newest first.
//
//encore:api auth method=GET path=/creator/me/posts
func (s *Service) ListPosts(ctx context.Context) (*PostList, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	rows, err := s.q.ListPosts(ctx, c.ID)
	if err != nil {
		return nil, err
	}
	out := make([]Post, len(rows))
	for i, p := range rows {
		out[i] = toPost(p)
	}
	return &PostList{Posts: out}, nil
}

type PostParams struct {
	Title string `json:"title"`
	Body  string `json:"body"`
	// Key returned by POST /creator/me/media/post, or null for no image.
	ImageKey *string `json:"imageKey"`
	// "public" or "members".
	Visibility string `json:"visibility"`
}

func (p *PostParams) Validate() error {
	if err := checkLen("title", &p.Title, 1, 200); err != nil {
		return err
	}
	if err := checkLen("body", &p.Body, 0, 20000); err != nil {
		return err
	}
	if p.Visibility != "public" && p.Visibility != "members" {
		return invalid("visibility must be public or members")
	}
	return nil
}

// checkImage rejects image keys outside the creator's folder for `kind`.
func checkImage(c persistence.Creator, kind string, key *string) error {
	if key != nil && !strings.HasPrefix(*key, mediaPrefix(c.ID, kind)) {
		return invalid("unknown image")
	}
	return nil
}

// CreatePost publishes a post on the page.
//
//encore:api auth method=POST path=/creator/me/posts
func (s *Service) CreatePost(ctx context.Context, p *PostParams) (*Post, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	if err := checkImage(c, "post", p.ImageKey); err != nil {
		return nil, err
	}
	row, err := s.q.CreatePost(ctx, persistence.CreatePostParams{
		CreatorID:  c.ID,
		Title:      p.Title,
		Body:       p.Body,
		ImageKey:   p.ImageKey,
		Visibility: p.Visibility,
	})
	if err != nil {
		return nil, err
	}
	events.PostUpdated(ctx, row.ID, false)
	events.CreatorUpdated(ctx, c.ID, true)
	out := toPost(row)
	return &out, nil
}

var errPostNotFound = &errs.Error{Code: errs.NotFound, Message: "post not found"}

// UpdatePost edits a post. A replaced image is deleted.
//
//encore:api auth method=PUT path=/creator/me/posts/:id
func (s *Service) UpdatePost(ctx context.Context, id uuid.UUID, p *PostParams) (*Post, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	if err := checkImage(c, "post", p.ImageKey); err != nil {
		return nil, err
	}
	old, err := s.q.GetPost(ctx, persistence.GetPostParams{ID: id, CreatorID: c.ID})
	if persistence.IsNotFound(err) {
		return nil, errPostNotFound
	} else if err != nil {
		return nil, err
	}
	row, err := s.q.UpdatePost(ctx, persistence.UpdatePostParams{
		ID:         id,
		CreatorID:  c.ID,
		Title:      p.Title,
		Body:       p.Body,
		ImageKey:   p.ImageKey,
		Visibility: p.Visibility,
	})
	if err != nil {
		return nil, err
	}
	deleteReplaced(ctx, old.ImageKey, p.ImageKey)
	events.PostUpdated(ctx, id, false)
	out := toPost(row)
	return &out, nil
}

// DeletePost removes a post and its image.
//
//encore:api auth method=DELETE path=/creator/me/posts/:id
func (s *Service) DeletePost(ctx context.Context, id uuid.UUID) error {
	c, err := s.mine(ctx)
	if err != nil {
		return err
	}
	imageKey, err := s.q.DeletePost(ctx, persistence.DeletePostParams{ID: id, CreatorID: c.ID})
	if persistence.IsNotFound(err) {
		return errPostNotFound
	} else if err != nil {
		return err
	}
	deleteObject(ctx, imageKey)
	events.PostUpdated(ctx, id, false)
	events.CreatorUpdated(ctx, c.ID, true)
	return nil
}
