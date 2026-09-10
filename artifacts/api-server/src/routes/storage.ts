import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookingsTable, enrollmentsTable } from "@workspace/db";
import { adminAuthMiddleware } from "../lib/admin-auth";
import { matchesReceiptUploadToken } from "../lib/receipt-tokens";
import { createReceiptDownload, createReceiptUpload } from "../lib/object-storage";

const router: IRouter = Router();
const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;
const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

function isEntityType(value: unknown): value is "booking" | "enrollment" {
  return value === "booking" || value === "enrollment";
}

router.post("/storage/uploads/request-url", async (req, res): Promise<void> => {
  const { entityType, entityId, token, name, size, contentType } = req.body ?? {};
  const id = Number(entityId);
  if (
    !isEntityType(entityType) ||
    !Number.isInteger(id) ||
    id < 1 ||
    typeof token !== "string" ||
    typeof name !== "string" ||
    typeof size !== "number" ||
    !Number.isInteger(size) ||
    size < 1 ||
    size > MAX_RECEIPT_SIZE ||
    typeof contentType !== "string" ||
    !allowedMimeTypes.has(contentType)
  ) {
    res.status(400).json({ error: "Receipt must be a PDF or image up to 10 MB." });
    return;
  }

  const row = entityType === "booking"
    ? (await db.select({ tokenHash: bookingsTable.receiptUploadTokenHash }).from(bookingsTable).where(eq(bookingsTable.id, id)))[0]
    : (await db.select({ tokenHash: enrollmentsTable.receiptUploadTokenHash }).from(enrollmentsTable).where(eq(enrollmentsTable.id, id)))[0];
  if (!row || !matchesReceiptUploadToken(token, row.tokenHash)) {
    res.status(403).json({ error: "This receipt upload link is invalid or expired." });
    return;
  }

  try {
    const upload = await createReceiptUpload(contentType);
    res.json({ ...upload, name, size, contentType });
  } catch (error) {
    req.log.error({ err: error }, "Could not create receipt upload URL");
    res.status(500).json({ error: "Could not prepare receipt upload." });
  }
});

router.post("/storage/uploads/complete", async (req, res): Promise<void> => {
  const { entityType, entityId, token, objectPath, name, contentType } = req.body ?? {};
  const id = Number(entityId);
  if (
    !isEntityType(entityType) ||
    !Number.isInteger(id) ||
    id < 1 ||
    typeof token !== "string" ||
    typeof objectPath !== "string" ||
    !objectPath.startsWith("/objects/uploads/receipts/") ||
    typeof name !== "string" ||
    typeof contentType !== "string" ||
    !allowedMimeTypes.has(contentType)
  ) {
    res.status(400).json({ error: "Invalid receipt metadata." });
    return;
  }

  const row = entityType === "booking"
    ? (await db.select({ tokenHash: bookingsTable.receiptUploadTokenHash }).from(bookingsTable).where(eq(bookingsTable.id, id)))[0]
    : (await db.select({ tokenHash: enrollmentsTable.receiptUploadTokenHash }).from(enrollmentsTable).where(eq(enrollmentsTable.id, id)))[0];
  if (!row || !matchesReceiptUploadToken(token, row.tokenHash)) {
    res.status(403).json({ error: "This receipt upload link is invalid or expired." });
    return;
  }

  if (entityType === "booking") {
    await db.update(bookingsTable).set({
      receiptObjectPath: objectPath,
      receiptFileName: name.slice(0, 255),
      receiptMimeType: contentType,
      receiptUploadedAt: new Date(),
      paymentStatus: "receipt_submitted",
    }).where(eq(bookingsTable.id, id));
  } else {
    await db.update(enrollmentsTable).set({
      receiptObjectPath: objectPath,
      receiptFileName: name.slice(0, 255),
      receiptMimeType: contentType,
      receiptUploadedAt: new Date(),
      paymentStatus: "receipt_submitted",
    }).where(eq(enrollmentsTable.id, id));
  }

  res.json({ uploaded: true });
});

router.get("/storage/objects/*path", adminAuthMiddleware, async (req, res): Promise<void> => {
  const raw = req.params.path;
  const path = `/objects/${Array.isArray(raw) ? raw.join("/") : raw}`;
  if (!path.startsWith("/objects/uploads/receipts/")) {
    res.status(404).json({ error: "Receipt not found" });
    return;
  }
  try {
    res.redirect(302, await createReceiptDownload(path));
  } catch (error) {
    req.log.error({ err: error }, "Could not create receipt download URL");
    res.status(404).json({ error: "Receipt not found" });
  }
});

export default router;