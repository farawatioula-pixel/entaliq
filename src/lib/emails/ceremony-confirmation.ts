import { SUMMIT, linkedInShareUrl, shareCardUrl } from "@/lib/summit";

/**
 * Confirmation email sent to anyone who registers for the Mountaliq 2026
 * closing ceremony + national dialogue session.
 *
 * Written as table-based HTML with inline styles because that is what email
 * clients (Outlook above all) actually render reliably.
 */

const BRAND_RED = "#E6007E";
const BRAND_CYAN = "#00A9B7";
const INK = "#121212";
const MUTED = "#5C5C5C";
const LINE = "#E4E4E4";

export type CeremonyEmailInput = {
  name: string;
  shareToken: string;
  locale?: string;
};

export function ceremonyConfirmationSubject(locale: string = "en"): string {
  return locale === "ar"
    ? `تأكيد التسجيل — منطلق ٢٠٢٦، ${SUMMIT.dateShortAr}`
    : `You're registered — Mountaliq 2026, ${SUMMIT.dateShortEn}`;
}

export function ceremonyConfirmationText({
  name,
  shareToken,
  locale = "en",
}: CeremonyEmailInput): string {
  const share = linkedInShareUrl(shareToken, locale);
  const card = shareCardUrl(shareToken, locale);

  if (locale === "ar") {
    return [
      `مرحبًا ${name}،`,
      "",
      "تم تأكيد تسجيلك في الحفل الختامي وجلسة الحوار الوطني حول الذكاء الاصطناعي لخلق فرص العمل في الأردن.",
      "",
      `التاريخ: ${SUMMIT.weekdayAr} ${SUMMIT.dateAr}`,
      `الوقت: ${SUMMIT.timeRangeAr}`,
      `المكان: ${SUMMIT.venueAr}، ${SUMMIT.cityAr}`,
      "",
      "شارك حضورك على لينكدإن وادعُ شبكتك للتسجيل:",
      share,
      "",
      "أو نزّل بطاقتك وانشرها كصورة:",
      card,
      "",
      "نراك هناك،",
      "فريق منطلق",
    ].join("\n");
  }

  return [
    `Hi ${name},`,
    "",
    "You're registered for the Mountaliq 2026 closing ceremony and national dialogue session on AI for job creation in Jordan.",
    "",
    `Date: ${SUMMIT.weekdayEn}, ${SUMMIT.dateEn}`,
    `Time: ${SUMMIT.timeRangeEn}`,
    `Venue: ${SUMMIT.venueEn}, ${SUMMIT.cityEn}`,
    "",
    "Share that you're attending on LinkedIn and invite your network to register:",
    share,
    "",
    "Or download your card and post it as an image:",
    card,
    "",
    "See you there,",
    "The Mountaliq team",
  ].join("\n");
}

