# Tasks: Monorepo Structure

**Input**: Design documents from `specs/001-monorepo-structure/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested — test tasks omitted. Vitest configs are scaffolded as part of the setup.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo**: `apps/api/` (NestJS backend), `apps/web/` (React frontend), `packages/` (shared)
- Paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the monorepo root with workspace configuration, version pinning, and ignore rules

- [x] T001 Create root `package.json` with `name: "better-itsm"`, `private: true`, `engines` field requiring Node.js >=24 and pnpm >=10, and empty `scripts` placeholder
- [x] T002 [P] Create `pnpm-workspace.yaml` with `packages: ["apps/*", "packages/*"]`
- [x] T003 [P] Create `.nvmrc` pinning `24` (Node.js 24)
- [x] T004 [P] Create `.npmrc` with `strict-peer-dependencies=true`, `auto-install-peers=true`, `shamefully-hoist=false`
- [x] T005 [P] Update `.gitignore` to cover monorepo patterns: `node_modules/`, `dist/`, `.turbo/`, `*.tsbuildinfo`, `.env`, `!.env.example`, `coverage/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared workspace packages and tooling that ALL apps depend on — MUST complete before any user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create `packages/tsconfig/package.json` (name: `@better-itsm/tsconfig`) and three config files: `base.json` (strict mode, ES2022, module NodeNext), `node.json` (extends base, Node target), `react.json` (extends base, JSX react-jsx, DOM lib)
- [x] T007 [P] Create `packages/eslint-config/package.json` (name: `@better-itsm/eslint-config`) with ESLint 9 flat config presets: `base.js` (TypeScript + import rules), `node.js` (extends base + Node-specific), `react.js` (extends base + React + React Hooks)
- [x] T008 [P] Create `packages/contracts/package.json` (name: `@better-itsm/contracts`, depends on `@better-itsm/tsconfig`), `packages/contracts/tsconfig.json` extending `node.json`, and barrel export at `packages/contracts/src/index.ts`
- [x] T009 Create `turbo.json` at repo root with task pipeline: `build` (dependsOn `^build`, outputs `dist/**`), `dev` (no cache, persistent), `test` (dependsOn `^build`), `lint` (no deps), `typecheck` (dependsOn `^build`), `format` (no deps), `clean` (no cache)
- [x] T010 [P] Create `.prettierrc` (semi, singleQuote, trailingComma all, printWidth 100, tabWidth 2) and `.prettierignore` (dist, node_modules, .turbo, pnpm-lock.yaml, coverage)
- [x] T011 Install Husky and lint-staged as root devDependencies, create `.husky/pre-commit` hook running `pnpm lint-staged`, and create `.lintstagedrc.js` running ESLint + Prettier on staged `.ts`/`.tsx` files

**Checkpoint**: Foundation ready — shared packages published in workspace, Turborepo pipeline configured, code quality toolchain active

---

## Phase 3: User Story 1 — First-Time Developer Setup (Priority: P1) 🎯 MVP

**Goal**: A developer clones the repo, runs `pnpm install` + `pnpm dev`, and has both API and web app running locally with hot reload

**Independent Test**: Run `pnpm install && pnpm dev`, then open `http://localhost:3000` (web shell loads) and `http://localhost:4000/health` (API returns 200 OK). Edit a file in either app and verify hot reload works.

### Implementation for User Story 1

