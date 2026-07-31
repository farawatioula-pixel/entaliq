import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { type, name, email } = body;
  const validTypes = ["plenary", "training", "partner"];
  if (!name || !email || typeof type !== "string" || !validTypes.includes(type)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Log every submission server-side so it always shows up in Vercel's
  // function logs, even if no external form endpoint is configured.
  console.log("[intaleq:register]", JSON.stringify(body));

  // Optional: forward to an external form service (Formspree, Getform, etc.)
  // so submissions land in an inbox instead of only Vercel logs.
  // Set FORM_ENDPOINT in your environment variables to enable this.
  const endpoint = process.env.FORM_ENDPOINT;
  if (endpoint) {
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("[intaleq:register] forwarding failed", err);
      // Submission is still accepted — logged above — even if forwarding fails.
    }
  }

  return NextResponse.json({ ok: true });
}
