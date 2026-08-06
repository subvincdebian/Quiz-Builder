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

### 🟩 Front-End (React + Vite)

- **Core:** React, Vite, TypeScript
- **Styling:** Tailwind CSS (v4)
- **Architecture:** Feature-Sliced Design (FSD)
- **Form Handling:** React Hook Form, Zod
- **Icons:** Lucide React

### 🟨 Infrastructure

- **Monorepo Management:** npm Workspaces
- **Containerization:** Docker (Postgres, Redis)

---

## 📁 Project Structure

```text
quiz-builder/
├── backend/                 # NestJS API application & Prisma schema
├── frontend/                # React + Vite application (FSD)
├── plans/                   # Architectural plans
├── docker-compose.dev.yml   # Local development environment
├── package.json             # Root workspaces configuration
└── README.md                # Project documentation
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

Start Backend and Frontend:

```bash
# In separate terminals or using a concurrent runner
cd backend && npm run start:dev
cd frontend && npm run dev
```

---

## 📄 License

This project is for educational/testing purposes within a hiring process and is provided under the [MIT License](./LICENSE).

---

## 🤝 Contributing

Guidelines and workflow for this project can be found in `CONTRIBUTING.md`.
