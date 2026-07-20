import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const admissionsTable = pgTable("admissions", {
  id: serial("id").primaryKey(),
  admissionId: text("admission_id").notNull().unique(),

  // Student details
  studentName: text("student_name").notNull(),
  gender: text("gender").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  aadhaarNumber: text("aadhaar_number"),
  bloodGroup: text("blood_group"),
  applyingForClass: text("applying_for_class").notNull(),
  previousSchoolName: text("previous_school_name").notNull(),
  previousClass: text("previous_class").notNull(),
  studentPhotoUrl: text("student_photo_url"),

  // Parent details
  fatherName: text("father_name").notNull(),
  motherName: text("mother_name").notNull(),
  parentMobile: text("parent_mobile").notNull(),
  alternateMobile: text("alternate_mobile"),
  parentEmail: text("parent_email").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pinCode: text("pin_code").notNull(),

  // Other details
  transportRequired: boolean("transport_required").notNull().default(false),
  hostelRequired: boolean("hostel_required").notNull().default(false),
  medicalCondition: text("medical_condition"),

  // Inquiry tracking
  inquiryStatus: text("inquiry_status").notNull().default("new"), // new | contacted | confirmed | closed

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAdmissionSchema = createInsertSchema(admissionsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertAdmission = z.infer<typeof insertAdmissionSchema>;
export type Admission = typeof admissionsTable.$inferSelect;
