import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

const DEFAULT_ACCOUNTS = [
  { name: "Admin",               role: "Admin",               email: "admin@ipskursi.in",       password: "Admin@2026" },
  { name: "School Administrator",role: "School Administrator", email: "schooladmin@ipskursi.in", password: "SchoolAdmin@2026" },
  { name: "Principal",           role: "Principal",            email: "principal@ipskursi.in",   password: "Principal@2026" },
  { name: "Managing Director",   role: "Managing Director",    email: "md@ipskursi.in",          password: "MD@2026" },
];

export async function seedAdminUsers(): Promise<void> {
  try {
    // Count existing admin users
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(adminUsersTable);

    if (count > 0) return; // already seeded — skip

    for (const account of DEFAULT_ACCOUNTS) {
      const passwordHash = await bcrypt.hash(account.password, 12);
      await db
        .insert(adminUsersTable)
        .values({ name: account.name, role: account.role, email: account.email, passwordHash, isActive: true })
        .onConflictDoNothing({ target: adminUsersTable.email });
    }

    console.log("[seed] Admin users created: admin, schooladmin, principal, md @ipskursi.in");
  } catch (err) {
    // Non-fatal — server can still start without seed
    console.error("[seed] Admin user seeding failed:", err);
  }
}
