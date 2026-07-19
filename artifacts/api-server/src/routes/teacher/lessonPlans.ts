import { Router } from "express";
import { db, lessonPlansTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { teacherAuth } from "../../middlewares/teacherAuth.js";

const router = Router();
router.use(teacherAuth);

// GET /api/teacher/lesson-plans
router.get("/", async (req, res) => {
  try {
    const plans = await db
      .select()
      .from(lessonPlansTable)
      .where(eq(lessonPlansTable.teacherId, req.teacher!.teacherId))
      .orderBy(desc(lessonPlansTable.createdAt));
    res.json(plans);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/teacher/lesson-plans
router.post("/", async (req, res) => {
  try {
    const { subject, className, topic, date, content } = req.body as {
      subject?: string;
      className?: string;
      topic?: string;
      date?: string;
      content?: string;
    };

    if (!subject || !className || !topic || !date || !content) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const [plan] = await db
      .insert(lessonPlansTable)
      .values({
        teacherId: req.teacher!.teacherId,
        subject: subject.trim(),
        className: className.trim(),
        topic: topic.trim(),
        date,
        content: content.trim(),
      })
      .returning();

    res.status(201).json(plan);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/teacher/lesson-plans/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { subject, className, topic, date, content } = req.body as {
      subject?: string;
      className?: string;
      topic?: string;
      date?: string;
      content?: string;
    };

    if (!subject || !className || !topic || !date || !content) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const [updated] = await db
      .update(lessonPlansTable)
      .set({
        subject: subject.trim(),
        className: className.trim(),
        topic: topic.trim(),
        date,
        content: content.trim(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(lessonPlansTable.id, id),
          eq(lessonPlansTable.teacherId, req.teacher!.teacherId)
        )
      )
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Lesson plan not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/teacher/lesson-plans/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [deleted] = await db
      .delete(lessonPlansTable)
      .where(
        and(
          eq(lessonPlansTable.id, id),
          eq(lessonPlansTable.teacherId, req.teacher!.teacherId)
        )
      )
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Lesson plan not found" });
      return;
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
