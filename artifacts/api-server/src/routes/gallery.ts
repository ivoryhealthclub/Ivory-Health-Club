import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, galleryImagesTable } from "@workspace/db";
import {
  ListGalleryImagesQueryParams,
  ListGalleryImagesResponse,
  CreateGalleryImageBody,
  CreateGalleryImageResponse,
  UpdateGalleryImageParams,
  UpdateGalleryImageBody,
  UpdateGalleryImageResponse,
  DeleteGalleryImageParams,
} from "@workspace/api-zod";
import { adminAuthMiddleware, getAdminSessionEmail } from "../lib/admin-auth";

const router: IRouter = Router();

const toImage = (r: typeof galleryImagesTable.$inferSelect) => ({
  ...r,
  createdAt: r.createdAt.toISOString(),
});

router.get("/gallery", async (req, res): Promise<void> => {
  const query = ListGalleryImagesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const isAdmin = Boolean(getAdminSessionEmail(req));
  const rows = await db
    .select()
    .from(galleryImagesTable)
    .where(
      and(
        query.data.category ? eq(galleryImagesTable.category, query.data.category) : undefined,
        query.data.includeUnpublished && isAdmin ? undefined : eq(galleryImagesTable.published, true),
      ),
    )
    .orderBy(galleryImagesTable.createdAt);

  res.json(ListGalleryImagesResponse.parse(rows.map(toImage)));
});

router.post("/gallery", adminAuthMiddleware, async (req, res): Promise<void> => {
  const parsed = CreateGalleryImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [image] = await db
    .insert(galleryImagesTable)
    .values({
      url: parsed.data.url,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      category: parsed.data.category,
      published: parsed.data.published ?? true,
    })
    .returning();

  res.status(201).json(CreateGalleryImageResponse.parse(toImage(image)));
});

router.patch("/gallery/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateGalleryImageParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateGalleryImageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [updated] = await db
    .update(galleryImagesTable)
    .set({
      ...(body.data.url !== undefined && { url: body.data.url }),
      ...(body.data.title !== undefined && { title: body.data.title }),
      ...(body.data.description !== undefined && { description: body.data.description }),
      ...(body.data.category !== undefined && { category: body.data.category }),
      ...(body.data.published !== undefined && { published: body.data.published }),
    })
    .where(eq(galleryImagesTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Gallery image not found" });
    return;
  }

  res.json(UpdateGalleryImageResponse.parse(toImage(updated)));
});

router.delete("/gallery/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteGalleryImageParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(galleryImagesTable)
    .where(eq(galleryImagesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Gallery image not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
