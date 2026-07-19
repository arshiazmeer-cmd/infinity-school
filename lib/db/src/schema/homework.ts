import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { teachersTable } from "./teachers";

export const homeworkTable = pgTable("homework", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => teachersTable.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  className: text("class_name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: text("due_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Homework = typeof homeworkTable.$inferSelect;
export type InsertHomework = typeof homeworkTable.$inferInsert;
