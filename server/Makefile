.PHONY: run sqlc migration client typesense

run:
	encore run

# Regenerate persistence/*.sql.go from persistence/queries/*.sql.
sqlc:
	sqlc generate

# Create a new golang-migrate migration: make migration name=add_foo
# (Pre-production, table changes go straight into 1_initial.up.sql instead.)
migration:
	migrate create -ext sql -dir persistence/migrations -seq $(name)

# Regenerate the UI's typed API client after changing endpoints.
client:
	encore gen client serve-c23i --lang=typescript --env=local --output=../ui/src/lib/api/client.gen.ts

# Start the local Typesense the search service talks to.
typesense:
	docker compose up -d typesense
