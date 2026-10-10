package authn

import (
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"testing"
	"time"

	"encore.dev/beta/errs"
	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
)

const (
	testBase = "https://test.supabase.co"
	testKID  = "test-key"
)

func newTestService(t *testing.T, pub *ecdsa.PublicKey) *Service {
	t.Helper()
	b64 := base64.RawURLEncoding.EncodeToString
	set, err := json.Marshal(map[string]any{"keys": []map[string]string{{
		"kty": "EC", "crv": "P-256", "alg": "ES256", "use": "sig", "kid": testKID,
		"x": b64(pub.X.FillBytes(make([]byte, 32))),
		"y": b64(pub.Y.FillBytes(make([]byte, 32))),
	}}})
	if err != nil {
		t.Fatal(err)
	}
	jwks, err := keyfunc.NewJWKSetJSON(set)
	if err != nil {
		t.Fatal(err)
	}
	return &Service{jwks: jwks, parser: newParser(testBase)}
}

func sign(t *testing.T, key *ecdsa.PrivateKey, c jwt.MapClaims) string {
	t.Helper()
	tok := jwt.NewWithClaims(jwt.SigningMethodES256, c)
	tok.Header["kid"] = testKID
	s, err := tok.SignedString(key)
	if err != nil {
		t.Fatal(err)
	}
	return s
}

func validClaims() jwt.MapClaims {
	return jwt.MapClaims{
		"iss":          testBase + "/auth/v1",
		"aud":          "authenticated",
		"sub":          "user-123",
		"exp":          time.Now().Add(time.Hour).Unix(),
		"email":        "a@b.mn",
		"role":         "authenticated",
		"session_id":   "sess-1",
		"aal":          "aal1",
		"app_metadata": map[string]any{"provider": "email"},
	}
}

func TestAuthHandler(t *testing.T) {
	key, _ := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	otherKey, _ := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	svc := newTestService(t, &key.PublicKey)

	uid, data, err := svc.AuthHandler(context.Background(), sign(t, key, validClaims()))
	if err != nil {
		t.Fatalf("valid token rejected: %v", err)
	}
	if uid != "user-123" || data.Email != "a@b.mn" || data.SessionID != "sess-1" {
		t.Fatalf("unexpected user: uid=%q data=%+v", uid, data)
	}

	with := func(k string, v any) jwt.MapClaims {
		c := validClaims()
		if v == nil {
			delete(c, k)
		} else {
			c[k] = v
		}
		return c
	}
	hs256, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, validClaims()).SignedString([]byte("secret"))

	rejected := map[string]string{
		"expired":       sign(t, key, with("exp", time.Now().Add(-time.Minute).Unix())),
		"no exp":        sign(t, key, with("exp", nil)),
		"wrong issuer":  sign(t, key, with("iss", "https://evil.supabase.co/auth/v1")),
		"anon audience": sign(t, key, with("aud", "anon")),
		"no subject":    sign(t, key, with("sub", nil)),
		"wrong key":     sign(t, otherKey, validClaims()),
		"hs256":         hs256,
		"garbage":       "not-a-jwt",
	}
	for name, tok := range rejected {
		t.Run(name, func(t *testing.T) {
			_, _, err := svc.AuthHandler(context.Background(), tok)
			if errs.Code(err) != errs.Unauthenticated {
				t.Fatalf("want unauthenticated, got %v", err)
			}
		})
	}
}
