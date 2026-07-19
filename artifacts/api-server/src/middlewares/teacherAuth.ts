import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface TeacherPayload {
  teacherId: number;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      teacher?: TeacherPayload;
    }
  }
}

export function teacherAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized — no token provided" });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env.TEACHER_JWT_SECRET;

  if (!secret) {
    res.status(500).json({ error: "Server misconfiguration: JWT secret missing" });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as TeacherPayload;
    req.teacher = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
