import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, membershipPlansTable } from "@workspace/db";
import {
  ListMembershipPlansResponse,
  GetMembershipPlanParams,
  GetMembershipPlanResponse,
  CreateMembershipPlanBody,
  CreateMembershipPlanResponse,
  UpdateMembershipPlanParams,
  UpdateMembershipPlanBody,
  UpdateMembershipPlanResponse,
} from "@workspace/api-zod";
import { adminAuthMiddleware } from "../lib/admin-auth";

const router: IRouter = Router();

const toPlan = (plan: typeof membershipPlansTable.$inferSelect) => ({
  ...plan,
  discounts: plan.discounts ?? undefined,
  maxMembers: plan.maxMembers ?? undefined,
});

router.get("/membership-plans", async (_req, res): Promise<void> => {
  const plans = await db
    .select()
    .from(membershipPlansTable)
    .orderBy(membershipPlansTable.id);
  res.json(ListMembershipPlansResponse.parse(plans.map(toPlan)));
});

router.post("/membership-plans", adminAuthMiddleware, async (req, res): Promise<void> => {
  const parsed = CreateMembershipPlanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const normalizedTier = parsed.data.tier.trim().toLowerCase().replace(/\s+/g, "_");
  const [existing] = await db
    .select({ id: membershipPlansTable.id })
    .from(membershipPlansTable)
    .where(eq(membershipPlansTable.tier, normalizedTier));

  if (existing) {
    res.status(409).json({ error: "A membership plan with this tier already exists" });
    return;
  }

  const [created] = await db
    .insert(membershipPlansTable)
    .values({
      name: parsed.data.name.trim(),
      tier: normalizedTier,
      description: parsed.data.description?.trim() || `${parsed.data.name.trim()} membership at Ivory Health Club.`,
      price: parsed.data.price,
      pricePeriod: parsed.data.pricePeriod ?? "monthly",
      perks: parsed.data.perks ?? [],
      discounts: parsed.data.discounts?.trim() || null,
      maxMembers: parsed.data.maxMembers ?? null,
    })
    .returning();

  res.status(201).json(CreateMembershipPlanResponse.parse(toPlan(created)));
});

router.get("/membership-plans/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetMembershipPlanParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [plan] = await db
    .select()
    .from(membershipPlansTable)
    .where(eq(membershipPlansTable.id, params.data.id));

  if (!plan) {
    res.status(404).json({ error: "Membership plan not found" });
    return;
  }

  res.json(GetMembershipPlanResponse.parse(toPlan(plan)));
});

router.patch("/membership-plans/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateMembershipPlanParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateMembershipPlanBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [updated] = await db
    .update(membershipPlansTable)
    .set({
      price: body.data.price,
      ...(body.data.pricePeriod !== undefined && { pricePeriod: body.data.pricePeriod }),
    })
    .where(eq(membershipPlansTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Membership plan not found" });
    return;
  }

  res.json(UpdateMembershipPlanResponse.parse(toPlan(updated)));
});

export default router;
