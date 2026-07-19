import { Router } from "express";
import jwt from "jsonwebtoken";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = Router();

// POST /api/admin/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !secret) {
    res.status(500).json({ error: "Admin credentials not configured" });
    return;
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ role: "admin", email }, secret, { expiresIn: "8h" });

  res.json({ token, email });
});

// GET /api/admin/me
router.get("/me", adminAuth, (req, res) => {
  res.json({ email: req.admin!.email, role: "admin" });
});

export default router;
