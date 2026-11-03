import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// HTML escaping helper to prevent XSS in email clients
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const {
      studentName,
      parentPhone,
      grade,
      message,
      // Honeypot field for anti-spam
      hp_website,
    } = body;

    // 1. Honeypot check
    if (typeof hp_website === "string" && hp_website.trim().length > 0) {
      return NextResponse.json(
        { success: true, message: "Your enquiry has been received." },
        { status: 200 }
      );
    }

    // 2. Validate Student Name
    if (typeof studentName !== "string" || studentName.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Please enter the student's full name." },
        { status: 400 }
      );
    }
    const cleanStudentName = studentName.trim().slice(0, 100);
    if (cleanStudentName.length < 2) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid student name (at least 2 characters)." },
        { status: 400 }
      );
    }

    // 3. Validate Parent Phone
    if (typeof parentPhone !== "string" || parentPhone.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Please enter the parent/guardian mobile number." },
        { status: 400 }
      );
    }
    const cleanParentPhone = parentPhone.trim().slice(0, 30);
    if (cleanParentPhone.length < 6) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    // 4. Validate Grade / Stage
    if (typeof grade !== "string" || grade.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Please select the class or stage seeking admission." },
        { status: 400 }
      );
    }
    const cleanGrade = grade.trim().slice(0, 100);

    // 5. Sanitize optional message
    let cleanMessage = "";
    if (typeof message === "string" && message.trim().length > 0) {
      cleanMessage = message.trim().slice(0, 3000);
    }

    // 6. Verify SMTP configuration
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, "");
    const rawContactTo =
      process.env.CONTACT_TO_EMAIL?.trim() ||
      "chingkheinganbaluwangthem@gmail.com, kidsfoundationghari@gmail.com";
    const recipients = Array.from(
      new Set(
        rawContactTo
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e.length > 0)
          .concat("chingkheinganbaluwangthem@gmail.com")
      )
    );

    if (!smtpUser || !smtpPass) {
      console.error(
        "[Enquiry API] Missing SMTP configuration (SMTP_USER or SMTP_PASS not set)."
      );
      return NextResponse.json(
        {
          success: false,
          message:
            "The enquiry service is temporarily unavailable. Please reach our admissions desk directly at kidsfoundationghari@gmail.com or call 0385-2456231.",
        },
        { status: 503 }
      );
    }

    // 7. Configure Nodemailer Transporter
    const isGmail = smtpHost.toLowerCase().includes("gmail.com");
    const transporter = nodemailer.createTransport(
      isGmail
        ? {
            service: "gmail",
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          }
        : {
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
          }
    );

    const submissionTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    // 8. Plain-text Email Fallback
    const textContent = `
NEW ADMISSION ENQUIRY - KIDS' FOUNDATION SCHOOL, IMPHAL
---------------------------------------------------------
Date/Time      : ${submissionTime} IST
Student Name   : ${cleanStudentName}
Parent Phone   : ${cleanParentPhone}
Class / Stage  : ${cleanGrade}
Specific Notes : ${cleanMessage || "None provided"}
---------------------------------------------------------
(Submitted via Quick Admission Enquiry modal on the Kids' Foundation website.)
`.trim();

    // 9. Branded HTML Email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Admission Enquiry</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);">
    
    <!-- Header Banner -->
    <tr>
      <td style="background: linear-gradient(135deg, #17345F 0%, #1e427b 100%); padding: 28px 32px; text-align: left;">
        <span style="display: inline-block; background: rgba(251, 191, 36, 0.2); border: 1px solid rgba(251, 191, 36, 0.4); color: #FBBF24; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; padding: 4px 10px; border-radius: 999px; margin-bottom: 8px;">
          Quick Admission Enquiry
        </span>
        <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 700; letter-spacing: -0.02em;">
          Kids' Foundation School, Imphal
        </h1>
        <p style="margin: 4px 0 0; color: #CBD5E1; font-size: 13px;">
          Received on ${submissionTime} IST
        </p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 28px 32px;">
        
        <!-- Enquiry Details Table -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-collapse: separate; border-spacing: 0; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 12px 18px; width: 140px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E2E8F0;">
              Student Name
            </td>
            <td style="padding: 12px 18px; font-size: 15px; font-weight: 700; color: #0F172A; border-bottom: 1px solid #E2E8F0;">
              ${escapeHtml(cleanStudentName)}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 18px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E2E8F0;">
              Parent Mobile
            </td>
            <td style="padding: 12px 18px; font-size: 14px; font-weight: 600; color: #0284C7; border-bottom: 1px solid #E2E8F0;">
              <a href="tel:${escapeHtml(cleanParentPhone)}" style="color: #0284C7; text-decoration: none;">${escapeHtml(cleanParentPhone)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 18px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E2E8F0;">
              Grade / Stage
            </td>
            <td style="padding: 12px 18px; font-size: 14px; font-weight: 700; color: #F47C61; border-bottom: 1px solid #E2E8F0;">
              ${escapeHtml(cleanGrade)}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 18px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em;">
              Specific Questions
            </td>
            <td style="padding: 12px 18px; font-size: 14px; color: #334155;">
              ${cleanMessage ? escapeHtml(cleanMessage) : '<span style="color: #94A3B8; font-style: italic;">No specific questions entered.</span>'}
            </td>
          </tr>
        </table>

        <!-- Quick Call Action Box -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 10px; padding: 14px 18px;">
          <tr>
            <td>
              <p style="margin: 0; font-size: 13px; color: #9A3412; line-height: 1.5;">
                <strong>Contact Applicant:</strong> Call <strong><a href="tel:${escapeHtml(cleanParentPhone)}" style="color: #9A3412; font-weight: 700; text-decoration: underline;">${escapeHtml(cleanParentPhone)}</a></strong> to schedule a campus tour or discuss admissions for <strong>${escapeHtml(cleanStudentName)}</strong> (${escapeHtml(cleanGrade)}).
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #F1F5F9; padding: 16px 32px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 11.5px; color: #64748B;">
        Kids' Foundation School • Airport Road, Ghari, Imphal, Manipur - 795001 • Automated Web Notification
      </td>
    </tr>

  </table>
</body>
</html>
`.trim();

    // 10. Send Email via Nodemailer
    await transporter.sendMail({
      from: `"Kids' Foundation School" <${smtpUser}>`,
      to: recipients,
      subject: `[Admission Enquiry] New Enquiry for ${cleanGrade} - ${cleanStudentName}`,
      text: textContent,
      html: htmlContent,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your admission enquiry has been submitted. Our admissions team will contact you shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Enquiry API] Nodemailer send error:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to send your enquiry right now. Please try again or call the admissions desk directly at 0385-2456231.",
      },
      { status: 500 }
    );
  }
}
