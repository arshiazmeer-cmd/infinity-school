import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db, studyMaterialsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { teacherAuth } from "../../middlewares/teacherAuth.js";

const router = Router();
router.use(teacherAuth);

// Ensure uploads directory exists
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed: PDF, DOCX, PPT, Images"));
    }
  },
});

// GET /api/teacher/study-materials
router.get("/", async (req, res) => {
  try {
    const materials = await db
      .select()
      .from(studyMaterialsTable)
      .where(eq(studyMaterialsTable.teacherId, req.teacher!.teacherId))
      .orderBy(desc(studyMaterialsTable.createdAt));
    res.json(materials);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/teacher/study-materials (multipart/form-data)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "File is required" });
      return;
    }

    const { title, className, subject } = req.body as {
      title?: string;
      className?: string;
      subject?: string;
    };

    if (!title || !className || !subject) {
      // Remove uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      res.status(400).json({ error: "Title, class, and subject are required" });
      return;
    }

    const fileUrl = `/api/uploads/${req.file.filename}`;

    const [material] = await db
      .insert(studyMaterialsTable)
      .values({
        teacherId: req.teacher!.teacherId,
        title: title.trim(),
        fileName: req.file.originalname,
        fileUrl,
        fileType: req.file.mimetype,
        className: className.trim(),
        subject: subject.trim(),
      })
      .returning();

    res.status(201).json(material);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/teacher/study-materials/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [deleted] = await db
      .delete(studyMaterialsTable)
      .where(
        and(
          eq(studyMaterialsTable.id, id),
          eq(studyMaterialsTable.teacherId, req.teacher!.teacherId)
        )
      )
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Study material not found" });
      return;
    }

    // Remove physical file
    const filename = deleted.fileUrl.split("/").pop();
    if (filename) {
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
