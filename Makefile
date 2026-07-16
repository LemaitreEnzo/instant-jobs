export SHELL := /bin/bash

up:
	docker compose -f docker-compose$(if $(ARGS),-$(ARGS)).yml up -d

down:
	docker compose down

migrate:
	@echo "===== Running DB migrations ====="
	@docker compose exec backend npm run migrate && \
	echo "===== Migrations finished =====" || \
	(echo "===== Migrations FAILED =====" && exit 1)