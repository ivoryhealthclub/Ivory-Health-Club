---
name: Imported preview setup
description: Imported workspace previews may need explicit workflows, a dev schema push, and a Vite proxy to the API.
---

Imported workspaces can contain artifact metadata without registered preview workflows. For a full-stack preview, configure one frontend workflow and one API workflow, apply the development Drizzle schema, and proxy `/api` from Vite to the API port.

**Why:** Without those steps, the frontend can return 200 while data requests fail because no API is running, the database tables do not exist, or Vite falls back to serving HTML for `/api` paths.

**How to apply:** When setting up an imported full-stack pnpm workspace, check workflow registration, database readiness/schema, and browser-facing API routing before declaring the preview healthy.

Imported pnpm workspaces also need their lockfile dependencies installed before artifact-owned workflows can start. Build the referenced shared libraries before running package-level TypeScript checks so project-reference declarations exist.

**Why:** Artifact workflows may fail with misleading “vite not found” or missing-package errors after import, and package-level checks otherwise report cascading TS6305/implicit-any errors from absent generated declarations.

**How to apply:** Run the repository’s frozen pnpm install, then `pnpm run typecheck:libs`, before validating the API and frontend workflows.

Imported Wouter apps may need an explicit exact route for a protected root path such as `/admin` in addition to the `/admin/*` wildcard.

**Why:** The wildcard route did not match the bare admin path in the preview, sending users to the public 404 page even though nested admin routes were configured.

**How to apply:** When validating a root dashboard URL after import, test the exact path and add an explicit route before relying on a wildcard-only match.

Imported Vite artifacts require both `PORT` and `BASE_PATH` for standalone production builds, even though managed dev workflows supply them automatically.

**Why:** Running the package build without those values fails while loading the Vite config, which can look like a feature regression even when the preview workflow is healthy.

**How to apply:** Use the artifact's configured preview base path and an available port when running the production build directly; keep the config's required environment checks intact.