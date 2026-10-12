.PHONY: run sqlc migration migrate-up client docker

run:
	encore run

sqlc:
	sqlc generate

migration:
	migrate create -ext sql -dir persistence/migrations -seq $(name)

# Apply migrations to a self-hosted database; the Docker image doesn't run them.
# make migrate-up DATABASE_URL='postgres://user:pass@host:5432/postgres?sslmode=require'
migrate-up:
	migrate -path persistence/migrations -database "$(DATABASE_URL)" up

client:
	encore gen client serve-c23i --lang=typescript --env=local --output=../ui/src/lib/api/client.gen.ts

# Build the self-hosted image; infra comes from infra.config.json: make docker tag=bonfire:latest
# The Encore runtime (v1.57.13) reads a database's map key as the server-side
# name and `name` as the Encore name, the reverse of the build check and docs,
# so the image's embedded config gets the two swapped back in a final layer.
docker:
	encore build docker --config infra.config.json $(tag)-base
	tmp=$$(mktemp -d) && cid=$$(docker create $(tag)-base) && \
	docker cp $$cid:/encore/infra.config.json $$tmp/infra.json && docker rm $$cid >/dev/null && \
	jq '.sql_servers[].databases |= with_entries({key: (.value.name // .key), value: (.value + {name: .key})})' \
		$$tmp/infra.json > $$tmp/infra.config.json && \
	printf 'FROM %s\nCOPY infra.config.json /encore/infra.config.json\n' '$(tag)-base' | docker build -q -t $(tag) -f- $$tmp && \
	rm -rf $$tmp
