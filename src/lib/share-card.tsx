/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- these
   elements are rendered by Satori into a PNG, not into the DOM, so next/image
   does not apply and alt text has nowhere to go. */
import { readFileSync } from "fs";
import { join } from "path";
import { SUMMIT } from "@/lib/summit";

/**
 * The personalised LinkedIn share card.
 *
 * Rendered with Satori (via next/og), which has one behaviour that shapes this
 * whole file: it lays words out left to right regardless of script, and
 * ignores `direction: rtl` entirely. Letter shaping within a word is correct,
 * so the fix is to stop handing Satori multi-word Arabic strings at all.
 *
 * `Line` below renders each word as its own element inside a `row-reverse`
 * flex row. The first word lands on the right, the gaps are set explicitly
 * rather than left to the font's space glyph, and nothing can wrap, so a long
 * line shrinks instead of breaking into scrambled rows. Reversing the string
 * itself would work until the text wrapped, and would silently break the next
 * time somebody edited the copy.
 */

const ASSETS = join(process.cwd(), "src/assets");

function asset(file: string) {
  return readFileSync(join(ASSETS, file));
}

export function loadFonts() {
  return [
    { name: "Grotesk", data: asset("fonts/grotesk-700.woff"), weight: 700 as const, style: "normal" as const },
    { name: "Grotesk", data: asset("fonts/grotesk-400.woff"), weight: 400 as const, style: "normal" as const },
    { name: "Tajawal", data: asset("fonts/tajawal-700.woff"), weight: 700 as const, style: "normal" as const },
    { name: "Tajawal", data: asset("fonts/tajawal-400.woff"), weight: 400 as const, style: "normal" as const },
  ];
}

function dataUri(file: string) {
  return `data:image/png;base64,${asset(file).toString("base64")}`;
}

const ARABIC = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;

export function hasArabic(text: string) {
  return ARABIC.test(text);
}

/**
 * One line of text. In Arabic each word becomes its own element laid out in a
 * `row-reverse` flex row, which puts the words in the right visual order with
 * spacing we control; in English it is a plain string.
 */
function Line({
  text,
  rtl,
  gap = 0.17,
  style = {},
}: {
  text: string;
  rtl: boolean;
  /** Word gap as a fraction of the font size. */
  gap?: number;
  style?: React.CSSProperties;
}) {
  const clean = text.trim().replace(/\s+/g, " ");

  if (!rtl) {
    return <div style={{ display: "flex", whiteSpace: "nowrap", ...style }}>{clean}</div>;
  }

  const words = clean.split(" ");
  const size = typeof style.fontSize === "number" ? style.fontSize : 16;
  const space = Math.round(size * gap);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "baseline",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {words.map((word, i) => (
        <div
          key={`${word}-${i}`}
          style={{ display: "flex", marginLeft: i === words.length - 1 ? 0 : space }}
        >
          {word}
        </div>
      ))}
    </div>
  );
}

