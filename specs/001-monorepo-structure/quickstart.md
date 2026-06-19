# Quickstart Validation Guide: Monorepo Structure

**Feature**: Monorepo Structure | **Date**: 2026-06-18

This guide documents how to validate that the monorepo scaffolding works end-to-end. Each scenario maps to a user story from the spec and can be run independently.

## Prerequisites

- Node.js 24 (check with `node -v`)
- pnpm 10+ (check with `pnpm -v`)
- Docker and Docker Compose (check with `docker compose version`)
- Git

## Scenario 1: First-Time Developer Setup (User Story 1 — P1)

**Goal**: Verify a fresh clone installs and runs successfully.

### Steps

```bash
# 1. Clone and install
git clone <repo-url> better-ITSM
cd better-ITSM
pnpm install

# 2. Copy environment defaults
cp .env.example .env

# 3. Start infrastructure (postgres + redis)
docker compose up -d postgres redis

# 4. Start all apps in dev mode
pnpm dev
```

### Expected Outcomes

| Check | Expected Result |
|-------|----------------|
| `pnpm install` completes | Zero errors, single `pnpm-lock.yaml` updated |
| PostgreSQL accessible | `docker compose exec postgres pg_isready` returns "accepting connections" |
| Redis accessible | `docker compose exec redis redis-cli ping` returns "PONG" |
| API starts | `http://localhost:4000/health` returns 200 OK |
| Web starts | `http://localhost:3000` loads the application shell |

### Hot Reload Validation

1. With `pnpm dev` running, edit `apps/web/src/app.tsx` (change any visible text)
2. The browser should reflect the change within 2 seconds without manual refresh
3. Edit `apps/api/src/main.ts` (add a log statement)
4. The API process should restart and the log should appear in the terminal

## Scenario 2: Shared Contract Development (User Story 2 — P2)

**Goal**: Verify the contracts package is consumable by both apps.

### Steps

```bash
# 1. Create a sample schema in contracts
# Edit packages/contracts/src/common.ts — add a test schema

# 2. Build contracts
pnpm --filter @better-itsm/contracts build

# 3. Import in API
# Edit apps/api/src/main.ts — import from @better-itsm/contracts

# 4. Import in Web
# Edit apps/web/src/app.tsx — import from @better-itsm/contracts

# 5. Typecheck both consumers
pnpm typecheck
```

### Expected Outcomes

| Check | Expected Result |
|-------|----------------|
| Contracts build | `pnpm --filter @better-itsm/contracts build` succeeds |
| API import resolves | No TypeScript errors when importing from `@better-itsm/contracts` |
| Web import resolves | No TypeScript errors when importing from `@better-itsm/contracts` |
| Typecheck passes | `pnpm typecheck` shows zero errors across all packages |

## Scenario 3: Build and Test Orchestration (User Story 3 — P3)

**Goal**: Verify Turborepo builds all packages in dependency order with caching.

### Steps

```bash
# 1. Clean build
pnpm clean
pnpm build

# 2. Verify cache on second run
pnpm build
# Output should show "cache hit" for all packages

# 3. Run tests
pnpm test

# 4. Run full quality check
pnpm lint
pnpm typecheck
pnpm format
```

### Expected Outcomes

| Check | Expected Result |
|-------|----------------|
| Clean build succeeds | All packages compile with zero errors |
| Cache hit on rebuild | Second `pnpm build` completes < 10 seconds, all tasks show "FULL TURBO" |
| Tests pass | `pnpm test` runs Vitest across all packages, zero failures |
| Lint passes | `pnpm lint` reports no errors |
| Typecheck passes | `pnpm typecheck` reports no errors |
| Format check passes | `pnpm format` reports no unformatted files |

## Scenario 4: Containerized Local Stack (User Story 4 — P2)

**Goal**: Verify the full Docker Compose stack starts and is functional.

### Steps

```bash
# 1. Build and start all containers
docker compose up --build -d

# 2. Check all services are healthy
docker compose ps

# 3. Verify service connectivity
curl http://localhost:4000/health
curl http://localhost:3000

# 4. Test data persistence
docker compose stop
docker compose up -d
# Data should survive the restart
```

### Expected Outcomes

| Check | Expected Result |
|-------|----------------|
| All containers start | `docker compose ps` shows all services as "healthy" or "running" |
| Services start within 60s | All health checks pass within one minute |
| API is accessible | `GET http://localhost:4000/health` returns 200 |
| Web is accessible | `GET http://localhost:3000` returns the app HTML |
| Data persists | PostgreSQL data survives stop/start via named volume |

## Scenario 5: Code Quality Pre-Commit (derived from FR-009)

**Goal**: Verify the pre-commit hook catches issues before code is committed.

### Steps

```bash
# 1. Introduce a lint error in any file
# (e.g., unused variable in apps/api/src/main.ts)

# 2. Stage and attempt to commit
git add .
git commit -m "test: verify pre-commit hook"
```

### Expected Outcomes

| Check | Expected Result |
|-------|----------------|
| Hook triggers | lint-staged runs ESLint and Prettier on staged files |
| Lint error caught | Commit is blocked with ESLint error output |
| Clean commit succeeds | After fixing the error, commit proceeds normally |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port conflict on 5432 | Set `POSTGRES_PORT=5433` in `.env` |
| Port conflict on 6379 | Set `REDIS_PORT=6380` in `.env` |
| `pnpm install` fails on native modules | Ensure build tools are installed (`python3`, `make`, `gcc` or Visual Studio Build Tools on Windows) |
| Docker Compose v1 syntax errors | Ensure Docker Compose v2 (`docker compose`, not `docker-compose`) |
| TypeScript path resolution errors | Run `pnpm build` in `packages/contracts` first to generate `dist/` |
