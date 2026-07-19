import { Router, type IRouter } from "express";
import healthRouter from "./health";
import admissionRouter from "./admission";
import teacherRouter from "./teacher/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(admissionRouter);
router.use("/teacher", teacherRouter);

export default router;
