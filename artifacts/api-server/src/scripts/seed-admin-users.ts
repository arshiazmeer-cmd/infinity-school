/**
 * Seed default admin accounts.
 * Run once: pnpm --filter @workspace/api-server tsx src/scripts/seed-admin-users.ts
 * Safe to re-run — uses INSERT … ON CONFLICT DO NOTHING.
 */
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

const ACCOUNTS = [
  {
    name: "Admin",
    role: "Admin",
    email: "admin@ipskursi.in",
    password: "Admin@2026",
  },
  {
    name: "School Administrator",
    role: "School Administrator",
    email: "schooladmin@ipskursi.in",
    password: "SchoolAdmin@2026",
  },
  {
    name: "Principal",
    role: "Principal",
    email: "principal@ipskursi.in",
    password: "Principal@2026",
  },
  {
    name: "Managing Director",
    role: "Managing Director",
    email: "md@ipskursi.in",
    password: "MD@2026",
  },
];

async function main() {
  console.log("Seeding admin users…");

  for (const account of ACCOUNTS) {
    const passwordHash = await bcrypt.hash(account.password, 12);
    await db
      .insert(adminUsersTable)
      .values({ name: account.name, role: account.role, email: account.email, passwordHash, isActive: true })
      .onConflictDoNothing({ target: adminUsersTable.email });
    console.log(`  ✓ ${account.role}: ${account.email} / ${account.password}`);
  }

  console.log("\nDone. All accounts ready.");
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
