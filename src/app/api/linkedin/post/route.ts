import { NextRequest, NextResponse } from "next/server";
import { LI_TOKEN_COOKIE, LI_VERSION, fetchUser } from "@/lib/linkedin";

/** Uploads the card image and publishes it as a post on the member's LinkedIn feed. */
export async function POST(req: NextRequest) {
  const token = req.cookies.get(LI_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "not_connected" }, { status: 401 });
  const user = await fetchUser(token);
  if (!user) return NextResponse.json({ error: "not_connected" }, { status: 401 });

  const form = await req.formData();
  const image = form.get("image");
  const text = String(form.get("text") ?? "").slice(0, 2900);
  if (!(image instanceof Blob)) return NextResponse.json({ error: "missing_image" }, { status: 400 });

  const author = `urn:li:person:${user.sub}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "LinkedIn-Version": LI_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
    "Content-Type": "application/json",
  };

  const init = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", {
    method: "POST",
    headers,
    body: JSON.stringify({ initializeUploadRequest: { owner: author } }),
  });
  if (!init.ok) {
    console.error("[mountaliq:linkedin] image init failed", init.status, await init.text());
    return NextResponse.json({ error: "upload_failed" }, { status: 502 });
  }
  const { value } = (await init.json()) as { value: { uploadUrl: string; image: string } };

  const put = await fetch(value.uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "image/png" },
    body: Buffer.from(await image.arrayBuffer()),
  });
  if (!put.ok) {
    console.error("[mountaliq:linkedin] image upload failed", put.status, await put.text());
    return NextResponse.json({ error: "upload_failed" }, { status: 502 });
  }

  const post = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers,
    body: JSON.stringify({
      author,
      commentary: text.replace(/[\\(){}\[\]<>@|~_*]/g, (c) => `\\${c}`),
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      content: { media: { id: value.image, altText: "Mountaliq 2026 attendee card" } },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  if (!post.ok) {
    console.error("[mountaliq:linkedin] post failed", post.status, await post.text());
    return NextResponse.json({ error: "post_failed" }, { status: 502 });
  }
  const urn = post.headers.get("x-restli-id");
  return NextResponse.json({ ok: true, url: urn ? `https://www.linkedin.com/feed/update/${urn}/` : null });
}
