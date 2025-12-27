.PHONY: help dev prod build up down logs clean restart

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

dev: ## Start both client and server in development mode
	@echo "Starting client on port 5173..."
	@cd client && docker compose -f docker-compose.dev.yml up -d
	@echo "Starting server on port 3000..."
	@cd server && docker compose -f docker-compose.dev.yml up -d
	@echo ""
	@echo "✓ Development environment started"
	@echo "  Client: http://localhost:5173"
	@echo "  Server: http://localhost:3000"
	@echo ""
	@echo "Run 'make logs' to see logs"

dev-build: ## Build and start both in development mode
	@cd client && docker compose -f docker-compose.dev.yml up -d --build
	@cd server && docker compose -f docker-compose.dev.yml up -d --build
	@echo "✓ Development environment built and started"

prod: ## Start both client and server in production mode
	@echo "Starting client on port 8080..."
	@cd client && docker compose up -d
	@echo "Starting server on port 3000..."
	@cd server && docker compose up -d
	@echo ""
	@echo "✓ Production environment started"
	@echo "  Client: http://localhost:8080"
	@echo "  Server: http://localhost:3000"

prod-build: ## Build and start both in production mode
	@cd client && docker compose up -d --build
	@cd server && docker compose up -d --build
	@echo "✓ Production environment built and started"

up: dev ## Alias for dev

dev-down: ## Stop development containers only
	@cd client && docker compose -f docker-compose.dev.yml down
	@cd server && docker compose -f docker-compose.dev.yml down
	@echo "✓ Development containers stopped"

prod-down: ## Stop production containers only
	@cd client && docker compose down
	@cd server && docker compose down
	@echo "✓ Production containers stopped"

down: ## Stop all containers (dev + prod)
	@cd client && docker compose down && docker compose -f docker-compose.dev.yml down
	@cd server && docker compose down && docker compose -f docker-compose.dev.yml down
	@echo "✓ All containers stopped"

dev-logs: ## Show logs from development containers
	@echo "=== Client Logs ==="
	@cd client && docker compose -f docker-compose.dev.yml logs --tail=50
	@echo ""
	@echo "=== Server Logs ==="
	@cd server && docker compose -f docker-compose.dev.yml logs --tail=50

prod-logs: ## Show logs from production containers
	@echo "=== Client Logs ==="
	@cd client && docker compose logs --tail=50
	@echo ""
	@echo "=== Server Logs ==="
	@cd server && docker compose logs --tail=50

logs: dev-logs ## Show logs from both client and server (defaults to dev)

logs-follow: ## Follow logs from both client and server
	@docker compose -f client/docker-compose.dev.yml logs -f & \
	docker compose -f server/docker-compose.dev.yml logs -f

client-logs: ## Show client logs
	@cd client && docker compose logs -f 

server-logs: ## Show server logs
	@cd server && docker compose logs -f

restart: ## Restart all containers
	@cd client && docker compose restart
	@cd server && docker compose restart
	@echo "✓ All containers restarted"

clean: ## Remove all containers, images, and volumes
	@cd client && docker compose down -v --rmi local && docker compose -f docker-compose.dev.yml down -v --rmi local
	@cd server && docker compose down -v --rmi local && docker compose -f docker-compose.dev.yml down -v --rmi local
	@echo "✓ Cleaned up all containers, images, and volumes"

client-shell: ## Open shell in client container
	@cd client && docker compose exec client sh

server-shell: ## Open shell in server container
	@cd server && docker compose exec server sh

status: ## Show status of all containers
	@echo "=== Client Containers ==="
	@cd client && docker compose ps
	@echo ""
	@echo "=== Server Containers ==="
	@cd server && docker compose ps