export function ceremonyConfirmationHtml({
  name,
  shareToken,
  locale = "en",
}: CeremonyEmailInput): string {
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const align = isAr ? "right" : "left";
  const share = linkedInShareUrl(shareToken, locale);
  const card = shareCardUrl(shareToken, locale);

  const copy = isAr
    ? {
        preheader: `${SUMMIT.weekdayAr} ${SUMMIT.dateAr} · ${SUMMIT.venueAr}`,
        eyebrow: "تم تأكيد التسجيل",
        heading: "أنت مسجّل",
        greeting: `مرحبًا ${name}،`,
        intro:
          "تم تأكيد مقعدك في الحفل الختامي وجلسة الحوار الوطني حول الذكاء الاصطناعي لخلق فرص العمل في الأردن.",
        dateLabel: "التاريخ",
        dateValue: `${SUMMIT.weekdayAr} ${SUMMIT.dateAr}`,
        timeLabel: "الوقت",
        timeValue: SUMMIT.timeRangeAr,
        venueLabel: "المكان",
        venueValue: `${SUMMIT.venueAr}، ${SUMMIT.cityAr}`,
        shareHeading: "أخبر شبكتك",
        shareBody:
          "شارك حضورك على لينكدإن. سيحصل من يرى منشورك على رابط للتسجيل والانضمام إليك.",
        shareCta: "المشاركة على لينكدإن",
        downloadCard: "تنزيل البطاقة لنشرها كصورة",
        signOff: "نراك هناك،",
        team: "فريق منطلق",
      }
    : {
        preheader: `${SUMMIT.weekdayEn}, ${SUMMIT.dateEn} · ${SUMMIT.venueEn}`,
        eyebrow: "Registration confirmed",
        heading: "You're registered",
        greeting: `Hi ${name},`,
        intro:
          "Your seat is confirmed for the Mountaliq 2026 closing ceremony and national dialogue session on AI for job creation in Jordan.",
        dateLabel: "Date",
        dateValue: `${SUMMIT.weekdayEn}, ${SUMMIT.dateEn}`,
        timeLabel: "Time",
        timeValue: SUMMIT.timeRangeEn,
        venueLabel: "Venue",
        venueValue: `${SUMMIT.venueEn}, ${SUMMIT.cityEn}`,
        shareHeading: "Tell your network",
        shareBody:
          "Share that you're attending on LinkedIn. Anyone who sees your post gets a link to register and join you.",
        shareCta: "Share on LinkedIn",
        downloadCard: "Download your card to post as an image",
        signOff: "See you there,",
        team: "The Mountaliq team",
      };

  const detailRow = (label: string, value: string) => `
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid ${LINE};">
                  <div style="font:600 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">${label}</div>
                  <div style="font:700 17px/1.4 Arial,Helvetica,sans-serif;color:${INK};padding-top:4px;">${value}</div>
                </td>
              </tr>`;

  return `<!doctype html>
<html lang="${isAr ? "ar" : "en"}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${copy.heading}</title>
</head>
<body style="margin:0;padding:0;background:#F4F5F7;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${copy.preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F5F7;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:560px;background:#FFFFFF;border:1px solid ${LINE};border-radius:4px;" dir="${dir}">

          <tr><td style="height:4px;background:${BRAND_CYAN};font-size:0;line-height:0;">&nbsp;</td></tr>

          <tr>
            <td style="padding:36px 36px 8px 36px;text-align:${align};">
              <div style="font:600 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:2px;text-transform:uppercase;color:${BRAND_CYAN};">
                ${copy.eyebrow}
              </div>
              <h1 style="margin:14px 0 0 0;font:700 30px/1.2 Arial,Helvetica,sans-serif;color:${INK};">
                ${copy.heading}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 36px 0 36px;text-align:${align};">
              <p style="margin:0 0 14px 0;font:400 16px/1.6 Arial,Helvetica,sans-serif;color:${INK};">${copy.greeting}</p>
              <p style="margin:0;font:400 15px/1.65 Arial,Helvetica,sans-serif;color:${MUTED};">${copy.intro}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 36px 0 36px;text-align:${align};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${detailRow(copy.dateLabel, copy.dateValue)}
${detailRow(copy.timeLabel, copy.timeValue)}
${detailRow(copy.venueLabel, copy.venueValue)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 36px 0 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#F4FBFC;border:1px solid ${BRAND_CYAN};border-radius:4px;">
                <tr>
                  <td style="padding:22px;text-align:${align};">
                    <div style="font:700 16px/1.4 Arial,Helvetica,sans-serif;color:${INK};">${copy.shareHeading}</div>
                    <p style="margin:8px 0 16px 0;font:400 14px/1.6 Arial,Helvetica,sans-serif;color:${MUTED};">
                      ${copy.shareBody}
                    </p>
                    <img src="${card}" alt="" width="460" style="display:block;width:100%;max-width:460px;height:auto;border:1px solid ${LINE};border-radius:3px;margin:0 0 16px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#0A66C2;border-radius:3px;">
                          <a href="${share}"
                             style="display:inline-block;padding:13px 26px;font:700 15px/1 Arial,Helvetica,sans-serif;color:#FFFFFF;text-decoration:none;">
                            ${copy.shareCta}
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:14px 0 0 0;font:400 13px/1.5 Arial,Helvetica,sans-serif;">
                      <a href="${card}" style="color:${BRAND_CYAN};text-decoration:underline;">${copy.downloadCard}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 36px 36px 36px;text-align:${align};">
              <p style="margin:0;font:400 15px/1.6 Arial,Helvetica,sans-serif;color:${INK};">${copy.signOff}</p>
              <p style="margin:2px 0 0 0;font:700 15px/1.6 Arial,Helvetica,sans-serif;color:${BRAND_RED};">${copy.team}</p>
            </td>
          </tr>

        </table>

        <div style="max-width:560px;padding:16px 8px 0 8px;font:400 12px/1.5 Arial,Helvetica,sans-serif;color:#8A8A8A;text-align:center;">
          Mountaliq 2026 · ${isAr ? SUMMIT.cityAr : SUMMIT.cityEn}
        </div>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
