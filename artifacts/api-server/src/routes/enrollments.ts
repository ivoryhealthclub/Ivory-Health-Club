import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, enrollmentsTable, membershipPlansTable } from "@workspace/db";
import {
  ListEnrollmentsQueryParams,
  ListEnrollmentsResponse,
  CreateEnrollmentBody,
  CreateEnrollmentResponse,
  GetEnrollmentParams,
  GetEnrollmentResponse,
  ConfirmPaymentParams,
  ConfirmPaymentBody,
  ConfirmPaymentResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/enrollments", async (req, res): Promise<void> => {
  const query = ListEnrollmentsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [];
  if (query.data.status) conditions.push(eq(enrollmentsTable.status, query.data.status));
  if (query.data.planId) conditions.push(eq(enrollmentsTable.planId, query.data.planId));

  const rows = await db
    .select({
      id: enrollmentsTable.id,
      planId: enrollmentsTable.planId,
      planName: membershipPlansTable.name,
      firstName: enrollmentsTable.firstName,
      lastName: enrollmentsTable.lastName,
      email: enrollmentsTable.email,
      phone: enrollmentsTable.phone,
      address: enrollmentsTable.address,
      dateOfBirth: enrollmentsTable.dateOfBirth,
      status: enrollmentsTable.status,
      paymentStatus: enrollmentsTable.paymentStatus,
      paymentReference: enrollmentsTable.paymentReference,
      notes: enrollmentsTable.notes,
      createdAt: enrollmentsTable.createdAt,
    })
    .from(enrollmentsTable)
    .leftJoin(membershipPlansTable, eq(enrollmentsTable.planId, membershipPlansTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(enrollmentsTable.createdAt);

  const parsed = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  res.json(ListEnrollmentsResponse.parse(parsed));
});

router.post("/enrollments", async (req, res): Promise<void> => {
  const parsed = CreateEnrollmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [enrollment] = await db
    .insert(enrollmentsTable)
    .values({
      planId: parsed.data.planId,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address ?? null,
      dateOfBirth: parsed.data.dateOfBirth ?? null,
      notes: parsed.data.notes ?? null,
      status: "pending",
      paymentStatus: "unpaid",
    })
    .returning();

  // Fetch with plan name
  const [row] = await db
    .select({
      id: enrollmentsTable.id,
      planId: enrollmentsTable.planId,
      planName: membershipPlansTable.name,
      firstName: enrollmentsTable.firstName,
      lastName: enrollmentsTable.lastName,
      email: enrollmentsTable.email,
      phone: enrollmentsTable.phone,
      address: enrollmentsTable.address,
      dateOfBirth: enrollmentsTable.dateOfBirth,
      status: enrollmentsTable.status,
      paymentStatus: enrollmentsTable.paymentStatus,
      paymentReference: enrollmentsTable.paymentReference,
      notes: enrollmentsTable.notes,
      createdAt: enrollmentsTable.createdAt,
    })
    .from(enrollmentsTable)
    .leftJoin(membershipPlansTable, eq(enrollmentsTable.planId, membershipPlansTable.id))
    .where(eq(enrollmentsTable.id, enrollment.id));

  res.status(201).json(CreateEnrollmentResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

router.get("/enrollments/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetEnrollmentParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select({
      id: enrollmentsTable.id,
      planId: enrollmentsTable.planId,
      planName: membershipPlansTable.name,
      firstName: enrollmentsTable.firstName,
      lastName: enrollmentsTable.lastName,
      email: enrollmentsTable.email,
      phone: enrollmentsTable.phone,
      address: enrollmentsTable.address,
      dateOfBirth: enrollmentsTable.dateOfBirth,
      status: enrollmentsTable.status,
      paymentStatus: enrollmentsTable.paymentStatus,
      paymentReference: enrollmentsTable.paymentReference,
      notes: enrollmentsTable.notes,
      createdAt: enrollmentsTable.createdAt,
    })
    .from(enrollmentsTable)
    .leftJoin(membershipPlansTable, eq(enrollmentsTable.planId, membershipPlansTable.id))
    .where(eq(enrollmentsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Enrollment not found" });
    return;
  }

  res.json(GetEnrollmentResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

router.patch("/enrollments/:id/confirm-payment", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ConfirmPaymentParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = ConfirmPaymentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [updated] = await db
    .update(enrollmentsTable)
    .set({
      paymentStatus: "paid",
      paymentReference: body.data.paymentReference,
      status: "active",
      notes: body.data.notes ?? undefined,
    })
    .where(eq(enrollmentsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Enrollment not found" });
    return;
  }

  const [row] = await db
    .select({
      id: enrollmentsTable.id,
      planId: enrollmentsTable.planId,
      planName: membershipPlansTable.name,
      firstName: enrollmentsTable.firstName,
      lastName: enrollmentsTable.lastName,
      email: enrollmentsTable.email,
      phone: enrollmentsTable.phone,
      address: enrollmentsTable.address,
      dateOfBirth: enrollmentsTable.dateOfBirth,
      status: enrollmentsTable.status,
      paymentStatus: enrollmentsTable.paymentStatus,
      paymentReference: enrollmentsTable.paymentReference,
      notes: enrollmentsTable.notes,
      createdAt: enrollmentsTable.createdAt,
    })
    .from(enrollmentsTable)
    .leftJoin(membershipPlansTable, eq(enrollmentsTable.planId, membershipPlansTable.id))
    .where(eq(enrollmentsTable.id, params.data.id));

  res.json(ConfirmPaymentResponse.parse({ ...row, createdAt: row!.createdAt.toISOString() }));
});

export default router;
