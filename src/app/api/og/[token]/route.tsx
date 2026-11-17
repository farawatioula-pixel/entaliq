import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { loadFonts, shareCard } from "@/lib/share-card";

export const runtime = "nodejs";

/**
 * Personalised share card for a registrant's referral link. Lives under /api
 * so the locale router leaves the path alone; the language comes from ?locale.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const locale = req.nextUrl.searchParams.get("locale") === "ar" ? "ar" : "en";

  let name = "";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key && /^[a-f0-9]{8,64}$/i.test(token)) {
    try {
      const supabase = createClient(url, key);
      const { data } = await supabase.rpc("share_card_name", { token });
      if (typeof data === "string") name = data;
    } catch {
      // Fall through to the generic card rather than failing the request —
      // a crawler must never get an error here or the post loses its image.
    }
  }

  // No name resolved (bad or expired token): serve the generic summit card.
  if (!name.trim()) {
    const fallback = locale === "ar" ? "/og/summit-share-ar.png" : "/og/summit-share-en.png";
    return Response.redirect(new URL(fallback, req.nextUrl.origin), 307);
  }

  const fonts = loadFonts().map((f) => ({
    ...f,
    data: f.data as unknown as ArrayBuffer,
  }));

  return new ImageResponse(shareCard(name, locale), {
    width: 1200,
    height: 627,
    fonts,
    headers: {
      // Cached hard: the card for a given token never changes.
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
