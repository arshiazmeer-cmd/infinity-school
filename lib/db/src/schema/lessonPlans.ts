import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { teachersTable } from "./teachers";

export const lessonPlansTable = pgTable("lesson_plans", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => teachersTable.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  className: text("class_name").notNull(),
  topic: text("topic").notNull(),
  date: text("date").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type LessonPlan = typeof lessonPlansTable.$inferSelect;
export type InsertLessonPlan = typeof lessonPlansTable.$inferInsert;
