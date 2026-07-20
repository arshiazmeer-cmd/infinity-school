import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  admissionNumber: text("admission_number").notNull().unique(),
  rollNumber: text("roll_number"),

  // Personal info
  name: text("name").notNull(),
  gender: text("gender").notNull(), // Male | Female | Other
  dateOfBirth: text("date_of_birth").notNull(),
  bloodGroup: text("blood_group"),
  aadhaarNumber: text("aadhaar_number"),
  religion: text("religion"),
  category: text("category"), // General | OBC | SC | ST
  address: text("address"),
  photoUrl: text("photo_url"),

  // Parent / Guardian info
  fatherName: text("father_name").notNull(),
  motherName: text("mother_name").notNull(),
  guardianName: text("guardian_name"),
  guardianOccupation: text("guardian_occupation"),
  parentMobile: text("parent_mobile").notNull(),
  alternateMobile: text("alternate_mobile"),
  parentEmail: text("parent_email"),
  emergencyContact: text("emergency_contact"),

  // Academic info
  className: text("class_name").notNull(), // Class 6, Class 10, etc.
  section: text("section").notNull().default("A"),
  house: text("house"),
  admissionDate: text("admission_date").notNull(),
  previousSchool: text("previous_school"),

  // Facilities
  transportRequired: boolean("transport_required").notNull().default(false),
  hostelRequired: boolean("hostel_required").notNull().default(false),

  // Status & fees
  feeStatus: text("fee_status").notNull().default("pending"), // paid | pending | partial
  studentStatus: text("student_status").notNull().default("active"), // active | inactive | transferred | alumni

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Student = typeof studentsTable.$inferSelect;
export type InsertStudent = typeof studentsTable.$inferInsert;
