/**
 * Marketplace search helpers: split the query into words, add common
 * English <-> Arabic equivalents, and build a safe PostgREST "or" filter.
 */

// Each group lists words that mean the same thing (English and Arabic, with common spellings).
const SYNONYMS: string[][] = [
  ["logo", "logos", "شعار", "شعارات", "لوجو", "لوغو"],
  ["design", "designer", "تصميم", "مصمم", "مصممة"],
  ["graphic", "graphics", "جرافيك", "غرافيك", "جرافيكي"],
  ["brand", "branding", "identity", "هوية", "علامة"],
  ["video", "videos", "فيديو", "فيديوهات"],
  ["edit", "editing", "editor", "مونتاج", "تحرير"],
  ["animation", "animated", "motion", "انيميشن", "أنيميشن", "رسوم متحركة", "موشن"],
  ["website", "websites", "web", "site", "موقع", "مواقع"],
  ["app", "apps", "application", "mobile", "تطبيق", "تطبيقات"],
  ["programming", "developer", "development", "code", "coding", "برمجة", "مبرمج", "تطوير"],
  ["marketing", "ads", "advertising", "تسويق", "إعلانات", "اعلانات"],
  ["social", "social media", "instagram", "tiktok", "سوشال", "سوشيال", "تواصل اجتماعي"],
  ["content", "creator", "محتوى", "صانع محتوى", "صانعة محتوى"],
  ["writing", "writer", "copywriting", "كتابة", "كاتب", "محتوى مكتوب"],
  ["translation", "translate", "translator", "ترجمة", "مترجم"],
  ["ecommerce", "e-commerce", "store", "shop", "shopify", "ebay", "متجر", "تجارة إلكترونية", "تجارة الكترونية", "التجارة"],
  ["ai", "artificial intelligence", "ai services", "ذكاء اصطناعي", "الذكاء الاصطناعي"],
  ["automation", "أتمتة", "اتمتة"],
  ["sales", "selling", "مبيعات", "بيع"],
  ["training", "workshop", "تدريب", "ورشة"],
  ["consulting", "consultant", "strategy", "استشارات", "استشارة", "استراتيجية"],
  ["resume", "cv", "سيرة ذاتية", "السيرة الذاتية"],
  ["invitation", "invitations", "cards", "دعوة", "دعوات", "بطاقات"],
  ["photo", "photography", "تصوير", "صور"],
  ["ui", "ux", "uiux", "واجهات", "تجربة المستخدم"],
];

const STOP = new Set(["and", "or", "the", "a", "an", "for", "of", "i", "need", "want", "و", "في", "من", "على", "أريد", "اريد", "احتاج", "أحتاج"]);

/** Strip characters that would break a PostgREST filter string. */
function clean(term: string) {
  return term.replace(/[,()%*\\"'.:]/g, " ").replace(/\s+/g, " ").trim();
}

/** Words of the query plus their equivalents in the other language. */
export function expandSearch(q: string): string[] {
  const base = clean(q.toLowerCase());
  if (!base) return [];
  const words = base.split(" ").filter((w) => w.length > 1 && !STOP.has(w));
  const terms = new Set<string>([base, ...words]);
  for (const group of SYNONYMS) {
    const hit = group.some((g) => base.includes(g) || words.some((w) => g === w || (w.length > 3 && g.startsWith(w))));
    if (hit) group.forEach((g) => terms.add(g));
  }
  return [...terms].filter(Boolean).slice(0, 30);
}

/** Does a category's name (en / ar / slug) match the search? */
export function categoryMatches(
  cat: { name: string; name_ar: string | null; slug: string },
  terms: string[]
): boolean {
  const hay = `${cat.name} ${cat.name_ar ?? ""} ${cat.slug.replace(/-/g, " ")}`.toLowerCase();
  return terms.some((t) => t.length > 2 && hay.includes(t));
}

/** PostgREST "or" filter across title, description and tags for all terms. */
export function searchOrFilter(terms: string[], categoryIds: string[]): string {
  const parts: string[] = [];
  // Two-letter words ("ai", "ui") would match almost everything inside other words.
  for (const t of terms.filter((x) => x.length >= 3)) {
    parts.push(`title.ilike.*${t}*`, `description.ilike.*${t}*`);
  }
  const tagTerms = terms.filter((t) => !t.includes(" "));
  if (tagTerms.length) parts.push(`tags.ov.{${tagTerms.join(",")}}`);
  if (categoryIds.length) {
    parts.push(`category_id.in.(${categoryIds.join(",")})`, `subcategory_id.in.(${categoryIds.join(",")})`);
  }
  return parts.join(",");
}

/** Simple relevance score: category, then title, tags, description. */
export function relevance(
  l: { title: string; description: string; tags: string[] | null; inCategory: boolean },
  terms: string[]
): number {
  const title = l.title.toLowerCase();
  const desc = l.description.toLowerCase();
  const tags = (l.tags ?? []).join(" ").toLowerCase();
  let s = l.inCategory ? 6 : 0;
  for (const t of terms) {
    if (t.length < 3) continue;
    if (title.includes(t)) s += 4;
    if (tags.includes(t)) s += 3;
    if (desc.includes(t)) s += 1;
  }
  return s;
}
