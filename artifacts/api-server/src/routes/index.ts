import { Router, type IRouter } from "express";
import healthRouter from "./health";
import admissionRouter from "./admission";
import teacherRouter from "./teacher/index.js";
import adminRouter from "./admin/index.js";
import disclosuresRouter from "./disclosures.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(admissionRouter);
router.use("/teacher", teacherRouter);
router.use("/admin", adminRouter);
router.use("/disclosures", disclosuresRouter);

export default router;
