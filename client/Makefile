.PHONY: help dev prod build up down logs clean restart

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

dev: ## Start development environment with hot-reload (port 5173)
	docker compose -f docker-compose.dev.yml up

dev-build: ## Build and start development environment
	docker compose -f docker-compose.dev.yml up --build

dev-down: ## Stop development environment
	docker compose -f docker-compose.dev.yml down

dev-logs: ## Show development logs
	docker compose -f docker-compose.dev.yml logs -f

prod: ## Start production environment (port 8080)
	docker compose up

prod-build: ## Build and start production environment
	docker compose up --build

prod-down: ## Stop production environment
	docker compose down

prod-logs: ## Show production logs
	docker compose logs -f

build: ## Build production image
	docker compose build

up: prod ## Alias for prod

down: ## Stop all containers
	docker compose down
	docker compose -f docker-compose.dev.yml down

logs: ## Show all logs
	docker compose logs -f

restart: ## Restart containers
	docker compose restart

clean: ## Remove containers, images, and volumes
	docker compose down -v --rmi local
	docker compose -f docker-compose.dev.yml down -v --rmi local

shell: ## Open shell in running container
	docker compose exec client sh
