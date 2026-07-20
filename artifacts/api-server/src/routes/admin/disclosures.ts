import { Router } from "express";
import multer from "multer";
import path from "path";
import { db } from "@workspace/db";
import { disclosuresTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth.js";
import fs from "fs";

const router = Router();
router.use(adminAuth);

// Ensure uploads directory exists
const uploadDir = path.resolve("./uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `disclosure-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only PDF and image files are allowed"));
  },
});

// GET /api/admin/disclosures
router.get("/", async (_req, res) => {
  try {
    const docs = await db.select().from(disclosuresTable).orderBy(disclosuresTable.createdAt);
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch disclosures" });
  }
});

// POST /api/admin/disclosures — upload a document
router.post("/", upload.single("file"), async (req, res) => {
  const { category, title } = req.body as { category?: string; title?: string };

  if (!category || !title) {
    res.status(400).json({ error: "Category and title are required" });
    return;
  }

  const fileUrl = req.file
    ? `/api/uploads/${req.file.filename}`
    : null;
  const fileName = req.file?.originalname ?? null;

  try {
    const [doc] = await db
      .insert(disclosuresTable)
      .values({ category, title, fileUrl, fileName })
      .returning();
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save disclosure" });
  }
});

// DELETE /api/admin/disclosures/:id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [doc] = await db
      .select({ fileName: disclosuresTable.fileName, fileUrl: disclosuresTable.fileUrl })
      .from(disclosuresTable)
      .where(eq(disclosuresTable.id, id));

    if (doc?.fileUrl) {
      const filePath = path.join(uploadDir, path.basename(doc.fileUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.delete(disclosuresTable).where(eq(disclosuresTable.id, id));
    res.json({ message: "Disclosure deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete disclosure" });
  }
});

export default router;
