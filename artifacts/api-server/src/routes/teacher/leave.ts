import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { leaveApplicationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { teacherAuth } from "../../middlewares/teacherAuth.js";

const router = Router();
router.use(teacherAuth);

const uploadDir = path.resolve("./uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `leave-cert-${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/teacher/leave — teacher's leave history
router.get("/", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(leaveApplicationsTable)
      .where(eq(leaveApplicationsTable.teacherId, req.teacher!.teacherId))
      .orderBy(desc(leaveApplicationsTable.createdAt));
    res.json(items);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/teacher/leave — apply for leave
router.post("/", upload.single("medicalCertificate"), async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body as {
    leaveType?: string;
    startDate?: string;
    endDate?: string;
    reason?: string;
  };

  if (!leaveType || !startDate || !endDate || !reason) {
    res.status(400).json({ error: "leaveType, startDate, endDate, reason are required" });
    return;
  }

  const medicalCertificateUrl = req.file ? `/api/uploads/${req.file.filename}` : null;

  try {
    const [application] = await db
      .insert(leaveApplicationsTable)
      .values({
        teacherId: req.teacher!.teacherId,
        leaveType,
        startDate,
        endDate,
        reason,
        medicalCertificateUrl,
      })
      .returning();
    res.status(201).json(application);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
