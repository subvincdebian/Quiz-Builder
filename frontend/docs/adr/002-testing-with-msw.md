# ADR 002: API Mocking with Mock Service Worker (MSW)

## Context

Our current tests often rely on mocking `axios` directly or don't mock at all. This makes tests brittle and difficult to maintain.

## Decision

We will use `msw` (Mock Service Worker) for network-level API mocking in tests.

## Consequences

- **Pros:**
  - Mocks are independent of the network client (axios, fetch, etc.).
  - Realistic simulation of network requests.
  - Can be reused in development/Storybook.
- **Cons:**
  - Additional setup time.
