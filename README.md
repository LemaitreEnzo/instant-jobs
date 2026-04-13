# 🚀 Instant Jobs

Une plateforme moderne de recherche d'emploi et de recrutement construite avec React, Node.js et PostgreSQL.

## 📋 Description

Instant Jobs est une application web full-stack qui facilite la mise en relation entre employeurs et candidats. La plateforme offre une interface intuitive pour publier des offres d'emploi, rechercher des opportunités et gérer les candidatures.

## ✨ Fonctionnalités

- 🔍 Recherche avancée d'offres d'emploi
- 📝 Publication et gestion d'annonces
- 👤 Profils utilisateurs (candidats et employeurs)
- 📄 Gestion des candidatures
- 🔐 Authentification et sécurité
- 🎨 Interface utilisateur moderne et responsive
- 🐳 Déploiement simplifié avec Docker

## 🛠️ Technologies Utilisées

### Frontend

- **React 19** - Bibliothèque JavaScript / TypeScript pour l'interface utilisateur
- **Vite** - Build tool moderne et rapide
- **React Router** - Navigation et routing
- **CSS** - Stylisation personnalisée

### Backend

- **Node.js** - Runtime JavaScript côté serveur
- **Express.js** - Framework web minimaliste
- **Sequelize** - ORM pour NodeJS
- **PostgreSQL** - Base de données relationnelle
- **Helmet** - Sécurité HTTP (CORS, headers...)
- **dotenv** - Gestion des variables d'environnement

### DevOps & Tests

- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration des services
- **Jest** - Framework de test
- **Supertest** - Testing des API HTTP

## 📁 Structure du Projet

```
instant-jobs/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── assets/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── backend/                  # API Express
│   ├── config/              # Configuration (DB, etc.)
│   ├── src/
│   │   ├── middlewares/         # Middlewares Express
│   │   ├── tests/               # Suites de tests
│   │   ├── routes/              # Routes API
│   │   ├── models/              # Tables de la BD
│   │   └── controllers/         # Controller d'un model
│   ├── app.ts
│   ├── server.ts
│   └── package.json
├── docker-compose.yml       # Orchestration des services
└── README.md
```

## 🚀 Installation et Démarrage

### 1. Cloner le repository

```bash
git clone https://github.com/LemaitreEnzo/Instant-jobs.git
cd Instant-jobs
```

### 2. Configuration avec Docker (Recommandé)

```bash
docker-compose up -d
```

L'application sera disponible sur :

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

Pour arrêter les services :

```bash
docker-compose down
```

### 3. Installation locale (Développement)

#### Backend

```bash
cd backend
npm install
```

##### Configuration `.env` :

1. Création d'un fichier `.env.dev` pour le développement

```env
PORT=

DB_HOST=
DB_PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
```

2. Création d'un fichier `.env.prod` pour la production

```env
PORT=

DB_HOST=
DB_PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
```

#### Frontend

```bash
cd frontend
npm install
```

Configuration `.env` :

```env
VITE_API_URL=
```

Démarrer le frontend :

```bash
npm run dev      # Serveur de développement (port 5173)
npm run build    # Build pour la production
npm run preview  # Aperçu du build
npm run lint     # Vérifier le code avec ESLint
```

## 🧪 Tests

Exécuter les tests du backend :

```bash
cd backend

npm test              # Lancer tous les tests
npm run test:watch   # Mode watch
npm run test:cov     # Avec couverture de code
```

## 📚 Documentation Supplémentaire

- Configuration des base de données
- Guide des API endpoints (à documenter)
- Guide de contribution (à documenter)
- Guide de déploiement (à documenter)

## 📁 Structure du Projet

```
Instant-jobs/
├── frontend/ # Application React
│ ├── src/ # Code source
│ ├── public/ # Assets statiques
│ └── package.json # Dépendances frontend
├── backend/ # API Backend
│ ├── src/ # Code source
│ └── package.json # Dépendances backend
├── docker-compose.yml # Configuration Docker
├── .dockerignore # Fichiers ignorés par Docker
└── README.md # Documentation
```

## 🔧 Scripts Disponibles

### Backend

- `npm run dev` - Lance le serveur en mode développement
