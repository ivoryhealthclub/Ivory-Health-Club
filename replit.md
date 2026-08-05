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

## Product

- **Public site:** Homepage with animated hero (Framer Motion), Services, Membership plans, Programs, Gallery, Blog, Contact
- **Enrollment:** Users pick a plan, fill a form, submit — creates a pending enrollment; admin confirms payment
- **Booking:** Users book any service (gym, spa, restaurant, event hall, programs) with date/time/guests
- **Admin dashboard:** Stats overview, recent activity, enrollment management (confirm payment), booking management, message inbox, blog management, gallery management

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Use `type: number` (not `type: integer`) in `lib/api-spec/openapi.yaml` to avoid `zod.int()` generation errors
- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` before touching the backend or frontend
- Do NOT run `pnpm run dev` at workspace root — use workflow tools
- `req.params.id` is `string | string[]` in Express 5; always parse: `const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
