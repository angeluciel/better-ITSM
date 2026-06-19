# Workspace Contracts: Monorepo Structure

**Feature**: Monorepo Structure | **Date**: 2026-06-18

This feature establishes the monorepo infrastructure. The contracts defined here are the internal workspace interfaces — how packages discover, depend on, and communicate with each other during build and development.

## Turborepo Pipeline Contract

Turborepo tasks define the build/test/lint dependency graph. All packages must conform to these task names in their `package.json` scripts.

### Required Script Names

Every workspace package MUST implement these scripts (or omit them if not applicable — Turborepo skips missing scripts):

| Script | Purpose | Turborepo Dependencies |
|--------|---------|----------------------|
| `build` | Compile TypeScript to JavaScript | Depends on `build` of workspace dependencies |
| `dev` | Start dev server with hot reload | No cache |
| `test` | Run unit/integration tests | Depends on `build` of workspace dependencies |
| `lint` | Run ESLint | No inter-package dependency |
| `typecheck` | Run `tsc --noEmit` | Depends on `build` of workspace dependencies |
| `format` | Run Prettier --check | No inter-package dependency |
| `clean` | Remove build artifacts (`dist/`, `.turbo/`) | No inter-package dependency |

### Pipeline Configuration (turbo.json)

```jsonc
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "format": {},
    "clean": {
      "cache": false
    }
  }
}
```

## Package Naming Contract

All workspace packages use the `@better-itsm/` scope:

| Pattern | Example | Location |
|---------|---------|----------|
| `@better-itsm/<app-name>` | `@better-itsm/api` | `apps/<app-name>` |
| `@better-itsm/<package-name>` | `@better-itsm/contracts` | `packages/<package-name>` |

## Shared Contracts Package Interface

The `@better-itsm/contracts` package exports Zod schemas and inferred TypeScript types. Consumers import from the package name, never from relative paths.

### Export Convention

```typescript
// packages/contracts/src/index.ts — barrel export
export * from './auth';
export * from './ticket';
export * from './common';
```

### Schema Naming Convention

| Pattern | Example | Description |
|---------|---------|-------------|
| `<Entity>Schema` | `TicketSchema` | Full entity validation |
| `Create<Entity>Schema` | `CreateTicketSchema` | Creation input validation |
| `Update<Entity>Schema` | `UpdateTicketSchema` | Partial update validation |
| `<Entity>` (type) | `Ticket` | Inferred type via `z.infer<typeof TicketSchema>` |

### Consumer Usage

**Backend (NestJS)**:
```typescript
import { CreateTicketSchema } from '@better-itsm/contracts';
```

**Frontend (React)**:
```typescript
import { CreateTicketSchema, type CreateTicket } from '@better-itsm/contracts';
```

## Docker Compose Service Contract

All services follow these conventions for inter-service communication:

| Convention | Value | Notes |
|------------|-------|-------|
| Internal network | `better-itsm` (bridge) | All services on the same Docker network |
| Service discovery | Docker DNS (`postgres`, `redis`, `api`, `web`) | Services reference each other by service name |
| Health check interval | 10s | All services define a healthcheck |
| Restart policy | `unless-stopped` | Production; dev override may differ |

### Port Mapping Contract

| Service | Container Port | Host Port (default) | Configurable Via |
|---------|---------------|-------------------|-----------------|
| `postgres` | 5432 | `${POSTGRES_PORT:-5432}` | `.env` |
| `redis` | 6379 | `${REDIS_PORT:-6379}` | `.env` |
| `api` | 4000 | `${API_PORT:-4000}` | `.env` |
| `web` | 3000 | `${WEB_PORT:-3000}` | `.env` |

## Environment Variable Contract

All environment variables MUST be documented in `.env.example` with sensible defaults. The application MUST start with only the defaults (no required secrets for local development).

### Variable Naming

| Pattern | Example | Description |
|---------|---------|-------------|
| `DATABASE_*` | `DATABASE_URL` | PostgreSQL connection settings |
| `REDIS_*` | `REDIS_URL` | Redis connection settings |
| `API_*` | `API_PORT`, `API_HOST` | Backend service settings |
| `WEB_*` | `WEB_PORT` | Frontend service settings |
| `CORS_*` | `CORS_ORIGIN` | CORS configuration |
