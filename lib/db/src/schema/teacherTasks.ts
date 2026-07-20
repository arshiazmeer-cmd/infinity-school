import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// Tasks visible to teachers — admin-assigned + system-derived
export const teacherTasksTable = pgTable("teacher_tasks", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull(),
  taskType: text("task_type").notNull(), // admin_assigned | exam_duty | attendance
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending | completed
  dueDate: text("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type TeacherTask = typeof teacherTasksTable.$inferSelect;
export type InsertTeacherTask = typeof teacherTasksTable.$inferInsert;
