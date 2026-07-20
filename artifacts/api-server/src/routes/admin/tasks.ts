import { Router } from "express";
import { db } from "@workspace/db";
import { teacherTasksTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = Router();
router.use(adminAuth);

// GET /api/admin/tasks?teacherId=X
router.get("/", async (req, res) => {
  const teacherId = req.query.teacherId ? parseInt(req.query.teacherId as string) : undefined;
  try {
    const query = teacherId
      ? db.select().from(teacherTasksTable).where(eq(teacherTasksTable.teacherId, teacherId))
      : db.select().from(teacherTasksTable);
    const items = await query.orderBy(desc(teacherTasksTable.createdAt));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/tasks — assign task to teacher
router.post("/", async (req, res) => {
  const { teacherId, taskType, title, description, dueDate } = req.body as {
    teacherId?: number;
    taskType?: string;
    title?: string;
    description?: string;
    dueDate?: string;
  };

  if (!teacherId || !taskType || !title) {
    res.status(400).json({ error: "teacherId, taskType, title are required" });
    return;
  }

  try {
    const [task] = await db
      .insert(teacherTasksTable)
      .values({ teacherId, taskType, title, description, dueDate })
      .returning();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/tasks/:id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.delete(teacherTasksTable).where(eq(teacherTasksTable.id, id));
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
