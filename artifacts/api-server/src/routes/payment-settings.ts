import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db, paymentSettingsTable } from "@workspace/db";
import {
  GetPaymentSettingsResponse,
  UpdatePaymentSettingsBody,
  UpdatePaymentSettingsResponse,
} from "@workspace/api-zod";
import { adminAuthMiddleware } from "../lib/admin-auth";

const router: IRouter = Router();

const toPaymentSettings = (row: typeof paymentSettingsTable.$inferSelect) => ({
  ...row,
  updatedAt: row.updatedAt.toISOString(),
});

router.get("/payment-settings", async (_req, res): Promise<void> => {
  const [settings] = await db.select().from(paymentSettingsTable).orderBy(asc(paymentSettingsTable.id)).limit(1);
  if (!settings) {
    res.status(404).json({ error: "Payment settings have not been configured" });
    return;
  }
  res.json(GetPaymentSettingsResponse.parse(toPaymentSettings(settings)));
});

router.patch("/admin/payment-settings", adminAuthMiddleware, async (req, res): Promise<void> => {
  const parsed = UpdatePaymentSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(paymentSettingsTable).orderBy(asc(paymentSettingsTable.id)).limit(1);
  const [updated] = existing
    ? await db.update(paymentSettingsTable).set({ ...parsed.data, updatedAt: new Date() }).where(eq(paymentSettingsTable.id, existing.id)).returning()
    : await db.insert(paymentSettingsTable).values(parsed.data).returning();

  res.json(UpdatePaymentSettingsResponse.parse(toPaymentSettings(updated)));
});

export default router;