- [x] T012 [US1] Create `apps/api/package.json` (name: `@better-itsm/api`) with dependencies: `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-fastify`, `fastify`, `@better-itsm/contracts`; devDependencies: `@better-itsm/tsconfig`, `@better-itsm/eslint-config`, `vitest`, `typescript`; and scripts: `dev`, `build`, `start`, `test`, `lint`, `typecheck`
- [x] T013 [P] [US1] Create `apps/api/tsconfig.json` extending `@better-itsm/tsconfig/node.json` with `paths` alias for `@/` pointing to `./src/`
- [x] T014 [US1] Create `apps/api/src/main.ts` bootstrapping NestJS with Fastify adapter, listening on `API_PORT` (default 4000), binding to `API_HOST` (default 0.0.0.0), with CORS configured from `CORS_ORIGIN` env var
- [x] T015 [US1] Create `apps/api/src/app.module.ts` with a minimal NestJS module registering a `GET /health` endpoint that returns `{ status: "ok", timestamp: Date }` — verify the health response shape matches the contract in `contracts/workspace-contracts.md`
- [x] T016 [P] [US1] Create directory structure for bounded-context modules: `apps/api/src/modules/.gitkeep` and common infrastructure: `apps/api/src/common/ports/.gitkeep`, `apps/api/src/common/guards/.gitkeep`, `apps/api/src/common/filters/.gitkeep`
- [x] T017 [P] [US1] Create `apps/api/vitest.config.ts` with TypeScript path aliases matching tsconfig
- [x] T018 [US1] Create `apps/web/package.json` (name: `@better-itsm/web`) with dependencies: `react`, `react-dom`, `@tanstack/react-router`, `@tanstack/react-query`, `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `@radix-ui/themes`, `@better-itsm/contracts`; devDependencies: `vite`, `@vitejs/plugin-react`, `typescript`, `@better-itsm/tsconfig`, `@better-itsm/eslint-config`, `vitest`, `tailwindcss`, `@tailwindcss/vite`; and scripts: `dev`, `build`, `preview`, `test`, `lint`, `typecheck`
- [x] T019 [P] [US1] Create `apps/web/tsconfig.json` extending `@better-itsm/tsconfig/react.json` with `paths` alias for `@/` pointing to `./src/`
- [x] T020 [US1] Create `apps/web/vite.config.ts` with React plugin, Tailwind CSS v4 plugin, path aliases matching tsconfig, and dev server proxy `/api` → `http://localhost:4000`
- [x] T021 [P] [US1] Create `apps/web/index.html` with `<div id="root">` mount point, meta viewport, and title "better-ITSM"
- [x] T022 [US1] Create `apps/web/src/main.tsx` rendering `<App />` into `#root` with `<QueryClientProvider>` and `<RouterProvider>` wrapping
- [x] T023 [US1] Create `apps/web/src/app.tsx` with TanStack Router setup, QueryClient instance, and a root layout component with a minimal shell (header with "better-ITSM" title)
- [x] T024 [US1] Create `apps/web/src/routes/` directory with root index route rendering a welcome/landing page
- [x] T025 [P] [US1] Create placeholder directories: `apps/web/src/components/.gitkeep`, `apps/web/src/stores/.gitkeep`, `apps/web/src/lib/.gitkeep`, `apps/web/public/.gitkeep`
- [x] T026 [US1] Create `apps/web/src/index.css` importing Tailwind CSS v4 base with `@import "tailwindcss"`
- [x] T027 [P] [US1] Create `apps/web/vitest.config.ts` with jsdom environment and path aliases matching tsconfig
- [x] T028 [US1] Create `.env.example` at repo root documenting all environment variables with defaults: `NODE_ENV`, `DATABASE_URL`, `REDIS_URL`, `API_PORT`, `API_HOST`, `WEB_PORT`, `CORS_ORIGIN` — per the environment contract in `contracts/workspace-contracts.md`
- [x] T029 [US1] Wire root `package.json` scripts: `"dev": "turbo dev"`, `"build": "turbo build"`, `"test": "turbo test"`, `"lint": "turbo lint"`, `"typecheck": "turbo typecheck"`, `"format": "turbo format"`, `"clean": "turbo clean"`, `"docker:dev"`, `"docker:up"`, `"docker:down"`
- [x] T030 [US1] Run `pnpm install` from repo root and verify all workspace packages resolve — fix any dependency resolution errors

**Checkpoint**: Developer can clone, `pnpm install`, `pnpm dev`, and see both apps running with hot reload. This is the MVP.

---

## Phase 4: User Story 2 — Shared Contract Development (Priority: P2)

**Goal**: Developers define Zod schemas in `packages/contracts` and both apps consume them for validation, with changes propagating automatically during dev

**Independent Test**: Add a schema to `packages/contracts/src/common.ts`, import it in both `apps/api` and `apps/web`, run `pnpm typecheck` — zero errors. Modify the schema and verify both consumers see the change.

### Implementation for User Story 2

- [x] T031 [US2] Add foundational Zod schemas to `packages/contracts/src/common.ts`: `IdSchema` (uuid string), `PaginationSchema` (page, pageSize), `TimestampSchema` (createdAt, updatedAt), and export their inferred types
- [x] T032 [US2] Configure contracts package build in `packages/contracts/package.json` using `tsup` or `tsc`: emit `dist/` with ESM output and `.d.ts` type declarations, set `main`, `module`, `types`, and `exports` fields in package.json
- [x] T033 [P] [US2] Add `@better-itsm/contracts` as workspace dependency in `apps/api/package.json`, import a schema in `apps/api/src/main.ts`, and verify TypeScript resolves the import
- [x] T034 [P] [US2] Add `@better-itsm/contracts` as workspace dependency in `apps/web/package.json`, import a schema in `apps/web/src/app.tsx`, and verify TypeScript resolves the import
- [x] T035 [US2] Run `pnpm typecheck` across all packages and verify zero errors with cross-package imports

