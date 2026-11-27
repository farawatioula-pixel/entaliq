import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Onboarding assistant ("مساعد منطلق").
 * Interviews a trainee one question at a time and returns a draft profile + first listing.
 * Needs ANTHROPIC_API_KEY in the environment; ANTHROPIC_MODEL is optional.
 */

type ChatTurn = { role: "user" | "assistant"; text: string };

const MAX_TURNS = 40;

const tools = [
  {
    name: "ask_question",
    description:
      "Ask the trainee ONE short question. Always offer 2-4 tap-to-answer options when the question has likely answers.",
    input_schema: {
      type: "object",
      properties: {
        step: {
          type: "integer",
          enum: [1, 2, 3, 4],
          description: "1 = about you, 2 = your service, 3 = packages and prices, 4 = final details",
        },
        question: { type: "string", description: "The question, in the trainee's language. Friendly, max 2 sentences." },
        options: { type: "array", items: { type: "string" }, maxItems: 5 },
        multiple: {
          type: "boolean",
          description: "true when more than one option can apply (skills, tools, types of clients). The trainee can then tick several, or all of them.",
        },
      },
      required: ["step", "question"],
    },
  },
  {
    name: "submit_draft",
    description: "Call once you have enough to write a complete profile and first service listing.",
    input_schema: {
      type: "object",
      properties: {
        profile: {
          type: "object",
          properties: {
            headline: { type: "string", description: "Max 80 characters, e.g. 'Graphic designer for small businesses'" },
            bio: { type: "string", description: "3-4 sentences in first person" },
            category: { type: "string", description: "One of the category slugs provided" },
          },
          required: ["headline", "bio", "category"],
        },
        listing: {
          type: "object",
          properties: {
            title: { type: "string", description: "Starts with 'I will' (English) or 'سأقوم' (Arabic). Max 80 characters." },
            description: { type: "string", description: "120-250 words: what the buyer gets, process, why choose me" },
            category: { type: "string", description: "One of the category slugs provided" },
            tags: { type: "array", items: { type: "string" }, maxItems: 5 },
            requirements: { type: "string", description: "What the buyer must send to start" },
            packages: {
              type: "array",
              minItems: 3,
              maxItems: 3,
              items: {
                type: "object",
                properties: {
                  tier: { type: "string", enum: ["basic", "standard", "premium"] },
                  name: { type: "string" },
                  description: { type: "string" },
                  price_jod: { type: "number", description: "Price in Jordanian dinars" },
                  delivery_days: { type: "integer" },
                  revisions: { type: "integer" },
                  features: { type: "array", items: { type: "string" }, maxItems: 5 },
                },
                required: ["tier", "name", "description", "price_jod", "delivery_days", "revisions"],
              },
            },
            faq: {
              type: "array",
              maxItems: 3,
              items: {
                type: "object",
                properties: { question: { type: "string" }, answer: { type: "string" } },
                required: ["question", "answer"],
              },
            },
          },
          required: ["title", "description", "category", "packages", "requirements"],
        },
      },
      required: ["profile", "listing"],
    },
  },
];

function systemPrompt(locale: string, categories: { slug: string; name: string }[]) {
  const lang = locale === "ar" ? "Arabic (clear Jordanian-friendly Modern Standard Arabic)" : "English";
  return `You are مساعد منطلق (the Mountaliq assistant) on mountaliq.com, a freelance marketplace for young people in Jordan trained by Mountaliq.
Your job: help a trainee publish their profile and FIRST service listing by interviewing them, so they never face a long empty form.

Rules:
- Write in ${lang}. If the trainee writes in another language, switch to theirs.
- ALWAYS respond by calling a tool. Ask exactly ONE question per turn with ask_question. Keep it short, warm and encouraging. Offer 2-5 options they can tap whenever possible. When several options can be true at once, set multiple: true (do not add an "all of the above" option yourself; the app adds it).
- Move through the steps in order:
  1. About you: what they do, their experience level, any past work or tools they use.
  2. Your service: the ONE service to sell first (help them narrow it down), who it is for, what the buyer receives.
  3. Packages and prices: suggest a basic/standard/premium structure with realistic Jordanian dinar prices for a beginner (basic is usually 5-25 JOD), delivery days and revisions; ask them to confirm or adjust.
  4. Final details: what they need from the buyer to start.
- Aim for 6-9 questions in total. Do not ask for things you can sensibly write yourself (tags, FAQ, polished descriptions).
- Never invent experience, clients or results they did not mention. If they are a beginner, write honestly and positively about their training with Mountaliq.
- When you have enough, call submit_draft with a complete, polished profile and listing written in ${lang}.
- Category slugs you may use: ${categories.map((c) => `${c.slug} (${c.name})`).join(", ")}.`;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { turns?: ChatTurn[]; locale?: string; categories?: { slug: string; name: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const turns = (body.turns ?? [])
    .filter((t) => (t.role === "user" || t.role === "assistant") && typeof t.text === "string" && t.text.trim())
    .slice(-MAX_TURNS)
    .map((t) => ({ role: t.role, content: t.text.slice(0, 4000) }));
  const locale = body.locale === "ar" ? "ar" : "en";
  const categories = (body.categories ?? []).slice(0, 20);

  // The conversation must start with the user.
  const messages =
    turns.length && turns[0].role === "user"
      ? turns
      : [{ role: "user" as const, content: locale === "ar" ? "مرحباً، ساعدني في إنشاء ملفي وخدمتي الأولى." : "Hi, help me set up my profile and first service." }, ...turns];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: 4000,
      system: systemPrompt(locale, categories),
      tools,
      tool_choice: { type: "auto" },
      messages,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("assistant: Anthropic API error", res.status, detail.slice(0, 500));
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }

  const data = (await res.json()) as {
    content: { type: string; name?: string; input?: Record<string, unknown>; text?: string }[];
  };
  const call = data.content.find((c) => c.type === "tool_use");
  if (!call || !call.input) {
    const text = data.content.find((c) => c.type === "text")?.text ?? "";
    return NextResponse.json({ kind: "question", step: 1, question: text, options: [] });
  }

  if (call.name === "submit_draft") {
    return NextResponse.json({ kind: "draft", draft: call.input });
  }

  const input = call.input as { step?: number; question?: string; options?: string[]; multiple?: boolean };
  return NextResponse.json({
    kind: "question",
    step: Math.min(4, Math.max(1, Number(input.step) || 1)),
    question: String(input.question ?? ""),
    options: Array.isArray(input.options) ? input.options.slice(0, 5).map(String) : [],
    multiple: Boolean(input.multiple),
  });
}
