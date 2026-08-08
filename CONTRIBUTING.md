# Contributing to Quiz Builder

Thank you for your interest in contributing to the Quiz Builder project! This document outlines the development workflow, code standards, and processes to ensure a smooth collaboration.

## 📋 Development Workflow

### 1. Branching Strategy

Use **conventional branch naming**:

| Prefix      | Purpose          | Example                        |
| ----------- | ---------------- | ------------------------------ |
| `feat/`     | New feature      | `feat/add-quiz-duplication`    |
| `fix/`      | Bug fix          | `fix/quiz-form-validation`     |
| `refactor/` | Code refactoring | `refactor/quiz-api-types`      |
| `docs/`     | Documentation    | `docs/update-readme`           |
| `chore/`    | Maintenance      | `chore/update-dependencies`    |
| `test/`     | Test additions   | `test/quiz-form-accessibility` |

### 2. Commit Messages

Follow **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)**:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `perf`, `style`, `ci`

**Examples:**

```
feat(quiz): add multiple choice question type
fix(api): handle prisma connection timeout
refactor(frontend): extract shared Button component
docs: update README with docker commands
chore(deps): update react to v19
```

### 3. Pull Request Process

1. **Create branch** from `main` with conventional name
2. **Develop** with frequent commits
3. **Run quality checks** locally before pushing:
   ```bash
   npm run lint && npm run typecheck && npm run test
   ```
4. **Open PR** with clear title and description
5. **CI passes** → Code review → Squash & merge

---

## 🏗️ Architecture Guidelines

### Frontend: Feature-Sliced Design (FSD)

Strict layer hierarchy (top → bottom):

```
app/       → Pages + Providers (routing, i18n, query client)
pages/     → Page compositions (QuizListPage, QuizDetailPage)
widgets/   → Composite blocks (Navbar, QuizListGrid)
features/  → Business features (QuizForm, schema)
entities/  → Business entities (QuizCard, Quiz API, types)
shared/    → Shared kernel (UI, API, hooks, lib)
```

**Rules:**

- Import only from **same or lower** layers
- Use `public API` (index.ts) for cross-slice imports
- No circular dependencies
- Enforced via `eslint-plugin-boundaries`

### Backend: Modular NestJS

```
src/
├── modules/
│   ├── quizzes/        # Quiz domain (controller, service, DTOs)
│   ├── health/         # Health checks
│   └── config/         # Env validation
├── common/             # Filters, pipes, guards, interceptors
├── prisma/             # Prisma service/module
├── app.module.ts       # Root module
└── main.ts             # Bootstrap + Swagger
```

**Rules:**

- Feature modules encapsulate domain logic
- Shared code in `common/`
- Prisma only in services, never in controllers
- DTOs with `class-validator` decorators

---

## 🔧 Code Quality Standards

### TypeScript

- **Strict mode** enabled in both apps
- **No `any`** — use proper types, `unknown` when needed
- **Type inference** preferred over explicit annotations
- **Zod schemas** for runtime validation + type safety

### Linting & Formatting

```bash
# Check
npm run lint

# Auto-fix
npm run lint:fix

# Format
npm run format
```

**ESLint config includes:**

- TypeScript ESLint recommended
- React hooks rules
- Import ordering
- FSD boundary enforcement
- No unused variables/parameters

### Pre-commit Hooks (Husky)

Automatically runs on `git commit`:

1. `lint-staged` → ESLint + Prettier on staged files
2. `commitlint` → Validates commit message format

---

## 🧪 Testing Requirements

### What to Test

| Layer        | Unit Tests                        | Integration/E2E                   |
| ------------ | --------------------------------- | --------------------------------- |
| **Backend**  | Services, utilities, DTOs         | Controller endpoints (E2E)        |
| **Frontend** | Components, hooks, schemas, utils | Storybook interaction, Playwright |

### Test Commands

```bash
# All tests
npm run test

# With coverage
npm run test:cov

# Backend E2E
npm run test:e2e

# Frontend only
npm run test -w frontend

# Frontend with UI
npm run test:ui -w frontend
```

### Frontend Test Stack

- **Vitest** — Unit/integration tests (jsdom)
- **Testing Library** — Component rendering & queries
- **MSW** — API mocking
- **vitest-axe** — Accessibility assertions
- **Storybook + Vitest** — Visual/interaction tests
- **Playwright** — E2E (configured separately)

### Writing Tests

**Component test example:**

```tsx
import { render, screen } from '@testing-library/react';
import { QuizCard } from './QuizCard';
import { axe } from 'vitest-axe';

it('renders correctly', () => {
  render(<QuizCard quiz={{ id: '1', title: 'Test', _count: { questions: 5 } }} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});

it('has no a11y violations', async () => {
  const { container } = render(<QuizCard quiz={...} />);
  expect(await axe(container)).toHaveNoViolations();
});
```

---

## 📦 Dependency Management

### Adding Dependencies

```bash
# Production
npm install <pkg> -w backend    # or -w frontend

# Development
npm install -D <pkg> -w backend # or -w frontend
```

**Guidelines:**

- Prefer existing utilities over new deps
- Check bundle size impact (`npm run build` → analyze)
- Keep versions aligned across workspace where possible

### Updating Dependencies

```bash
# Check outdated
npm outdated -w backend
npm outdated -w frontend

# Update (patch/minor)
npm update -w backend
npm update -w frontend
```

---

## 🔄 Release Process

Automated via **standard-version**:

```bash
npm run release
```

This:

1. Bumps version in `package.json`
2. Generates `CHANGELOG.md` from conventional commits
3. Creates git commit + tag
4. Push with `git push --follow-tags origin main`

---

## 🛡️ Security

- **Never commit secrets** — use `.env` files (gitignored)
- **Validate all inputs** — Zod (frontend), class-validator (backend)
- **Rate limiting** — NestJS Throttler on all endpoints
- **Helmet** — Security headers
- **CORS** — Configured for specific origins

---

## 📚 Documentation

- **API Docs:** Swagger at `/api/docs` (dev)
- **Architecture Decisions:** `docs/adr` (ADRs via `npm run adr`)
- **Component Docs:** Storybook (`npm run storybook -w frontend`)
- **Code Comments:** JSDoc for public APIs, complex logic

---

## ❓ Getting Help

- Check existing issues/PRs
- Review architecture in `plans/`
- Ask in PR comments or team chat

---

## ✅ Pre-Push Checklist

Before pushing, ensure:

- [ ] `npm run lint` passes (no errors)
- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes (all tests green)
- [ ] `npm run build` succeeds
- [ ] Commits follow Conventional Commits
- [ ] No `console.log` / debug code
- [ ] New features have tests
- [ ] Breaking changes documented

---

Thank you for contributing! 🎉
