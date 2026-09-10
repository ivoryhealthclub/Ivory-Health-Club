import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
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
  ReviewEnrollmentPaymentBody,
  ReviewEnrollmentPaymentResponse,
} from "@workspace/api-zod";
import { adminAuthMiddleware } from "../lib/admin-auth";
import { createReceiptUploadToken } from "../lib/receipt-tokens";

const router: IRouter = Router();

const enrollmentSelection = {
  id: enrollmentsTable.id,
  planId: enrollmentsTable.planId,
  enrollmentType: enrollmentsTable.enrollmentType,
  programKey: enrollmentsTable.programKey,
  programName: enrollmentsTable.programName,
  enrollmentDate: enrollmentsTable.enrollmentDate,
  participantName: enrollmentsTable.participantName,
  companyName: enrollmentsTable.companyName,
  teamSize: enrollmentsTable.teamSize,
  age: enrollmentsTable.age,
  experience: enrollmentsTable.experience,
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
  paymentMethod: enrollmentsTable.paymentMethod,
  receiptObjectPath: enrollmentsTable.receiptObjectPath,
  receiptFileName: enrollmentsTable.receiptFileName,
  receiptMimeType: enrollmentsTable.receiptMimeType,
  receiptUploadedAt: enrollmentsTable.receiptUploadedAt,
  notes: enrollmentsTable.notes,
  createdAt: enrollmentsTable.createdAt,
};

function toEnrollment(row: typeof enrollmentSelection extends never ? never : Record<string, unknown>, receiptUploadToken?: string) {
  return {
    ...row,
    createdAt: (row.createdAt as Date).toISOString(),
    receiptUploadedAt: row.receiptUploadedAt instanceof Date ? row.receiptUploadedAt.toISOString() : null,
    receiptUploadToken: receiptUploadToken ?? null,
  };
}

async function getEnrollmentRow(id: number) {
  const [row] = await db
    .select(enrollmentSelection)
    .from(enrollmentsTable)
    .leftJoin(membershipPlansTable, eq(enrollmentsTable.planId, membershipPlansTable.id))
    .where(eq(enrollmentsTable.id, id));
  return row;
}

router.get("/enrollments", adminAuthMiddleware, async (req, res): Promise<void> => {
  const query = ListEnrollmentsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [];
  if (query.data.status) conditions.push(eq(enrollmentsTable.status, query.data.status));
  if (query.data.planId) conditions.push(eq(enrollmentsTable.planId, query.data.planId));

  const rows = await db
    .select(enrollmentSelection)
    .from(enrollmentsTable)
    .leftJoin(membershipPlansTable, eq(enrollmentsTable.planId, membershipPlansTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(enrollmentsTable.createdAt);

  res.json(ListEnrollmentsResponse.parse(rows.map((row) => toEnrollment(row))));
});

router.post("/enrollments", async (req, res): Promise<void> => {
  const parsed = CreateEnrollmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const enrollmentType = parsed.data.enrollmentType ?? "membership";
  if (enrollmentType === "membership" && !parsed.data.planId) {
    res.status(400).json({ error: "A membership plan is required for membership enrollments." });
    return;
  }
  if (enrollmentType !== "membership" && !parsed.data.programName) {
    res.status(400).json({ error: "A program name is required for program enrollments." });
    return;
  }

  const receiptToken = createReceiptUploadToken();
  const [enrollment] = await db
    .insert(enrollmentsTable)
    .values({
      planId: parsed.data.planId ?? null,
      enrollmentType,
      programKey: parsed.data.programKey ?? null,
      programName: parsed.data.programName ?? null,
      enrollmentDate: parsed.data.enrollmentDate ?? null,
      participantName: parsed.data.participantName ?? null,
      companyName: parsed.data.companyName ?? null,
      teamSize: parsed.data.teamSize ?? null,
      age: parsed.data.age ?? null,
      experience: parsed.data.experience ?? null,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address ?? null,
      dateOfBirth: parsed.data.dateOfBirth ?? null,
      notes: parsed.data.notes ?? null,
      status: "pending",
      paymentStatus: "unpaid",
      paymentMethod: "bank_transfer",
      receiptUploadTokenHash: receiptToken.hash,
    })
    .returning();

  const row = await getEnrollmentRow(enrollment.id);
  res.status(201).json(CreateEnrollmentResponse.parse(toEnrollment(row!, receiptToken.token)));
});

router.get("/enrollments/:id", adminAuthMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetEnrollmentParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const row = await getEnrollmentRow(params.data.id);
  if (!row) {
    res.status(404).json({ error: "Enrollment not found" });
    return;
  }

  res.json(GetEnrollmentResponse.parse(toEnrollment(row)));
});

router.patch("/enrollments/:id/confirm-payment", adminAuthMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ConfirmPaymentParams.safeParse({ id: Number(raw) });
  const body = ConfirmPaymentBody.safeParse(req.body);
  if (!params.success || !body.success) {
    const error = !params.success ? params.error.message : body.success ? "Invalid payment data." : body.error.message;
    res.status(400).json({ error });
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

  const row = await getEnrollmentRow(params.data.id);
  res.json(ConfirmPaymentResponse.parse(toEnrollment(row!)));
});

router.patch("/enrollments/:id/payment-review", adminAuthMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ConfirmPaymentParams.safeParse({ id: Number(raw) });
  const body = ReviewEnrollmentPaymentBody.safeParse(req.body);
  if (!params.success || !body.success) {
    const error = !params.success ? params.error.message : body.success ? "Invalid payment review data." : body.error.message;
    res.status(400).json({ error });
    return;
  }

  const existing = await getEnrollmentRow(params.data.id);
  if (!existing) {
    res.status(404).json({ error: "Enrollment not found" });
    return;
  }
  if (body.data.decision === "approve" && !existing.receiptObjectPath) {
    res.status(400).json({ error: "A payment receipt must be uploaded before approval." });
    return;
  }

  await db
    .update(enrollmentsTable)
    .set({
      paymentStatus: body.data.decision === "approve" ? "paid" : "rejected",
      paymentReference: body.data.paymentReference ?? undefined,
      status: body.data.decision === "approve" ? "active" : "pending",
      notes: body.data.notes ?? undefined,
    })
    .where(eq(enrollmentsTable.id, params.data.id));

  const row = await getEnrollmentRow(params.data.id);
  res.json(ReviewEnrollmentPaymentResponse.parse(toEnrollment(row!)));
});

export default router;