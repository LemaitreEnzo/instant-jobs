# 🚀 Instant Jobs

A modern job search and recruitment platform built with React, Node.js, and PostgreSQL. It facilitates the connection between employers and candidates, providing an intuitive interface for publishing job offers, searching for opportunities, and managing applications.

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, React Router |
| **Backend** | Node.js, Express.js, Sequelize, PostgreSQL |
| **Database GUI**| Adminer |
| **Containers** | Docker, Docker Compose |
| **Testing** | Jest, Supertest |

## 📋 Requirements

- **Docker** >= 24.0
- **Docker Compose** >= 2.20

## 🚀 Installation & Setup

### 1. Clone the project

```bash
git clone https://github.com/LemaitreEnzo/instant-jobs.git
cd instant-jobs
```

### 2. Configure Environment

Copy the example environment file and adjust the values if necessary:

```bash
cp .env.example .env
```

### 3. Start development environment

Using the provided Makefile, you can easily start all Docker containers:

```bash
make up
```

## ⌨️ Available Commands

The project includes a `Makefile` to simplify common operations:

```bash
make help         # Display help
make up           # Start the project (build + containers + dependencies)
make stop         # Stop the containers without removing them
make down         # Stop and remove containers (potential data loss)
make ps           # List running containers
make logs         # Display real-time logs for all services
make backend-cli  # Enter bash CLI in the backend container
make frontend-cli # Enter bash CLI in the frontend container
make db-cli       # Enter bash CLI in the PostgreSQL container
make update       # Update project (dependencies + migrations)
make deps         # Install dependencies only
make migrate      # Run database migrations
```

## 📁 Project Structure

```
instant-jobs/
├── .docker/                    # Docker configuration
│   ├── env/
│   │   ├── base/              # Base services (pgsql, node, frontend, adminer)
│   │   └── development.yaml   # Dev overrides
├── .github/workflows/         # CI/CD GitHub Actions
├── backend/                   # Express API
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── db/                # Database configurations & migrations
│   │   ├── models/            # Sequelize models
│   │   ├── routes/            # API routes
│   │   └── tests/             # Jest/Supertest test suites
│   ├── app.ts                 # Express app setup
│   ├── server.ts              # Server entry point
│   └── package.json
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React contexts
│   │   ├── interfaces/        # TypeScript interfaces
│   │   ├── pages/             # Page components
│   │   ├── scripts/           # Utility scripts (e.g., component generator)
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── shared/                    # Shared resources between front/back
├── Makefile                   # Make commands for Docker lifecycle
└── README.md
```

## 🌍 Environments

| Environment | Branch | Deployment |
|-------------|--------|------------|
| Development | `dev` | `make up` |
| Production | `main` | Auto (GitHub Actions) |

## 🔄 CI/CD

Deployment is automated via GitHub Actions (`deploy.yml`).

### Runner Requirements
1. SSH access configured via GitHub Secrets (`HOST`, `USERNAME`, `SSH_KEY`, `SSH_PASSPHRASE`, `SSH_PORT`, `PROJECT_PATH`)
2. Docker and Docker Compose installed on the deployment server

### Deployment Steps
When pushing to the `main` branch, the workflow:
1. Connects via SSH to the VPS
2. Fetches the latest `main` branch
3. Runs `docker compose up -d --build` to reconstruct and start services without downtime
4. Cleans up old Docker images

## 🧪 Testing (Local)

To run the backend tests locally (assuming node modules are installed):

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:cov      # Run with coverage
```

## 💡 Local Development (Without Docker)

If you prefer to run the application outside of Docker for development:

**1. Backend**
```bash
cd backend
npm install
```

**2. Frontend**
```bash
cd frontend
npm install
```

Run the development server:
```bash
npm run dev
```

*Frontend tools:* You can generate new components using `npm run create`.

## 📜 License

Proprietary - Instant Jobs
