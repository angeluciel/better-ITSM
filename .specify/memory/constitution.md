<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0 (initial ratification)
- Added principles:
  1. UX-First Design
  2. Modular Monolith
  3. Ports & Adapters
  4. Capability-Based Authorization
  5. Event-Driven Side Effects
  6. Phased Delivery
  7. Shared Contracts
- Added sections:
  - Technology & Self-Hosting Constraints
  - Development Workflow & Quality Standards
  - Governance
- Templates requiring updates:
  - .specify/templates/plan-template.md — Constitution Check section
    references generic "[Gates determined based on constitution file]";
    no update needed now, gates are derived at plan time. Status: OK
  - .specify/templates/spec-template.md — no constitution-specific
    references; requirements/success criteria align. Status: OK
  - .specify/templates/tasks-template.md — task phasing (Setup,
    Foundational, User Story) aligns with Phased Delivery principle;
    no blocking changes. Status: OK
- Follow-up TODOs: none
-->

# better-ITSM Constitution

## Core Principles

### I. UX-First Design

Every feature MUST prioritize analyst and requester experience
above technical convenience.

- The analyst console MUST feel fast: perceived latency < 100 ms
  for interactions, leveraging optimistic updates and client-side
  caching.
- The requester portal MUST be low-friction: minimal steps to open,
  track, and reply to tickets.
- UI decisions MUST be validated against the Tiflux UX benchmark
  and explicitly justify any deviation that worsens usability
  relative to that reference.
- Accessibility baseline: all interactive elements MUST use Radix UI
  primitives (or equivalent a11y-compliant components).

### II. Modular Monolith

The system is a single deployable NestJS application split into
bounded-context modules. Each module owns its data and exposes a
narrow public contract.

- No shared mutable tables. Cross-module references MUST be by
  id only.
- Modules communicate via domain events (EventBus, preferred for
  side effects) or explicit public service contracts (for queries
  requiring immediate consistency).
- Dependency direction: domain modules depend on platform modules,
  never the reverse. Platform modules MUST NOT import domain modules.
- Module boundaries are designed to be extractable into standalone
  services later without a rewrite.

### III. Ports & Adapters

All infrastructure concerns (broker, cache, storage, authentication
strategy) MUST sit behind port interfaces. Concrete adapters
implement these ports.

- No module imports a concrete infrastructure library (BullMQ,
  Redis client, S3 SDK) directly. Only the adapter does.
- Swapping an adapter (e.g., BullMQ to RabbitMQ) MUST require
  only a new adapter plus configuration, with zero changes in
  domain modules.
- Auth strategies (session, OIDC, PAT, service token) compose
  behind the same guard abstraction.

### IV. Capability-Based Authorization

Authorization MUST be checked via capabilities, never by inspecting
roles.

- The single authorization surface is
  `can(actor, capability, subject?)`.
- Capabilities are namespaced strings (e.g., `ticket:assign`,
  `ticket:read:own`). IAM owns the role-to-capability mapping
  internally.
- The optional `subject` parameter allows ownership checks
  (e.g., `ticket:read:own` verifies `requesterId === actor.id`)
  so authorization logic never leaks into domain modules.
- Other modules reference actors by id via `AccessPort` and
  `DirectoryPort`; they MUST NOT depend on `User` entities or
  inspect role values.

### V. Event-Driven Side Effects

Side effects (notifications, audit, SLA timers) MUST be triggered
by domain events published on the EventBus, not by synchronous
calls from the producing module.

- Producers fire events and forget; they MUST NOT know their
  consumers.
- Consumers MUST be idempotent (at-least-once delivery semantics).
- Event payloads carry the fields consumers need to act, without
  serializing the full aggregate. Extend events additively when
  new consumers need additional fields.

### VI. Phased Delivery

The roadmap is phased with hard gates. Each phase MUST ship before
the next begins.

- **v1 (MVP):** Ticketing core (Incidents + Requests), analyst
  console, requester portal, IAM (thin), basic SLA, notifications,
  audit, Docker self-host.
- **v2:** Problems, Changes, configurable workflows, custom fields.
- **v3:** Assets/CMDB, Knowledge Base, reporting/dashboards.
- **Later:** Multi-tenant SaaS mode.
- Features from a later phase MUST NOT leak into an earlier phase.
  Architectural seams (nullable foreign keys, port interfaces) may
  be placed to reserve room, but the functionality MUST NOT be
  built until its phase.

### VII. Shared Contracts

Zod schemas defined in a shared workspace package are the single
source of truth for data contracts between frontend and backend.

- Frontend form validation and backend DTO validation MUST derive
  from the same Zod schema.
- REST API endpoints MUST be documented by OpenAPI, generated from
  or consistent with the shared schemas.
- Contract changes MUST be made in the shared package first; both
  frontend and backend consumers update in the same changeset.

## Technology & Self-Hosting Constraints

- **Language:** TypeScript end to end (frontend and backend).
- **Monorepo:** pnpm workspace + Turborepo.
- **Backend:** NestJS (Fastify adapter), MikroORM, PostgreSQL,
  Redis + BullMQ.
- **Frontend:** React + Vite, TanStack (Router/Query/Table),
  Zustand, React Hook Form + Zod, Tailwind CSS v4, Radix UI.
- **Testing:** Vitest (unit/integration), Playwright (E2E).
- **Self-host:** The full stack MUST run via `docker compose up`
  from day one with no managed-cloud dependency.
- **Passwords:** Hashed with argon2id. Tokens (PAT/service) hashed
  at rest, scoped, and revocable.
- **Sessions:** Server-side Redis store; cookies are `HttpOnly`,
  `Secure`, `SameSite`. CSRF protection on cookie-authenticated
  mutating routes.

## Development Workflow & Quality Standards

- **Testing discipline:** Critical paths MUST have Vitest unit or
  integration coverage. E2E coverage via Playwright for key user
  journeys (analyst triage, requester self-service, SLA breach).
- **API contracts:** OpenAPI documentation MUST stay in sync with
  the implementation. Breaking API changes follow the shared
  contract rule (Principle VII).
- **Code review:** All changes merged via pull request with at
  least one review.
- **Observability:** Structured logs, health/readiness endpoints,
  and basic operational metrics (queue depth, job failures, SLA
  breaches) MUST be exposed for operators.
- **Open source:** The repository maintains a clear contribution
  path. Documentation, Docker quickstart, and issue tracking MUST
  be kept current.

## Governance

- This constitution is the highest-authority design document for
  better-ITSM. It supersedes ad-hoc decisions and MUST be
  consulted when architectural questions arise.
- **Amendments:** Any change to this constitution MUST be
  documented with a version bump, rationale, and migration plan
  for affected artifacts. Amendments follow semantic versioning:
  - MAJOR: Principle removal or backward-incompatible redefinition.
  - MINOR: New principle, new section, or material expansion.
  - PATCH: Clarifications, wording, or non-semantic refinements.
- **Compliance review:** Pull requests introducing new modules,
  new infrastructure dependencies, or cross-module communication
  patterns MUST be checked against these principles before merge.
- **Complexity justification:** Deviations from any principle MUST
  be documented in the plan's Complexity Tracking table with the
  violation, rationale, and rejected simpler alternative.

**Version**: 1.0.0 | **Ratified**: 2026-06-18 | **Last Amended**: 2026-06-18
