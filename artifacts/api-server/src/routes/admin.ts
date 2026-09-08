import { Router, type IRouter } from "express";
import { count, eq, sum } from "drizzle-orm";
import { db, enrollmentsTable, bookingsTable, contactMessagesTable, membershipPlansTable } from "@workspace/db";
import {
  GetAdminStatsResponse,
  GetRecentActivityQueryParams,
  GetRecentActivityResponse,
  GetMembershipBreakdownResponse,
} from "@workspace/api-zod";
import { adminAuthMiddleware } from "../lib/admin-auth";

const router: IRouter = Router();
router.use(adminAuthMiddleware);

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [enrollmentCounts] = await db
    .select({
      total: count(),
      active: count(eq(enrollmentsTable.status, "active")),
      pending: count(eq(enrollmentsTable.status, "pending")),
    })
    .from(enrollmentsTable);

  const [bookingCounts] = await db
    .select({
      total: count(),
      pending: count(eq(bookingsTable.status, "pending")),
      confirmed: count(eq(bookingsTable.status, "confirmed")),
    })
    .from(bookingsTable);

  const [messageCounts] = await db
    .select({
      unread: count(eq(contactMessagesTable.isRead, false)),
    })
    .from(contactMessagesTable);

  // Count active enrollments properly
  const activeRows = await db
    .select({ c: count() })
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.status, "active"));

  const pendingRows = await db
    .select({ c: count() })
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.status, "pending"));

  const pendingBookRows = await db
    .select({ c: count() })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "pending"));

  const confirmedBookRows = await db
    .select({ c: count() })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "confirmed"));

  const unreadMsgRows = await db
    .select({ c: count() })
    .from(contactMessagesTable)
    .where(eq(contactMessagesTable.isRead, false));

  const stats = {
    totalMembers: Number(enrollmentCounts.total ?? 0),
    activeMembers: Number(activeRows[0]?.c ?? 0),
    pendingEnrollments: Number(pendingRows[0]?.c ?? 0),
    totalBookings: Number(bookingCounts.total ?? 0),
    pendingBookings: Number(pendingBookRows[0]?.c ?? 0),
    confirmedBookings: Number(confirmedBookRows[0]?.c ?? 0),
    unreadMessages: Number(unreadMsgRows[0]?.c ?? 0),
    totalRevenue: 0, // placeholder — real impl would sum paid amounts
  };

  res.json(GetAdminStatsResponse.parse(stats));
});

router.get("/admin/recent-activity", async (req, res): Promise<void> => {
  const query = GetRecentActivityQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const limit = query.data.limit ?? 10;

  const enrollments = await db
    .select({
      id: enrollmentsTable.id,
      firstName: enrollmentsTable.firstName,
      lastName: enrollmentsTable.lastName,
      status: enrollmentsTable.status,
      paymentStatus: enrollmentsTable.paymentStatus,
      createdAt: enrollmentsTable.createdAt,
    })
    .from(enrollmentsTable)
    .orderBy(enrollmentsTable.createdAt)
    .limit(limit);

  const bookings = await db
    .select({
      id: bookingsTable.id,
      firstName: bookingsTable.firstName,
      lastName: bookingsTable.lastName,
      serviceType: bookingsTable.serviceType,
      status: bookingsTable.status,
      createdAt: bookingsTable.createdAt,
    })
    .from(bookingsTable)
    .orderBy(bookingsTable.createdAt)
    .limit(limit);

  const activity = [
    ...enrollments.map((e) => ({
      id: e.id,
      type: "enrollment" as const,
      title: `New enrollment: ${e.firstName} ${e.lastName}`,
      description: `Payment status: ${e.paymentStatus}`,
      timestamp: e.createdAt.toISOString(),
      status: e.status,
    })),
    ...bookings.map((b) => ({
      id: b.id + 10000,
      type: "booking" as const,
      title: `New booking: ${b.firstName} ${b.lastName}`,
      description: `Service: ${b.serviceType.replace(/_/g, " ")}`,
      timestamp: b.createdAt.toISOString(),
      status: b.status,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  res.json(GetRecentActivityResponse.parse(activity));
});

router.get("/admin/membership-breakdown", async (_req, res): Promise<void> => {
  const plans = await db.select().from(membershipPlansTable);

  const breakdown = await Promise.all(
    plans.map(async (plan) => {
      const [result] = await db
        .select({ c: count() })
        .from(enrollmentsTable)
        .where(eq(enrollmentsTable.planId, plan.id));
      return {
        planName: plan.name,
        tier: plan.tier,
        count: Number(result?.c ?? 0),
      };
    })
  );

  res.json(GetMembershipBreakdownResponse.parse(breakdown));
});

export default router;
