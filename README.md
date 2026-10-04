# Instant Jobs

Plateforme de suivi et de gestion du parcours de recherche d'alternance et de stage pour les etudiants, connectée aux structures de formation (ecoles, campus, promotions, specialites) et à leurs equipes pédagogiques et administratives.

## Stack Technique

| Couche | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, React Router 7/8 |
| Backend | Node.js, Express 5, Sequelize 6, PostgreSQL 16, TypeScript |
| Base de donnees & GUI | PostgreSQL 16, Adminer 5.4 |
| Conteneurisation | Docker, Docker Compose |
| Tests & Outillage API | Jest, Supertest, Bruno API Client |

## Prerequis

- Docker (version 24.0 ou superieure)
- Docker Compose (version 2.20 ou superieure)
- GNU Make
- Reseau Docker externe nomme `proxy` :
  ```bash
  docker network create proxy
  ```

## Installation et Demarrage

### 1. Cloner le projet

```bash
git clone https://github.com/LemaitreEnzo/instant-jobs.git
cd instant-jobs
```

### 2. Configurer les variables d'environnement

Le projet utilise des fichiers de configuration d'environnement dedies par composant. Creez les fichiers `.env` a partir de leurs modeles `.env.dist` respectifs :

```bash
# Configuration globale et Docker
cp .env.dist .env
cp .docker/.env.dist .docker/.env

# Configuration Backend
cp backend/.env.dist backend/.env

# Configuration Frontend
cp frontend/.env.dist frontend/.env
```

Pour les tests avec la collection Bruno (optionnel) :
```bash
cp bruno/.env.dist bruno/.env
```

#### Detail des fichiers de configuration

- Racine (`.env`) :
  - `FRONTEND_CONTAINER`, `FRONTEND_PORT`, `VITE_API_URL` : Configuration conteneur et URL d'exposition frontend.
  - `BACKEND_CONTAINER`, `API_PORT` : Nom du conteneur et port de l'API.
  - `DB_CONTAINER`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_VOLUME` : Parametres de connexion et persistance PostgreSQL.
  - `ADMINER_CONTAINER`, `ADMINER_PORT` : Nom et port d'acces de l'interface Adminer.
  - `NETWORK` : Nom du reseau Docker externe (ex: `proxy`).

- Docker (`.docker/.env`) :
  - `COMPOSE_PROJECT_NAME` : Nom du projet Docker Compose.
  - `COMPOSE_IGNORE_ORPHANS` : Gestion des conteneurs orphelins.

- Backend (`backend/.env`) :
  - `VERSION` : Version de l'API utilisee pour le prefixe des routes (ex: `v1`).
  - `TOKEN` : Nom du cookie securise HTTP-Only stockant le jeton de session (ex: `token`).
  - `SECRET` : Cle secrete utilisee pour la signature et la verification des jetons JWT.

- Frontend (`frontend/.env`) :
  - `VITE_API_VERSION` : Version de l'API ciblee par le client (ex: `v1`).
  - `VITE_BASE_API_URL` : URL de base du serveur API (ex: `http://localhost:3000`).

- Bruno (`bruno/.env`, optionnel) :
  - `API_URL` : URL du serveur pour executer les requetes de test (ex: `http://localhost:3000`).
  - `API_VERSION` : Version de l'API ciblee dans la collection (ex: `v1`).

### 3. Demarrer avec Make

L'ensemble des services est orchestre via le `Makefile` :

```bash
make up
```

Pour initialiser la base de donnees avec les tables et les donnees de demonstration :

```bash
make init
```

## Commandes Make Disponibles

### Cycle de vie Docker
- `make up` : Lance la verification du daemon Docker, le build et le demarrage des conteneurs, puis installe les dependances.
- `make stop` : Arrete les conteneurs sans les supprimer.
- `make down` : Arrete et supprime les conteneurs du projet.
- `make ps` : Liste l'etat des conteneurs en cours d'execution.
- `make logs` : Affiche les logs en temps reel de tous les services.

### Acces CLI aux conteneurs
- `make backend-cli` : Ouvre un terminal interactif dans le conteneur backend.
- `make frontend-cli` : Ouvre un terminal interactif dans le conteneur frontend.
- `make db-cli` : Ouvre une session psql interactive sur PostgreSQL.

### Base de donnees & Migrations
- `make migrate` : Compile TypeScript et applique les migrations Sequelize.
- `make migrate-undo` : Annule la derniere migration.
- `make migrate-undo-all` : Annule l'ensemble des migrations appliquees.
- `make load` : Charge les donnees initiales du seeder par defaut (`load-data.seeder.ts`).
- `make load SEED=<nom_du_fichier>` : Execute un seeder specifique.
- `make load-all` : Execute tous les seeders disponibles.
- `make init` : Reinitialise completement la base (`migrate-undo-all` -> `migrate` -> `load`).

## Architecture du Projet

