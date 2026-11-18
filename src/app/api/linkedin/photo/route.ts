import { NextRequest, NextResponse } from "next/server";
import { LI_TOKEN_COOKIE, fetchUser } from "@/lib/linkedin";

/** Proxies the member's LinkedIn photo so the browser can draw it on the card. */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(LI_TOKEN_COOKIE)?.value;
  if (!token) return new NextResponse(null, { status: 401 });
  const user = await fetchUser(token);
  if (!user?.picture) return new NextResponse(null, { status: 404 });
  const img = await fetch(user.picture, { cache: "no-store" });
  if (!img.ok) return new NextResponse(null, { status: 502 });
  return new NextResponse(img.body, {
    headers: { "Content-Type": img.headers.get("content-type") ?? "image/jpeg", "Cache-Control": "private, no-store" },
  });
}