**Checkpoint**: Shared contracts package is the single source of truth. Both apps consume it. Schema changes propagate during dev.

---

## Phase 5: User Story 4 — Containerized Local Stack (Priority: P2)

**Goal**: The full stack (postgres, redis, api, web) starts with `docker compose up` and passes health checks within 60 seconds

**Independent Test**: Run `docker compose up --build -d`, wait for health checks, then `curl http://localhost:4000/health` (200 OK) and `curl http://localhost:3000` (HTML response). Stop and restart — postgres data persists.

### Implementation for User Story 4

- [x] T036 [US4] Create `docker-compose.yml` with four services per the service container contract in `contracts/workspace-contracts.md`: `postgres` (postgres:16-alpine, port 5432, named volume, pg_isready healthcheck), `redis` (redis:7-alpine, port 6379, redis-cli ping healthcheck), `api` (build from docker/api.Dockerfile, port 4000, depends_on postgres + redis healthy, GET /health check), `web` (build from docker/web.Dockerfile, port 3000, depends_on api). Use `better-itsm` bridge network. All ports configurable via `${VAR:-default}` from `.env`.
- [x] T037 [P] [US4] Create `docker/api.Dockerfile` with multi-stage build: stage 1 `deps` (pnpm fetch + install), stage 2 `build` (copy source, pnpm build --filter @better-itsm/api), stage 3 `runtime` (node:24-alpine, copy dist + node_modules, CMD node dist/main.js)
- [x] T038 [P] [US4] Create `docker/web.Dockerfile` with multi-stage build: stage 1 `deps` (pnpm fetch + install), stage 2 `build` (copy source, pnpm build --filter @better-itsm/web), stage 3 `runtime` (nginx:alpine, copy dist to /usr/share/nginx/html, EXPOSE 3000)
- [x] T039 [P] [US4] Create `docker/postgres/init.sql` with initial database setup: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"` and `CREATE SCHEMA IF NOT EXISTS app`
- [x] T040 [US4] Create `docker-compose.dev.yml` with dev overrides: api service uses volume mount (`./apps/api/src:/app/apps/api/src`) and overrides command to `pnpm --filter @better-itsm/api dev`; web service uses volume mount and overrides command to `pnpm --filter @better-itsm/web dev`; both bypass the multi-stage Dockerfile for hot reload
- [x] T041 [US4] Add health check definitions with `interval: 10s`, `timeout: 5s`, `retries: 5`, `start_period: 30s` for all services in `docker-compose.yml`
- [x] T042 [US4] Verify `docker compose up --build -d` starts all services, all health checks pass within 60 seconds, and `docker compose down && docker compose up -d` preserves postgres data

**Checkpoint**: Full stack starts with one command. Health checks pass. Data persists across restarts.

---

## Phase 6: User Story 3 — Build and Test Across Packages (Priority: P3)

**Goal**: Turborepo builds all packages in dependency order with caching; subsequent unchanged builds return instantly

**Independent Test**: Run `pnpm build` (succeeds), run `pnpm build` again (all tasks show cache hit / "FULL TURBO"), run `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format` — all pass.

### Implementation for User Story 3

- [x] T043 [US3] Run `pnpm build` and verify all packages compile in correct dependency order (contracts → api, contracts → web) with zero errors
- [x] T044 [US3] Run `pnpm build` a second time without changes and verify all tasks report cache hits (Turborepo "FULL TURBO" or "cache hit") and complete in under 10 seconds
- [x] T045 [P] [US3] Run `pnpm test` and verify Vitest executes across all packages with test runners configured (zero failures; empty test suites are acceptable at this stage)
- [x] T046 [P] [US3] Run `pnpm lint` and verify ESLint processes all `.ts`/`.tsx` files across all packages with zero errors
- [x] T047 [P] [US3] Run `pnpm typecheck` and verify `tsc --noEmit` passes across all packages with zero type errors
- [x] T048 [US3] Run `pnpm format` (Prettier check mode) and verify all files are correctly formatted; fix any formatting inconsistencies

