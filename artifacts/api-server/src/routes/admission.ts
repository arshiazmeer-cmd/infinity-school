import { Router } from "express";
import { db, admissionsTable } from "@workspace/db";
import nodemailer from "nodemailer";

const router = Router();

async function sendWhatsAppNotification(data: {
  admissionId: string;
  studentName: string;
  applyingForClass: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  parentMobile: string;
  parentEmail: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  transportRequired: boolean;
  hostelRequired: boolean;
  previousSchoolName: string;
  medicalCondition?: string;
}): Promise<void> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) return; // not configured yet

  const submittedOn = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const message =
    `🎓 *NEW ADMISSION ENQUIRY*\n\n` +
    `🆔 *ID:* ${data.admissionId}\n` +
    `👦 *Student:* ${data.studentName}\n` +
    `🏫 *Class:* ${data.applyingForClass}\n` +
    `🎂 *DOB:* ${data.dateOfBirth}\n` +
    `👨 *Father:* ${data.fatherName}\n` +
    `👩 *Mother:* ${data.motherName}\n` +
    `📱 *Mobile:* ${data.parentMobile}\n` +
    `📧 *Email:* ${data.parentEmail}\n` +
    `🏠 *Address:* ${data.address}, ${data.city}, ${data.state} - ${data.pinCode}\n` +
    `🚌 *Transport:* ${data.transportRequired ? "Yes" : "No"}\n` +
    `🏨 *Hostel:* ${data.hostelRequired ? "Yes" : "No"}\n` +
    `🏫 *Prev School:* ${data.previousSchoolName}\n` +
    `📝 *Medical:* ${data.medicalCondition || "None"}\n` +
    `📅 *Submitted:* ${submittedOn}`;

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: "919151115234",
      type: "text",
      text: { body: message },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Meta WhatsApp API error ${res.status}: ${errBody}`);
  }
}

function generateAdmissionId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `IPS-${year}-${random}`;
}

async function sendEmailNotification(data: {
  admissionId: string;
  studentName: string;
  applyingForClass: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  parentMobile: string;
  parentEmail: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  transportRequired: boolean;
  hostelRequired: boolean;
  previousSchoolName: string;
  medicalCondition?: string;
}): Promise<void> {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPass) {
    // Email not configured — skip silently
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: emailUser, pass: emailPass },
  });

  const submittedOn = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const siteUrl = "https://ipskursi.com";

  const whatsappMsg = encodeURIComponent(
    `🎓 NEW ADMISSION ENQUIRY\n\n` +
    `🆔 Admission ID: ${data.admissionId}\n` +
    `👦 Student Name: ${data.studentName}\n` +
    `🏫 Applying Class: ${data.applyingForClass}\n` +
    `🎂 DOB: ${data.dateOfBirth}\n` +
    `👨 Father: ${data.fatherName}\n` +
    `👩 Mother: ${data.motherName}\n` +
    `📱 Mobile: ${data.parentMobile}\n` +
    `📧 Email: ${data.parentEmail}\n` +
    `🏠 Address: ${data.address}, ${data.city}, ${data.state} - ${data.pinCode}\n` +
    `🚌 Transport: ${data.transportRequired ? "Yes" : "No"}\n` +
    `🏠 Hostel: ${data.hostelRequired ? "Yes" : "No"}\n` +
    `🏫 Previous School: ${data.previousSchoolName}\n` +
    `📝 Medical Condition: ${data.medicalCondition || "None"}\n` +
    `📅 Submitted On: ${submittedOn}\n` +
    `🌐 Website: ${siteUrl}`
  );

  const waLink = `https://wa.me/919118502112?text=${whatsappMsg}`;

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
      <div style="background:#1a3a6b;padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">🎓 New Admission Enquiry</h1>
        <p style="color:#f0c050;margin:8px 0 0;font-size:14px;">Infinity Public School — Kursi, Barabanki</p>
      </div>
      <div style="padding:24px;">
        <div style="background:#f0f7ff;border-left:4px solid #1a3a6b;padding:12px 16px;border-radius:4px;margin-bottom:20px;">
          <strong>Admission ID: ${data.admissionId}</strong><br/>
          <small style="color:#666;">Submitted on ${submittedOn}</small>
        </div>

        <h3 style="color:#1a3a6b;border-bottom:2px solid #f0c050;padding-bottom:6px;">👦 Student Details</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr><td style="padding:6px 0;color:#555;width:40%;">Name</td><td style="padding:6px 0;font-weight:bold;">${data.studentName}</td></tr>
          <tr><td style="padding:6px 0;color:#555;">Applying For Class</td><td style="padding:6px 0;font-weight:bold;">${data.applyingForClass}</td></tr>
          <tr><td style="padding:6px 0;color:#555;">Date of Birth</td><td style="padding:6px 0;">${data.dateOfBirth}</td></tr>
          <tr><td style="padding:6px 0;color:#555;">Previous School</td><td style="padding:6px 0;">${data.previousSchoolName}</td></tr>
        </table>

        <h3 style="color:#1a3a6b;border-bottom:2px solid #f0c050;padding-bottom:6px;">👨‍👩‍👦 Parent Details</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr><td style="padding:6px 0;color:#555;width:40%;">Father's Name</td><td style="padding:6px 0;font-weight:bold;">${data.fatherName}</td></tr>
          <tr><td style="padding:6px 0;color:#555;">Mother's Name</td><td style="padding:6px 0;font-weight:bold;">${data.motherName}</td></tr>
          <tr><td style="padding:6px 0;color:#555;">Mobile</td><td style="padding:6px 0;">${data.parentMobile}</td></tr>
          <tr><td style="padding:6px 0;color:#555;">Email</td><td style="padding:6px 0;">${data.parentEmail}</td></tr>
          <tr><td style="padding:6px 0;color:#555;">Address</td><td style="padding:6px 0;">${data.address}, ${data.city}, ${data.state} — ${data.pinCode}</td></tr>
        </table>

        <h3 style="color:#1a3a6b;border-bottom:2px solid #f0c050;padding-bottom:6px;">📋 Other Details</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:6px 0;color:#555;width:40%;">Transport Required</td><td style="padding:6px 0;">${data.transportRequired ? "✅ Yes" : "❌ No"}</td></tr>
          <tr><td style="padding:6px 0;color:#555;">Hostel Required</td><td style="padding:6px 0;">${data.hostelRequired ? "✅ Yes" : "❌ No"}</td></tr>
          <tr><td style="padding:6px 0;color:#555;">Medical Condition</td><td style="padding:6px 0;">${data.medicalCondition || "None"}</td></tr>
        </table>

        <div style="text-align:center;margin-top:24px;">
          <a href="${waLink}" style="display:inline-block;background:#25d366;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">
            📲 Send WhatsApp Message
          </a>
          <p style="color:#888;font-size:12px;margin-top:8px;">Click to open WhatsApp with pre-filled admission details</p>
        </div>
      </div>
      <div style="background:#f5f5f5;padding:12px;text-align:center;font-size:12px;color:#999;">
        Infinity Public School · Kursi, Barabanki, UP · +91 9118502112
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"IPS Admissions" <${emailUser}>`,
    to: "ipskursi@gmail.com",
    subject: `🎓 New Admission Enquiry — ${data.studentName} (Class ${data.applyingForClass}) | ${data.admissionId}`,
    html: htmlBody,
  });
}

router.post("/admissions", async (req, res) => {
  try {
    const body = req.body as {
      studentName: string;
      gender: string;
      dateOfBirth: string;
      aadhaarNumber?: string;
      bloodGroup?: string;
      applyingForClass: string;
      previousSchoolName: string;
      previousClass: string;
      fatherName: string;
      motherName: string;
      parentMobile: string;
      alternateMobile?: string;
      parentEmail: string;
      address: string;
      city: string;
      state: string;
      pinCode: string;
      transportRequired: boolean;
      hostelRequired: boolean;
      medicalCondition?: string;
    };

    // Basic required-field validation
    const required = [
      "studentName", "gender", "dateOfBirth", "applyingForClass",
      "previousSchoolName", "previousClass", "fatherName", "motherName",
      "parentMobile", "parentEmail", "address", "city", "state", "pinCode",
    ] as const;

    for (const field of required) {
      if (!body[field] || String(body[field]).trim() === "") {
        res.status(400).json({ error: `Field "${field}" is required` });
        return;
      }
    }

    // Mobile validation
    if (!/^[6-9]\d{9}$/.test(body.parentMobile)) {
      res.status(400).json({ error: "Invalid mobile number (must be 10 digits starting with 6-9)" });
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.parentEmail)) {
      res.status(400).json({ error: "Invalid email address" });
      return;
    }

    // PIN validation
    if (!/^\d{6}$/.test(body.pinCode)) {
      res.status(400).json({ error: "Invalid PIN code (must be 6 digits)" });
      return;
    }

    const admissionId = generateAdmissionId();

    await db.insert(admissionsTable).values({
      admissionId,
      studentName: body.studentName.trim(),
      gender: body.gender,
      dateOfBirth: body.dateOfBirth,
      aadhaarNumber: body.aadhaarNumber?.trim() || null,
      bloodGroup: body.bloodGroup?.trim() || null,
      applyingForClass: body.applyingForClass,
      previousSchoolName: body.previousSchoolName.trim(),
      previousClass: body.previousClass,
      studentPhotoUrl: null,
      fatherName: body.fatherName.trim(),
      motherName: body.motherName.trim(),
      parentMobile: body.parentMobile.trim(),
      alternateMobile: body.alternateMobile?.trim() || null,
      parentEmail: body.parentEmail.trim().toLowerCase(),
      address: body.address.trim(),
      city: body.city.trim(),
      state: body.state,
      pinCode: body.pinCode.trim(),
      transportRequired: Boolean(body.transportRequired),
      hostelRequired: Boolean(body.hostelRequired),
      medicalCondition: body.medicalCondition?.trim() || null,
    });

    // Fire-and-forget WhatsApp — don't fail the response if it fails
    sendWhatsAppNotification({
      admissionId,
      studentName: body.studentName,
      applyingForClass: body.applyingForClass,
      dateOfBirth: body.dateOfBirth,
      fatherName: body.fatherName,
      motherName: body.motherName,
      parentMobile: body.parentMobile,
      parentEmail: body.parentEmail,
      address: body.address,
      city: body.city,
      state: body.state,
      pinCode: body.pinCode,
      transportRequired: Boolean(body.transportRequired),
      hostelRequired: Boolean(body.hostelRequired),
      previousSchoolName: body.previousSchoolName,
      medicalCondition: body.medicalCondition,
    }).catch(() => {
      // WhatsApp failure is non-fatal
    });

    // Fire-and-forget email — don't fail the response if email fails
    sendEmailNotification({
      admissionId,
      studentName: body.studentName,
      applyingForClass: body.applyingForClass,
      dateOfBirth: body.dateOfBirth,
      fatherName: body.fatherName,
      motherName: body.motherName,
      parentMobile: body.parentMobile,
      parentEmail: body.parentEmail,
      address: body.address,
      city: body.city,
      state: body.state,
      pinCode: body.pinCode,
      transportRequired: Boolean(body.transportRequired),
      hostelRequired: Boolean(body.hostelRequired),
      previousSchoolName: body.previousSchoolName,
      medicalCondition: body.medicalCondition,
    }).catch(() => {
      // Email failure is non-fatal
    });

    res.status(201).json({
      admissionId,
      message: "Admission enquiry submitted successfully",
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

export default router;
