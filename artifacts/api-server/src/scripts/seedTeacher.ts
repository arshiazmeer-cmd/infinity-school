/**
 * Run once to create the first teacher account.
 * Usage: npx tsx src/scripts/seedTeacher.ts
 *
 * Edit the values below before running.
 */
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { teachersTable } from "@workspace/db";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ── Edit these values ──────────────────────────────────────────────────
const TEACHER_NAME        = "Admin Teacher";
const TEACHER_EMAIL       = "teacher@ipskursi.com";
const TEACHER_PASSWORD    = "Teacher@123";       // change after first login
const TEACHER_DESIGNATION = "Senior Teacher";
const TEACHER_MOBILE      = "9151115234";
// ──────────────────────────────────────────────────────────────────────

async function main() {
  const hashed = await bcrypt.hash(TEACHER_PASSWORD, 12);

  const [created] = await db.insert(teachersTable).values({
    name: TEACHER_NAME,
    email: TEACHER_EMAIL,
    password: hashed,
    designation: TEACHER_DESIGNATION,
    mobile: TEACHER_MOBILE,
  }).returning({ id: teachersTable.id, email: teachersTable.email });

  console.log("✅ Teacher account created:", created);
  console.log(`   Email   : ${TEACHER_EMAIL}`);
  console.log(`   Password: ${TEACHER_PASSWORD}`);
  console.log("   ⚠️  Please change the password after first login.");

  await pool.end();
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
