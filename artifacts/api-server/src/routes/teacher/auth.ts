import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, teachersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { teacherAuth } from "../../middlewares/teacherAuth.js";

const router = Router();

// POST /api/teacher/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const [teacher] = await db
      .select()
      .from(teachersTable)
      .where(eq(teachersTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (!teacher || !teacher.isActive) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, teacher.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const secret = process.env.TEACHER_JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: "Server misconfiguration" });
      return;
    }

    const token = jwt.sign(
      { teacherId: teacher.id, email: teacher.email, name: teacher.name },
      secret,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        designation: teacher.designation,
        photoUrl: teacher.photoUrl,
      },
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/teacher/me — verify token and return profile
router.get("/me", teacherAuth, async (req, res) => {
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

export default router;
