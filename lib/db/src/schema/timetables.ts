import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// Timetable slots assigned to teachers by admin
export const timetablesTable = pgTable("timetables", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull(),
  dayOfWeek: text("day_of_week").notNull(), // Monday, Tuesday, ...
  periodNumber: integer("period_number").notNull(), // 1, 2, 3 ...
  subject: text("subject").notNull(),
  className: text("class_name").notNull(), // Class 6, Class 10, etc.
  section: text("section").notNull().default("A"),
  startTime: text("start_time").notNull(), // e.g. "08:00"
  endTime: text("end_time").notNull(),     // e.g. "08:45"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Timetable = typeof timetablesTable.$inferSelect;
export type InsertTimetable = typeof timetablesTable.$inferInsert;
