# Data Model: Monorepo Structure

**Feature**: Monorepo Structure | **Date**: 2026-06-18

This feature is infrastructure scaffolding — it establishes the repository layout, build tooling, and development environment. There are no domain entities or database tables created in this feature. Domain data models are defined in subsequent features (IAM, Ticketing, SLA, etc.).

## Configuration Entities

The following configuration artifacts are the "data model" for this feature:

### Workspace Package

A self-contained unit within the monorepo.

| Attribute | Description |
|-----------|-------------|
| `name` | Scoped package name (e.g., `@better-itsm/api`, `@better-itsm/contracts`) |
| `type` | `app` (deployable) or `package` (shared library) |
| `dependencies` | Other workspace packages this package depends on |
| `scripts` | Build, test, lint, dev commands |
| `tsconfig` | TypeScript configuration extending a shared base |

**Workspace packages in this feature**:

| Package | Type | Path | Dependencies |
|---------|------|------|-------------|
| `@better-itsm/api` | app | `apps/api` | `@better-itsm/contracts`, `@better-itsm/tsconfig`, `@better-itsm/eslint-config` |
| `@better-itsm/web` | app | `apps/web` | `@better-itsm/contracts`, `@better-itsm/tsconfig`, `@better-itsm/eslint-config` |
| `@better-itsm/contracts` | package | `packages/contracts` | `@better-itsm/tsconfig`, `@better-itsm/eslint-config` |
| `@better-itsm/tsconfig` | package | `packages/tsconfig` | — |
| `@better-itsm/eslint-config` | package | `packages/eslint-config` | — |

### Service Container

A Docker service in the compose stack.

| Attribute | Description |
|-----------|-------------|
| `name` | Service name in docker-compose |
| `image` | Base image or build context |
| `ports` | Exposed port mappings |
| `volumes` | Persistent data or source code mounts |
| `healthcheck` | Readiness probe command |
| `depends_on` | Services that must be healthy first |

**Service containers in this feature**:

| Service | Image/Build | Default Port | Healthcheck | Depends On |
|---------|-------------|-------------|-------------|------------|
| `postgres` | `postgres:16-alpine` | 5432 | `pg_isready` | — |
| `redis` | `redis:7-alpine` | 6379 | `redis-cli ping` | — |
| `api` | `./docker/api.Dockerfile` | 4000 | `GET /health` | postgres, redis |
| `web` | `./docker/web.Dockerfile` | 3000 | HTTP check | api |

### Environment Configuration

| Variable | Default | Used By | Description |
|----------|---------|---------|-------------|
| `NODE_ENV` | `development` | api, web | Runtime environment |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/better_itsm` | api | PostgreSQL connection |
| `REDIS_URL` | `redis://localhost:6379` | api | Redis connection |
| `API_PORT` | `4000` | api | Backend HTTP port |
| `WEB_PORT` | `3000` | web | Frontend dev server port |
| `API_HOST` | `0.0.0.0` | api | Backend bind address |
| `CORS_ORIGIN` | `http://localhost:3000` | api | Allowed CORS origin |

## Relationships

```text
@better-itsm/tsconfig ◄── @better-itsm/eslint-config
       ▲                           ▲
       │                           │
       ├───────────────────────────┤
       │                           │
@better-itsm/contracts ◄── @better-itsm/api
       ▲                           │
       │                           ▼
       └────────────── @better-itsm/web
                                   │
                                   ▼
                        [postgres, redis] (Docker)
```
