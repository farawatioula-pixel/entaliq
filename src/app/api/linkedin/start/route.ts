import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { LI_STATE_COOKIE, linkedInConfigured, redirectUri } from "@/lib/linkedin";

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") === "ar" ? "ar" : "en";
  if (!linkedInConfigured()) {
    return NextResponse.redirect(new URL(`/${locale}/summit/card`, req.url));
  }
  const state = `${randomBytes(16).toString("hex")}.${locale}`;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    redirect_uri: redirectUri(),
    state,
    scope: "openid profile w_member_social",
  });
  const res = NextResponse.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);
  res.cookies.set(LI_STATE_COOKIE, state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/" });
  return res;
}
