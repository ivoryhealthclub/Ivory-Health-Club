---
name: Seeded media validation
description: Remote image URLs in editorial seed data need validation and explicit repair when records already exist.
---

Remote media used by seeded Gallery or Blog content should be checked for a successful response before declaring the page healthy. Insert-only seeders will preserve a broken existing URL, so correcting the seed definition alone does not repair the current development record.

**Why:** A single stale external image URL can render as a broken card while API requests and TypeScript checks still pass.

**How to apply:** Validate seeded media during page verification, correct the seed source, and repair the existing development record when the bad item is already persisted.