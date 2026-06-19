# Implementation Plan: Monorepo Structure

**Branch**: `001-monorepo-structure` | **Date**: 2026-06-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-monorepo-structure/spec.md`

## Summary

Scaffold the better-ITSM monorepo as a pnpm workspace orchestrated by Turborepo, with two applications (NestJS API, React SPA), a shared Zod contracts package, shared tooling packages (TypeScript configs, ESLint config), Docker Compose for local development, and a unified code-quality toolchain. This delivers the development-ready foundation required before any feature work begins.

## Technical Context

**Language/Version**: TypeScript 5.x, strict mode, ES2022 target

**Primary Dependencies**: pnpm (workspace + lockfile), Turborepo (build orchestration), NestJS with Fastify adapter (backend), React + Vite (frontend), Zod (shared validation schemas)

**Storage**: PostgreSQL 16 (via Docker), Redis 7 (via Docker)

**Testing**: Vitest (unit/integration), Playwright (E2E — scaffolded, not populated)

**Target Platform**: Docker Compose (self-host), Node.js 24 LTS (dev)

**Project Type**: Monorepo — web application (SPA + API + shared packages)

**Performance Goals**: N/A for scaffolding; build cache hits < 10s, full clean build < 3 minutes

**Constraints**: Self-hostable via `docker compose up` with zero managed-cloud dependency; all infrastructure behind port interfaces per Constitution III

**Scale/Scope**: 2 apps, 3 shared packages, 5 Docker services (api, web, postgres, redis, migrations)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. UX-First Design | **PASS** | Frontend package scaffolded with Radix UI, Tailwind v4; no UI features built in this phase |
| II. Modular Monolith | **PASS** | Backend structured with `src/modules/` directory for bounded-context modules; single NestJS app |
| III. Ports & Adapters | **PASS** | Backend scaffolded with `src/common/ports/` directory; no direct infra imports in module code |
| IV. Capability-Based Authorization | **PASS** | N/A for scaffolding; structure supports it |
| V. Event-Driven Side Effects | **PASS** | BullMQ available via Redis container; EventBus port directory reserved |
| VI. Phased Delivery | **PASS** | Only foundational structure; no domain features built |
| VII. Shared Contracts | **PASS** | Dedicated `packages/contracts` workspace package with Zod; consumed by both apps |

No violations. No complexity tracking entries needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-monorepo-structure/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
better-ITSM/
├── apps/
│   ├── api/                          # NestJS + Fastify backend
│   │   ├── src/
│   │   │   ├── modules/              # Bounded-context modules (empty until domain work)
│   │   │   ├── common/
│   │   │   │   ├── ports/            # Port interfaces (EventBus, Storage, etc.)
│   │   │   │   ├── guards/           # Auth guards (session, capability)
│   │   │   │   └── filters/          # Exception filters
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── mikro-orm.config.ts
│   │   ├── tsconfig.json             # Extends packages/tsconfig/node.json
│   │   ├── vitest.config.ts
│   │   └── package.json
│   └── web/                          # React + Vite frontend
│       ├── src/
│       │   ├── components/           # Shared UI components
│       │   ├── routes/               # TanStack Router route tree
│       │   ├── stores/               # Zustand stores
│       │   ├── lib/                  # Utilities, API client
│       │   ├── app.tsx
│       │   └── main.tsx
│       ├── public/
│       ├── index.html
│       ├── tsconfig.json             # Extends packages/tsconfig/react.json
│       ├── vite.config.ts
│       ├── vitest.config.ts
│       └── package.json
├── packages/
│   ├── contracts/                    # Zod schemas — single source of truth (Principle VII)
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── eslint-config/                # Shared ESLint configuration
│   │   ├── base.js
│   │   ├── node.js
│   │   ├── react.js
│   │   └── package.json
│   └── tsconfig/                     # Shared TypeScript base configs
│       ├── base.json
│       ├── node.json
│       ├── react.json
│       └── package.json
├── docker/
│   ├── api.Dockerfile                # Multi-stage build for API
│   ├── web.Dockerfile                # Multi-stage build for frontend
│   └── postgres/
│       └── init.sql                  # Initial DB setup (extensions, schema)
├── docker-compose.yml                # Production-like stack
├── docker-compose.dev.yml            # Dev overrides (volumes, hot reload)
├── turbo.json                        # Turborepo pipeline config
├── pnpm-workspace.yaml               # Workspace package globs
├── package.json                      # Root scripts (dev, build, test, lint, format)
├── .npmrc                            # pnpm settings (strict-peer-dependencies, etc.)
├── .nvmrc                            # Node.js version pin (24)
├── .env.example                      # Documented environment variable defaults
├── .gitignore
├── .prettierrc                       # Prettier config
└── .lintstagedrc.js                  # lint-staged config for pre-commit
```

**Structure Decision**: Monorepo with `apps/` (deployable applications) and `packages/` (shared libraries/config). This follows pnpm workspace conventions and cleanly separates the two deployable units (API, web) from shared code (contracts, tooling configs). The `modules/` directory inside `apps/api/src/` will hold bounded-context NestJS modules per Constitution Principle II.

## Complexity Tracking

> No violations. Table left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
