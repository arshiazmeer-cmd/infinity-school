import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { teachersTable } from "./teachers";

export const studyMaterialsTable = pgTable("study_materials", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => teachersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  className: text("class_name").notNull(),
  subject: text("subject").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type StudyMaterial = typeof studyMaterialsTable.$inferSelect;
export type InsertStudyMaterial = typeof studyMaterialsTable.$inferInsert;
