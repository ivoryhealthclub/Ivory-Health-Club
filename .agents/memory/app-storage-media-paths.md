---
name: App Storage media URL paths
description: Persistent media uploads return object paths that include an /objects prefix, while the public media route already supplies that prefix.
---

When building a public URL for an App Storage object, remove the leading `/objects` from the returned object path before appending it to `/api/storage/media`.

**Why:** The signed upload URL uses the storage provider’s `/objects/...` path, but the application serving route reconstructs that prefix itself. Keeping both prefixes makes otherwise successful uploads return 404.

**How to apply:** Keep the database value as the stable `/api/storage/media/...` URL and use the raw `/objects/...` path only for storage signing or internal object operations.