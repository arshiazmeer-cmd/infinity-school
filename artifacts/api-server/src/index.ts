// Load .env file before anything else reads process.env
import "dotenv/config";

import app from "./app";
import { logger } from "./lib/logger";
import { seedAdminUsers } from "./lib/seedAdminUsers";

const port = Number(process.env["PORT"] ?? "3000");

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env["PORT"]}"`);
}

// Seed default admin accounts if the table is empty (runs once on first boot)
seedAdminUsers();

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
