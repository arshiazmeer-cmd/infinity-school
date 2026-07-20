import { Router } from "express";
import { db } from "@workspace/db";
import { leaveApplicationsTable, teachersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = Router();
router.use(adminAuth);

// GET /api/admin/leave-applications — all teachers' leave
router.get("/", async (_req, res) => {
  try {
    const applications = await db
      .select({
        id: leaveApplicationsTable.id,
        teacherId: leaveApplicationsTable.teacherId,
        teacherName: teachersTable.name,
        teacherEmail: teachersTable.email,
        leaveType: leaveApplicationsTable.leaveType,
        startDate: leaveApplicationsTable.startDate,
        endDate: leaveApplicationsTable.endDate,
        reason: leaveApplicationsTable.reason,
        medicalCertificateUrl: leaveApplicationsTable.medicalCertificateUrl,
        status: leaveApplicationsTable.status,
        adminRemarks: leaveApplicationsTable.adminRemarks,
        createdAt: leaveApplicationsTable.createdAt,
      })
      .from(leaveApplicationsTable)
      .leftJoin(teachersTable, eq(leaveApplicationsTable.teacherId, teachersTable.id))
      .orderBy(desc(leaveApplicationsTable.createdAt));
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/admin/leave-applications/:id — approve/reject/keep pending
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { status, adminRemarks } = req.body as {
    status?: string;
    adminRemarks?: string;
  };

  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    res.status(400).json({ error: "Invalid status. Must be pending, approved, or rejected" });
    return;
  }

  try {
    const [updated] = await db
      .update(leaveApplicationsTable)
      .set({ status, adminRemarks: adminRemarks ?? null, updatedAt: new Date() })
      .where(eq(leaveApplicationsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Application not found" }); return; }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