/** Keep one very long name from blowing out the layout. */
function clampName(name: string, max = 34) {
  const clean = name.trim().replace(/\s+/g, " ");
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

const C = {
  ink: "#05070d",
  body: "#44485a",
  muted: "#7a7f90",
  faint: "#9aa0ae",
  line: "#dcdfe8",
  rule: "#e4e6ed",
  paper: "#f7f7fa",
  white: "#ffffff",
  cyan: "#0e7c90",
  pink: "#ff3d9a",
};

export function shareCard(name: string, locale: string) {
  const isAr = locale === "ar";
  const font = isAr ? "Tajawal" : "Grotesk";

  const displayName = clampName(name);
  const nameSize = displayName.length > 22 ? 54 : displayName.length > 16 ? 64 : 72;

  const copy = isAr
    ? {
        eyebrow: "القمة العربية لمهارات الاقتصاد الرقمي",
        attending: "حضور مؤكّد",
        event: "الحفل الختامي والحوار الوطني",
        sub: "الذكاء الاصطناعي لخلق فرص العمل في الأردن",
        labels: ["التاريخ", "الوقت", "المكان"],
        values: [
          `${SUMMIT.weekdayAr} ${SUMMIT.dateAr}`,
          SUMMIT.timeRangeAr,
          SUMMIT.venueAr,
        ],
        partners: "بالشراكة مع",
      }
    : {
        eyebrow: "THE ARAB SUMMIT FOR DIGITAL ECONOMY SKILLS",
        attending: "IS ATTENDING",
        event: "Closing Ceremony & National Dialogue",
        sub: "AI for job creation in Jordan",
        labels: ["DATE", "TIME", "VENUE"],
        values: [
          `${SUMMIT.weekdayEn} ${SUMMIT.dateEn}`,
          SUMMIT.timeRangeEn,
          SUMMIT.venueEn,
        ],
        partners: "IN PARTNERSHIP WITH",
      };

  // The name may be Arabic even on an English card, or the reverse, so each
  // line decides its own direction from its own content.
  const nameRtl = hasArabic(displayName) && !/[A-Za-z]/.test(displayName);

  const row = isAr ? ("row-reverse" as const) : ("row" as const);
  const align = isAr ? ("flex-end" as const) : ("flex-start" as const);
  const track = isAr ? 0 : 2;
  const edge = (ltr: number | string, rtl: number | string) => (isAr ? rtl : ltr);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: C.paper,
        fontFamily: font,
      }}
    >
      <div style={{ display: "flex", height: 10, width: "100%" }}>
        <div style={{ display: "flex", width: "58%", backgroundColor: "#22d3ee" }} />
        <div style={{ display: "flex", width: "42%", backgroundColor: C.pink }} />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: align,
          padding: "0 56px",
        }}
      >
        <div style={{ display: "flex", flexDirection: row, alignItems: "center" }}>
          <img src={dataUri("logos/mountaliq.png")} height={66} />
          <Line
            text={copy.eyebrow}
            rtl={isAr}
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: C.cyan,
              letterSpacing: track,
              marginLeft: edge(20, 0),
              marginRight: edge(0, 20),
              paddingLeft: edge(20, 0),
              paddingRight: edge(0, 20),
              borderLeft: edge(`1px solid ${C.line}`, "none"),
              borderRight: edge("none", `1px solid ${C.line}`),
            }}
          />
        </div>

        <Line
          text={displayName}
          rtl={nameRtl}
          gap={0.15}
          style={{
            marginTop: 24,
            fontSize: nameSize,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: isAr ? 0 : -1.5,
          }}
        />

        <div style={{ display: "flex", flexDirection: row, alignItems: "center", marginTop: 14 }}>
          <Line
            text={copy.attending}
            rtl={isAr}
            style={{
              backgroundColor: C.pink,
              color: C.white,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: track,
              padding: "8px 16px",
            }}
          />
          <Line
            text={copy.event}
            rtl={isAr}
            style={{
              fontSize: 29,
              fontWeight: 700,
              color: C.ink,
              marginLeft: edge(16, 0),
              marginRight: edge(0, 16),
            }}
          />
        </div>

        <Line
          text={copy.sub}
          rtl={isAr}
          style={{ marginTop: 12, fontSize: 22, color: C.body }}
        />

        <div style={{ display: "flex", flexDirection: row, marginTop: 26 }}>
          {copy.labels.map((label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: align,
                marginLeft: edge(i === 0 ? 0 : 26, 0),
                marginRight: edge(0, i === 0 ? 0 : 26),
                paddingLeft: edge(i === 0 ? 16 : 26, 0),
                paddingRight: edge(0, i === 0 ? 16 : 26),
                borderLeft: edge(
                  i === 0 ? `5px solid ${C.pink}` : `1px solid ${C.line}`,
                  "none"
                ),
                borderRight: edge(
                  "none",
                  i === 0 ? `5px solid ${C.pink}` : `1px solid ${C.line}`
                ),
              }}
            >
              <Line
                text={label}
                rtl={isAr}
                style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: track }}
              />
              <Line
                text={copy.values[i]}
                rtl={isAr}
                style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginTop: 6 }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: row,
          alignItems: "center",
          height: 140,
          padding: "0 56px",
          backgroundColor: C.white,
          borderTop: `1px solid ${C.rule}`,
        }}
      >
        <Line
          text={copy.partners}
          rtl={isAr}
          style={{ fontSize: 13, fontWeight: 700, color: C.faint, letterSpacing: track }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: row,
            alignItems: "center",
            flex: 1,
            justifyContent: "space-around",
          }}
        >
          <img src={dataUri("logos/modee.png")} height={108} />
          <img src={dataUri("logos/bromine.png")} height={108} />
          <img src={dataUri("logos/replit.png")} height={36} />
        </div>
      </div>
    </div>
  );
}
