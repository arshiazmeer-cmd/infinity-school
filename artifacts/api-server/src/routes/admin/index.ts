import { Router } from "express";
import authRouter from "./auth.js";
import teachersRouter from "./teachers.js";

const router = Router();

router.use(authRouter);
router.use("/teachers", teachersRouter);

export default router;
