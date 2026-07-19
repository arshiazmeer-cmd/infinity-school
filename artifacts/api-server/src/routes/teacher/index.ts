import { Router } from "express";
import authRouter from "./auth.js";
import lessonPlansRouter from "./lessonPlans.js";
import homeworkRouter from "./homework.js";
import studyMaterialsRouter from "./studyMaterials.js";
import noticesRouter from "./notices.js";
import profileRouter from "./profile.js";

const router = Router();

router.use("/", authRouter);
router.use("/lesson-plans", lessonPlansRouter);
router.use("/homework", homeworkRouter);
router.use("/study-materials", studyMaterialsRouter);
router.use("/notices", noticesRouter);
router.use("/profile", profileRouter);

export default router;
