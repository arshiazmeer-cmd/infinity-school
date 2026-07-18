import { Router, type IRouter } from "express";
import healthRouter from "./health";
import admissionRouter from "./admission";

const router: IRouter = Router();

router.use(healthRouter);
router.use(admissionRouter);

export default router;
