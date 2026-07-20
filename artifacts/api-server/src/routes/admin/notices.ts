import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { noticesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = Router();
router.use(adminAuth);

const uploadDir = path.resolve("./uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `notice-${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only PDF and image files are allowed"));
  },
});

// GET /api/admin/notices
router.get("/", async (_req, res) => {
  try {
    const notices = await db
      .select()
      .from(noticesTable)
      .orderBy(noticesTable.createdAt);
    res.json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/notices
router.post("/", upload.single("file"), async (req, res) => {
  const { title, content, postedBy, publishDate, expiryDate } = req.body as {
    title?: string;
    content?: string;
    postedBy?: string;
    publishDate?: string;
    expiryDate?: string;
  };

  if (!title || !content) {
    res.status(400).json({ error: "Title and content are required" });
    return;
  }

  const fileUrl = req.file ? `/api/uploads/${req.file.filename}` : null;
  const fileType = req.file ? path.extname(req.file.originalname).replace(".", "").toLowerCase() : null;

  try {
    const [notice] = await db
      .insert(noticesTable)
      .values({
        title,
        content,
        postedBy: postedBy || "Administration",
        fileUrl,
        fileType,
        publishDate: publishDate ? new Date(publishDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      })
      .returning();
    res.status(201).json(notice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/admin/notices/:id
router.put("/:id", upload.single("file"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, postedBy, publishDate, expiryDate } = req.body as {
    title?: string;
    content?: string;
    postedBy?: string;
    publishDate?: string;
    expiryDate?: string;
  };

  if (!title || !content) {
    res.status(400).json({ error: "Title and content are required" });
    return;
  }

  const updateData: Record<string, unknown> = {
    title,
    content,
    postedBy: postedBy || "Administration",
    publishDate: publishDate ? new Date(publishDate) : null,
    expiryDate: expiryDate ? new Date(expiryDate) : null,
  };

  if (req.file) {
    updateData.fileUrl = `/api/uploads/${req.file.filename}`;
    updateData.fileType = path.extname(req.file.originalname).replace(".", "").toLowerCase();
  }

  try {
    const [notice] = await db
      .update(noticesTable)
      .set(updateData)
      .where(eq(noticesTable.id, id))
      .returning();
    if (!notice) { res.status(404).json({ error: "Notice not found" }); return; }
    res.json(notice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/notices/:id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [notice] = await db.select().from(noticesTable).where(eq(noticesTable.id, id));
    if (notice?.fileUrl) {
      const filePath = path.join(uploadDir, path.basename(notice.fileUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await db.delete(noticesTable).where(eq(noticesTable.id, id));
    res.json({ message: "Notice deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
