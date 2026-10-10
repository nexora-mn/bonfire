// Package authn verifies Supabase-issued access tokens and exposes the
// caller's identity to every `auth` endpoint in the app.
package authn

import (
	"context"
	"encoding/json"
	"strings"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
)

var secrets struct {
	// SupabaseURL is the project URL, e.g. https://<ref>.supabase.co.
	SupabaseURL string
}

// UserData is available in auth endpoints via auth.Data().(*authn.UserData).
type UserData struct {
	ID          string          `json:"id"`
	Email       string          `json:"email"`
	Role        string          `json:"role"`
	IsAnonymous bool            `json:"is_anonymous"`
	SessionID   string          `json:"session_id"`
	AAL         string          `json:"aal"`
	AppMetadata json.RawMessage `json:"app_metadata"`
}

// claims mirrors the Supabase access token payload.
// See https://supabase.com/docs/guides/auth/jwt-fields.
type claims struct {
	jwt.RegisteredClaims
	Email       string          `json:"email"`
	Role        string          `json:"role"`
	IsAnonymous bool            `json:"is_anonymous"`
	SessionID   string          `json:"session_id"`
	AAL         string          `json:"aal"`
	AppMetadata json.RawMessage `json:"app_metadata"`
}

//encore:service
type Service struct {
	jwks   keyfunc.Keyfunc
	parser *jwt.Parser
}

func initService() (*Service, error) {
	base := strings.TrimRight(secrets.SupabaseURL, "/")

	// Keys are cached and refreshed in the background, so verification is
	// local; an unknown kid (key rotation) triggers a rate-limited refetch.
	jwks, err := keyfunc.NewDefault([]string{base + "/auth/v1/.well-known/jwks.json"})
	if err != nil {
		return nil, err
	}

	return &Service{jwks: jwks, parser: newParser(base)}, nil
}

func newParser(base string) *jwt.Parser {
	return jwt.NewParser(
		// Asymmetric signing keys only; rejects HS256 and "none".
		jwt.WithValidMethods([]string{"ES256", "RS256"}),
		jwt.WithIssuer(base+"/auth/v1"),
		jwt.WithAudience("authenticated"),
		jwt.WithExpirationRequired(),
	)
}

// AuthHandler validates the `Authorization: Bearer <access_token>` header.
//
//encore:authhandler
func (s *Service) AuthHandler(ctx context.Context, token string) (auth.UID, *UserData, error) {
	var c claims
	if _, err := s.parser.ParseWithClaims(token, &c, s.jwks.Keyfunc); err != nil {
		rlog.Debug("rejected access token", "err", err)
		return "", nil, &errs.Error{Code: errs.Unauthenticated, Message: "invalid token"}
	}
	if c.Subject == "" {
		return "", nil, &errs.Error{Code: errs.Unauthenticated, Message: "invalid token"}
	}

	return auth.UID(c.Subject), &UserData{
		ID:          c.Subject,
		Email:       c.Email,
		Role:        c.Role,
		IsAnonymous: c.IsAnonymous,
		SessionID:   c.SessionID,
		AAL:         c.AAL,
		AppMetadata: c.AppMetadata,
	}, nil
}

// Me returns the authenticated caller.
//
//encore:api auth method=GET path=/me
func Me(ctx context.Context) (*UserData, error) {
	return auth.Data().(*UserData), nil
}
