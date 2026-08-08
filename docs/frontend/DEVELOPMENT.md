# Development Guide

This document outlines the setup, workflow, and standards for developing on the Quiz Builder frontend.

## Prerequisites

- Node.js (v22+)
- npm

## Setup

1. Clone the repository.
2. Navigate to the `frontend` directory: `cd frontend`
3. Install dependencies: `npm install`
4. Set up environment variables: Copy `.env.example` to `.env` and configure accordingly.
5. Start development server: `npm run dev`

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs linting checks (Oxlint).
- `npm run test`: Runs unit and integration tests (Vitest).
- `npm run test:e2e`: Runs E2E tests (Playwright).
- `npm run storybook`: Starts Storybook development server.

## Code Standards

- Adhere to the existing feature-based folder structure.
- Follow established naming conventions.
- All new features must include unit tests.
