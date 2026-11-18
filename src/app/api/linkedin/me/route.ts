import { NextRequest, NextResponse } from "next/server";
import { LI_TOKEN_COOKIE, fetchUser, linkedInConfigured } from "@/lib/linkedin";

export async function GET(req: NextRequest) {
  if (!linkedInConfigured()) return NextResponse.json({ enabled: false, connected: false });
  const token = req.cookies.get(LI_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ enabled: true, connected: false });
  const user = await fetchUser(token);
  if (!user) return NextResponse.json({ enabled: true, connected: false });
  return NextResponse.json({ enabled: true, connected: true, name: user.name, hasPhoto: !!user.picture });
}
