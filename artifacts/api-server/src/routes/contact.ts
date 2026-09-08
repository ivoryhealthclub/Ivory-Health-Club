import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, contactMessagesTable } from "@workspace/db";
import {
  SubmitContactBody,
  SubmitContactResponse,
  ListContactMessagesQueryParams,
  ListContactMessagesResponse,
  MarkContactReadParams,
  MarkContactReadBody,
  MarkContactReadResponse,
} from "@workspace/api-zod";
import { adminAuthMiddleware } from "../lib/admin-auth";

const router: IRouter = Router();

const toMsg = (r: typeof contactMessagesTable.$inferSelect) => ({
  ...r,
  createdAt: r.createdAt.toISOString(),
});

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [msg] = await db
    .insert(contactMessagesTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject,
      message: parsed.data.message,
      isRead: false,
    })
    .returning();

  res.status(201).json(SubmitContactResponse.parse(toMsg(msg)));
});

router.get("/contact-messages", adminAuthMiddleware, async (req, res): Promise<void> => {
  const query = ListContactMessagesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const rows = await db
    .select()
    .from(contactMessagesTable)
    .where(
      query.data.isRead !== undefined
        ? eq(contactMessagesTable.isRead, query.data.isRead)
        : undefined
    )
    .orderBy(contactMessagesTable.createdAt);

  res.json(ListContactMessagesResponse.parse(rows.map(toMsg)));
});

router.patch("/contact-messages/:id/read", adminAuthMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = MarkContactReadParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = MarkContactReadBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [updated] = await db
    .update(contactMessagesTable)
    .set({ isRead: body.data.isRead })
    .where(eq(contactMessagesTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  res.json(MarkContactReadResponse.parse(toMsg(updated)));
});

export default router;
