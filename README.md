# 🌐 Quiz Builder

A modern, high-performance **Quiz Builder Application** built as a monorepo using **npm workspaces**. Powered by **NestJS** on the backend and **React + Vite** on the frontend, following **Feature-Sliced Design (FSD)** principles for scalable architecture.

---

## 🛠️ Tech Stack

### 🟦 Back-End (NestJS)

- **Framework:** NestJS (Modular Architecture)
- **API Documentation:** Swagger (`/api/docs`)
- **Database & Caching:** PostgreSQL, Redis, Prisma ORM
- **Auth & Security:** Helmet, CORS, NestJS Throttler (Rate Limiting)
- **Validation:** `class-validator`, `class-transformer`
- **Logging:** Pino, nestjs-pino
- **Health Checks:** NestJS Terminus

### 🟩 Front-End (React + Vite)

- **Core:** React 19, Vite 8, TypeScript 6
- **Styling:** Tailwind CSS v4
- **Architecture:** Feature-Sliced Design (FSD)
- **State Management:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod
- **Routing:** React Router v7
- **i18n:** i18next, react-i18next
- **Icons:** Lucide React
- **Testing:** Vitest, Testing Library, Playwright (E2E), Vitest-Axe (a11y)
- **Storybook:** Component documentation & visual testing

### 🟨 Infrastructure

- **Monorepo Management:** npm Workspaces
- **Containerization:** Docker (Postgres, Redis)
- **CI/CD:** GitHub Actions (via standard-version for releases)
- **Code Quality:** ESLint, Prettier, Husky, lint-staged, Commitlint
- **Type Safety:** TypeScript strict mode, Prisma type generation

---

## 📁 Project Structure

```text
quiz-builder/
├── backend/                 # NestJS API application
│   ├── src/
│   │   ├── modules/         # Feature modules (quizzes, health, config)
│   │   ├── prisma/          # Prisma service & module
│   │   ├── common/          # Shared filters, pipes, guards
│   │   ├── app.module.ts    # Root module
│   │   └── main.ts          # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── test/                # E2E tests
│   └── package.json
├── frontend/                # React + Vite application (FSD)
│   ├── src/
│   │   ├── app/             # App layer (routing, providers)
│   │   ├── pages/           # Page components (QuizList, QuizDetail, QuizForm)
│   │   ├── widgets/         # Composite UI blocks (Navbar, QuizListGrid)
│   │   ├── features/        # Business features (quiz form, schema)
│   │   ├── entities/        # Business entities (Quiz, QuizCard, api)
│   │   ├── shared/          # Shared kernel (ui, api, hooks, lib)
│   │   │   ├── ui/          # Base UI components (Button, Input, Modal, etc.)
│   │   │   ├── api/         # API client, query client
│   │   │   ├── hooks/       # Shared hooks (useDebounce)
│   │   │   └── lib/         # Utilities (i18n, cn, utils)
│   │   ├── test/            # Test setup (MSW handlers, vitest-axe)
│   │   └── stories/         # Storybook configuration
│   ├── vitest.config.ts     # Vitest configuration (unit + storybook)
│   └── package.json
├── docs/                    # Documentation
│   └── adr/                 # Architectural plans (ADR)
├── docker-compose.dev.yml   # Local dev: Postgres + Redis
├── docker-compose.prod.yml  # Production deployment
├── package.json             # Root workspaces & shared scripts
├── README.md                # This file
├── CONTRIBUTING.md          # Contribution guidelines
└── LICENSE                  # MIT License
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js:** `>=20.x`
- **Docker & Docker Compose**

### 2. Install dependencies

```bash
npm install
```

### 3. Run Development Environment

Start PostgreSQL and Redis:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Run database migrations:

```bash
npm run migration:deploy -w backend
```

Start Backend and Frontend (in one terminal):

```bash
npm run dev
```

Or separately:

```bash
# Terminal 1 - Backend (http://localhost:3000, Swagger at /api/docs)
npm run dev:backend

