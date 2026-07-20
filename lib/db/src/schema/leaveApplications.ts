import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const leaveApplicationsTable = pgTable("leave_applications", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull(),
  leaveType: text("leave_type").notNull(), // casual | medical | earned | unpaid | other
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  reason: text("reason").notNull(),
  medicalCertificateUrl: text("medical_certificate_url"),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  adminRemarks: text("admin_remarks"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type LeaveApplication = typeof leaveApplicationsTable.$inferSelect;
export type InsertLeaveApplication = typeof leaveApplicationsTable.$inferInsert;
