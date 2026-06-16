# RFC: better-ITSM

<table width="100%" style="border:1px solid;">
  <thead>
    <tr>
      <th colspan="2" style="">Field</th>
    </tr>
  </thead>
  <tbody>
    <colgroup>
      <col>
        <tr>
          <td style="padding-block:8px; width:20%; border-right:1px solid;"><b>Status</b></td>
          <td>Draft</td>
        </tr>
        <tr>
          <td style="padding-block:8px; border-right:1px solid;""><b>Author</b></td>
          <td>angeluciel</td>
        </tr>
         <tr>
          <td style="padding-block:8px; border-right:1px solid;""><b>Created At</b></td>
          <td>2026-16-06</td>
        </tr>
         <tr>
          <td style="padding-block:8px; border-right:1px solid;""><b>Updated At</b></td>
          <td>2026-06-16</td>
        </tr>
      </col>
      <col>
    </colgroup>
  </tbody>
</table>

---

## 1. Problem / Motivation

**Incumbent pain - GLPI.** GLPI is the open-source ITSM tool many teams default to, but it falls short for daily operators:

- **Hard to find data / track tickets.** Analysts struggle to locate information and follow ticket state across the queue. Slow triage, lost context.
- **Poor UI/UX.** Interface is dated and unfriendly. High friction for the people living in it all day.
- **Old tech stack.** Aging architecture makes it hard to customize, extend, and maintain.

**Benchmark - Tiflux.** Tiflux delivers the UX and workflow quality we want, but it is **paid / closed-source**. No open-source tool currently combines Tiflux-grade UX with GLPI-grade openness.

**Why now.** Gap in the market: teams that need a self-hostable, open-source ITSM tool are stuck choosing between bad UX (GLPI) and vendor lock-in / cost (Tiflux). `better-ITSM` aims to be the open-source tool with strong UX, easy customization, clean architecture, and long-term maintainability.

**Cost of doing nothing.** Analysts stay slow and frustrated on GLPI, or orgs pay for closed tools they can't customize or self-host.

## 2. Goals

_Driving principles: **good UX**, **easy customization**, **clean architecture**, **maintainability**._

**Product**

- [ ] Fast, modern analyst console - find any ticket/data in seconds, clear queue + ticket-state tracking.
- [ ] Self-service requester portal - open and track own tickets with low friction.
- [ ] Full ITIL surface as a phased roadmap: Incidents → Requests → Problems → Changes → Assets/CMDB → Knowledge Base → SLA management.
- [ ] First-class customization - fields, workflows, statuses, SLAs configurable without forking code.

**Technical**

- [ ] Clean, documented architecture; modular so ITIL domains ship incrementally.
- [ ] Deployable self-hosted (Docker) from day one; architected so multi-tenant SaaS is possible later without a rewrite.
- [ ] Maintainable, modern stack with tests and clear contribution path (open-source).

**Phasing (so v1 stays shippable despite full-ITIL ambition)**

- **v1 (MVP):** Ticketing core (Incidents + Requests), analyst console + requester portal, auth/roles, basic SLA, self-host Docker.
- **v2:** Problems, Changes, customizable workflows/fields.
- **v3:** Assets/CMDB, Knowledge Base, reporting/dashboards.
- **Later:** Multi-tenant SaaS mode.

## 3. Non-Goals

