import { Router } from "express";
import { db } from "@workspace/db";
import { teacherTasksTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { teacherAuth } from "../../middlewares/teacherAuth.js";

const router = Router();
router.use(teacherAuth);

// GET /api/teacher/tasks
router.get("/", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(teacherTasksTable)
      .where(eq(teacherTasksTable.teacherId, req.teacher!.teacherId))
      .orderBy(desc(teacherTasksTable.createdAt));
    res.json(items);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/teacher/tasks/:id — mark complete/pending
router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body as { status?: string };
  if (!status || !["pending", "completed"].includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  try {
    const [task] = await db
      .update(teacherTasksTable)
      .set({ status })
      .where(
        and(
          eq(teacherTasksTable.id, id),
          eq(teacherTasksTable.teacherId, req.teacher!.teacherId)
        )
      )
      .returning();
    if (!task) { res.status(404).json({ error: "Task not found" }); return; }
    res.json(task);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
