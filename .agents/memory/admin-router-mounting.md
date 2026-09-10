---
name: Admin router mounting
description: Express route mounting convention for keeping public routes public while protecting admin endpoints.
---

Mount the admin router at the `/admin` prefix and define its handlers relative to that prefix; do not mount an unscoped router whose middleware can intercept later public routes.

**Why:** An unscoped admin router applied authentication to public payment settings and receipt-upload endpoints, while prefixing it without removing `/admin` from handler paths created duplicated admin URLs.

**How to apply:** Keep `router.use("/admin", adminRouter)` in the route index and use handler paths such as `/stats`, `/recent-activity`, and `/membership-breakdown` inside the admin router.