include .env
export

define DOCKER_COMPOSE
	docker compose --env-file ./.docker/.env \
				   -f .docker/env/base/pgsql.yaml \
				   -f .docker/env/base/node.yaml \
				   -f .docker/env/base/frontend.yaml \
				   -f .docker/env/base/adminer.yaml \
				   -f .docker/env/development.yaml
endef

STEP = "\\n\\r*****************************************************************************\\n"

help:
	@echo "=== DOCKER ===";
	@echo "make up              	Start the project (build + containers + dependencies)";
	@echo "make stop            	Stop the containers without removing them";
	@echo "make down            	Stop and remove containers (potential data loss)";
	@echo "make ps              	List running containers";
	@echo "make logs            	Display real-time logs for all services";
	@echo "";
	@echo "=== CLI ===";
	@echo "make backend-cli     	Enter bash CLI in the backend container";
	@echo "make frontend-cli    	Enter bash CLI in the frontend container";
	@echo "make db-cli          	Enter bash CLI in the PostgresSQL container";
	@echo "";
	@echo "=== INSTALLATION ===";
	@echo "make build          	    Build project's images";
	@echo "make update          	Update project (dependencies + migrations)";
	@echo "make deps            	Install dependencies only";
	@echo "make migrate         	Run database migrations only";
	@echo "make migrate-undo     	Undo the last migration";
	@echo "make migrate-undo-all 	Undo all migrations";
	@echo "make load [SEED=file] 	Load seed data (default: load-data.seeder.ts)";
	@echo "make load-all         	Load all seed files";

	@echo "";

base:
	@echo "$(STEP) Starting Docker if the daemon is not running... $(STEP)"
	@if ! docker info > /dev/null 2>&1; then \
		if [ -f /etc/init.d/docker ]; then sudo /etc/init.d/docker start; else open -a Docker; fi; \
	fi
	@until docker info > /dev/null 2>&1; do sleep 1; done;
	@echo "Docker is running";

build:
	@$(DOCKER_COMPOSE) build;
	@echo "$(STEP) Starting up containers... $(STEP)";
	@$(DOCKER_COMPOSE) up -d;

deps:
	@echo "$(STEP) Installing backend dependencies... $(STEP)";
	@docker container exec -it instant-jobs_backend npm install;
	@echo "$(STEP) Installing frontend dependencies... $(STEP)";
	@docker container exec -it instant-jobs_frontend npm install;

up: base build deps
	@echo "$(STEP) Finished! $(STEP)";

migrate:
	@echo "$(STEP) Running database migrations... $(STEP)";
	@docker container exec -it instant-jobs_backend npm run migrate;

migrate-undo:
	@echo "$(STEP) Undoing last migration... $(STEP)";
	@docker container exec -it instant-jobs_backend npm run migrate:undo;

migrate-undo-all:
	@echo "$(STEP) Undoing all migrations... $(STEP)";
	@docker container exec -it instant-jobs_backend npm run migrate:undo:all;

update: deps migrate
	@echo "$(STEP) Project updated successfully! $(STEP)";

stop:
	@echo "$(STEP) Stopping containers... $(STEP)";
	@$(DOCKER_COMPOSE) stop;
	@echo "$(STEP) Finished! $(STEP)";

down:
	@echo "$(STEP) Stopping and removing containers... $(STEP)";
	@$(DOCKER_COMPOSE) down;
	@echo "$(STEP) Finished! $(STEP)";

backend-cli:
	@echo "$(STEP) Entering bash CLI in instant-jobs_backend... $(STEP)";
	@docker container exec -it instant-jobs_backend sh;

frontend-cli:
	@echo "$(STEP) Entering bash CLI in instant-jobs_frontend... $(STEP)";
	@docker container exec -it instant-jobs_frontend sh;

db-cli:
	@echo "$(STEP) Entering bash CLI in instant-jobs_pgsql... $(STEP)";
	@docker container exec -it instant-jobs_pgsql /bin/bash -c "PGPASSWORD=$(DB_PASSWORD) psql --username $(DB_USER) $(DB_NAME)";

logs:
	@echo "$(STEP) Displaying logs... $(STEP)";
	@$(DOCKER_COMPOSE) logs -f;

ps:
	@echo "$(STEP) List containers... $(STEP)";
	@$(DOCKER_COMPOSE) ps;
	@echo "$(STEP) Finished! $(STEP)";

load:
	@echo "$(STEP) Loading seed data ($(or $(SEED),load-data.seeder.ts))... $(STEP)";
	@docker container exec -it instant-jobs_backend npm run load -- $(or $(SEED),load-data.seeder.ts);

load-all:
	@echo "$(STEP) Loading all seed files... $(STEP)";
	@docker container exec -it instant-jobs_backend npm run load:all;
