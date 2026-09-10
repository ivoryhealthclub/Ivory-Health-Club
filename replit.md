# Ivory Health Club

A full-stack luxury health and wellness club website for Ivory Health Club, Nigeria. Features a futuristic animated hero, membership enrollment, service/event booking, admin dashboard, blog, gallery, and contact.

## Run & Operate

- `pnpm --filter @workspace/ivory-health-club run dev` — run the frontend (port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Admin portal: open `/admin`; development demo credentials are `admin@ivoryhealthclub.com` / `IvoryDemo!2026`
- Set the `ADMIN_PASSWORD` Replit Secret for a non-demo password; it overrides the development fallback and is required in production

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Wouter, React Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — Drizzle table definitions
  - `membership-plans.ts`, `enrollments.ts`, `bookings.ts`, `blog-posts.ts`, `gallery-images.ts`, `contact-messages.ts`
- `artifacts/api-server/src/routes/` — Express route handlers by domain
- `artifacts/ivory-health-club/src/` — React frontend

## Architecture decisions

- All `type: integer` fields in OpenAPI spec use `type: number` — Orval with the workspace Zod version generates `zod.int()` for `integer` which doesn't exist in zod v3.25.x. Use `number` to generate `zod.number()` instead.
- Admin dashboard uses sidebar layout at `/admin/*` routes
- Membership plans are seeded at startup — no create endpoint needed for plans (admin-only in future)
- Blog posts are filtered to `published: true` on public endpoints; admin can see all
- Blog and gallery records are stored in PostgreSQL; startup seeding inserts only missing starter records and never resets existing content.
- Admin-uploaded images are stored in persistent App Storage, while PostgreSQL stores the stable media URL used by public pages.

## Product

- **Public site:** Homepage with animated hero (Framer Motion), Services, Membership plans, Programs, Gallery, Blog, Contact
- **Enrollment:** Users submit membership, academy, or programme applications as separate enrollment records; bank-transfer receipts must be reviewed before activation
- **Booking:** Users request restaurant, spa, fitness programme, or gym services/activities with date/time/guest details
- **Payments:** Bank transfer is the only payment method; payment settings are managed from the admin dashboard and receipts use private object storage
- **Admin dashboard:** Stats overview, recent activity, enrollment payment review, booking management, bank-detail management, message inbox, blog management, and gallery management

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Use `type: number` (not `type: integer`) in `lib/api-spec/openapi.yaml` to avoid `zod.int()` generation errors
- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` before touching the backend or frontend
- Do NOT run `pnpm run dev` at workspace root — use workflow tools
- `req.params.id` is `string | string[]` in Express 5; always parse: `const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
