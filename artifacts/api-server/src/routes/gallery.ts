import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, galleryImagesTable } from "@workspace/db";
import {
  ListGalleryImagesQueryParams,
  ListGalleryImagesResponse,
  CreateGalleryImageBody,
  CreateGalleryImageResponse,
  DeleteGalleryImageParams,
} from "@workspace/api-zod";
import { adminAuthMiddleware } from "../lib/admin-auth";

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

  const rows = await db
    .select()
    .from(galleryImagesTable)
    .where(query.data.category ? eq(galleryImagesTable.category, query.data.category) : undefined)
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
    })
    .returning();

  res.status(201).json(CreateGalleryImageResponse.parse(toImage(image)));
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
