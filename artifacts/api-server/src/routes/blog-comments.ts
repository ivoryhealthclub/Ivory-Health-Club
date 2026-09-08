import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, blogCommentsTable, blogPostsTable } from "@workspace/db";
import {
  ListBlogCommentsParams,
  ListBlogCommentsResponse,
  CreateBlogCommentParams,
  CreateBlogCommentBody,
  CreateBlogCommentResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toComment = (comment: typeof blogCommentsTable.$inferSelect) => ({
  ...comment,
  createdAt: comment.createdAt.toISOString(),
});

const parsePostId = (raw: string | string[]) =>
  Number(Array.isArray(raw) ? raw[0] : raw);

async function findPublishedPost(id: number) {
  const [post] = await db
    .select({ id: blogPostsTable.id })
    .from(blogPostsTable)
    .where(and(eq(blogPostsTable.id, id), eq(blogPostsTable.published, true)));
  return post;
}

router.get("/blog-posts/:id/comments", async (req, res): Promise<void> => {
  const params = ListBlogCommentsParams.safeParse({ id: parsePostId(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  if (!(await findPublishedPost(params.data.id))) {
    res.status(404).json({ error: "Published blog post not found" });
    return;
  }

  const comments = await db
    .select()
    .from(blogCommentsTable)
    .where(eq(blogCommentsTable.blogPostId, params.data.id))
    .orderBy(blogCommentsTable.createdAt);

  res.json(ListBlogCommentsResponse.parse(comments.map(toComment)));
});

router.post("/blog-posts/:id/comments", async (req, res): Promise<void> => {
  const params = CreateBlogCommentParams.safeParse({ id: parsePostId(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = CreateBlogCommentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  if (!(await findPublishedPost(params.data.id))) {
    res.status(404).json({ error: "Published blog post not found" });
    return;
  }

  const [comment] = await db
    .insert(blogCommentsTable)
    .values({
      blogPostId: params.data.id,
      name: body.data.name.trim(),
      email: body.data.email?.trim() || null,
      content: body.data.content.trim(),
    })
    .returning();

  res.status(201).json(CreateBlogCommentResponse.parse(toComment(comment)));
});

export default router;