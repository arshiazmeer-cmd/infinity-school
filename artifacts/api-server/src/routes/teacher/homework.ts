import { Router } from "express";
import { db, homeworkTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { teacherAuth } from "../../middlewares/teacherAuth.js";

const router = Router();
router.use(teacherAuth);

// GET /api/teacher/homework
router.get("/", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(homeworkTable)
      .where(eq(homeworkTable.teacherId, req.teacher!.teacherId))
      .orderBy(desc(homeworkTable.createdAt));
    res.json(items);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/teacher/homework
router.post("/", async (req, res) => {
  try {
    const { subject, className, title, description, dueDate } = req.body as {
      subject?: string;
      className?: string;
      title?: string;
      description?: string;
      dueDate?: string;
    };

    if (!subject || !className || !title || !description || !dueDate) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const [hw] = await db
      .insert(homeworkTable)
      .values({
        teacherId: req.teacher!.teacherId,
        subject: subject.trim(),
        className: className.trim(),
        title: title.trim(),
        description: description.trim(),
        dueDate,
      })
      .returning();

    res.status(201).json(hw);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/teacher/homework/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { subject, className, title, description, dueDate } = req.body as {
      subject?: string;
      className?: string;
      title?: string;
      description?: string;
      dueDate?: string;
    };

    if (!subject || !className || !title || !description || !dueDate) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const [updated] = await db
      .update(homeworkTable)
      .set({
        subject: subject.trim(),
        className: className.trim(),
        title: title.trim(),
        description: description.trim(),
        dueDate,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(homeworkTable.id, id),
          eq(homeworkTable.teacherId, req.teacher!.teacherId)
        )
      )
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Homework not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/teacher/homework/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [deleted] = await db
      .delete(homeworkTable)
      .where(
        and(
          eq(homeworkTable.id, id),
          eq(homeworkTable.teacherId, req.teacher!.teacherId)
        )
      )
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Homework not found" });
      return;
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
