import { Router } from "express";
import authRouter from "./auth.js";
import lessonPlansRouter from "./lessonPlans.js";
import homeworkRouter from "./homework.js";
import studyMaterialsRouter from "./studyMaterials.js";
import noticesRouter from "./notices.js";
import profileRouter from "./profile.js";
import timetableRouter from "./timetable.js";
import tasksRouter from "./tasks.js";
import leaveRouter from "./leave.js";

const router = Router();

router.use("/", authRouter);
router.use("/lesson-plans", lessonPlansRouter);
router.use("/homework", homeworkRouter);
router.use("/study-materials", studyMaterialsRouter);
router.use("/notices", noticesRouter);
router.use("/profile", profileRouter);
router.use("/timetable", timetableRouter);
router.use("/tasks", tasksRouter);
router.use("/leave", leaveRouter);

export default router;
