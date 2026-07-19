import { Router } from "express";
import { db, noticesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { teacherAuth } from "../../middlewares/teacherAuth.js";

const router = Router();
router.use(teacherAuth);

// GET /api/teacher/notices — read-only for teachers
router.get("/", async (req, res) => {
  try {
    const notices = await db
      .select()
      .from(noticesTable)
      .orderBy(desc(noticesTable.createdAt));
    res.json(notices);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
