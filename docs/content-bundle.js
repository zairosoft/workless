// Auto-generated file. Do not edit directly.
window.DOCS_BUNDLE = {
  "registry": {
    "sections": [
      {
        "title": "Introduction",
        "items": [
          {
            "label": "Overview",
            "slug": "overview",
            "file": "content/overview.md"
          },
          {
            "label": "First steps",
            "slug": "first-steps",
            "file": "content/app/overview.md"
          }
        ]
      },
      {
        "title": "Components",
        "collapsed": true,
        "items": [
          {
            "label": "Buttons",
            "slug": "component-buttons",
            "file": "content/component/buttons.md"
          },
          {
            "label": "Badges",
            "slug": "component-badges",
            "file": "content/component/badges.md"
          },
          {
            "label": "Confirmation modal",
            "slug": "component-confirmation-modal",
            "file": "content/component/confirmation-modal.md"
          },
          {
            "label": "Layouts",
            "slug": "component-layouts",
            "file": "content/component/layouts.md"
          }
        ]
      },
      {
        "title": "Database",
        "collapsed": true,
        "items": [
          {
            "label": "Overview",
            "slug": "database-overview",
            "file": "content/database/overview.md"
          }
        ]
      },
      {
        "title": "Modules",
        "badge": "NEW",
        "collapsed": true,
        "items": [
          {
            "label": "Overview",
            "slug": "module-overview",
            "file": "content/module/overview.md"
          }
        ]
      },
      {
        "title": "Deployment",
        "collapsed": true,
        "items": [
          {
            "label": "Docker",
            "slug": "docker",
            "file": "content/docker/overview.md"
          }
        ]
      }
    ]
  },
  "markdown": {
    "content/overview.md": "# Workless Overview\n\nWorkless is a modular business application platform built with **NestJS** and\n**TypeScript**. It provides a consistent foundation for internal applications:\nauthentication, companies, users, permissions, server-rendered pages, database\nmigrations, caching, and installable modules all live in one application.\n\nThe project is designed for teams that want to add business capabilities without\nrebuilding the surrounding platform for every application.\n\n## What Workless Provides\n\n- **Application platform** — authentication, users, companies, profiles,\n  settings, permissions, and shared UI components.\n- **Company-aware execution** — every request has a company context so\n  company-owned data and cache entries can remain isolated.\n- **Modular capabilities** — modules under `src/modules` can expose their own\n  configuration, lifecycle, views, migrations, seeders, and menu entries.\n- **Database lifecycle** — timestamped migrations create and evolve PostgreSQL\n  schema without relying on production schema synchronization.\n- **Cache infrastructure** — Redis is supported for shared data caching, with\n  an in-memory fallback when Redis is intentionally disabled or unavailable.\n- **Server-rendered UI** — React TSX renders HTML on the NestJS server. The UI\n  uses Tailwind CSS assets and includes English and Thai locales.\n\n## Architecture at a Glance\n\n```text\nBrowser\n  |\n  v\nNginx\n  |\n  v\nNestJS application\n  |- Platform application     src/app\n  |- Workless core            src/workless\n  |- Runtime modules          src/modules\n  |- Database                 PostgreSQL\n  `- Data cache               Redis (optional)\n```\n\n`src/app.module.ts` is the application composition root. It loads configuration,\ndatabase access, caching, the platform application, Workless core services, and\nthe runtime modules registered in `src/modules/modules.ts`.\n\n## Main Directories\n\n| Directory | Responsibility |\n| --- | --- |\n| `src/app` | Platform controllers, services, entities, policies, views, locales, and company context. |\n| `src/workless` | Module registry, lifecycle services, hooks, events, shared HTTP helpers, and infrastructure ports. |\n| `src/modules` | Self-contained runtime modules such as Apps, Dashboard, and Website. |\n| `src/database` | Database configuration, application migrations, migration runner, seeders, and seeder runner. |\n| `src/config` | Environment-backed configuration for database and JWT settings. |\n| `public` | Static assets served by the application. |\n\n## Request Flow\n\n1. Nginx forwards a request to the NestJS application.\n2. Middleware creates a request-scoped company context.\n3. Public routes continue directly; protected routes require a valid JWT.\n4. Permission and module-enabled guards enforce access rules when the route\n   declares them.\n5. Controllers call platform services or module services, which use PostgreSQL\n   and the company-aware cache where appropriate.\n6. The result is returned as JSON for API routes or server-rendered HTML for\n   page routes.\n\nMost APIs use the `/api/v1` prefix. Public pages such as `/`, `/auth/login`,\nand `/auth/register` are served without that prefix.\n\n## Modules\n\nModules extend Workless without putting all business code into `src/app`.\nEach runtime module can declare metadata in `app.config.json` and may provide\nits own lifecycle logic, migrations, seeders, menus, routes, and views.\n\nWorkless discovers the runtime module list from `src/modules/modules.ts`. The\nmodule registry tracks installation and lifecycle state, while module guards\nprevent unavailable modules from serving requests.\n\n## Data and Caching\n\nPostgreSQL is the system of record. Application migrations are registered in\n`src/database/migrations/migrations.ts` and run through `npm run db:migrate`.\nUse a new timestamped migration for every schema change; do not edit an applied\nmigration.\n\nRedis stores cacheable data only. Workless keeps data-cache keys separate from\nrendered HTML and provides scoped cache helpers for company-owned records.\nCache reads can fall back to process memory, but production deployments should\nuse Redis when shared cache consistency is required.\n\n## Start Locally\n\n```bash\nnpm install\ncp .env.example .env\n# Set JWT_SECRET and PostgreSQL settings in .env\nnpm run db:migrate\nnpm run seed\nnpm run start:dev\n```\n\nOpen [http://localhost:3000](http://localhost:3000) after the application has\nstarted. Continue with the Database, Modules, Components, and Docker sections\nfor focused guidance.\n",
    "content/app/overview.md": "",
    "content/component/buttons.md": "# Buttons\n\nUse `Button` for actions that submit a form, save changes, cancel an action, or\nperform a destructive operation. It renders a native `<button>` and uses the\nshared Workless button shape, spacing, dark-mode styles, and disabled state.\n\n```tsx\nimport { Button } from '@/app/views/components/buttons/button';\n```\n\n## Default Button\n\nThe default variant is `primary`. Use it for the main action on a page or form.\n\n```tsx\n<Button type=\"submit\">Save changes</Button>\n```\n\n## Variants\n\n| Variant | Use for |\n| --- | --- |\n| `primary` | Main action, such as save, create, or continue. |\n| `secondary` | Secondary non-destructive action. |\n| `danger` | Destructive action, such as delete or revoke. |\n| `outline` | Low-emphasis action on a white or card surface. |\n\n```tsx\n<Button variant=\"primary\">Create company</Button>\n<Button variant=\"secondary\">Cancel</Button>\n<Button variant=\"danger\">Delete user</Button>\n<Button variant=\"outline\">Preview</Button>\n```\n\n## Disabled State\n\nUse the native `disabled` attribute while an action cannot be performed.\n\n```tsx\n<Button type=\"submit\" disabled>\n  Saving…\n</Button>\n```\n\n## Additional Classes\n\nPass `className` only for page-specific layout or sizing. Do not replace the\nvariant classes with a new visual style.\n\n```tsx\n<Button className=\"w-full sm:w-auto\" type=\"submit\">\n  Sign in\n</Button>\n```\n\nAll standard `button` attributes are forwarded to the rendered element.\n",
    "content/component/badges.md": "# Badges\n\nBadges communicate a compact status, category, or count. All badge components\naccept `children`, an optional `tone`, and an optional `className`.\n\n```tsx\nimport { BadgeBasic } from '@/app/views/components/badges/badge-basic';\n```\n\n## Default Badge\n\nUse `BadgeBasic` as the starting point for a solid status badge.\n\n```tsx\n<BadgeBasic tone=\"success\">Active</BadgeBasic>\n```\n\n## Badge Styles\n\n| Component | Appearance |\n| --- | --- |\n| `BadgeBasic` | Solid background. |\n| `BadgeSoft` | Soft background with colored text. |\n| `BadgeOutlined` | Border with transparent background. |\n| `BadgeRounded` | Pill-shaped solid badge. |\n| `BadgeDot` | Solid badge with a leading status dot. |\n| `BadgeSoftDot` | Soft badge with a leading status dot. |\n| `BadgeGlow` | Solid badge with a subtle colored glow. |\n\n```tsx\nimport { BadgeDot } from '@/app/views/components/badges/badge-dot';\nimport { BadgeOutlined } from '@/app/views/components/badges/badge-outlined';\nimport { BadgeSoft } from '@/app/views/components/badges/badge-soft';\n\n<BadgeSoft tone=\"warning\">Pending</BadgeSoft>\n<BadgeOutlined tone=\"info\">Draft</BadgeOutlined>\n<BadgeDot tone=\"success\">Online</BadgeDot>\n```\n\n## Tones\n\nAvailable tones are `default`, `primary`, `secondary`, `info`, `success`,\n`warning`, `error`, `dark`, and `light`.\n\n```tsx\n<BadgeBasic tone=\"primary\">New</BadgeBasic>\n<BadgeBasic tone=\"warning\">Needs review</BadgeBasic>\n<BadgeBasic tone=\"error\">Failed</BadgeBasic>\n```\n\n## Custom BadgeBase\n\nUse `BadgeBase` when the supplied badge wrappers do not fit the required\ncombination.\n\n```tsx\nimport { BadgeBase } from '@/app/views/components/badges/badge-base';\n\n<BadgeBase tone=\"info\" style=\"outline\" rounded dot>\n  Processing\n</BadgeBase>\n```\n",
    "content/component/confirmation-modal.md": "# Confirmation Modal\n\n`CenterConfirmModal` renders an accessible confirmation dialog in the center\nof the page. It uses Alpine directives for visibility and button actions.\n\n```tsx\nimport { CenterConfirmModal } from '@/app/views/components/modals/confirm.modal';\n```\n\n## Required Parent State\n\nThe enclosing page must define the boolean state used by `model`.\n\n```tsx\n<main x-data=\"{ showDeleteConfirm: false }\">\n  {/* Page content */}\n</main>\n```\n\n## Basic Usage\n\nThe modal closes automatically when cancel is selected if `onCancel` is not\nprovided.\n\n```tsx\n<CenterConfirmModal\n  model=\"showDeleteConfirm\"\n  title=\"Delete this company?\"\n  description=\"This action cannot be undone.\"\n  confirmLabel=\"Delete\"\n  cancelLabel=\"Cancel\"\n  variant=\"danger\"\n  onConfirm=\"deleteCompany()\"\n/>\n```\n\n## Open the Modal\n\nUse an Alpine click expression to change the state.\n\n```tsx\n<Button variant=\"danger\" {...{ 'x-on:click': 'showDeleteConfirm = true' }}>\n  Delete company\n</Button>\n```\n\n## Properties\n\n| Property | Description |\n| --- | --- |\n| `model` | Alpine boolean state name. Default: `showConfirmModal`. |\n| `title` | Required dialog title. |\n| `description` | Optional supporting text or JSX. |\n| `confirmLabel` | Text for the confirm button. |\n| `cancelLabel` | Text for the cancel button. |\n| `variant` | `primary` or `danger`. |\n| `onConfirm` | Alpine expression run after confirmation. |\n| `onCancel` | Alpine expression run when the dialog is dismissed. |\n| `locale` | Locale used for default button labels. |\n\nKeep the business operation in an Alpine action, form submit handler, or page\ncontroller. The modal only handles the user confirmation interface.\n",
    "content/component/layouts.md": "# Layouts\n\nLayouts provide the shared application shell around authenticated pages. The\nmain layout includes application navigation, header controls, page content, and\nthe standard footer.\n\n```tsx\nimport { renderMainLayoutView } from '@/app/views/components/layouts/layout';\n```\n\n## Main Application Layout\n\nUse `renderMainLayoutView` when rendering a page inside the authenticated\nWorkless application.\n\n```tsx\nexport function renderUsersPage() {\n  return renderMainLayoutView({\n    title: 'Users',\n    activePath: '/users',\n    children: <section className=\"card p-5\">User list</section>,\n  });\n}\n```\n\n`activePath` highlights the appropriate sidebar item. Keep page-specific markup\ninside `children` and reuse the `card` utility for standard content surfaces.\n\n## Footer\n\nUse `Footer` when a page needs only the standard product footer.\n\n```tsx\nimport { Footer } from '@/app/views/components/layouts/common/footer';\n\n<Footer version=\"1.0.0\" />\n```\n\nThe footer derives the current year automatically. If no version is supplied,\nit uses the package version when available.\n\n## Document Helpers\n\n`main.tsx` contains helpers for complete HTML documents and localized page\nrendering.\n\n```tsx\nimport { createView } from '@/app/views/components/main';\n\nexport const renderWelcomePage = createView(({ t }) => ({\n  title: t('welcome.title'),\n  children: <main className=\"p-6\">{t('welcome.title')}</main>,\n}));\n```\n\nUse `createView` for standalone server-rendered pages. Use the main layout for\npages that belong in the signed-in application shell.\n",
    "content/database/overview.md": "",
    "content/module/overview.md": "",
    "content/docker/overview.md": ""
  }
};
