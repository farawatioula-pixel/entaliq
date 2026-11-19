/**
 * Works out where a visitor came from and remembers it for the session.
 *
 * The referrer has to be captured on the *first* page the visitor lands on.
 * Once they click through the site to /register, `document.referrer` is
 * mountaliq.com itself and the original source is gone — so we stash it in
 * sessionStorage the first time and never overwrite it.
 *
 * Caveat worth knowing: WhatsApp, Instagram and most native mobile apps strip
 * the referrer, so those arrive as "direct". UTM tags on the link are the only
 * reliable way to attribute those — see utmLink() below.
 */

const KEY = "mountaliq_source";

export type VisitSource = {
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  landing_path: string | null;
};

const EMPTY: VisitSource = {
  referrer: null,
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  landing_path: null,
};

function clean(value: string | null | undefined): string | null {
  const s = (value ?? "").trim();
  if (!s) return null;
  // Keep it short — these go straight into a database column and a table cell.
  return s.slice(0, 300);
}

/**
 * Call once as early as possible on any landing page. Safe to call repeatedly:
 * only the first visit in a session is recorded.
 */
export function captureSource(): VisitSource {
  if (typeof window === "undefined") return EMPTY;

  const existing = readSource();
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const ref = document.referrer || "";

  // A referrer on our own domain means this is not the first page of the visit
  // (a reload or a back-navigation), so there is no external source to record.
  let referrer: string | null = null;
  if (ref) {
    try {
      const host = new URL(ref).hostname.replace(/^www\./, "");
      const here = window.location.hostname.replace(/^www\./, "");
      if (host !== here) referrer = ref;
    } catch {
      /* malformed referrer — ignore it */
    }
  }

  const source: VisitSource = {
    referrer: clean(referrer),
    utm_source: clean(params.get("utm_source")),
    utm_medium: clean(params.get("utm_medium")),
    utm_campaign: clean(params.get("utm_campaign")),
    landing_path: clean(window.location.pathname),
  };

  try {
    sessionStorage.setItem(KEY, JSON.stringify(source));
  } catch {
    /* private mode or storage blocked — the source is still returned below */
  }

  return source;
}

/** Reads back what captureSource() stored earlier in this session. */
export function readSource(): VisitSource | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<VisitSource>;
    return { ...EMPTY, ...parsed };
  } catch {
    return null;
  }
}

export type SourceKind =
  /** Arrived through someone else's shared attendee card. */
  | { kind: "shared" }
  /** No referrer at all: typed the address, or came from an app that strips it. */
  | { kind: "direct" }
  /** A recognised channel, or the bare hostname when it is not one we know. */
  | { kind: "named"; label: string };

/**
 * Turns a stored referrer/UTM pair into something readable in the admin table.
 * UTM tags win when present, because they are deliberate and never stripped.
 */
export function sourceLabel(row: {
  referrer?: string | null;
  utm_source?: string | null;
  referred_by?: string | null;
}): SourceKind {
  if (row.referred_by) return { kind: "shared" };
  if (row.utm_source) return { kind: "named", label: row.utm_source };

  const ref = row.referrer;
  if (!ref) return { kind: "direct" };

  let host: string;
  try {
    host = new URL(ref).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return { kind: "named", label: ref.slice(0, 40) };
  }

  const known: Record<string, string> = {
    "linkedin.com": "LinkedIn",
    "lnkd.in": "LinkedIn",
    "facebook.com": "Facebook",
    "l.facebook.com": "Facebook",
    "m.facebook.com": "Facebook",
    "instagram.com": "Instagram",
    "l.instagram.com": "Instagram",
    "t.co": "X / Twitter",
    "x.com": "X / Twitter",
    "twitter.com": "X / Twitter",
    "google.com": "Google",
    "google.jo": "Google",
    "bing.com": "Bing",
    "youtube.com": "YouTube",
    "whatsapp.com": "WhatsApp",
    "web.whatsapp.com": "WhatsApp",
    "t.me": "Telegram",
    "mail.google.com": "Gmail",
    "outlook.live.com": "Outlook",
    "outlook.office.com": "Outlook",
  };

  return { kind: "named", label: known[host] ?? host };
}

/** Builds a tagged link for a specific channel, so attribution never relies on the referrer. */
export function utmLink(
  base: string,
  opts: { source: string; medium?: string; campaign?: string }
): string {
  const url = new URL(base);
  url.searchParams.set("utm_source", opts.source);
  if (opts.medium) url.searchParams.set("utm_medium", opts.medium);
  url.searchParams.set("utm_campaign", opts.campaign ?? "ceremony2026");
  return url.toString();
}
