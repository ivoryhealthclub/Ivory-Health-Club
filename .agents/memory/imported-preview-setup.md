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