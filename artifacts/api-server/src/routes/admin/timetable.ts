import { Router } from "express";
import { db } from "@workspace/db";
import { timetablesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = Router();
router.use(adminAuth);

// GET /api/admin/timetable?teacherId=X — get timetable for a teacher
router.get("/", async (req, res) => {
  const teacherId = req.query.teacherId ? parseInt(req.query.teacherId as string) : undefined;
  try {
    const query = teacherId
      ? db.select().from(timetablesTable).where(eq(timetablesTable.teacherId, teacherId))
      : db.select().from(timetablesTable);
    const items = await query;
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/timetable — create a slot
router.post("/", async (req, res) => {
  const { teacherId, dayOfWeek, periodNumber, subject, className, section, startTime, endTime } = req.body as {
    teacherId?: number;
    dayOfWeek?: string;
    periodNumber?: number;
    subject?: string;
    className?: string;
    section?: string;
    startTime?: string;
    endTime?: string;
  };

  if (!teacherId || !dayOfWeek || !periodNumber || !subject || !className || !startTime || !endTime) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const [slot] = await db
      .insert(timetablesTable)
      .values({ teacherId, dayOfWeek, periodNumber, subject, className, section: section || "A", startTime, endTime })
      .returning();
    res.status(201).json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/timetable/:id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.delete(timetablesTable).where(eq(timetablesTable.id, id));
    res.json({ message: "Slot deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
