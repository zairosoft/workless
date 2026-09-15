# Workless Overview

Workless is a modular business application platform built with **NestJS** and
**TypeScript**. It provides a consistent foundation for internal applications:
authentication, companies, users, permissions, server-rendered pages, database
migrations, caching, and installable modules all live in one application.

The project is designed for teams that want to add business capabilities without
rebuilding the surrounding platform for every application.

## What Workless Provides

- **Application platform** — authentication, users, companies, profiles,
  settings, permissions, and shared UI components.
- **Company-aware execution** — every request has a company context so
  company-owned data and cache entries can remain isolated.
- **Modular capabilities** — modules under `src/modules` can expose their own
  configuration, lifecycle, views, migrations, seeders, and menu entries.
- **Database lifecycle** — timestamped migrations create and evolve PostgreSQL
  schema without relying on production schema synchronization.
- **Cache infrastructure** — Redis is supported for shared data caching, with
  an in-memory fallback when Redis is intentionally disabled or unavailable.
- **Server-rendered UI** — React TSX renders HTML on the NestJS server. The UI
  uses Tailwind CSS assets and includes English and Thai locales.

## Architecture at a Glance

```text
Browser
  |
  v
Nginx
  |
  v
NestJS application
  |- Platform application     src/app
  |- Workless core            src/workless
  |- Runtime modules          src/modules
  |- Database                 PostgreSQL
  `- Data cache               Redis (optional)
```

`src/app.module.ts` is the application composition root. It loads configuration,
database access, caching, the platform application, Workless core services, and
the runtime modules registered in `src/modules/modules.ts`.

## Main Directories

| Directory | Responsibility |
| --- | --- |
| `src/app` | Platform controllers, services, entities, policies, views, locales, and company context. |
| `src/workless` | Module registry, lifecycle services, hooks, events, shared HTTP helpers, and infrastructure ports. |
| `src/modules` | Self-contained runtime modules such as Apps, Dashboard, and Website. |
| `src/database` | Database configuration, application migrations, migration runner, seeders, and seeder runner. |
| `src/config` | Environment-backed configuration for database and JWT settings. |
| `public` | Static assets served by the application. |

## Request Flow

1. Nginx forwards a request to the NestJS application.
2. Middleware creates a request-scoped company context.
3. Public routes continue directly; protected routes require a valid JWT.
4. Permission and module-enabled guards enforce access rules when the route
   declares them.
5. Controllers call platform services or module services, which use PostgreSQL
   and the company-aware cache where appropriate.
6. The result is returned as JSON for API routes or server-rendered HTML for
   page routes.

Most APIs use the `/api/v1` prefix. Public pages such as `/`, `/auth/login`,
and `/auth/register` are served without that prefix.

## Modules

Modules extend Workless without putting all business code into `src/app`.
Each runtime module can declare metadata in `app.config.json` and may provide
its own lifecycle logic, migrations, seeders, menus, routes, and views.

Workless discovers the runtime module list from `src/modules/modules.ts`. The
module registry tracks installation and lifecycle state, while module guards
prevent unavailable modules from serving requests.

## Data and Caching

PostgreSQL is the system of record. Application migrations are registered in
`src/database/migrations/migrations.ts` and run through `npm run db:migrate`.
Use a new timestamped migration for every schema change; do not edit an applied
migration.

Redis stores cacheable data only. Workless keeps data-cache keys separate from
rendered HTML and provides scoped cache helpers for company-owned records.
Cache reads can fall back to process memory, but production deployments should
use Redis when shared cache consistency is required.

## Start Locally

```bash
npm install
cp .env.example .env
# Set JWT_SECRET and PostgreSQL settings in .env
npm run db:migrate
npm run seed
npm run start:dev
```

Open [http://localhost:3000](http://localhost:3000) after the application has
started. Continue with the Database, Modules, Components, and Docker sections
for focused guidance.
