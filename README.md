# better-ITSM

![GitHub repo size](https://img.shields.io/github/repo-size/angeluciel/better-ITSM?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/angeluciel/better-ITSM?style=for-the-badge)
![GitHub open issues](https://img.shields.io/github/issues/angeluciel/better-ITSM?style=for-the-badge)
![GitHub open PRs](https://img.shields.io/github/issues-pr/angeluciel/better-ITSM?style=for-the-badge)

Open-source IT Service Management with modern UX. Self-hostable, modular, and built with TypeScript end to end.

## Prerequisites

- [Node.js](https://nodejs.org/) 24+
- [pnpm](https://pnpm.io/) 10+
- [Docker](https://www.docker.com/) and Docker Compose

## Quickstart

```bash
git clone https://github.com/angeluciel/better-ITSM.git
cd better-ITSM
cp .env.example .env
pnpm install
pnpm dev
```

The API runs at `http://localhost:4000` and the web app at `http://localhost:3000`.

## Available Scripts

| Script             | Description                                     |
| ------------------ | ----------------------------------------------- |
| `pnpm dev`         | Start all apps in development mode (hot reload) |
| `pnpm build`       | Build all packages in dependency order          |
| `pnpm test`        | Run tests across all packages                   |
| `pnpm lint`        | Lint all packages with ESLint                   |
| `pnpm typecheck`   | Type-check all packages with TypeScript         |
| `pnpm format`      | Check formatting with Prettier                  |
| `pnpm format:fix`  | Fix formatting with Prettier                    |
| `pnpm clean`       | Remove build artifacts                          |
| `pnpm docker:up`   | Start full stack with Docker Compose            |
| `pnpm docker:dev`  | Start stack with dev overrides (hot reload)     |
| `pnpm docker:down` | Stop Docker Compose stack                       |

## Docker

Start the full stack (PostgreSQL, Redis, API, Web):

```bash
pnpm docker:up
```

For development with hot reload:

```bash
pnpm docker:dev
```

## Project Structure

```
better-ITSM/
├── apps/
│   ├── api/              # NestJS + Fastify backend
│   └── web/              # React + Vite frontend
├── packages/
│   ├── contracts/        # Shared Zod schemas
│   ├── eslint-config/    # Shared ESLint configuration
│   └── tsconfig/         # Shared TypeScript configs
├── docker/               # Dockerfiles and init scripts
├── docker-compose.yml    # Production-like stack
├── docker-compose.dev.yml # Dev overrides
├── turbo.json            # Turborepo pipeline
└── pnpm-workspace.yaml   # Workspace definition
```

## Contributing

All changes are merged via pull request with at least one review. See `docs/RFC.md` for architecture decisions and `docs/BRANCH-NAMING.md` for branch conventions.
