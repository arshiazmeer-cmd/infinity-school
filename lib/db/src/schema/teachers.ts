import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const teachersTable = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // bcrypt hash
  mobile: text("mobile"),
  designation: text("designation"),
  photoUrl: text("photo_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Teacher = typeof teachersTable.$inferSelect;
export type InsertTeacher = typeof teachersTable.$inferInsert;
