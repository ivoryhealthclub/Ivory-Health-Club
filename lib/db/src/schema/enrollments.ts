import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const enrollmentsTable = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id"),
  enrollmentType: text("enrollment_type").notNull().default("membership"), // membership, academy, program, other
  programKey: text("program_key"),
  programName: text("program_name"),
  enrollmentDate: text("enrollment_date"),
  participantName: text("participant_name"),
  companyName: text("company_name"),
  teamSize: integer("team_size"),
  age: integer("age"),
  experience: text("experience"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  dateOfBirth: text("date_of_birth"),
  status: text("status").notNull().default("pending"), // pending, active, expired, cancelled
  paymentStatus: text("payment_status").notNull().default("unpaid"), // unpaid, paid, failed
  paymentReference: text("payment_reference"),
  paymentMethod: text("payment_method").notNull().default("bank_transfer"),
  receiptObjectPath: text("receipt_object_path"),
  receiptFileName: text("receipt_file_name"),
  receiptMimeType: text("receipt_mime_type"),
  receiptUploadedAt: timestamp("receipt_uploaded_at", { withTimezone: true }),
  receiptUploadTokenHash: text("receipt_upload_token_hash"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEnrollmentSchema = createInsertSchema(enrollmentsTable).omit({ id: true, createdAt: true });
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollmentsTable.$inferSelect;
