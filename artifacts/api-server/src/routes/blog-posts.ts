import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  ListBlogPostsQueryParams,
  ListBlogPostsResponse,
  CreateBlogPostBody,
  CreateBlogPostResponse,
  GetBlogPostParams,
  GetBlogPostResponse,
  UpdateBlogPostParams,
  UpdateBlogPostBody,
  UpdateBlogPostResponse,
  DeleteBlogPostParams,
} from "@workspace/api-zod";
import { adminAuthMiddleware } from "../lib/admin-auth";

const router: IRouter = Router();

const toPost = (r: typeof blogPostsTable.$inferSelect) => ({
  ...r,
  createdAt: r.createdAt.toISOString(),
});

router.get("/blog-posts", async (req, res): Promise<void> => {
  const query = ListBlogPostsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [eq(blogPostsTable.published, true)];
  if (query.data.category) conditions.push(eq(blogPostsTable.category, query.data.category));

  const rows = await db
    .select()
    .from(blogPostsTable)
    .where(and(...conditions))
    .orderBy(blogPostsTable.createdAt)
    .limit(query.data.limit ?? 10);

  res.json(ListBlogPostsResponse.parse(rows.map(toPost)));
});

router.post("/blog-posts", adminAuthMiddleware, async (req, res): Promise<void> => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const slug = parsed.data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    + "-" + Date.now();

  const [post] = await db
    .insert(blogPostsTable)
    .values({
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt ?? null,
      content: parsed.data.content,
      category: parsed.data.category,
      imageUrl: parsed.data.imageUrl ?? null,
      focusKeyword: parsed.data.focusKeyword ?? null,
      metaDescription: parsed.data.metaDescription ?? null,
      tags: parsed.data.tags ?? [],
      ogTitle: parsed.data.ogTitle ?? null,
      ogDescription: parsed.data.ogDescription ?? null,
      author: parsed.data.author,
      published: parsed.data.published ?? false,
    })
    .returning();

  res.status(201).json(CreateBlogPostResponse.parse(toPost(post)));
});

router.get("/blog-posts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetBlogPostParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, params.data.id));

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(GetBlogPostResponse.parse(toPost(post)));
});

router.patch("/blog-posts/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateBlogPostParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateBlogPostBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [updated] = await db
    .update(blogPostsTable)
    .set({
      ...(body.data.title !== undefined && { title: body.data.title }),
      ...(body.data.excerpt !== undefined && { excerpt: body.data.excerpt }),
      ...(body.data.content !== undefined && { content: body.data.content }),
      ...(body.data.category !== undefined && { category: body.data.category }),
      ...(body.data.imageUrl !== undefined && { imageUrl: body.data.imageUrl }),
      ...(body.data.focusKeyword !== undefined && { focusKeyword: body.data.focusKeyword }),
      ...(body.data.metaDescription !== undefined && { metaDescription: body.data.metaDescription }),
      ...(body.data.tags !== undefined && { tags: body.data.tags }),
      ...(body.data.ogTitle !== undefined && { ogTitle: body.data.ogTitle }),
      ...(body.data.ogDescription !== undefined && { ogDescription: body.data.ogDescription }),
      ...(body.data.author !== undefined && { author: body.data.author }),
      ...(body.data.published !== undefined && { published: body.data.published }),
    })
    .where(eq(blogPostsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(UpdateBlogPostResponse.parse(toPost(updated)));
});

router.delete("/blog-posts/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteBlogPostParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(blogPostsTable)
    .where(eq(blogPostsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
