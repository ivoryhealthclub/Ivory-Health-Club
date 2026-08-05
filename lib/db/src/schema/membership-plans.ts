import { pgTable, text, serial, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const membershipPlansTable = pgTable("membership_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tier: text("tier").notNull(), // silver_single, silver_family, gold_single, gold_family, gold_plus, diamond, seventy_plus
  description: text("description").notNull(),
  price: real("price").notNull(),
  pricePeriod: text("price_period").notNull().default("monthly"), // monthly, annual
  perks: text("perks").array().notNull().default([]),
  discounts: text("discounts"),
  maxMembers: integer("max_members"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMembershipPlanSchema = createInsertSchema(membershipPlansTable).omit({ id: true, createdAt: true });
export type InsertMembershipPlan = z.infer<typeof insertMembershipPlanSchema>;
export type MembershipPlan = typeof membershipPlansTable.$inferSelect;
