package creator

import (
	"fmt"
	"net/url"
	"regexp"
	"slices"
	"strings"
	"unicode/utf8"

	"encore.dev/beta/errs"
)

var slugPattern = regexp.MustCompile(`^[a-z0-9][a-z0-9_-]{1,30}[a-z0-9]$`)

// reservedSlugs would shadow app routes at bonfire.mn/<slug>.
var reservedSlugs = []string{
	"about", "admin", "ai", "api", "app", "auth", "blog", "c", "creator",
	"creators", "dashboard", "explore", "faq", "help", "home", "login",
	"logout", "pricing", "privacy", "qr-code", "robots", "search",
	"settings", "signup", "sitemap", "static", "support", "terms", "www",
}

func validateSlug(slug string) error {
	if !slugPattern.MatchString(slug) {
		return invalid("slug must be 3-32 lowercase letters, digits, - or _")
	}
	if slices.Contains(reservedSlugs, slug) {
		return &errs.Error{Code: errs.AlreadyExists, Message: "slug is taken"}
	}
	return nil
}

var platforms = []string{
	"website", "facebook", "instagram", "x", "youtube", "tiktok",
	"twitch", "discord", "github", "other",
}

const maxLinks = 10

func validateLinks(links []Link) error {
	if len(links) > maxLinks {
		return invalid(fmt.Sprintf("at most %d links", maxLinks))
	}
	for _, l := range links {
		if !slices.Contains(platforms, l.Platform) {
			return invalid("unknown link platform " + l.Platform)
		}
		u, err := url.Parse(l.URL)
		if err != nil || (u.Scheme != "https" && u.Scheme != "http") || u.Host == "" || len(l.URL) > 500 {
			return invalid("invalid link url")
		}
	}
	return nil
}

// checkLen trims s and checks its length in characters.
func checkLen(field string, s *string, min, max int) error {
	*s = strings.TrimSpace(*s)
	if n := utf8.RuneCountInString(*s); n < min || n > max {
		return invalid(fmt.Sprintf("%s must be %d-%d characters", field, min, max))
	}
	return nil
}

func invalid(msg string) error {
	return &errs.Error{Code: errs.InvalidArgument, Message: msg}
}
