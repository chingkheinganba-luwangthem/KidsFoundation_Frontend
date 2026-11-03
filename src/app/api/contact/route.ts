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

// RFC 5322 compliant regex for basic email format validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

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
      name,
      email,
      phone,
      subject,
      message,
      // Honeypot field: invisible to real users, filled by bots
      hp_website,
    } = body;

    // 1. Honeypot check (anti-spam)
    if (typeof hp_website === "string" && hp_website.trim().length > 0) {
      // Silently accept so bot thinks it succeeded
      return NextResponse.json(
        { success: true, message: "Your message has been received." },
        { status: 200 }
      );
    }

    // 2. Validate and sanitize 'name'
    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide your full name." },
        { status: 400 }
      );
    }
    const cleanName = name.trim().slice(0, 100);
    if (cleanName.length < 2) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    // 3. Validate and sanitize 'email'
    if (typeof email !== "string" || email.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide your email address." },
        { status: 400 }
      );
    }
    const cleanEmail = email.trim().toLowerCase().slice(0, 150);
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address (e.g. name@example.com)." },
        { status: 400 }
      );
    }

    // 4. Validate and sanitize optional 'phone'
    let cleanPhone = "";
    if (typeof phone === "string" && phone.trim().length > 0) {
      cleanPhone = phone.trim().slice(0, 30);
    }

    // 5. Validate and sanitize 'subject' (prevent CRLF / header injection)
    if (typeof subject !== "string" || subject.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Please enter a subject for your enquiry." },
        { status: 400 }
      );
    }
    const safeSubject = subject.replace(/[\r\n]+/g, " ").trim().slice(0, 200);
    if (safeSubject.length < 2) {
      return NextResponse.json(
        { success: false, message: "Please enter a meaningful subject." },
        { status: 400 }
      );
    }

    // 6. Validate and sanitize 'message'
    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Please write your message." },
        { status: 400 }
      );
    }
    const cleanMessage = message.trim().slice(0, 5000);
    if (cleanMessage.length < 5) {
      return NextResponse.json(
        { success: false, message: "Your message is too short. Please provide more details." },
        { status: 400 }
      );
    }

    // 7. Verify SMTP Configuration
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
        "[Contact API] Missing SMTP configuration in environment variables (SMTP_USER or SMTP_PASS not set)."
      );
      return NextResponse.json(
        {
          success: false,
          message:
            "The email service is currently unavailable. Please reach us directly at kidsfoundationghari@gmail.com or call 0385-2456231.",
        },
        { status: 503 }
      );
    }

    // 8. Configure Nodemailer Transporter
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

    // 9. Plain-text version (fallback)
    const textContent = `
NEW WEBSITE ENQUIRY - KIDS' FOUNDATION SCHOOL, IMPHAL
------------------------------------------------------
Date/Time : ${submissionTime} IST
Name      : ${cleanName}
Email     : ${cleanEmail}
Phone     : ${cleanPhone || "Not provided"}
Subject   : ${safeSubject}

MESSAGE:
------------------------------------------------------
${cleanMessage}
------------------------------------------------------
(Sent securely from the Kids' Foundation website contact form. Click "Reply" in your email client to respond directly to ${cleanName} at ${cleanEmail}.)
`.trim();

    // 10. School-branded HTML email version
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Enquiry</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);">
    
    <!-- Header Banner -->
    <tr>
      <td style="background: linear-gradient(135deg, #17345F 0%, #1e427b 100%); padding: 28px 32px; text-align: left;">
        <span style="display: inline-block; background: rgba(244, 124, 97, 0.2); border: 1px solid rgba(244, 124, 97, 0.4); color: #FFB3A1; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; padding: 4px 10px; border-radius: 999px; margin-bottom: 8px;">
          Website Contact Form
        </span>
        <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 700; letter-spacing: -0.02em;">
          Kids' Foundation School, Imphal
        </h1>
        <p style="margin: 4px 0 0; color: #CBD5E1; font-size: 13px;">
          New message received on ${submissionTime} IST
        </p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 28px 32px;">
        
        <!-- Visitor Info Table -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-collapse: separate; border-spacing: 0; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 12px 18px; width: 130px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E2E8F0;">
              Sender Name
            </td>
            <td style="padding: 12px 18px; font-size: 14px; font-weight: 600; color: #0F172A; border-bottom: 1px solid #E2E8F0;">
              ${escapeHtml(cleanName)}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 18px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E2E8F0;">
              Email Address
            </td>
            <td style="padding: 12px 18px; font-size: 14px; font-weight: 500; color: #0284C7; border-bottom: 1px solid #E2E8F0;">
              <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #0284C7; text-decoration: none; font-weight: 600;">${escapeHtml(cleanEmail)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 18px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E2E8F0;">
              Phone Number
            </td>
            <td style="padding: 12px 18px; font-size: 14px; color: #334155; border-bottom: 1px solid #E2E8F0;">
              ${cleanPhone ? escapeHtml(cleanPhone) : '<span style="color: #94A3B8; font-style: italic;">Not provided</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 18px; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em;">
              Subject
            </td>
            <td style="padding: 12px 18px; font-size: 14px; font-weight: 600; color: #0F172A;">
              ${escapeHtml(safeSubject)}
            </td>
          </tr>
        </table>

        <!-- Message Box -->
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B; margin: 0 0 10px; font-weight: 700;">
            Enquiry Message
          </h2>
          <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-left: 4px solid #F47C61; border-radius: 8px; padding: 18px 20px; font-size: 14.5px; line-height: 1.7; color: #1E293B; white-space: pre-wrap;">
${escapeHtml(cleanMessage)}
          </div>
        </div>

        <!-- Quick Reply Callout -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 10px; padding: 14px 18px;">
          <tr>
            <td>
              <p style="margin: 0; font-size: 13px; color: #9A3412; line-height: 1.5;">
                <strong>Direct Reply:</strong> Clicking <strong>Reply</strong> in your email app will send your response directly to <strong>${escapeHtml(cleanEmail)}</strong>.
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

    // 11. Send Email via Nodemailer
    await transporter.sendMail({
      from: `"Kids' Foundation School" <${smtpUser}>`,
      to: recipients,
      replyTo: `"${cleanName}" <${cleanEmail}>`,
      subject: `[Contact Enquiry] ${safeSubject}`,
      text: textContent,
      html: htmlContent,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been sent successfully. We will get back to you shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    // Log safe error diagnostics without leaking passwords
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Contact API] Nodemailer send error:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to send your message right now due to a mail delivery error. Please try again in a moment or contact the school directly via phone/email.",
      },
      { status: 500 }
    );
  }
}
