import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  serviceType: text("service_type").notNull(), // restaurant, spa, fitness_program, gym
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  bookingDate: text("booking_date").notNull(),
  bookingTime: text("booking_time"),
  numberOfGuests: integer("number_of_guests"),
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  notes: text("notes"),
  paymentMethod: text("payment_method").notNull().default("bank_transfer"),
  paymentStatus: text("payment_status").notNull().default("unpaid"), // unpaid, receipt_submitted, paid, rejected
  paymentReference: text("payment_reference"),
  receiptObjectPath: text("receipt_object_path"),
  receiptFileName: text("receipt_file_name"),
  receiptMimeType: text("receipt_mime_type"),
  receiptUploadedAt: timestamp("receipt_uploaded_at", { withTimezone: true }),
  receiptUploadTokenHash: text("receipt_upload_token_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
