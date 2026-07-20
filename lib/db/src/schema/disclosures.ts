import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const disclosuresTable = pgTable("disclosures", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),  // e.g. 'cbse_affiliation', 'fee_structure', etc.
  title: text("title").notNull(),
  fileName: text("file_name"),
  fileUrl: text("file_url"),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
