import { Router } from "express";
import { db } from "@workspace/db";
import { disclosuresTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router = Router();

// GET /api/disclosures — public list, ordered by category then date
router.get("/", async (_req, res) => {
  try {
    const docs = await db
      .select()
      .from(disclosuresTable)
      .orderBy(asc(disclosuresTable.category), asc(disclosuresTable.createdAt));
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch disclosures" });
  }
});

export default router;