# Terminal 2 - Frontend (http://localhost:5173)
npm run dev:frontend
```

---

## 📜 Available Scripts

Run from root:

| Command                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Start both backend & frontend in dev mode        |
| `npm run dev:backend`  | Start backend only (watch mode)                  |
| `npm run dev:frontend` | Start frontend only (Vite dev server)            |
| `npm run build`        | Build both apps for production                   |
| `npm run lint`         | Lint all packages (ESLint)                       |
| `npm run lint:fix`     | Auto-fix lint issues                             |
| `npm run format`       | Format code with Prettier                        |
| `npm run typecheck`    | TypeScript type checking (no emit)               |
| `npm run test`         | Run unit tests (backend: Jest, frontend: Vitest) |
| `npm run test:cov`     | Run tests with coverage                          |
| `npm run test:e2e`     | Run backend E2E tests                            |
| `npm run release`      | Create release with standard-version             |
| `npm run adr`          | Create new Architecture Decision Record          |

---

## 🗄️ Database

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate -w backend

# Run migrations (dev)
npm run prisma:migrate:dev -w backend

# Deploy migrations (prod)
npm run migration:deploy -w backend

# Open Prisma Studio
npm run prisma:studio -w backend
```

### Schema Overview

- **Quiz**: id, title, createdAt, questions[]
- **Question**: id, type (BOOLEAN|INPUT|CHECKBOX|MULTIPLE_CHOICE), text, options[], correctAnswers[], quizId

---

## 🧪 Testing Strategy

### Backend (Jest)

- **Unit tests:** `src/**/*.spec.ts` — services, controllers
- **E2E tests:** `test/*.e2e-spec.ts` — full API integration

### Frontend (Vitest)

- **Unit tests:** `src/**/*.{test,spec}.tsx` — components, hooks, utils, schemas
- **Storybook tests:** Visual regression & interaction tests via `@storybook/addon-vitest`
- **Accessibility:** `vitest-axe` integration in component tests
- **E2E tests:** Playwright (configured, run separately)

```bash
# Run all frontend tests
npm run test -w frontend

# Run with UI
npm run test:ui -w frontend

# Run storybook tests
npm run test:storybook -w frontend
```

---

## 📦 Production Deployment

### Docker (Recommended)

```bash
# Build images
docker compose -f docker-compose.prod.yml build

# Start production stack
docker compose -f docker-compose.prod.yml up -d
```

Required environment variables for production:

```env
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...
REDIS_PASSWORD=...
DOCKER_REGISTRY=...
IMAGE_TAG=latest
```

### Manual Deployment

1. Build: `npm run build`
2. Run migrations: `npm run migration:deploy -w backend`
3. Start backend: `npm run start:prod -w backend`
4. Serve frontend `dist/` with nginx or similar

---

## 🔧 Development Tools

### Code Quality

- **ESLint** — TypeScript/React rules, boundaries plugin for FSD enforcement
- **Prettier** — Consistent formatting
- **Husky + lint-staged** — Pre-commit hooks
- **Commitlint** — Conventional commit messages

### Type Safety

- Strict TypeScript config in both apps
- Prisma generates types from schema
- Zod schemas for runtime validation + type inference
- API contracts validated at runtime (quiz API)

### Architecture Enforcement

- **FSD boundaries** via `eslint-plugin-boundaries`
- Public API exports through `index.ts` barrels
- Shared kernel (`shared/`) isolated from features

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

Quick summary:

1. Follow Conventional Commits
2. Run `npm run lint && npm run typecheck && npm run test` before pushing
3. Adhere to FSD (frontend) and Modular Architecture (backend)
4. Write tests for new features
5. Update documentation for API/schema changes

---

## 📄 License

This project is for educational/testing purposes within a hiring process and is provided under the [MIT License](./LICENSE).
