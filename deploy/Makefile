.PHONY: deploy image push namespace secrets migrations apply

REGISTRY ?= ghcr.io/CHANGE-ME
TAG      ?= $(shell git -C ../server rev-parse --short HEAD)
IMAGE    := $(REGISTRY)/bonfire-server:$(TAG)
NS       := bonfire

# Build, push and roll out the current server commit.
deploy: image push namespace migrations apply

# infra.config.json is baked into the image; distroless brings CA certs for
# the Supabase JWKS fetch.
image:
	cd ../server && encore build docker \
		--config ../deploy/infra.config.json \
		--base gcr.io/distroless/static-debian12:nonroot \
		--arch amd64 \
		$(IMAGE)

push:
	docker push $(IMAGE)

namespace:
	kubectl create namespace $(NS) --dry-run=client -o yaml | kubectl apply -f -

# One-time, and whenever a secret changes (then restart: kubectl -n bonfire rollout restart deploy/server).
secrets: namespace
	kubectl apply -f secrets.yaml

migrations:
	kubectl -n $(NS) create configmap bonfire-migrations \
		--from-file=../server/persistence/migrations \
		--dry-run=client -o yaml | kubectl apply -f -

apply:
	sed 's|__IMAGE__|$(IMAGE)|' bonfire.yaml | kubectl apply -f -
	kubectl -n $(NS) rollout status statefulset/postgres --timeout=3m
	kubectl -n $(NS) rollout status deployment/server --timeout=5m