- **Not** a 1:1 feature-clone of GLPI - drop legacy cruft, keep what matters.
- **Not** building multi-tenant SaaS in v1 (architect for it, don't build it yet).
- **Not** full ITIL on first release - phased; v1 is ticketing core only.
- **Not** a GLPI migration/import tool in v1 (revisit later).
- **Not** mobile native apps in v1 (responsive web only).

## 4. Proposed Solution

_High-level approach. Architecture sketch. How it works end to end._

### 4.1 Overview

TypeScript end to end. Monorepo (pnpm workspace + Turborepo) holds a React SPA and a NestJS API, sharing types/contracts. API exposes REST documented by OpenAPI. PostgreSQL via MikroORM for persistence; Redis + BullMQ for background jobs (SLA timers, notifications) **and** domain events between modules. Everything runs under Docker Compose for self-host.

### 4.2 Architecture

```
[ React SPA ] --REST/OpenAPI--> [ NestJS (Fastify) API ]
                                       |
                 +---------------------+---------------------+
                 |                                           |
          [ PostgreSQL ]                            [ Redis + BullMQ ]
          (MikroORM)                                (jobs + domain events)
```

_Detailed architecture (module boundaries, event flows, tenancy) — see §4.6 / TBD._

### 4.3 Tech Stack

**Monorepo / tooling**

| Concern | Choice |
|---------|--------|
| Package manager | pnpm workspace |
| Build orchestration | Turborepo |
| Language | TypeScript |
| Containers | Docker Compose |

**Frontend**

| Concern | Choice |
|---------|--------|
| Framework / bundler | React + Vite |
| Routing | TanStack Router |
| Server state | TanStack Query |
| Client state | Zustand |
| Forms + validation | React Hook Form + Zod |
| Tables | TanStack Table |
| Styling | Tailwind CSS v4 |
| UI primitives | Radix UI |
| Variants | class-variance-authority |
| Icons | Lucide React |
| Toasts | Sonner |
| Component workshop | Storybook |

**Backend**

| Concern | Choice |
|---------|--------|
| Framework | NestJS (Fastify adapter) |
| API style | REST + OpenAPI |
| ORM | MikroORM |
| Database | PostgreSQL |
| Cache / jobs / events | Redis + BullMQ |
| Message broker | _None in v1 — RabbitMQ deferred (see Event Bus note)_ |

**Testing**

| Concern | Choice |
|---------|--------|
| Unit / integration | Vitest |
| E2E | Playwright |

**Shared validation note:** Zod schemas defined in a shared workspace package, reused for frontend forms and backend DTO validation — single source of truth for contracts.

### 4.4 Event Bus (decoupling)

Domain events flow through an **`EventBus` port** (interface) — modules publish/subscribe against the abstraction, never a concrete broker. v1 ships a **BullMQ-backed adapter** (Redis). The transport is swappable:

```
Module ──> EventBus (port) ──> [ BullMQ adapter ]   ← v1
                            └─> [ RabbitMQ adapter ] ← advanced install, later
```

- No module imports BullMQ/Redis directly — only the adapter does.
- Adding RabbitMQ later = new adapter + config flag, zero changes in domain modules.
- Same rule applies broadly: infra (broker, cache, storage) sits behind ports so swaps stay local.

### 4.5 Authentication & Authorization

Two distinct auth surfaces — keep separate:

**Interactive users (web app)**

- **Internal:** email + password → server-issued **session cookie** (`HttpOnly`, `Secure`, `SameSite`). Server-side session store (Redis). Passwords hashed with argon2id (or bcrypt).
- **External / SSO:** **OIDC** (authorization code + PKCE). Maps OIDC identity → local user. Pluggable provider config.

**Programmatic API access**

- **PAT** (personal access tokens) — scoped, user-owned, revocable.
- **Service tokens** — for machine-to-machine / integrations, scoped + revocable.
- Tokens hashed at rest; carry scopes for authorization.

**Design notes**

- Auth providers behind an abstraction (same port pattern) so internal / OIDC / token strategies compose cleanly.
- Authorization: role-based (analyst / requester / admin) now; design leaves room for finer-grained permissions later.
- CSRF protection required for cookie-based session flows; tokens (PAT/service) exempt (no ambient credentials).

### 4.6 Module Boundaries (provisional)

Modular monolith: one NestJS app, internally split into **bounded-context modules**. Each module owns its data (its own tables/schema namespace), exposes a narrow public API, and talks to other modules only via (a) published **domain events** (EventBus) or (b) explicit **public service contracts** — never by reaching into another module's entities or tables. This keeps modules extractable into services later if needed.

**Platform modules (cross-cutting, phase v1)**

| Module | Responsibility | Notes |
|--------|----------------|-------|
| **IAM** | Users, authn (session / OIDC / PAT / service tokens), roles & permissions | §4.5. Other modules consume identity via contract, not direct table access |
| **Notifications** | Email + in-app delivery, templates, preferences | Consumes domain events (e.g. `TicketAssigned`). Delivery via BullMQ jobs |
| **Files** | Attachment upload, storage abstraction (local / S3 port) | Referenced by tickets, KB, etc. by id |
| **Audit** | Activity log, immutable change history | Subscribes to events across modules |
| **Admin / Config** | Tenant settings, custom fields, dropdown/catalog config | Custom-field definitions consumed by domain modules |

**ITSM domain modules**

| Module | Responsibility | Phase | Key dependencies |
|--------|----------------|-------|------------------|
| **Ticketing** | Incidents + Requests: lifecycle, statuses, queues, assignment, comments, watchers | v1 | IAM, Files, Notifications (events), SLA |
| **SLA** | SLA policies, timers, escalation, breach detection | v1 | BullMQ (timers), Ticketing (events) |
| **Service Catalog** | Request types, request forms, catalog items | v1→v2 | Admin/Config, Ticketing |
| **Workflow / Automation** | Rules, triggers, conditional transitions, automated actions | v2 | Ticketing (events), most domains |
| **Problems** | Problem records, link to incidents, root-cause | v2 | Ticketing |
| **Changes** | Change requests, approvals, change calendar | v2 | Ticketing, Workflow |
| **Assets / CMDB** | Configuration items, relationships, asset inventory | v3 | IAM, Ticketing (CI links) |
| **Knowledge Base** | Articles, categories, search, link to tickets | v3 | Files, Ticketing |
| **Reporting / Analytics** | Dashboards, metrics, queries over domains | v3 | Read-only across modules (events / read models) |

**Boundary rules**

- **No shared mutable tables.** Each module = own schema namespace. Cross-module reference by **id only**.
- **Communication:** async via EventBus (preferred for side effects), or sync via a module's exported service contract (for queries that must be consistent now).
- **Dependency direction:** domain modules depend on platform modules, not vice versa. Platform modules never import domain modules.
- **Ticketing is the hub** — Problems/Changes/Assets/KB attach to it. Keep its public contract small and stable.
- These are **provisional** — domain modeling inside each boundary (next step) may merge/split a boundary. Revisit before locking.

### 4.7 Domain Models

Per-module domain modeling. Built incrementally as boundaries are designed.

#### 4.7.1 IAM (thin — v1)

Scope: **just enough to support Ticketing.** Authenticate an interactive user, know their role, and let other modules reference users as actors (requester / assignee / watcher). OIDC and API tokens are stubbed at the seam, not built yet.

**Entities**

| Entity | Fields (core) | Notes |
|--------|---------------|-------|
| **User** | `id` (uuid), `email` (unique, citext), `displayName`, `status`, `role`, `createdAt`, `updatedAt` | The actor every other module references by `id` |
| **PasswordCredential** | `userId` (1:1 User), `passwordHash` (argon2id), `updatedAt` | Separate from User → external-only users have none. Nullable relation |

**Enums**

- `UserStatus`: `ACTIVE` · `DISABLED` · `INVITED`
- `Role` (v1, coarse): `ADMIN` · `ANALYST` · `REQUESTER`
  - Start as enum column, not a table. **Role is an IAM-internal detail — it never crosses the boundary.** Promote to a Role/Permission table when fine-grained perms land (v2+).

**Authorization model — capabilities, not roles**

Other modules must **never** branch on `actor.role`. They ask whether the actor holds a **capability** for an action; IAM owns the role→capability mapping internally.

- Capability vocabulary (string, namespaced by domain), v1 coarse set, e.g.:
  - `ticket:read:any` · `ticket:read:own` · `ticket:create` · `ticket:assign` · `ticket:comment` · `ticket:close` · `ticket:admin`
- Role→capability map lives in IAM (v1: a static table). Ticketing declares the *actions* it needs; IAM decides if the actor may.
- Single authorization surface: `can(actor, capability, subject?)`. The optional `subject` lets IAM resolve ownership rules (e.g. `ticket:read:own` checks `subject.requesterId === actor.id`) so that logic never leaks into Ticketing.

**Sessions** — stored in **Redis** (server-side session store), not a domain table. Cookie holds opaque session id only. A lightweight `sessions` listing (for "active devices" UI) is **deferred**.

**Public contract (what other modules consume)**

Split by concern, not by "user". Two ports: **Access** (who is acting, what they may do) and **Directory** (resolve principals as references for display/selection). Neither exposes `role` or credentials.

```ts
// Principal — the thing acting. Human now; service token later (same shape).
type Actor = {
  id: string;
  kind: 'user' | 'service';   // reserves room for non-human principals
};

// Access — authentication context + authorization. The primary surface.
interface AccessPort {
  getCurrentActor(ctx): Actor;                       // resolved by session guard
  can(actor, capability, subject?): boolean;         // capability check, never role
}

// Directory — actor lookup for display / pickers. No auth semantics.
interface DirectoryPort {
  getActorRef(id): ActorRef | null;                  // hydrate assignee/requester/watcher
  searchActors(query): ActorRef[];                   // assignee picker, requester search
}

// ActorRef = { id, kind, displayName, email, status } — no role, no credentials
```

Ticketing depends on `AccessPort` + `DirectoryPort`, not on a `User` entity. It references actors by `id` and never inspects how authorization is decided.

**Auth flow (v1)**

1. `POST /auth/login` — email + password → verify argon2id → create Redis session → set `HttpOnly`/`Secure`/`SameSite` cookie.
2. Session guard resolves cookie → `Actor` on each request; injected into Ticketing handlers.
3. `POST /auth/logout` — destroy session.
4. CSRF protection on cookie-authenticated mutating routes.

**Deferred (seams left, not built)**

- **OIDC** — `OidcIdentity` entity (`userId`, `issuer`, `subject`) + provider config. Auth strategy behind the same guard abstraction.
- **API tokens** — `ApiToken` (PAT + service tokens: hashed secret, scopes, `revokedAt`). Token guard alongside session guard.
- **Invitations / password reset** flows — `INVITED` status already reserves room.
- **Fine-grained permissions** — Role/Permission tables behind `can()`.

#### 4.7.2 Ticketing (hub — v1)

Scope: **Incidents + Requests** with a shared lifecycle, queues, assignment, public/internal comments, watchers, attachments. The state machine is **fixed in code for v1**; the Workflow module (v2) will externalize transitions. Ticketing emits domain events; SLA / Notifications / Audit react.

**Aggregate: `Ticket` (root)**

| Field | Notes |
|-------|-------|
| `id` (uuid) | Internal identity |
| `number` | Human-friendly monotonic seq; displayed `INC-1042` / `REQ-1042` by `type` |
| `type` | `INCIDENT` \| `REQUEST` — discriminator, shared shape v1 |
| `subject` | Short title |
| `description` | Body (initial report) |
| `status` | See lifecycle |
| `priority` | `LOW` \| `MEDIUM` \| `HIGH` \| `URGENT` (flat v1; impact×urgency matrix deferred) |
| `requesterId` | Actor id (IAM Directory) — who it's for |
| `assigneeId?` | Actor id — current owner, nullable |
| `queueId?` | Queue the ticket sits in |
| `createdAt` / `updatedAt` / `resolvedAt?` / `closedAt?` | Timestamps drive SLA + metrics |

Actors referenced **by id only** (no IAM entity import). `requesterId`/`assigneeId` hydrated via `DirectoryPort`.

**Entities within the aggregate / module**

| Entity | Fields | Notes |
|--------|--------|-------|
| **Comment** | `id`, `ticketId`, `authorId`, `body`, `visibility`, `createdAt` | `visibility`: `PUBLIC` (requester sees) \| `INTERNAL` (analysts only) — core analyst/requester split |
| **Watcher** | `ticketId`, `actorId` | Many-to-many; Notifications targets watchers |
| **TicketAttachment** | `ticketId`, `fileId`, `commentId?` | Link only — Files module owns the blob |
| **Queue** | `id`, `name`, `description?` | Bucket analysts triage from. Assignment target. (Could grow into Team later) |

**Enums**

- `TicketType`: `INCIDENT` · `REQUEST`
- `TicketStatus`: `NEW` · `OPEN` · `PENDING` · `RESOLVED` · `CLOSED` · `CANCELLED`
- `Priority`: `LOW` · `MEDIUM` · `HIGH` · `URGENT`
- `CommentVisibility`: `PUBLIC` · `INTERNAL`

**Status lifecycle (fixed v1)**

```
NEW ──> OPEN ──> PENDING ──> OPEN
         │  └──────┐  └────────> RESOLVED ──> CLOSED
         │         ▼                 │
         └──────> RESOLVED        (reopen) ──> OPEN
any (pre-RESOLVED) ──> CANCELLED
```

- `NEW`: created, untriaged. `OPEN`: being worked. `PENDING`: waiting on requester (often pauses SLA). `RESOLVED`: fix proposed. `CLOSED`: confirmed/terminal. `CANCELLED`: abandoned.
- Transitions guarded centrally (one state-machine module) — **no scattered status branching**, mirrors the capability rule.
- `RESOLVED → OPEN` (reopen) allowed; `CLOSED` terminal (reopen-from-closed window deferred).

**Domain events (EventBus)**

`TicketCreated` · `TicketAssigned` · `TicketStatusChanged` · `TicketPriorityChanged` · `TicketCommented` · `TicketResolved` · `TicketClosed` · `TicketReopened`

Consumers: **SLA** (timers/escalation), **Notifications** (requester/assignee/watchers), **Audit** (history). Ticketing knows none of them — fire and forget.

**Capabilities consumed (from IAM)**

`ticket:create` · `ticket:read:any` · `ticket:read:own` · `ticket:assign` · `ticket:comment` · `ticket:comment:internal` · `ticket:close` · `ticket:reopen` · `ticket:admin`

Every handler calls `can(actor, capability, ticket?)`. `read:own` passes the ticket so IAM checks `requesterId === actor.id`. Zero `role` references.

**Cross-module seams**

- **SLA** — owns timers/policies. Ticketing emits events + exposes `priority`/timestamps; SLA computes due/breach. UI reads SLA state via SLA contract, **not** stored on Ticket.
- **Files** — attachments by `fileId`.
- **Admin/Config** — **custom fields** deferred. When added, definitions live in Admin/Config; Ticket stores values (likely `jsonb` column) validated against definitions. Seam noted, not built v1.
- **Service Catalog** — Requests may later originate from a catalog item (`catalogItemId?`). Nullable seam.

**Deferred (v1 out)**

- Impact × urgency priority matrix
- Linked/child tickets, merge, parent-child
- Configurable workflow (→ Workflow v2)
- Problem/Change linkage (→ v2 modules attach to Ticket)
- Custom fields, SLA pause rules detail, time tracking, reopen-from-closed

## 5. Alternatives Considered

_Other options and why rejected. Buy vs build, existing tools, etc._

**Open-source competitors to evaluate** (research before committing to build - confirm gap is real):

| Tool | Notes | Worth a look? |
|------|-------|---------------|
| **GLPI** | Incumbent. The pain we're escaping (UX, old stack). | Baseline |
| **Zammad** | Modern OSS helpdesk, good UX, Ruby/JS. Closest UX rival. | High |
| **iTop** | OSS ITIL/CMDB, strong CMDB, PHP. | High (CMDB ref) |
| **Znuny** (OTRS fork) | Mature ticketing, Perl, dated UX. | Medium |
| **osTicket** | Simple OSS ticketing, PHP, limited ITIL. | Low |
| **UVdesk / FreeScout** | Lightweight OSS helpdesk. | Low |
| **Tiflux** | Paid benchmark for UX/workflow. | UX reference |

**Build vs adopt:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Adopt/extend Zammad or iTop | Mature, saves time | Inherit their stack/UX constraints; customization limits | _TBD after eval_ |
| Build custom (`better-ITSM`) | Full control of UX, architecture, customization | Long runway, must reach parity | _Proposed_ |

## 6. Scope / Requirements

### 6.1 Functional

- …

### 6.2 Non-Functional

- **Performance**: …
- **Scale**: …
- **Security / Auth**: …
- **Availability**: …

## 7. Risks / Open Questions

| Risk / Question | Impact | Mitigation / Owner |
|-----------------|--------|--------------------|
| … | … | … |

## 8. Success Metrics

_How we know it worked. Measurable._

- …
- …

## 9. Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Owner | … | … |
| Approver | … | … |

## 10. Timeline / Milestones

| Milestone | Target | Notes |
|-----------|--------|-------|
| M1 - … | … | … |

## 11. Dependencies

- …

## 12. Appendix / References

- …
