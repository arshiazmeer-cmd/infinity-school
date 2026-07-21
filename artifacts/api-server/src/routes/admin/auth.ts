import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = Router();

// POST /api/admin/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Server misconfiguration: session secret missing" });
    return;
  }

  try {
    // Look up the admin user by email
    const [user] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (!user || !user.isActive) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { role: "admin", email: user.email, name: user.name, adminRole: user.role },
      secret,
      { expiresIn: "8h" }
    );

    res.json({ token, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// GET /api/admin/me
router.get("/me", adminAuth, (req, res) => {
  res.json({ email: req.admin!.email, name: req.admin!.name, role: "admin", adminRole: req.admin!.adminRole });
});

export default router;
