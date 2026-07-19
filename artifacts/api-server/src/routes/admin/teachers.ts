import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { teachersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = Router();
router.use(adminAuth);

// GET /api/admin/teachers — list all teachers
router.get("/", async (_req, res) => {
  try {
    const teachers = await db
      .select({
        id: teachersTable.id,
        name: teachersTable.name,
        email: teachersTable.email,
        designation: teachersTable.designation,
        mobile: teachersTable.mobile,
        photoUrl: teachersTable.photoUrl,
        isActive: teachersTable.isActive,
        createdAt: teachersTable.createdAt,
      })
      .from(teachersTable)
      .orderBy(teachersTable.createdAt);
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

// POST /api/admin/teachers — create teacher
router.post("/", async (req, res) => {
  const { name, email, password, designation, mobile } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    designation?: string;
    mobile?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }

  try {
    const hashed = await bcrypt.hash(password, 12);
    const [created] = await db
      .insert(teachersTable)
      .values({ name, email, password: hashed, designation, mobile })
      .returning({
        id: teachersTable.id,
        name: teachersTable.name,
        email: teachersTable.email,
        designation: teachersTable.designation,
        mobile: teachersTable.mobile,
        isActive: teachersTable.isActive,
        createdAt: teachersTable.createdAt,
      });
    res.status(201).json(created);
  } catch (err: any) {
    if (err?.code === "23505") {
      res.status(409).json({ error: "A teacher with this email already exists" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Failed to create teacher" });
    }
  }
});

// PUT /api/admin/teachers/:id — update teacher details
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, designation, mobile } = req.body as {
    name?: string;
    designation?: string;
    mobile?: string;
  };

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  try {
    const [updated] = await db
      .update(teachersTable)
      .set({ name, designation, mobile })
      .where(eq(teachersTable.id, id))
      .returning({
        id: teachersTable.id,
        name: teachersTable.name,
        email: teachersTable.email,
        designation: teachersTable.designation,
        mobile: teachersTable.mobile,
        isActive: teachersTable.isActive,
        createdAt: teachersTable.createdAt,
      });

    if (!updated) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update teacher" });
  }
});

// PUT /api/admin/teachers/:id/password — reset password
router.put("/:id/password", async (req, res) => {
  const id = parseInt(req.params.id);
  const { password } = req.body as { password?: string };

  if (!password || password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  try {
    const hashed = await bcrypt.hash(password, 12);
    const [updated] = await db
      .update(teachersTable)
      .set({ password: hashed })
      .where(eq(teachersTable.id, id))
      .returning({ id: teachersTable.id });

    if (!updated) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// PATCH /api/admin/teachers/:id/status — toggle active/inactive
router.patch("/:id/status", async (req, res) => {
  const id = parseInt(req.params.id);
  const { isActive } = req.body as { isActive?: boolean };

  if (typeof isActive !== "boolean") {
    res.status(400).json({ error: "isActive (boolean) is required" });
    return;
  }

  try {
    const [updated] = await db
      .update(teachersTable)
      .set({ isActive })
      .where(eq(teachersTable.id, id))
      .returning({ id: teachersTable.id, isActive: teachersTable.isActive });

    if (!updated) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// DELETE /api/admin/teachers/:id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.delete(teachersTable).where(eq(teachersTable.id, id));
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete teacher" });
  }
});

export default router;
