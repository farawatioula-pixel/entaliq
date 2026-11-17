/**
 * Single source of truth for the Mountaliq 2026 closing ceremony details.
 * The site copy, the registration form, and the confirmation email all read
 * from here so the date and venue can never drift apart between them.
 */

/**
 * Mountaliq 2026 runs across three days:
 *   Fri 20 + Sat 21 November — full-day training, seminars and activities.
 *                              Registration for these has closed.
 *   Sun 29 November          — closing ceremony and national dialogue.
 *                              This is the one still open for registration.
 */
export const SUMMIT = {
  /** The two training days, registration closed. */
  training: {
    startISO: "2026-11-20",
    endISO: "2026-11-21",
    rangeEn: "Fri 20 – Sat 21 November 2026",
    rangeShortEn: "Nov 20 – 21",
    rangeAr: "الجمعة ٢٠ – السبت ٢١ تشرين الثاني ٢٠٢٦",
    rangeShortAr: "٢٠ – ٢١ تشرين الثاني",
    day1En: "Friday 20 November",
    day2En: "Saturday 21 November",
    day1Ar: "الجمعة ٢٠ تشرين الثاني",
    day2Ar: "السبت ٢١ تشرين الثاني",
  },

  /** The closing ceremony, open for registration. */
  dateISO: "2026-11-29",
  weekdayEn: "Sunday",
  dateEn: "29 November 2026",
  dateShortEn: "Sun, Nov 29",
  weekdayAr: "الأحد",
  dateAr: "٢٩ تشرين الثاني ٢٠٢٦",
  dateShortAr: "الأحد ٢٩ تشرين الثاني",
  startTime: "10:00",
  endTime: "13:00",
  timeRangeEn: "10:00 AM – 1:00 PM",
  timeRangeAr: "١٠:٠٠ صباحاً – الواحدة ظهراً",

  venueEn: "Hilton Amman Hotel",
  venueAr: "فندق هيلتون عمّان",
  cityEn: "Amman, Jordan",
  cityAr: "عمّان، الأردن",
} as const;

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return "https://mountaliq.com";
}

/**
 * The link a sharer hands to their network. Points at /join/<token> rather
 * than straight at the register page, because that route carries the sharer's
 * own personalised card as its Open Graph image.
 */
export function referralUrl(shareToken: string, locale: string = "en"): string {
  return `${siteUrl()}/${locale}/join/${encodeURIComponent(shareToken)}`;
}

/** Direct link to a registrant's personalised card, for downloading. */
export function shareCardUrl(shareToken: string, locale: string = "en"): string {
  return `${siteUrl()}/api/og/${encodeURIComponent(shareToken)}?locale=${locale}`;
}

/**
 * LinkedIn share link that opens the composer with the post text already
 * filled in. LinkedIn dropped the old `summary`/`title` parameters from
 * `shareArticle`; `/feed/?shareActive=true&text=` is the form that still
 * pre-fills text, so we put the registration URL inside the text itself.
 */
export function linkedInShareUrl(shareToken: string, locale: string = "en"): string {
  const url = referralUrl(shareToken, locale);

  const text =
    locale === "ar"
      ? `سأحضر الحفل الختامي وجلسة الحوار الوطني حول الذكاء الاصطناعي لخلق فرص العمل في الأردن — منطلق ٢٠٢٦، ${SUMMIT.dateShortAr}، ${SUMMIT.venueAr}.\n\nسجّل حضورك هنا: ${url}`
      : `I will be attending the closing ceremony and national dialogue session on AI for job creation in Jordan — Mountaliq 2026, ${SUMMIT.weekdayEn} ${SUMMIT.dateEn}, ${SUMMIT.venueEn}.\n\nRegister to join here: ${url}`;

  return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
}
