import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import path from "path";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import fs from "fs";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/api/uploads", express.static(path.resolve("uploads")));

app.use("/api", router);

// In production, serve the built frontend and handle SPA routing
if (process.env.NODE_ENV === "production") {
  const publicDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "public");
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
    // SPA fallback — serve index.html for any non-API route
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(publicDir, "index.html"));
    });
  }
}

export default app;
