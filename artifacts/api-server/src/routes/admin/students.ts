import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { studentsTable } from "@workspace/db";
import { eq, ilike, or, sql } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = Router();
router.use(adminAuth);

const uploadDir = path.resolve("./uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `student-${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only image files are allowed for photo"));
  },
});

// GET /api/admin/students — with search, filter, pagination
router.get("/", async (req, res) => {
  try {
    const search = (req.query.search as string) || "";
    const className = (req.query.class as string) || "";
    const status = (req.query.status as string) || "";
    const page = Math.max(1, parseInt((req.query.page as string) || "1"));
    const limit = 20;
    const offset = (page - 1) * limit;

    let baseQuery = db.select().from(studentsTable);

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(studentsTable.name, `%${search}%`),
          ilike(studentsTable.admissionNumber, `%${search}%`),
          ilike(studentsTable.fatherName, `%${search}%`),
          ilike(studentsTable.parentMobile, `%${search}%`)
        )
      );
    }
    if (className) conditions.push(eq(studentsTable.className, className));
    if (status) conditions.push(eq(studentsTable.studentStatus, status));

    // Total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(studentsTable);
    const total = Number(countResult[0]?.count ?? 0);

    // Paginated data
    let query = db.select().from(studentsTable).limit(limit).offset(offset);
    const students = await query.orderBy(studentsTable.createdAt);

    res.json({ students, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/students/stats — summary stats for dashboard
router.get("/stats", async (_req, res) => {
  try {
    const all = await db.select({
      gender: studentsTable.gender,
      className: studentsTable.className,
      section: studentsTable.section,
      studentStatus: studentsTable.studentStatus,
      createdAt: studentsTable.createdAt,
    }).from(studentsTable);

    const total = all.length;
    const boys = all.filter(s => s.gender?.toLowerCase() === "male").length;
    const girls = all.filter(s => s.gender?.toLowerCase() === "female").length;
    const active = all.filter(s => s.studentStatus === "active").length;
    const alumni = all.filter(s => s.studentStatus === "alumni").length;

    // Class-wise breakdown
    const classCounts: Record<string, number> = {};
    for (const s of all) {
      classCounts[s.className] = (classCounts[s.className] || 0) + 1;
    }

    // Recent admissions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCount = all.filter(s => new Date(s.createdAt) >= thirtyDaysAgo).length;

    res.json({ total, boys, girls, active, alumni, classCounts, recentCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/students/:id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, id));
    if (!student) { res.status(404).json({ error: "Student not found" }); return; }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/students
router.post("/", upload.single("photo"), async (req, res) => {
  const data = req.body as Record<string, string>;
  if (!data.admissionNumber || !data.name || !data.gender || !data.dateOfBirth
    || !data.fatherName || !data.motherName || !data.parentMobile
    || !data.className || !data.admissionDate) {
    res.status(400).json({ error: "Required fields missing" });
    return;
  }
  const photoUrl = req.file ? `/api/uploads/${req.file.filename}` : null;
  try {
    const [student] = await db.insert(studentsTable).values({
      ...data,
      photoUrl,
      transportRequired: data.transportRequired === "true",
      hostelRequired: data.hostelRequired === "true",
    } as any).returning();
    res.status(201).json(student);
  } catch (err: any) {
    console.error(err);
    if (err?.code === "23505") {
      res.status(409).json({ error: "Admission number already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// PUT /api/admin/students/:id
router.put("/:id", upload.single("photo"), async (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body as Record<string, string>;
  const updates: Record<string, unknown> = { ...data, updatedAt: new Date() };
  if (req.file) updates.photoUrl = `/api/uploads/${req.file.filename}`;
  if (data.transportRequired !== undefined) updates.transportRequired = data.transportRequired === "true";
  if (data.hostelRequired !== undefined) updates.hostelRequired = data.hostelRequired === "true";
  try {
    const [student] = await db
      .update(studentsTable)
      .set(updates as any)
      .where(eq(studentsTable.id, id))
      .returning();
    if (!student) { res.status(404).json({ error: "Student not found" }); return; }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/students/:id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [student] = await db.select({ photoUrl: studentsTable.photoUrl })
      .from(studentsTable).where(eq(studentsTable.id, id));
    if (student?.photoUrl) {
      const filePath = path.join(uploadDir, path.basename(student.photoUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await db.delete(studentsTable).where(eq(studentsTable.id, id));
    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
