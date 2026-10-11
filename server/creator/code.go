package creator

import (
	"crypto/rand"
	"math/big"
)

// Unambiguous characters only (no 0/O, 1/I/L), so a printed code can be typed.
const codeAlphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"

const codeLength = 8

// newCode returns a random QR code ID (31^8 ≈ 8.5e11 combinations).
// Uniqueness is enforced by the database; callers retry on collision.
func newCode() string {
	max := big.NewInt(int64(len(codeAlphabet)))
	b := make([]byte, codeLength)
	for i := range b {
		n, err := rand.Int(rand.Reader, max)
		if err != nil {
			panic(err) // crypto/rand never fails on supported platforms
		}
		b[i] = codeAlphabet[n.Int64()]
	}
	return string(b)
}
