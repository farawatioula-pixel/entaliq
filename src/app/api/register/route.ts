import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail } from "@/lib/email";
import { linkedInShareUrl } from "@/lib/summit";
import {
  ceremonyConfirmationHtml,
  ceremonyConfirmationSubject,
  ceremonyConfirmationText,
} from "@/lib/emails/ceremony-confirmation";

const VALID_TYPES = ["ceremony", "training", "partner", "trainer"] as const;
type RegistrationType = (typeof VALID_TYPES)[number];

function isValidType(value: unknown): value is RegistrationType {
  return typeof value === "string" && (VALID_TYPES as readonly string[]).includes(value);
}

function str(value: unknown): string | null {
  const s = typeof value === "string" ? value.trim() : "";
  return s.length > 0 ? s : null;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // "plenary" was the old name for what is now the closing ceremony; accept it
  // so any cached page still in someone's browser keeps working.
  const rawType = body.type === "plenary" ? "ceremony" : body.type;

  const name = str(body.name);
  const email = str(body.email);

  if (!name || !email || !isValidType(rawType)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (rawType === "ceremony" && (!str(body.organisation) || !str(body.phone))) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (
    rawType === "trainer" &&
    (!str(body.phone) || !str(body.background) || !str(body.message))
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const type: RegistrationType = rawType;
  const locale = str(body.locale) === "ar" ? "ar" : "en";
  const shareToken = randomBytes(8).toString("hex");
  const ageValue = Number(body.age);

  const record = {
    type,
    name,
    email,
    organisation: str(body.organisation),
    phone: str(body.phone),
    age: Number.isFinite(ageValue) && ageValue > 0 ? Math.floor(ageValue) : null,
    background: str(body.background),
    locale,
    share_token: shareToken,
    referred_by: str(body.ref),
    message: str(body.message),
    links: str(body.links),
  };

  // Always log, so a submission is never lost even if the database write fails.
  console.log("[mountaliq:register]", JSON.stringify(record));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from("registrations").insert(record);
    if (error) {
      // A storage failure must not cost us the registration — it is in the logs
      // above, and the attendee still gets their confirmation below.
      console.error("[mountaliq:register] database insert failed", error.message);
    }
  } else {
    console.error("[mountaliq:register] Supabase env vars missing — registration only logged");
  }

  let emailSent = false;

  if (type === "ceremony") {
    const result = await sendMail({
      to: email,
      subject: ceremonyConfirmationSubject(locale),
      html: ceremonyConfirmationHtml({ name, shareToken, locale }),
      text: ceremonyConfirmationText({ name, shareToken, locale }),
      replyTo: process.env.MAIL_REPLY_TO?.trim() || undefined,
    });
    emailSent = result.sent;
  }

  // Optional: forward to an external form service (Formspree, Getform, etc.).
  const endpoint = process.env.FORM_ENDPOINT;
  if (endpoint) {
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(record),
      });
    } catch (err) {
      console.error("[mountaliq:register] forwarding failed", err);
    }
  }

  return NextResponse.json({
    ok: true,
    emailSent,
    shareUrl: type === "ceremony" ? linkedInShareUrl(shareToken, locale) : null,
  });
}
