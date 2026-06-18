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
          <td>2026-06-16</td>
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

**Incumbent pain: GLPI.** GLPI is the open-source ITSM tool many teams default to, but it falls short for daily operators:

- **Hard to find data and track tickets.** Analysts struggle to locate information and follow ticket state across the queue. Triage is slow and context gets lost.
- **Poor UI/UX.** The interface is dated and unfriendly, which is high friction for the people living in it all day.
- **Old tech stack.** Aging architecture makes it hard to customize, extend, and maintain.

**Benchmark: Tiflux.** Tiflux delivers the UX and workflow quality we want, but it is paid and closed-source. No open-source tool currently combines Tiflux-grade UX with GLPI-grade openness.

**Why now.** There is a gap in the market: teams that need a self-hostable, open-source ITSM tool are stuck choosing between bad UX (GLPI) and vendor lock-in or cost (Tiflux). `better-ITSM` aims to be the open-source tool with strong UX, easy customization, clean architecture, and long-term maintainability.

**Cost of doing nothing.** Analysts stay slow and frustrated on GLPI, or orgs pay for closed tools they can't customize or self-host.

## 2. Goals

_Driving principles: **good UX**, **easy customization**, **clean architecture**, **maintainability**._

**Product**

- [ ] Fast, modern analyst console that finds any ticket or data in seconds, with clear queue and ticket-state tracking.
- [ ] Self-service requester portal to open and track your own tickets with low friction.
- [ ] Full ITIL surface as a phased roadmap: Incidents, then Requests, Problems, Changes, Assets/CMDB, Knowledge Base, and SLA management.
- [ ] First-class customization, so fields, workflows, statuses, and SLAs are configurable without forking code.

**Technical**

- [ ] Clean, documented architecture, modular so ITIL domains ship incrementally.
- [ ] Deployable self-hosted (Docker) from day one, architected so multi-tenant SaaS is possible later without a rewrite.
- [ ] Maintainable, modern stack with tests and a clear contribution path (open-source).

**Phasing (so v1 stays shippable despite full-ITIL ambition)**

- **v1 (MVP):** Ticketing core (Incidents and Requests), analyst console and requester portal, auth/roles, basic SLA, self-host Docker.
- **v2:** Problems, Changes, customizable workflows and fields.
- **v3:** Assets/CMDB, Knowledge Base, reporting and dashboards.
- **Later:** Multi-tenant SaaS mode.

## 3. Non-Goals

