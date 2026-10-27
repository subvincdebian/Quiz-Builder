<img src="https://raw.githubusercontent.com/subvincdebian/subvincdebian/main/assets/repo-Quiz-Builder.svg" alt="Quiz-Builder project overview" width="100%" />

# Quiz Builder

A full-stack quiz authoring application with a React interface and a NestJS REST API. Built as an educational project for a hiring assessment.

## What it does

- Create quizzes with boolean, text input, checkbox, and multiple-choice questions.
- Browse and search quizzes, inspect questions and correct answers, and delete quizzes with confirmation.
- Switch between English, Ukrainian, German, French, and Spanish interface translations.
- Store quizzes in PostgreSQL through Prisma, with Redis-backed caching, request validation, rate limiting, health checks, and Swagger documentation.

**Stack:** TypeScript, React 19, Vite, Tailwind CSS 4, React Hook Form, Zod, i18next, NestJS 11, Prisma, PostgreSQL, Redis. Managed with npm workspaces.

## Run locally

Use **Node.js 24** (see [.nvmrc](.nvmrc)), npm, and Docker Compose. Run these commands from the repository root:

```sh
npm ci
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Set `backend/.env` to match the local Compose services:

```dotenv
DATABASE_URL=postgresql://postgres:password@localhost:5432/quizdb
REDIS_URL=redis://localhost:6379
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

The frontend example already sets `VITE_API_URL=http://localhost:3000`.

```sh
docker compose -f docker-compose.dev.yml up -d
cd backend
npx prisma generate
npm run migration:deploy
cd ..
npm run dev
```

Wait for PostgreSQL to accept connections before applying migrations. Open the frontend at `http://localhost:5173` and the API explorer at `http://localhost:3000/api/docs`. To run either app separately, use `npm run dev:frontend` or `npm run dev:backend`.

## Checks

Configured commands, run from the repository root after setup:

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Check both TypeScript projects |
| `npm run build` | Build the backend and frontend |
| `npm run lint` | Run the root ESLint check |
| `npm run test -w backend -- --runInBand` | Run backend Jest unit tests |
| `npm run test -w frontend -- --run` | Run frontend Vitest tests once |
| `npm run test:e2e` | Run backend API tests; PostgreSQL and Redis must be available |
| `npm run storybook -w frontend` | Open component documentation on port 6006 |

Frontend browser tests use `npm run test:e2e -w frontend`. Install Chromium first with `cd frontend` followed by `npx playwright install chromium`; return to the repository root to run the workspace command. Playwright starts Vite; API-dependent scenarios also need the backend and its services.

## Source map

| Path | Contents |
| --- | --- |
| [frontend/src](frontend/src/) | Pages, features, entities, widgets, and shared UI |
| [backend/src/modules/quizzes](backend/src/modules/quizzes/) | Quiz controller, validation, service, and unit tests |
| [backend/prisma](backend/prisma/) | Database schema and migrations |
| [backend/test](backend/test/) · [frontend/e2e](frontend/e2e/) | API and browser tests |
| [docs/adr](docs/adr/) | Architecture decisions |
| [docs/frontend](docs/frontend/) | Frontend development and deployment notes |

## Scope and project notes

This is an assessment project. The API currently exposes create, list, detail, and delete operations without user authentication or per-user access control. The interface includes an edit flow, but the backend has no matching update endpoint. Correct answers are visible in quiz details; taking quizzes and recording scores are outside the current implementation.

Local Compose credentials are for development. Production Compose and deployment notes are included for reference and require environment-specific review. Some older supporting documentation may describe scripts or versions that differ from the current manifests; use the commands above and each package's `package.json` as the reference.

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution conventions and [LICENSE](LICENSE) for the existing MIT license.
