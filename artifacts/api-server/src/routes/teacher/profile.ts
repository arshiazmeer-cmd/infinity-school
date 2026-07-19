import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, teachersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { teacherAuth } from "../../middlewares/teacherAuth.js";

const router = Router();
router.use(teacherAuth);

// GET /api/teacher/profile
router.get("/", async (req, res) => {
  try {
    const [teacher] = await db
      .select({
        id: teachersTable.id,
        name: teachersTable.name,
        email: teachersTable.email,
        mobile: teachersTable.mobile,
        designation: teachersTable.designation,
        photoUrl: teachersTable.photoUrl,
        createdAt: teachersTable.createdAt,
      })
      .from(teachersTable)
      .where(eq(teachersTable.id, req.teacher!.teacherId))
      .limit(1);

    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    res.json(teacher);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/teacher/profile
router.put("/", async (req, res) => {
  try {
    const { name, mobile, designation } = req.body as {
      name?: string;
      mobile?: string;
      designation?: string;
    };

    if (!name?.trim()) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const [updated] = await db
      .update(teachersTable)
      .set({
        name: name.trim(),
        mobile: mobile?.trim() || null,
        designation: designation?.trim() || null,
      })
      .where(eq(teachersTable.id, req.teacher!.teacherId))
      .returning({
        id: teachersTable.id,
        name: teachersTable.name,
        email: teachersTable.email,
        mobile: teachersTable.mobile,
        designation: teachersTable.designation,
        photoUrl: teachersTable.photoUrl,
      });

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/teacher/profile/password
router.put("/password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Current and new passwords are required" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" });
      return;
    }

    const [teacher] = await db
      .select()
      .from(teachersTable)
      .where(eq(teachersTable.id, req.teacher!.teacherId))
      .limit(1);

    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(currentPassword, teacher.password);
    if (!passwordMatch) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    await db
      .update(teachersTable)
      .set({ password: hashed })
      .where(eq(teachersTable.id, req.teacher!.teacherId));

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
