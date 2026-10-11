// Package persistence owns the Bonfire database: the migrations, the sqlc
// queries in queries/ and the Go code generated from them (`make sqlc`).
//
// Other services reach the database through Open, never with raw SQL.
package persistence

import (
	"errors"

	"encore.dev/storage/sqldb"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Service exists only to own the database; it exposes no endpoints.
//
//encore:service
type Service struct{}

var db = sqldb.NewDatabase("bonfire", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

// Open returns the query set and connection pool for a database handle,
// obtained in the calling service with sqldb.Named("bonfire").
func Open(handle *sqldb.Database) (*Queries, *pgxpool.Pool) {
	pool := sqldb.Driver[*pgxpool.Pool](handle)
	return New(pool), pool
}

// IsNotFound reports whether err means a :one query matched no rows.
func IsNotFound(err error) bool {
	return errors.Is(err, pgx.ErrNoRows)
}

// UniqueViolation returns the name of the violated unique constraint, or ""
// when err is not a unique violation.
func UniqueViolation(err error) string {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return pgErr.ConstraintName
	}
	return ""
}
