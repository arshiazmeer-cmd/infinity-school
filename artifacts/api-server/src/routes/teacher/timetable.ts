import { Router } from "express";
import { db } from "@workspace/db";
import { timetablesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { teacherAuth } from "../../middlewares/teacherAuth.js";

const router = Router();
router.use(teacherAuth);

// GET /api/teacher/timetable
router.get("/", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(timetablesTable)
      .where(eq(timetablesTable.teacherId, req.teacher!.teacherId));
    res.json(items);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
