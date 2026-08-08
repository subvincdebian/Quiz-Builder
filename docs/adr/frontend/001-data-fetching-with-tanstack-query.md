# ADR 001: Data Fetching with TanStack Query

## Context

We currently use `useEffect` and `axios` to fetch data, which leads to manual state management (loading, error, data, refetching) in each component.

## Decision

We will use `@tanstack/react-query` to handle all server-state management.

## Consequences

- **Pros:**
  - Automated caching and invalidation.
  - Simplified component logic (no manual `loading`/`error` states).
  - Built-in support for retries and polling.
- **Cons:**
  - Added dependency and learning curve.
