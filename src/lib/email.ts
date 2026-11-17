/**
 * Email sending for Mountaliq.
 *
 * Works with whichever provider hosts register@mountaliq.com:
 *
 *   1. Resend  — set RESEND_API_KEY (and optionally MAIL_FROM).
 *   2. SMTP    — set SMTP_HOST, SMTP_USER, SMTP_PASS
 *                (and optionally SMTP_PORT, SMTP_SECURE, MAIL_FROM).
 *
 * If neither is configured, sending is skipped and logged rather than
 * throwing, so a missing env var can never cost us a registration.
 */

export type MailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type MailResult = {
  sent: boolean;
  via: "resend" | "smtp" | "none";
  error?: string;
};

const DEFAULT_FROM = "Mountaliq <register@mountaliq.com>";

function fromAddress(): string {
  return process.env.MAIL_FROM?.trim() || DEFAULT_FROM;
}

async function sendViaResend(message: MailMessage, apiKey: string): Promise<MailResult> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { sent: false, via: "resend", error: `Resend responded ${res.status}: ${detail}` };
  }

  return { sent: true, via: "resend" };
}

async function sendViaSmtp(message: MailMessage): Promise<MailResult> {
  // Imported lazily so the dependency never loads on requests that don't send mail.
  const nodemailer = (await import("nodemailer")).default;

  const port = Number(process.env.SMTP_PORT) || 587;
  // Port 465 is implicit TLS; 587 and 25 use STARTTLS.
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from: fromAddress(),
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    ...(message.replyTo ? { replyTo: message.replyTo } : {}),
  });

  return { sent: true, via: "smtp" };
}

export async function sendMail(message: MailMessage): Promise<MailResult> {
  const resendKey = process.env.RESEND_API_KEY?.trim();

  try {
    if (resendKey) {
      return await sendViaResend(message, resendKey);
    }

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      return await sendViaSmtp(message);
    }

    console.warn(
      "[mountaliq:email] No email provider configured — set RESEND_API_KEY, or SMTP_HOST/SMTP_USER/SMTP_PASS. " +
        `Skipped sending "${message.subject}" to ${message.to}.`
    );
    return { sent: false, via: "none", error: "No email provider configured" };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("[mountaliq:email] Sending failed:", error);
    return { sent: false, via: resendKey ? "resend" : "smtp", error };
  }
}