**Checkpoint**: Build pipeline is fully functional. Cache works. All quality checks pass.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, configuration, and validation that spans multiple user stories

- [x] T049 [P] Create `apps/api/mikro-orm.config.ts` with PostgreSQL connection from `DATABASE_URL` env var, entity discovery from `./src/modules/**/entities/`, and migration settings pointing to `./src/migrations/`
- [x] T050 [P] Update `README.md` at repo root with: project overview, prerequisites (Node 24, pnpm 10, Docker), quickstart instructions (`pnpm install && pnpm dev`), available scripts table, Docker usage (`docker compose up`), project structure overview, and contribution guidelines link
- [x] T051 Verify pre-commit hook works: introduce a lint error in any file, stage it, attempt `git commit` — hook should block the commit; fix the error, commit should succeed
- [x] T052 Run all quickstart.md validation scenarios end-to-end (Scenarios 1–5) and fix any failures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — MVP delivery target
- **User Story 2 (Phase 4)**: Depends on Foundational; partially depends on US1 (apps must exist to verify imports)
- **User Story 4 (Phase 5)**: Depends on US1 (apps must build for Dockerfiles); independent from US2
- **User Story 3 (Phase 6)**: Depends on US1 + US2 (all packages must exist for full pipeline verification)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational, but T033/T034 require apps from US1 to exist — run after US1 or stub the imports
- **User Story 4 (P2)**: Can start after US1 (needs buildable apps for Dockerfiles) — independent from US2
- **User Story 3 (P3)**: Verification-heavy — run after US1 + US2 to test the full pipeline

### Within Each User Story

- Package.json and tsconfig before source files
- Source entry points (main.ts/main.tsx) before secondary modules
- Configuration before build/verification tasks
- Story complete before moving to next priority

### Parallel Opportunities

- T002, T003, T004, T005 can all run in parallel (Phase 1)
- T007, T008 can run in parallel with each other (Phase 2, after T006)
- T010 can run in parallel with T007/T008
- Within US1: T013, T016, T017, T019, T021, T025, T027 are parallelizable (different files)
- T033 and T034 can run in parallel (US2 — different apps)
- T037, T038, T039 can run in parallel (US4 — different Dockerfiles)
- T045, T046, T047 can run in parallel (US3 — independent quality checks)
- T049 and T050 can run in parallel (Polish — different files)

---

## Parallel Example: User Story 1

```text
# After T012 (api package.json), launch in parallel:
T013: Create apps/api/tsconfig.json
T016: Create apps/api/src/common/ and modules/ directory structure
T017: Create apps/api/vitest.config.ts

# After T018 (web package.json), launch in parallel:
T019: Create apps/web/tsconfig.json
T021: Create apps/web/index.html
T025: Create placeholder directories (components, stores, lib, public)
T027: Create apps/web/vitest.config.ts
```

---

## Parallel Example: User Story 4

```text
# After T036 (docker-compose.yml), launch in parallel:
T037: Create docker/api.Dockerfile
T038: Create docker/web.Dockerfile
T039: Create docker/postgres/init.sql
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T005)
2. Complete Phase 2: Foundational (T006–T011)
3. Complete Phase 3: User Story 1 (T012–T030)
4. **STOP and VALIDATE**: `pnpm install && pnpm dev` — both apps running, hot reload works
5. This is a shippable foundation that unblocks all other development

### Incremental Delivery

1. Setup + Foundational → Workspace configured, tooling ready
2. Add User Story 1 → Test independently → Working dev environment (MVP!)
3. Add User Story 2 → Test independently → Shared contracts flowing between apps
4. Add User Story 4 → Test independently → Full Docker Compose stack operational
5. Add User Story 3 → Test independently → Build pipeline verified with caching
6. Polish → Pre-commit hooks, docs, MikroORM config, full validation

### Parallel Team Strategy

With multiple developers after Foundational:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (API scaffolding)
   - Developer B: User Story 1 (Web scaffolding) — can split US1 by app
3. After US1 is done:
   - Developer A: User Story 2 (contracts build + imports)
   - Developer B: User Story 4 (Docker setup)
4. User Story 3 runs last (verification of everything)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths reference the plan.md project structure
- Constitution principles are satisfied by the directory structure (Principle II: modules/, Principle III: common/ports/, Principle VII: packages/contracts/)
