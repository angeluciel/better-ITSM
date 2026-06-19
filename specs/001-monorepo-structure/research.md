# Research: Monorepo Structure

**Feature**: Monorepo Structure | **Date**: 2026-06-18

## R1: pnpm Workspace + Turborepo Monorepo Layout

**Decision**: Use `apps/` for deployable applications and `packages/` for shared libraries, orchestrated by Turborepo with pnpm workspaces.

**Rationale**: This is the established convention for pnpm + Turborepo monorepos. The `apps/` vs `packages/` split communicates intent clearly — apps are deployable, packages are consumed. Turborepo handles dependency-aware task ordering, parallelization, and result caching out of the box. pnpm's strict node_modules structure (content-addressable store + symlinks) prevents phantom dependencies and enforces correct package declarations.

**Alternatives considered**:
- **Nx**: More opinionated, heavier CLI, plugin ecosystem. Rejected because Turborepo is lighter and the constitution already specifies Turborepo.
- **Lerna**: Legacy; maintenance-mode since Nx acquired it. Not suitable for new projects.
- **Yarn workspaces**: Viable but pnpm is specified in the constitution and offers stricter dependency isolation.

## R2: Shared TypeScript Configuration Strategy

**Decision**: Create a `packages/tsconfig` workspace package containing base configurations (`base.json`, `node.json`, `react.json`) that each app and package extends.

**Rationale**: Centralizing TypeScript configuration ensures consistent compiler settings (strict mode, ES2022 target, path resolution) across all packages. Each app extends the relevant base config and adds only its own path aliases. Changes to the base config propagate to all consumers automatically.

**Alternatives considered**:
- **Root-level tsconfig with project references**: More complex to configure and maintain; project references add build-order coupling that Turborepo already handles.
- **Per-package standalone configs**: Leads to config drift across packages; harder to enforce strict mode and consistent settings.

## R3: Docker Compose Dev Environment Strategy

**Decision**: Use two Compose files — `docker-compose.yml` (production-like) and `docker-compose.dev.yml` (dev overrides with volume mounts and hot reload).

**Rationale**: The base file defines the full stack (postgres, redis, api, web) with production-like settings. The dev override adds source-code volume mounts and changes entrypoints to use dev servers with hot reload. Developers run `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` (aliased to `pnpm docker:dev`). For pure-local development (without containerized api/web), a `pnpm dev` script starts only the infrastructure containers (postgres, redis) and runs api/web natively with hot reload.

**Alternatives considered**:
- **Single Compose file with profiles**: Docker profiles can separate dev/prod services but are less readable and harder to override selectively.
- **Devcontainers**: Useful for editor integration but adds complexity; not all contributors use VS Code. Can be added later as an optional enhancement.

## R4: Code Quality Toolchain

**Decision**: ESLint (flat config) + Prettier + lint-staged + Husky for pre-commit hooks. Shared ESLint config as a workspace package with base, node, and react presets.

**Rationale**: ESLint catches logic and style issues; Prettier handles formatting (removing formatting debates). lint-staged runs checks only on staged files for fast commits. Husky manages Git hooks. The shared ESLint config package ensures consistent rules across apps and packages. Using ESLint's new flat config format is forward-looking and simplifies configuration.

**Alternatives considered**:
- **Biome**: Faster, but less ecosystem support for NestJS-specific rules and custom plugins. Could revisit as it matures.
- **No pre-commit hooks (CI only)**: Delays feedback; developers push broken code that CI catches minutes later. Pre-commit hooks provide instant feedback.

## R5: Shared Contracts Package Design

**Decision**: A `packages/contracts` package exporting Zod schemas, with TypeScript types inferred via `z.infer<>`. No runtime dependency other than Zod.

**Rationale**: Per Constitution Principle VII, Zod schemas in a shared package are the single source of truth. Frontend forms validate with the same schema the backend uses for DTO validation. The package exports schemas grouped by domain (e.g., `contracts/src/auth.ts`, `contracts/src/ticket.ts`). NestJS uses `@anatine/zod-nestjs` or a thin adapter to convert Zod schemas to NestJS DTOs. React Hook Form uses `@hookform/resolvers/zod` for form validation.

**Alternatives considered**:
- **OpenAPI-first with code generation**: Generates types from OpenAPI spec, but creates a code-gen step and doesn't give runtime validation on the frontend. Zod-first with OpenAPI generated from schemas is the better direction.
- **Separate schema definitions per side**: Violates Principle VII (single source of truth) and guarantees drift.

## R6: NestJS Backend Internal Structure

**Decision**: Organize the NestJS app with `src/modules/` for bounded-context modules, `src/common/` for cross-cutting concerns (ports, guards, filters, decorators), and each module following NestJS conventions (controller, service, entities, DTOs, events subdirectories).

**Rationale**: Per Constitution Principle II (Modular Monolith), each module owns its data and exposes a narrow contract. The `modules/` directory maps 1:1 to bounded contexts from RFC §4.6. The `common/` directory holds port interfaces (Constitution III) and shared NestJS infrastructure (guards, filters). Module boundaries are enforced by explicit exports in each module's NestJS module definition.

**Alternatives considered**:
- **Flat feature-based structure** (`src/tickets/`, `src/iam/`): Works but loses the visual grouping that `modules/` provides. Less clear that these are meant to be bounded contexts.
- **NestJS libraries (monorepo mode)**: NestJS has its own monorepo mode with `libs/`, but this conflicts with the pnpm workspace approach and adds NestJS CLI coupling.

## R7: Node.js and Dependency Version Management

**Decision**: Pin Node.js 24 via `.nvmrc`. Use pnpm 10's `strict-peer-dependencies=true` and `auto-install-peers=true` in `.npmrc`. Pin Turborepo and key framework versions in the root `package.json`.

**Rationale**: Node.js 24 is the latest release line with the newest runtime features. pnpm 10 brings improved workspace support and stricter defaults. Strict peer dependencies prevent phantom dependency issues. `.nvmrc` ensures all developers use the same runtime. The `engines` field in root `package.json` enforces the minimum Node.js and pnpm versions.

**Alternatives considered**:
- **Node.js 20 LTS**: More conservative choice, but 24 provides better performance and native TypeScript support improvements.
- **pnpm 9**: Previous major version; pnpm 10 has better workspace defaults and stricter dependency resolution.
- **Corepack for pnpm management**: Corepack is still experimental; explicit pnpm install via npm is more reliable across environments.
