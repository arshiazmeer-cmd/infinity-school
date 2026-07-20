import { Router } from "express";
import { db } from "@workspace/db";
import { noticesTable } from "@workspace/db";
import { desc, and, lte, or, isNull, gte } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

// GET /api/notices — public list, filtered by publishDate and expiryDate
router.get("/", async (_req, res) => {
  try {
    const now = new Date();
    const notices = await db
      .select()
      .from(noticesTable)
      .orderBy(desc(noticesTable.createdAt));

    // Filter: publishDate <= now (or null) and expiryDate >= now (or null)
    const visible = notices.filter((n) => {
      const pub = n.publishDate ? new Date(n.publishDate) : null;
      const exp = n.expiryDate ? new Date(n.expiryDate) : null;
      if (pub && pub > now) return false;
      if (exp && exp < now) return false;
      return true;
    });

    res.json(visible);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

export default router;
