export SHELL := /bin/bash

up:
	@echo "=========================================="
	@echo "🚀 Démarrage des conteneurs Docker..."
	@echo "=========================================="
	docker compose -f docker-compose$(if $(ARGS),-$(ARGS)).yml up -d
	@echo "✅ Conteneurs démarrés avec succès !"

down:
	@echo "=========================================="
	@echo "🛑 Arrêt des conteneurs Docker..."
	@echo "=========================================="
	docker compose down
	@echo "✅ Conteneurs arrêtés."

install:
	@echo "=========================================="
	@echo "🧹 Nettoyage du Backend..."
	@echo "=========================================="
	@rm -rf backend/node_modules
	@rm -f backend/package-lock.json
	@echo "📦 Installation des dépendances du Backend..."
	@cd backend && npm i
	@echo "✅ Backend installé avec succès !"
	@echo ""
	@echo "=========================================="
	@echo "🧹 Nettoyage du Frontend..."
	@echo "=========================================="
	@rm -rf frontend/node_modules
	@rm -f frontend/package-lock.json
	@echo "📦 Installation des dépendances du Frontend..."
	@cd frontend && npm i
	@echo "✅ Frontend installé avec succès !"

migrate:
	@echo "=========================================="
	@echo "🔄 Exécution des migrations de la base de données..."
	@echo "=========================================="
	@docker compose exec backend npm run migrate && \
	(echo "==========================================" && \
	 echo "✅ Migrations terminées avec succès !" && \
	 echo "==========================================") || \
	(echo "==========================================" && \
	 echo "❌ Erreur : Les migrations ont ÉCHOUÉ !" && \
	 echo "==========================================" && exit 1)