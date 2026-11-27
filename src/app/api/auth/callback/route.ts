import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** OAuth (Google / LinkedIn) return URL: exchanges the code for a session, then continues. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next") || "/ar/dashboard/listings/assistant";
  // Only allow same-site relative paths.
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/ar";
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