```
instant-jobs/
|-- .docker/                  # Configurations Docker modulaires
|   |-- env/                  # Fichiers Compose d'environnements (base, dev, prod)
|   |   |-- base/             # Services de base : pgsql, node, frontend, adminer
|   |   `-- development.yaml  # Surcouche d'environnement de developpement
|   |-- frontend/             # Dockerfiles dedies au frontend
|   `-- node/                 # Dockerfiles dedies au backend
|-- .github/workflows/        # Pipeline CI/CD GitHub Actions (deploy.yml)
|-- backend/                  # API REST Express en TypeScript
|   |-- config/               # Configuration Sequelize et limiteur de requetes
|   |-- middlewares/          # Middlewares d'authentification et de controle des roles
|   |-- src/
|   |   |-- controllers/      # Logique metier des controleurs REST
|   |   |-- db/               # Migrations, seeders et configuration base de donnees
|   |   |-- models/           # Modeles Sequelize, enums et associations
|   |   |-- routes/           # Definitions des routes API versionnees
|   |   `-- tests/            # Tests fonctionnels Jest / Supertest
|   |-- utils/                # Fonctions utilitaires (hash, env helper, slugs)
|   |-- app.ts                # Configuration du serveur Express
|   `-- server.ts             # Point d'entree d'initialisation et d'ecoute
|-- frontend/                 # Application client React 19 en TypeScript
|   |-- src/
|   |   |-- assets/           # Feuilles de style CSS natives, images et polices
|   |   |-- components/       # Composants reactifs UI, layout et metier
|   |   |-- constants/        # Routes et constantes globales
|   |   |-- context/          # Contexte d'authentification (AuthProvider)
|   |   |-- hooks/            # Hooks React personnalises (CRUD et formulaires)
|   |   |-- interfaces/       # Types et interfaces TypeScript
|   |   |-- lib/              # Client API fetch typé
|   |   |-- pages/            # Vues principales de l'application
|   |   `-- scripts/          # Script interactif de generation de composants
|   `-- vite.config.ts        # Configuration du bundler Vite
|-- bruno/                    # Collection de requetes HTTP et tests API Bruno
|-- Makefile                  # Commandes d'automatisation
`-- README.md                 # Documentation du projet
```

## Modele de Donnees

Le schema relationnel structure l'environnement educatif et le suivi des candidatures :

- Organization : Entite principale (ecoles ou entreprises partenaires). Un espace dedie aux entreprises pour le depot d'offres et la consultation des profils d'etudiants est prevu dans les evolutions futures.
- Campus : Etablissements physiques relies a une ecole.
- Promotion : Sessions de formation rattachees a un campus.
- Speciality : Filieres et filieres principales d'une promotion.
- SubSpeciality : Options ou sous-specialisations d'une filiere.
- User : Utilisateurs de la plateforme avec 3 roles distincts :
  - `student` : Etudiant lie a une ecole, un campus, une promotion, des specialites, et associe a un statut de recherche (`search`, `pending`, `found`).
  - `staff` : Membre de l'equipe pedagogique ou administrative.
  - `admin` : Administrateur de la plateforme.
- Application : Candidature creee par un etudiant (stage ou alternance), comprenant le titre, l'entreprise, la ville, la date, le statut (`pending`, `refused`, `accepted`) et les relances (`follow up`, `interview completed`, `no follow up`, `not necessary`).
- Appointment : Rendez-vous ou entretiens planifies, associes a un etudiant et a une candidature.
- Media : Documents et pieces jointes (CV, lettres de motivation) relies aux etudiants.

## Securite et Authentification

- Chiffrement des mots de passe : Hachage bcrypt.
- Authentification : Tokens JWT transmis exclusivement via un cookie securise HTTP-Only avec l'attribut `SameSite=Strict`.
- Controle d'acces :
  - `authenticateUser` : Valide la presence et l'integrite du token de session.
  - `checkRole` : Restreint l'acces selon les roles autorises (`admin`, `staff`, `student`).
  - `checkUser` : Verifie la propriete des ressources modifiees par les etudiants pour eviter toute elevation de privilege horizontal.
- Protection HTTP & Reseau : En-tetes securises via `helmet` et limitation du debit de requetes via `express-rate-limit` sur les endpoints sensibles (authentification, creations et modifications).

## Tests et Qualite

### Backend (Jest / Supertest)

Le backend comprend 9 suites de tests fonctionnels couvrant l'ensemble des controleurs et verifiant les autorisations par role et les cas d'erreur :

```bash
cd backend
npm run test:cov      # Execution avec rapport de couverture
npm run test:watch    # Mode surveillance
```

### Collection d'API Bruno

Les fichiers de requetes pour tester l'API manuellement ou en automatisation se trouvent dans le dossier `bruno/`. Ils couvrent l'ensemble des endpoints CRUD de chaque ressource (`user`, `organization`, `campus`, `promotion`, `speciality`, `subSpeciality`, `application`, `appointment`, `media`).

### Frontend

- Execution en mode developpement :
  ```bash
  cd frontend
  npm run dev
  ```
- Creation assistee de composants :
  ```bash
  npm run create
  ```
- Verification de conformite du code :
  ```bash
  npm run lint
  ```
- Compilation TypeScript et build Vite :
  ```bash
  npm run build
  ```

## Deploiement Continu (CI/CD)

Le deploiement est automatise via GitHub Actions (`.github/workflows/deploy.yml`) lors d'un push sur la branche `main` :
1. Connexion SSH au serveur VPS cible.
2. Synchronisation du depot avec la branche de production (`git fetch`, `git reset --hard`).
3. Reconstruction et relance a chaud des conteneurs (`docker compose up -d --build`).
4. Nettoyage des images Docker obsoletes.
