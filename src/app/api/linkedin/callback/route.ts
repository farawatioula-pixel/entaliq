import { NextRequest, NextResponse } from "next/server";
import { LI_STATE_COOKIE, LI_TOKEN_COOKIE, linkedInConfigured, redirectUri } from "@/lib/linkedin";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state") ?? "";
  const locale = state.endsWith(".ar") ? "ar" : "en";
  const back = (flag: string) => new URL(`/${locale}/summit/card?li=${flag}`, req.url);

  const expected = req.cookies.get(LI_STATE_COOKIE)?.value;
  if (!linkedInConfigured() || !code || !expected || expected !== state) {
    return NextResponse.redirect(back("error"));
  }

  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri(),
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  });
  if (!tokenRes.ok) {
    console.error("[mountaliq:linkedin] token exchange failed", tokenRes.status, await tokenRes.text());
    return NextResponse.redirect(back("error"));
  }
  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  if (!access_token) return NextResponse.redirect(back("error"));

  const res = NextResponse.redirect(back("1"));
  res.cookies.set(LI_TOKEN_COOKIE, access_token, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 3600, path: "/" });
  res.cookies.delete(LI_STATE_COOKIE);
  return res;
}
