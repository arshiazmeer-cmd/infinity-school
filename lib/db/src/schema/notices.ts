import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const noticesTable = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  postedBy: text("posted_by").notNull().default("Administration"),
  // Extended fields for admin notice management
  fileUrl: text("file_url"),
  fileType: text("file_type"), // 'pdf' | 'image'
  publishDate: timestamp("publish_date"),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Notice = typeof noticesTable.$inferSelect;
export type InsertNotice = typeof noticesTable.$inferInsert;
