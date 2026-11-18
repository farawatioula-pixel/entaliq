import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CARD_BUCKET = "attendee-cards";

/** Stores a finished attendee card so LinkedIn can show it as the post's link preview. */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: "storage_unavailable" }, { status: 503 });

  const form = await req.formData();
  const image = form.get("image");
  if (!(image instanceof Blob) || image.type !== "image/png" || image.size > 3 * 1024 * 1024) {
    return NextResponse.json({ error: "invalid_image" }, { status: 400 });
  }

  const id = randomBytes(9).toString("base64url");
  const supabase = createClient(url, key);
  const { error } = await supabase.storage
    .from(CARD_BUCKET)
    .upload(`${id}.png`, Buffer.from(await image.arrayBuffer()), { contentType: "image/png", upsert: false });
  if (error) {
    console.error("[mountaliq:card] upload failed", error.message);
    return NextResponse.json({ error: "upload_failed" }, { status: 502 });
  }
  return NextResponse.json({ id });
}
