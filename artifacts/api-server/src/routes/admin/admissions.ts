import { Router } from "express";
import { db } from "@workspace/db";
import { admissionsTable } from "@workspace/db";
import { eq, ilike, or, desc, sql } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = Router();
router.use(adminAuth);

// GET /api/admin/admissions — all inquiry submissions with search/filter
router.get("/", async (req, res) => {
  try {
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "";
    const page = Math.max(1, parseInt((req.query.page as string) || "1"));
    const limit = 20;
    const offset = (page - 1) * limit;

    const all = await db
      .select()
      .from(admissionsTable)
      .orderBy(desc(admissionsTable.createdAt));

    let filtered = all;
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.studentName.toLowerCase().includes(lower) ||
          a.fatherName.toLowerCase().includes(lower) ||
          a.parentMobile.includes(lower) ||
          a.parentEmail.toLowerCase().includes(lower)
      );
    }
    if (status) {
      filtered = filtered.filter((a) => a.inquiryStatus === status);
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    res.json({ admissions: paginated, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/admin/admissions/:id/status — update inquiry status
router.put("/:id/status", async (req, res) => {
  const id = parseInt(req.params.id);
  const { inquiryStatus } = req.body as { inquiryStatus?: string };

  const valid = ["new", "contacted", "confirmed", "closed"];
  if (!inquiryStatus || !valid.includes(inquiryStatus)) {
    res.status(400).json({ error: "Invalid status. Must be: new, contacted, confirmed, closed" });
    return;
  }

  try {
    const [updated] = await db
      .update(admissionsTable)
      .set({ inquiryStatus })
      .where(eq(admissionsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Admission not found" }); return; }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
