import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { sendMail } from "@/lib/email";

/**
 * POST /api/opportunities
 * A buyer posts what they need ("أحتاج خدمة"). The post_opportunity database
 * function saves it and drops it into a Mountaliq chat with every matching
 * freelancer (request card + message + bell notification). We then email each
 * of them. Emails need SUPABASE_SERVICE_ROLE_KEY (to look up addresses) plus
 * the usual mail settings; without them the chat + bell still work.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://mountaliq.com";

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "login" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_body" }, { status: 400 });
  }

  const title = clean(body.title, 120);
  const description = clean(body.description, 4000);
  const category = clean(body.category, 60);
  const budget = clean(body.budget, 80);
  const deadline = clean(body.deadline, 80);
  const locale = body.locale === "en" ? "en" : "ar";

  if (title.length < 3 || description.length < 10) {
    return NextResponse.json({ error: "too_short" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("post_opportunity", {
    p_title: title,
    p_description: description,
    p_category_slug: category || null,
    p_budget: budget,
    p_deadline: deadline,
  });

  if (error) {
    const limit = error.message.includes("daily limit");
    return NextResponse.json({ error: limit ? "daily_limit" : "failed" }, { status: limit ? 429 : 500 });
  }

  const rows = (data ?? []) as { opportunity_id: string; seller_id: string | null; conversation_id: string | null }[];
  const matches = rows.filter((r) => r.seller_id && r.conversation_id) as {
    opportunity_id: string;
    seller_id: string;
    conversation_id: string;
  }[];

  const emailed = await emailFreelancers(matches, { title, description, budget, deadline });

  return NextResponse.json({
    opportunityId: rows[0]?.opportunity_id ?? null,
    matched: matches.length,
    emailed,
    locale,
  });
}

async function emailFreelancers(
  matches: { seller_id: string; conversation_id: string }[],
  o: { title: string; description: string; budget: string; deadline: string }
) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey || matches.length === 0) return 0;

  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, name")
    .in(
      "id",
      matches.map((m) => m.seller_id)
    );
  const names = new Map((profiles ?? []).map((p: { id: string; name: string | null }) => [p.id, p.name ?? ""]));

  const short = o.description.length > 400 ? o.description.slice(0, 400) + "…" : o.description;
  let sent = 0;

  await Promise.all(
    matches.map(async (m) => {
      const { data } = await admin.auth.admin.getUserById(m.seller_id);
      const to = data?.user?.email;
      if (!to) return;
      const link = `${SITE}/ar/messages/${m.conversation_id}`;
      const name = names.get(m.seller_id) || "";
      const extras = [o.budget && `💰 ${o.budget}`, o.deadline && `⏱ ${o.deadline}`].filter(Boolean).join("   ");

      const html = `<!doctype html><html><body style="margin:0;background:#f5f6fa;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:24px">
  <div style="background:#0D1220;border-radius:16px;padding:28px;color:#fff">
    <p style="margin:0;color:#22D3EE;font-size:12px;letter-spacing:2px">MOUNTALIQ · منطلق</p>
    <h1 dir="rtl" style="margin:12px 0 4px;font-size:22px">طلب جديد يناسب مهاراتك</h1>
    <p style="margin:0;color:#cbd5e1;font-size:14px">A new client request matches your skills</p>
  </div>
  <div style="background:#fff;border-radius:16px;padding:24px;margin-top:12px;color:#0D1220">
    ${name ? `<p dir="auto" style="margin:0 0 12px">${esc(name)}،</p>` : ""}
    <h2 dir="auto" style="margin:0 0 8px;font-size:18px">${esc(o.title)}</h2>
    <p dir="auto" style="margin:0 0 12px;white-space:pre-line;line-height:1.6">${esc(short)}</p>
    ${extras ? `<p dir="auto" style="margin:0 0 16px;color:#475569">${esc(extras)}</p>` : ""}
    <a href="${link}" style="display:inline-block;background:#EC4899;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px">ردّ وأرسل عرضك · Reply with an offer</a>
    <p dir="rtl" style="margin:16px 0 0;font-size:13px;color:#64748b">الطلب موجود في محادثاتك على منطلق. أسرع من يردّ يفوز غالباً بالعمل.</p>
  </div>
</div></body></html>`;

      const text = `طلب جديد يناسب مهاراتك / New request matching your skills\n\n${o.title}\n\n${short}\n${extras}\n\nردّ هنا / Reply here: ${link}`;

      const res = await sendMail({ to, subject: `طلب جديد على منطلق: ${o.title}`, html, text });
      if (res.sent) sent += 1;
    })
  );

  return sent;
}
