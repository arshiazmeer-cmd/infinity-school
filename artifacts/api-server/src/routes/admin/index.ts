import { Router } from "express";
import authRouter from "./auth.js";
import teachersRouter from "./teachers.js";
import disclosuresRouter from "./disclosures.js";
import noticesRouter from "./notices.js";
import leaveRouter from "./leave.js";
import studentsRouter from "./students.js";
import admissionsRouter from "./admissions.js";
import timetableRouter from "./timetable.js";
import tasksRouter from "./tasks.js";

const router = Router();

router.use(authRouter);
router.use("/teachers", teachersRouter);
router.use("/disclosures", disclosuresRouter);
router.use("/notices", noticesRouter);
router.use("/leave-applications", leaveRouter);
router.use("/students", studentsRouter);
router.use("/admissions", admissionsRouter);
router.use("/timetable", timetableRouter);
router.use("/tasks", tasksRouter);

export default router;