- **Not** a 1:1 feature-clone of GLPI. Drop the legacy cruft, keep what matters.
- **Not** building multi-tenant SaaS in v1 (architect for it, don't build it yet).
- **Not** full ITIL on the first release. It's phased, and v1 is the ticketing core only.
- **Not** a GLPI migration/import tool in v1 (revisit later).
- **Not** mobile native apps in v1 (responsive web only).

## 4. Proposed Solution

_High-level approach. Architecture sketch. How it works end to end._

### 4.1 Overview

TypeScript end to end. A monorepo (pnpm workspace plus Turborepo) holds a React SPA and a NestJS API, sharing types and contracts. The API exposes REST documented by OpenAPI. PostgreSQL via MikroORM for persistence; Redis plus BullMQ for background jobs (SLA timers, notifications) and for domain events between modules. Everything runs under Docker Compose for self-host.

### 4.2 Architecture

```
[ React SPA ] --REST/OpenAPI--> [ NestJS (Fastify) API ]
                                       |
                 +---------------------+---------------------+
                 |                                           |
          [ PostgreSQL ]                            [ Redis + BullMQ ]
          (MikroORM)                                (jobs + domain events)
```

_Detailed architecture (module boundaries, event flows, tenancy): see §4.6 / TBD._

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
| Message broker | _None in v1; RabbitMQ deferred (see Event Bus note)_ |

**Testing**

| Concern | Choice |
|---------|--------|
| Unit / integration | Vitest |
| E2E | Playwright |

**Shared validation note:** Zod schemas defined in a shared workspace package, reused for frontend forms and backend DTO validation. This gives a single source of truth for contracts.

### 4.4 Event Bus (decoupling)

Domain events flow through an `EventBus` port (interface). Modules publish and subscribe against the abstraction, never a concrete broker. v1 ships a BullMQ-backed adapter (Redis). The transport is swappable:

```
Module ──> EventBus (port) ──> [ BullMQ adapter ]   ← v1
                            └─> [ RabbitMQ adapter ] ← advanced install, later
```

- No module imports BullMQ or Redis directly. Only the adapter does.
- Adding RabbitMQ later means a new adapter plus a config flag, with zero changes in domain modules.
- The same rule applies broadly: infra (broker, cache, storage) sits behind ports so swaps stay local.

**Event payload convention**

> Events should be self-contained for their intended consumers, without becoming full entity dumps.

- Carry the fields consumers actually need to act, so they don't synchronously call back into the producer (which avoids coupling and chatty reads).
- Do **not** serialize the whole aggregate "just in case." That bloats payloads, leaks internal shape, and couples consumers to fields they don't use.
- Identify the known consumers when defining an event; include their required fields, plus stable ids for anything they may hydrate on demand via a read contract.
- When a new consumer needs a field the event lacks, extend the event deliberately (additive) rather than defaulting to fat payloads.

### 4.5 Authentication & Authorization

There are two distinct auth surfaces, kept separate:

**Interactive users (web app)**

- **Internal:** email and password yield a server-issued **session cookie** (`HttpOnly`, `Secure`, `SameSite`). Server-side session store (Redis). Passwords hashed with argon2id (or bcrypt).
- **External / SSO:** **OIDC** (authorization code plus PKCE). Maps an OIDC identity to a local user. Pluggable provider config.

**Programmatic API access**

- **PAT** (personal access tokens): scoped, user-owned, revocable.
- **Service tokens:** for machine-to-machine integrations, scoped and revocable.
- Tokens hashed at rest; they carry scopes for authorization.

**Design notes**

- Auth providers sit behind an abstraction (the same port pattern) so internal, OIDC, and token strategies compose cleanly.
- Authorization is role-based (analyst / requester / admin) now; the design leaves room for finer-grained permissions later.
- CSRF protection is required for cookie-based session flows; tokens (PAT and service) are exempt because they carry no ambient credentials.

### 4.6 Module Boundaries (provisional)

A modular monolith: one NestJS app, internally split into **bounded-context modules**. Each module owns its data (its own tables/schema namespace), exposes a narrow public API, and talks to other modules only via (a) published **domain events** (EventBus) or (b) explicit **public service contracts**. It never reaches into another module's entities or tables. This keeps modules extractable into services later if needed.

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

- **No shared mutable tables.** Each module owns its schema namespace. Cross-module references are by **id only**.
- **Communication:** async via EventBus (preferred for side effects), or sync via a module's exported service contract (for queries that must be consistent now).
- **Dependency direction:** domain modules depend on platform modules, not the other way around. Platform modules never import domain modules.
- **Ticketing is the hub.** Problems, Changes, Assets, and KB attach to it. Keep its public contract small and stable.
- These are **provisional**. Domain modeling inside each boundary (the next step) may merge or split a boundary. Revisit before locking.

### 4.7 Domain Models

Per-module domain modeling. Built incrementally as boundaries are designed.

#### 4.7.1 IAM (thin, v1)

Scope: **just enough to support Ticketing.** Authenticate an interactive user, know their role, and let other modules reference users as actors (requester, assignee, watcher). OIDC and API tokens are stubbed at the seam, not built yet.

**Entities**

| Entity | Fields (core) | Notes |
|--------|---------------|-------|
| **User** | `id` (uuid), `email` (unique, citext), `displayName`, `status`, `role`, `createdAt`, `updatedAt` | The actor every other module references by `id` |
| **PasswordCredential** | `userId` (1:1 User), `passwordHash` (argon2id), `updatedAt` | Separate from User so external-only users have none. Nullable relation |

**Enums**

- `UserStatus`: `ACTIVE` · `DISABLED` · `INVITED`
- `Role` (v1, coarse): `ADMIN` · `ANALYST` · `REQUESTER`
  - Starts as an enum column, not a table. **Role is an IAM-internal detail; it never crosses the boundary.** Promote it to a Role/Permission table when fine-grained perms land (v2+).

**Authorization model: capabilities, not roles**

Other modules must **never** branch on `actor.role`. They ask whether the actor holds a **capability** for an action; IAM owns the role-to-capability mapping internally.

- Capability vocabulary (string, namespaced by domain), v1 coarse set, e.g.:
  - `ticket:read:any` · `ticket:read:own` · `ticket:create` · `ticket:assign` · `ticket:comment` · `ticket:close` · `ticket:admin`
- The role-to-capability map lives in IAM (v1: a static table). Ticketing declares the *actions* it needs; IAM decides if the actor may.
- Single authorization surface: `can(actor, capability, subject?)`. The optional `subject` lets IAM resolve ownership rules (e.g. `ticket:read:own` checks `subject.requesterId === actor.id`) so that logic never leaks into Ticketing.

**Sessions** are stored in **Redis** (server-side session store), not a domain table. The cookie holds an opaque session id only. A lightweight `sessions` listing (for an "active devices" UI) is **deferred**.

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

Ticketing depends on `AccessPort` and `DirectoryPort`, not on a `User` entity. It references actors by `id` and never inspects how authorization is decided.

**Auth flow (v1)**

1. `POST /auth/login` — email and password, verify argon2id, create a Redis session, set the `HttpOnly`/`Secure`/`SameSite` cookie.
2. Session guard resolves the cookie to an `Actor` on each request; injected into Ticketing handlers.
3. `POST /auth/logout` — destroy the session.
4. CSRF protection on cookie-authenticated mutating routes.

**Deferred (seams left, not built)**

- **OIDC:** `OidcIdentity` entity (`userId`, `issuer`, `subject`) plus provider config. Auth strategy behind the same guard abstraction.
- **API tokens:** `ApiToken` (PAT and service tokens: hashed secret, scopes, `revokedAt`). Token guard alongside the session guard.
- **Invitations and password reset** flows: the `INVITED` status already reserves room.
- **Fine-grained permissions:** Role/Permission tables behind `can()`.

#### 4.7.2 Ticketing (hub, v1)

Scope: **Incidents + Requests** with a shared lifecycle, queues, assignment, public/internal comments, watchers, attachments. The state machine is **fixed in code for v1**; the Workflow module (v2) will externalize transitions. Ticketing emits domain events; SLA, Notifications, and Audit react.

**Aggregate: `Ticket` (root)**

| Field | Notes |
|-------|-------|
| `id` (uuid) | Internal identity |
| `number` | Human-friendly monotonic seq; displayed `INC-1042` / `REQ-1042` by `type` |
| `type` | `INCIDENT` \| `REQUEST` discriminator; shared shape in v1 |
| `subject` | Short title |
| `description` | Body (initial report) |
| `status` | See lifecycle |
| `priority` | `LOW` \| `MEDIUM` \| `HIGH` \| `URGENT` (flat v1; impact×urgency matrix deferred) |
| `requesterId` | Actor id (IAM Directory), i.e. who it's for |
| `assigneeId?` | Actor id of the current owner, nullable |
| `queueId?` | Queue the ticket sits in |
| `createdAt` / `updatedAt` / `resolvedAt?` / `closedAt?` | Timestamps drive SLA + metrics |

Actors are referenced **by id only** (no IAM entity import). `requesterId` and `assigneeId` are hydrated via `DirectoryPort`.

**Entities within the aggregate / module**

| Entity | Fields | Notes |
|--------|--------|-------|
| **Comment** | `id`, `ticketId`, `authorId`, `body`, `visibility`, `createdAt` | `visibility`: `PUBLIC` (requester sees) \| `INTERNAL` (analysts only); the core analyst/requester split |
| **Watcher** | `ticketId`, `actorId` | Many-to-many; Notifications targets watchers |
| **TicketAttachment** | `ticketId`, `fileId`, `commentId?` | Link only; the Files module owns the blob |
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
- Transitions are guarded centrally (one state-machine module), so there's no scattered status branching. This mirrors the capability rule.
- `RESOLVED → OPEN` (reopen) is allowed; `CLOSED` is terminal (reopen-from-closed window deferred).

**Domain events (EventBus)**

`TicketCreated` · `TicketAssigned` · `TicketStatusChanged` · `TicketPriorityChanged` · `TicketCommented` · `TicketResolved` · `TicketClosed` · `TicketReopened`

Consumers: **SLA** (timers/escalation), **Notifications** (requester/assignee/watchers), **Audit** (history). Ticketing knows none of them; fire and forget.

**Capabilities consumed (from IAM)**

`ticket:create` · `ticket:read:any` · `ticket:read:own` · `ticket:assign` · `ticket:comment` · `ticket:comment:internal` · `ticket:close` · `ticket:reopen` · `ticket:admin`

Every handler calls `can(actor, capability, ticket?)`. `read:own` passes the ticket so IAM checks `requesterId === actor.id`. Zero `role` references.

**Cross-module seams**

- **SLA** owns timers and policies. Ticketing emits events and exposes `priority` plus timestamps; SLA computes due and breach times. The UI reads SLA state via the SLA contract; it isn't stored on the Ticket.
- **Files:** attachments by `fileId`.
- **Admin/Config:** **custom fields** are deferred. When added, definitions live in Admin/Config; the Ticket stores values (likely a `jsonb` column) validated against those definitions. Seam noted, not built in v1.
- **Service Catalog:** Requests may later originate from a catalog item (`catalogItemId?`). Nullable seam.

**Deferred (v1 out)**

- Impact × urgency priority matrix
- Linked/child tickets, merge, parent-child
- Configurable workflow (→ Workflow v2)
- Problem/Change linkage (→ v2 modules attach to Ticket)
- Custom fields, SLA pause rules detail, time tracking, reopen-from-closed

#### 4.7.3 SLA (v1)

Scope: attach **time targets** (first-response, resolution) to tickets, track them as live clocks, pause when waiting on the requester, and fire breach/warning events. Fully **event-driven**: it reacts to Ticketing events and is never called synchronously by Ticketing. Timers are **BullMQ delayed jobs**. SLA state is **not** stored on the Ticket; the UI reads it through the SLA contract.

**Entities**

| Entity | Fields (core) | Notes |
|--------|---------------|-------|
| **SlaPolicy** | `id`, `name`, `enabled`, `match`, `calendarId?`, `isDefault` | `match` = conditions `{ ticketType?, priority?, queueId? }`. First enabled policy that matches wins; `isDefault` is fallback |
| **SlaTarget** | `id`, `policyId`, `metric`, `durationMinutes` | A policy has 1+ targets (e.g. first-response 30m, resolution 8h) |
| **BusinessCalendar** | `id`, `name`, `timezone`, `weeklyHours`, `holidays[]` | Optional. No calendar ⇒ **24/7**. Drives how elapsed time is counted |
| **SlaClock** | `id`, `ticketId`, `policyId`, `metric`, `startedAt`, `dueAt`, `pausedAt?`, `accumulatedPauseMs`, `stoppedAt?`, `status`, `jobId?` | The live instance. `jobId` = BullMQ breach job ref |

**Enums**

- `SlaMetric`: `FIRST_RESPONSE` · `RESOLUTION`
- `SlaClockStatus`: `RUNNING` · `PAUSED` · `MET` · `BREACHED`

**How it works (event-driven + BullMQ)**

| Trigger (Ticketing event) | SLA action |
|---------------------------|------------|
| `TicketCreated` | Match policy → create clocks per target → compute `dueAt` (via calendar) → schedule delayed **breach job** + optional **warning job** (e.g. 80%) |
| `TicketCommented` (PUBLIC, `authorId !== requesterId`) | First agent reply → stop `FIRST_RESPONSE` clock → `MET` or `BREACHED`; cancel its job |
| `TicketStatusChanged → PENDING` | **Pause** running clocks (waiting on requester) → cancel/hold jobs, accrue pause time |
| `TicketStatusChanged → OPEN` (from PENDING) | **Resume** → recompute `dueAt` from accumulated pause → reschedule jobs |
| `TicketResolved` | Stop `RESOLUTION` clock → `MET`/`BREACHED`; cancel job |
| Breach job fires | Mark clock `BREACHED` → emit `SlaBreached` |
| Warning job fires | emit `SlaBreachWarning` |

- **First response** is detected without roles: the first `PUBLIC` comment whose `authorId !== ticket.requesterId`. (The event payload must carry `visibility` and `authorId`.)
- **Recompute on resume** keeps business-hours math correct; the delayed job is the single source of breach timing (rescheduled, not polled).

**Events emitted (EventBus)**

`SlaClockStarted` · `SlaClockPaused` · `SlaClockResumed` · `SlaTargetMet` · `SlaBreachWarning` · `SlaBreached`

Consumers: **Notifications** (warn assignee/escalate), **Audit**. (Escalation routing itself is Workflow/v2; v1 just notifies.)

**Public contract (read side)**

```ts
interface SlaPort {
  getTicketSla(ticketId): SlaClockView[];   // { metric, status, dueAt, remainingMs, paused }
}
// Ticket list/detail UI calls this to render "due in 2h" / breached badges
```

**Cross-module seams**

- **Ticketing** is the source of truth for ticket state; SLA consumes its events only. Per the [event payload convention](#44-event-bus-decoupling), ticket events carry what SLA needs to act: `type`, `priority`, `queueId`, `status`, `requesterId`, and for comments `visibility` plus `authorId`, not the whole ticket. Anything SLA needs only rarely, it hydrates by id via a small Ticketing read contract.
- **BullMQ:** delayed jobs for breach and warning; cancel or reschedule on pause and resume. SLA owns its queue.
- **Admin/Config:** the policy and calendar management UI lives there or in SLA admin; definitions are owned by SLA.

**Deferred (v1 out)**

- Per-priority target overrides within one policy (v1: separate policies match by priority)
- Escalation chains / auto-reassign (→ Workflow v2)
- Multiple pause reasons, manual pause, SLA "clock corrections"
- Operational-level agreements (OLA) / vendor (UC) timers
- Reporting on SLA attainment (→ Reporting v3, off the emitted events)

## 5. Alternatives Considered

_Other options and why rejected. Buy vs build, existing tools, etc._

**Open-source competitors to evaluate** (research before committing to build, to confirm the gap is real):

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

_Requirements for **v1 (MVP)** unless flagged otherwise. Later phases (v2/v3) tracked in §2 Phasing._

### 6.1 Functional

**Authentication & users (IAM — §4.7.1)**

- Internal users authenticate with email + password; server issues an `HttpOnly`/`Secure`/`SameSite` session cookie backed by a Redis session store.
- Three coarse roles — `ADMIN`, `ANALYST`, `REQUESTER` — mapped internally to a capability set; other modules authorize via `can(actor, capability, subject?)`, never by inspecting role.
- Admin can create, disable, and list users; `INVITED` status reserved for the (deferred) invitation flow.
- Logout destroys the session; mutating cookie-authenticated routes are CSRF-protected.

**Ticketing (hub — §4.7.2)**

- Create Incidents and Requests with subject, description, type, priority, requester, and optional queue/assignee.
- Each ticket gets a human-friendly monotonic number, displayed `INC-<n>` / `REQ-<n>` by type.
- Analysts triage from queues, assign/reassign tickets, set priority, and drive the fixed v1 status lifecycle (`NEW → OPEN → PENDING → RESOLVED → CLOSED`, with `CANCELLED` and `RESOLVED → OPEN` reopen).
- Comments support `PUBLIC` (requester-visible) and `INTERNAL` (analyst-only) visibility.
- Watchers can be added/removed; attachments link to tickets via the Files module (`fileId`).
- All ticket mutations emit domain events (`TicketCreated`, `TicketAssigned`, `TicketStatusChanged`, …) on the EventBus.

**Analyst console**

- Fast queue view with filter, sort, and full-text search across tickets (subject/description/number/requester).
- Ticket detail view: timeline of comments + status changes, assignment, priority, watchers, attachments, SLA state.
- Bulk-friendly actions (assign, change status/priority) and keyboard-driven navigation.

**Requester portal**

- Open a ticket, track its status, read public comments, and reply — low-friction, scoped to the requester's own tickets (`ticket:read:own`).

**SLA (§4.6)**

- Define basic SLA policies keyed off priority; timers start/pause/stop in response to ticket events.
- Breach detection and escalation signals surfaced to the console; SLA state read via the SLA contract, not stored on the Ticket.

**Notifications**

- Email + in-app notifications driven by domain events (e.g. `TicketAssigned` → assignee, `TicketCommented` → watchers), delivered via BullMQ jobs.

**Audit**

- Immutable activity log capturing cross-module domain events for each ticket.

**API**

- REST API documented by OpenAPI; Zod-derived contracts shared between frontend and backend.

### 6.2 Non-Functional

- **Performance**: p95 < 200 ms for read endpoints (queue list, ticket detail) and < 400 ms for writes under nominal load; console interactions feel instant (< 100 ms perceived) via TanStack Query caching and optimistic updates.
- **Scale**: a single self-hosted instance handles ~100 concurrent analysts and ≥ 100k tickets without architectural change; modular-monolith boundaries (§4.6) allow extracting hot modules into services later without a rewrite. SaaS multi-tenancy is architected for, not built (§3).
- **Security / Auth**: passwords hashed with argon2id; tokens (PAT/service) hashed at rest and scoped/revocable; session cookies `HttpOnly`/`Secure`/`SameSite`; CSRF protection on cookie flows; capability-based authorization with ownership checks owned by IAM; least-privilege module boundaries (no shared mutable tables, cross-module reference by id only); dependencies pinned and scanned.
- **Availability**: stateless API replicas behind a load balancer; session/job state externalized to Redis so instances are disposable; Postgres is the single stateful tier (operator-managed backups/replication). Target ≥ 99.5% for a single-instance self-host; graceful degradation if Redis/queues are briefly unavailable (events retried, not lost).
- **Maintainability**: clean modular architecture, ports for all infra (broker, cache, storage, auth), documented contracts, Vitest unit/integration + Playwright E2E coverage on critical paths, and a clear contribution path (open-source).
- **Portability / Self-host**: full stack runs via Docker Compose from day one; no managed-cloud dependency required to operate.
- **Accessibility / i18n**: responsive web (no native apps in v1); Radix UI primitives for a11y baseline; copy externalized to leave room for localization later.
- **Observability**: structured logs, health/readiness endpoints, and basic metrics (queue depth, job failures, SLA breaches) exposed for operators.

## 7. Risks / Open Questions

| Risk / Question | Impact | Mitigation / Owner |
|-----------------|--------|--------------------|
| **Gap may not be real** — Zammad/iTop could already cover the niche (§5). | High — invalidates build. | Time-boxed evaluation of Zammad + iTop before locking the build decision. Owner: author. |
| **Scope creep** — full-ITIL ambition leaks into v1. | High — v1 never ships. | Hard phase gates (§2); v1 = ticketing core only; defer list in §4.7 enforced in review. |
| **Provisional module boundaries wrong** — a boundary needs merge/split after domain modeling. | Medium — rework. | Boundaries explicitly provisional (§4.6); revisit per-module before locking; id-only references keep refactors local. |
| **Fixed-in-code state machine** vs eventual Workflow module (v2). | Medium — migration cost. | Centralized state-machine module (§4.7.2) isolates transition logic for later externalization. |
| **EventBus reliability** — BullMQ/Redis delivery semantics for domain events. | Medium — lost side effects (notifications, audit). | EventBus behind a port; at-least-once + idempotent consumers; RabbitMQ adapter path reserved (§4.4). |
| **SLA pause/breach correctness** — timer accuracy across PENDING transitions. | Medium — wrong metrics/escalations. | Drive timers off events; detailed pause rules deferred but seam defined (§4.7.2). |
| **Solo/small contributor bandwidth** — broad roadmap, limited hands. | Medium — slow runway. | Strict phasing; open-source contribution path; prioritize MVP parity. |
| **Custom fields deferred** — `jsonb` validation design unproven. | Low (v1) | Seam noted in Ticketing; design alongside Admin/Config in v2. |
| **Open**: PAT/OIDC needed for any v1 integration? | Low | Stubbed at the seam (§4.7.1); revisit if a v1 integration appears. |

## 8. Success Metrics

_How we know it worked. Measurable._

- **Triage speed**: median time-to-find a ticket and time-to-first-assignment lower than the GLPI baseline (target ≥ 30% faster).
- **Analyst efficiency**: average ticket-handling time and clicks-per-resolution trend down release over release.
- **SLA adherence**: ≥ 90% of in-scope tickets resolved within SLA; breaches visible and trending down.
- **Adoption**: weekly active analysts and self-service tickets opened via the requester portal (vs. analyst-created) growing.
- **Reliability**: API availability ≥ 99.5%; event-delivery success ≥ 99.9%; zero lost audit events.
- **Performance**: p95 latencies meet §6.2 targets in production-like load tests.
- **Open-source health**: time-to-first-successful-`docker compose up`, external contributors, and resolved issues over time.
- **Qualitative**: analyst satisfaction (survey/SUS) materially above the GLPI baseline.

## 9. Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Owner / Author | angeluciel | Drives the RFC, architecture, and v1 delivery. |
| Approver | _TBD_ | Signs off on the design before build starts. |
| Reviewers | _TBD (eng)_ | Review architecture, boundaries, and tech choices. |
| Contributors | _Open-source community_ | Implement modules per the phased roadmap and contribution path. |
| Users — Analysts | _Pilot team_ | Primary users of the analyst console; supply triage/UX feedback. |
| Users — Requesters | _Pilot org_ | Use the self-service portal; supply friction feedback. |

## 10. Timeline / Milestones

_Indicative; sequenced by dependency, not committed dates. Phases map to §2._

| Milestone | Target | Notes |
|-----------|--------|-------|
| **M0 — Competitor eval** | Pre-build | Evaluate Zammad/iTop (§5); confirm the gap is real before committing to build. |
| **M1 — Foundations** | v1 | Monorepo, Docker Compose, CI, shared Zod contracts, NestJS + React skeletons, Postgres/MikroORM + Redis/BullMQ wired. |
| **M2 — IAM (thin)** | v1 | Email/password auth, Redis sessions, capability `can()` surface, Access/Directory ports (§4.7.1). |
| **M3 — Ticketing core** | v1 | Incidents + Requests, fixed lifecycle, comments/visibility, watchers, queues, attachments, domain events (§4.7.2). |
| **M4 — Console + portal** | v1 | Analyst console (search/queue/detail) and requester self-service portal. |
| **M5 — SLA + Notifications + Audit** | v1 | Basic SLA policies/timers/breach, event-driven notifications, audit log. |
| **M6 — Harden + ship v1** | v1 | E2E coverage, perf pass, docs, self-host release. |
| **M7+ — v2/v3** | Later | Problems, Changes, Workflow, custom fields (v2); Assets/CMDB, KB, reporting (v3); SaaS mode (later). |

## 11. Dependencies

**Runtime / infrastructure**

- **PostgreSQL** — primary datastore (per-module schema namespaces).
- **Redis** — session store, BullMQ backing, and v1 EventBus transport.
- **Docker / Docker Compose** — self-host packaging from day one.
- **SMTP / email provider** — notification delivery (pluggable).
- **Object storage (S3-compatible)** — optional Files backend behind a storage port; local FS default.

**Core libraries / frameworks** (see §4.3 for the full stack)

- Backend: NestJS (Fastify), MikroORM, BullMQ, argon2.
- Frontend: React + Vite, TanStack (Router/Query/Table), Zustand, React Hook Form + Zod, Tailwind v4, Radix UI.
- Tooling: pnpm, Turborepo, TypeScript, Vitest, Playwright, Storybook.

**External / future**

- **OIDC provider** — deferred SSO seam (§4.5).
- **RabbitMQ** — deferred EventBus adapter for advanced installs (§4.4).

**Decision dependency**

- Build-vs-adopt verdict (§5) gates M1; M0 evaluation must complete first.

## 12. Appendix / References

- **Internal**
  - §4.4 Event Bus — port/adapter swap strategy.
  - §4.5 Authentication & Authorization.
  - §4.6 Module Boundaries (provisional).
  - §4.7 Domain Models (IAM, Ticketing).
- **Benchmarks / competitors**
  - GLPI — incumbent baseline (pain we're escaping).
  - Tiflux — UX/workflow benchmark (paid/closed).
  - Zammad, iTop, Znuny (OTRS), osTicket, UVdesk/FreeScout — OSS landscape to evaluate (§5).
- **Standards / concepts**
  - ITIL — incident/request/problem/change/CMDB/KB vocabulary informing the domain roadmap.
  - OpenAPI — API contract documentation.
  - OIDC (authorization code + PKCE) — deferred SSO.
  - argon2id — password hashing.
- **Glossary**
  - **Actor / Principal** — the thing acting (user now, service token later); referenced by id across modules.
  - **Capability** — namespaced permission string (e.g. `ticket:assign`) checked via `can()`; replaces role branching.
  - **Port / Adapter** — interface boundary (`EventBus`, storage, auth) with swappable concrete implementations.
  - **Modular monolith** — single deployable app split into bounded-context modules, extractable into services later.
