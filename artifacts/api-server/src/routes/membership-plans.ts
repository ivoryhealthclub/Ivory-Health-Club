import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, membershipPlansTable } from "@workspace/db";
import {
  ListMembershipPlansResponse,
  GetMembershipPlanParams,
  GetMembershipPlanResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/membership-plans", async (_req, res): Promise<void> => {
  const plans = await db
    .select()
    .from(membershipPlansTable)
    .orderBy(membershipPlansTable.id);
  const normalized = plans.map((p) => ({
    ...p,
    discounts: p.discounts ?? undefined,
    maxMembers: p.maxMembers ?? undefined,
  }));
  res.json(ListMembershipPlansResponse.parse(normalized));
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

  res.json(GetMembershipPlanResponse.parse({
    ...plan,
    discounts: plan.discounts ?? undefined,
    maxMembers: plan.maxMembers ?? undefined,
  }));
});

export default router;
