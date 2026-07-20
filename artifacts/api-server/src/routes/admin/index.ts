import { Router } from "express";
import authRouter from "./auth.js";
import teachersRouter from "./teachers.js";
import disclosuresRouter from "./disclosures.js";

const router = Router();

router.use(authRouter);
router.use("/teachers", teachersRouter);
router.use("/disclosures", disclosuresRouter);

export default router;
