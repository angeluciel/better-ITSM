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

…

### 4.2 Architecture

```
[ client ] -> [ API ] -> [ services ] -> [ datastore ]
```

### 4.3 Core Concepts / Domain Model

- **Ticket / Incident** - …
- **Request** - …
- **User / Agent** - …
- **SLA / Workflow** - …

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
