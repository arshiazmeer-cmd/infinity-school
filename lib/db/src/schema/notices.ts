import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const noticesTable = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  postedBy: text("posted_by").notNull().default("Administration"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Notice = typeof noticesTable.$inferSelect;
export type InsertNotice = typeof noticesTable.$inferInsert;
