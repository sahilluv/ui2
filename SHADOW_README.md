# Shadow

Shadow is a monorepo for a student social product with a React Native mobile app, NestJS API, Prisma data layer, and local development infrastructure.

## Structure

- `apps/mobile` — Expo + React Native app
- `apps/api` — NestJS API foundation
- `packages/types` — shared TypeScript types
- `packages/config` — environment/config helpers
- `packages/validation` — small validation utilities
- `prisma` — Prisma schema and configuration
- `docs` — project documentation
- `tests` — test scaffolding and project checks
- `docker-compose.yml` — local PostgreSQL and Redis development services

## Local development

```bash
# install workspace dependencies
npm install

# start the mobile app
npm run start --workspace apps/mobile

# start the API in development mode
npm run start:dev --workspace apps/api

# validate the mobile app
npm.cmd run typecheck --workspace apps/mobile

# validate the API
npm.cmd run typecheck --workspace apps/api
```

## Platform services

- PostgreSQL for application persistence
- Redis for future session, cache, rate-limit, and notification-counter use
- Docker Compose for local developer infrastructure

## Environment

Use `.env.example` as the template for local environment variables. Do not commit real secrets or `.env` files.
