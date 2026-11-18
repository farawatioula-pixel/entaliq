"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SUMMIT } from "@/lib/summit";

const SIZE = 1200;
const INK = "#05070D";
const CYAN = "#22D3EE";
const MAGENTA = "#FF3D9A";
const VIOLET = "#8B5CF6";
const WHITE = "#F4F6FB";
const FOG = "#8B93A7";

const VOLT = "#D4F547";
const COLLAGE = ["/card/photo-3.jpg", "/card/photo-1.jpg", "/card/photo-2.jpg"];

/** Draws an image cropped to fill the box (like CSS object-fit: cover). */
function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, focusY = 0.4) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.width - sw) / 2;
  const sy = Math.max(0, (img.height - sh) * focusY);
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** The Mountaliq screen mascot, drawn as line art. (x, y) is the screen's top-left corner. */
function mascot(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, alpha: number) {
  const h = w * 0.68;
  const line = w * 0.07;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = line;
  roundRect(ctx, x, y, w, h, w * 0.1);
  ctx.stroke();
  // eyes: two corner brackets and a pink dot
  ctx.lineWidth = line * 0.7;
  const bx = x + w * 0.22;
  const by = y + h * 0.28;
  const s = w * 0.12;
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(bx + s, by);
  ctx.lineTo(bx + s, by + s);
  ctx.stroke();
  const ex = x + w * 0.66;
  const ey = y + h * 0.5;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex, ey + s);
  ctx.lineTo(ex + s, ey + s);
  ctx.stroke();
  ctx.fillStyle = MAGENTA;
  ctx.beginPath();
  ctx.arc(x + w * 0.5, y + h * 0.52, w * 0.065, 0, Math.PI * 2);
  ctx.fill();
  // legs
  const legW = w * 0.1;
  const legH = w * 0.2;
  ctx.fillStyle = VIOLET;
  roundRect(ctx, x + w * 0.3, y + h + line * 0.9, legW, legH, legW * 0.2);
  ctx.fill();
  ctx.fillStyle = MAGENTA;
  roundRect(ctx, x + w * 0.6, y + h + line * 0.9, legW, legH, legW * 0.2);
  ctx.fill();
  ctx.restore();
}

const LOGOS = [
  "/partners/mixed-sources.png",
  "/partners/bromine-jordan.png",
  "/partners/replit.svg",
  "/partners/modee.png",
];

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function cssFont(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.body).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

/** Shrinks the font until the text fits the given width. */
function fitText(ctx: CanvasRenderingContext2D, text: string, weight: number, start: number, family: string, maxWidth: number) {
  let size = start;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    size -= 2;
  } while (ctx.measureText(text).width > maxWidth && size > 20);
}

export default function AttendeeCard({
  defaultName = "",
  shareToken = null,
}: {
  defaultName?: string;
  shareToken?: string | null;
}) {
  const t = useTranslations("attendeeCard");
  const locale = useLocale();
  const isAr = locale === "ar";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState(defaultName);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [assets, setAssets] = useState<{
    icon: HTMLImageElement | null;
    logos: (HTMLImageElement | null)[];
    collage: (HTMLImageElement | null)[];
  } | null>(null);
  const [canShareFile, setCanShareFile] = useState(false);
  const [li, setLi] = useState<{ enabled: boolean; connected: boolean }>({ enabled: false, connected: false });
  const joinUrl = `https://mountaliq.com/${locale}/register${shareToken ? `?ref=${encodeURIComponent(shareToken)}` : ""}`;
  const [sharing, setSharing] = useState<"idle" | "working">("idle");
  const [ready, setReady] = useState(false);
  const [preparedLink, setPreparedLink] = useState<string | null>(null);
  const autoShareRef = useRef(false);
  // Link to this person's card page (its preview picture is the card), prepared before they tap Share.
  const cardLinkRef = useRef<{ key: string; link: Promise<string | null> } | null>(null);

  useEffect(() => {
    fetch("/api/linkedin/me")
      .then((r) => r.json())
      .then((data: { enabled: boolean; connected: boolean; name?: string; hasPhoto?: boolean }) => {
        setLi({ enabled: data.enabled, connected: data.connected });
        if (!data.connected) return;
        if (data.name) setName((current) => current || data.name || "");
        const params = new URLSearchParams(window.location.search);
        autoShareRef.current = params.get("share") === "1";
        if (autoShareRef.current) {
          params.delete("share");
          const qs = params.toString();
          window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
        }
        const photoReady = data.hasPhoto
          ? loadImage("/api/linkedin/photo").then((img) => {
              if (img) setPhoto(img);
            })
          : Promise.resolve();
        photoReady.then(() => {
          if (!autoShareRef.current) return;
          autoShareRef.current = false;
          if (isMobileShare()) {
            setReady(true);
            return;
          }
          // Desktop: give the card a moment to redraw with the LinkedIn photo, then share.
          setTimeout(() => goToLinkedIn(), 1200);
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    Promise.all([
      loadImage("/logo-icon.png"),
      Promise.all(LOGOS.map(loadImage)),
      Promise.all(COLLAGE.map(loadImage)),
    ]).then(([icon, logos, collage]) => setAssets({ icon, logos, collage }));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !assets) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const display = isAr ? cssFont("--font-arabic", "Tahoma, sans-serif") : cssFont("--font-display", "Arial, sans-serif");
    const body = isAr ? display : cssFont("--font-body", "Arial, sans-serif");
    ctx.direction = isAr ? "rtl" : "ltr";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    // Mirror horizontal positions for Arabic so the layout reads right to left.
    const X = (x: number, w = 0) => (isAr ? SIZE - x - w : x);
    const start = isAr ? "right" : "left";
    const bandTop = 1000;

    // 1. Photo collage on the far side.
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, SIZE, SIZE);
    const [big, top2, bottom2] = assets.collage;
    const gx = 470;
    if (big) cover(ctx, big, X(gx, SIZE - gx), 0, SIZE - gx, 500, 0.45);
    if (top2) cover(ctx, top2, X(gx, 365), 500, 365, bandTop - 500, 0.35);
    if (bottom2) cover(ctx, bottom2, X(gx + 365, SIZE - gx - 365), 500, SIZE - gx - 365, bandTop - 500, 0.35);
    ctx.fillStyle = INK;

    // 2. Brand wash: solid ink behind the text, fading into a magenta-violet tint over the photos.
    ctx.fillStyle = "rgba(5,7,13,0.45)";
    ctx.fillRect(0, 0, SIZE, bandTop);
    const wash = ctx.createLinearGradient(X(0), 0, X(SIZE), 0);
    wash.addColorStop(0, "rgba(5,7,13,1)");
    wash.addColorStop(0.38, "rgba(5,7,13,0.97)");
    wash.addColorStop(0.6, "rgba(40,16,70,0.72)");
    wash.addColorStop(1, "rgba(120,30,110,0.5)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, SIZE, bandTop);
    const bottomFade = ctx.createLinearGradient(0, 560, 0, bandTop);
    bottomFade.addColorStop(0, "rgba(5,7,13,0)");
    bottomFade.addColorStop(1, "rgba(5,7,13,0.85)");
    ctx.fillStyle = bottomFade;
    ctx.fillRect(0, 560, SIZE, bandTop - 560);

    // Brand elements over the photos: a large mascot, the roll-up colour stripe and a few accents.
    mascot(ctx, X(880, 250), 340, 250, 0.6);
    const stripe = [CYAN, VIOLET, MAGENTA, CYAN, VIOLET, MAGENTA, VOLT];
    const segW = SIZE / stripe.length;
    stripe.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(i * segW, 0, segW + 1, 12);
    });
    ctx.save();
    ctx.globalAlpha = 0.85;
    const accents: [number, number, number, string][] = [
      [1110, 210, 26, VOLT],
      [1040, 160, 14, CYAN],
      [640, 940, 18, MAGENTA],
      [1130, 900, 20, VIOLET],
    ];
    accents.forEach(([ax, ay, size, color]) => {
      ctx.fillStyle = color;
      roundRect(ctx, X(ax, size), ay, size, size, size * 0.25);
      ctx.fill();
    });
    ctx.strokeStyle = "rgba(34,211,238,0.35)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(X(1005), 450, 190, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3. Brand mark and date.
    const pad = 64;
    if (assets.icon) ctx.drawImage(assets.icon, X(pad, 84), 56, 84, 84);
    ctx.textAlign = start;
    ctx.textBaseline = "middle";
    ctx.fillStyle = WHITE;
    ctx.font = `800 40px ${display}`;
    ctx.fillText(isAr ? "منطلق ٢٠٢٦" : "MOUNTALIQ 2026", X(pad + 104), 86);
    ctx.fillStyle = FOG;
    ctx.font = `600 24px ${body}`;
    ctx.fillText(
      isAr ? `${SUMMIT.dateShortAr} · ${SUMMIT.venueAr}` : `SUN 29 NOV 2026 · HILTON AMMAN`,
      X(pad + 104),
      124,
    );

    // 4. Highlighted eyebrow, then the headline.
    const colW = 600;
    ctx.font = `800 ${isAr ? 40 : 34}px ${display}`;
    const eyebrow = t("cardEyebrow");
    const ew = ctx.measureText(eyebrow).width + 40;
    ctx.fillStyle = VOLT;
    roundRect(ctx, X(pad, ew), 196, ew, 62, 6);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.fillText(eyebrow, X(pad + 20), 228);

    ctx.textBaseline = "alphabetic";
    const lines: [string, string][] = isAr
      ? [["القمة العربية", WHITE], ["لمهارات", WHITE], ["الاقتصاد الرقمي", VOLT]]
      : [["THE ARAB SUMMIT", WHITE], ["FOR DIGITAL", WHITE], ["ECONOMY SKILLS", VOLT]];
    let y = 340;
    for (const [line, color] of lines) {
      ctx.fillStyle = color;
      fitText(ctx, line, 800, isAr ? 84 : 76, display, colW - pad);
      ctx.fillText(line, X(pad), y);
      y += isAr ? 96 : 84;
    }

    // 5. Photo circle bleeding off the edge, like a badge.
    const r = 160;
    const cx = X(210);
    const cy = 790;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 14, 0, Math.PI * 2);
    const ring = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    ring.addColorStop(0, CYAN);
    ring.addColorStop(0.5, VIOLET);
    ring.addColorStop(1, MAGENTA);
    ctx.fillStyle = ring;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    if (photo) {
      cover(ctx, photo, cx - r, cy - r, r * 2, r * 2, 0.3);
    } else {
      ctx.fillStyle = "#1A2236";
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.fillStyle = FOG;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 28px ${body}`;
      ctx.fillText(t("photoPlaceholder"), cx + (isAr ? -40 : 40), cy);
    }
    ctx.restore();

    // 6. Name and call to action beside the photo.
    const nx = 410;
    const nameMax = 520;
    ctx.textAlign = start;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = WHITE;
    const shownName = name.trim() || t("namePlaceholder");
    fitText(ctx, shownName, 800, 58, display, nameMax);
    ctx.fillText(shownName, X(nx), 770);
    ctx.fillStyle = CYAN;
    ctx.font = `600 26px ${body}`;
    ctx.fillText(isAr ? "مشارك في منطلق ٢٠٢٦" : "Taking part in Mountaliq 2026", X(nx), 812);
    ctx.font = `800 30px ${display}`;
    const cta = isAr ? "انضم إلينا  ‹" : "JOIN US  ›";
    const cw = ctx.measureText(cta).width + 56;
    ctx.fillStyle = VOLT;
    roundRect(ctx, X(nx, cw), 846, cw, 64, 32);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.textBaseline = "middle";
    ctx.fillText(cta, X(nx + 28), 879);

    // 7. Partner strip.
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, bandTop, SIZE, SIZE - bandTop);
    const logos = assets.logos.filter((l): l is HTMLImageElement => !!l);
    const slot = SIZE / Math.max(logos.length, 1);
    const ordered = isAr ? [...logos].reverse() : logos;
    ordered.forEach((logo, i) => {
      const maxW = slot - 70;
      const maxH = 130;
      const scale = Math.min(maxW / logo.width, maxH / logo.height);
      const w = logo.width * scale;
      const h = logo.height * scale;
      ctx.drawImage(logo, i * slot + (slot - w) / 2, bandTop + (SIZE - bandTop - h) / 2, w, h);
    });

    canvas.toBlob((blob) => {
      if (!blob || typeof navigator === "undefined" || !navigator.canShare) return;
      const file = new File([blob], "mountaliq-2026.png", { type: "image/png" });
      setCanShareFile(navigator.canShare({ files: [file] }));
    }, "image/png");
  }, [assets, isAr, name, photo, t]);

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(draw);
    } else {
      draw();
    }
  }, [draw]);



  function fileName() {
    const slug = name.trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
    return `mountaliq-2026${slug ? `-${slug}` : ""}.png`;
  }

  function download() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName();
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, "image/png");
  }

  /** On phones, open the share sheet with just the image so "Save Image" puts it in Photos. */
  function saveCard() {
    if (!isMobileShare()) return download();
    canvasRef.current?.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.share({ files: [new File([blob], fileName(), { type: "image/png" })] });
      } catch {
        /* closed the share sheet */
      }
    }, "image/png");
  }

  function shareImage() {
    canvasRef.current?.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], fileName(), { type: "image/png" });
      try {
        await navigator.share({ files: [file], text: t("shareText") });
      } catch {
        /* user closed the share sheet */
      }
    }, "image/png");
  }

  /** A 1200x627 version of the card: the size LinkedIn shows for link previews. */
  function previewBlob(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const card = canvasRef.current;
      if (!card) return resolve(null);
      const W = 1200;
      const H = 627;
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d");
      if (!ctx) return resolve(null);
      const display = isAr ? cssFont("--font-arabic", "Tahoma, sans-serif") : cssFont("--font-display", "Arial, sans-serif");
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, W, H);
      const cardX = isAr ? W - H : 0;
      ctx.drawImage(card, cardX, 0, H, H);
      const textX = isAr ? W - H - 48 : H + 48;
      const maxW = W - H - 96;
      ctx.direction = isAr ? "rtl" : "ltr";
      ctx.textAlign = isAr ? "right" : "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = MAGENTA;
      ctx.font = `700 ${isAr ? 34 : 28}px ${display}`;
      ctx.fillText(t("previewEyebrow"), textX, 190);
      ctx.fillStyle = WHITE;
      fitText(ctx, isAr ? "منطلق ٢٠٢٦" : "Mountaliq 2026", 800, 64, display, maxW);
      ctx.fillText(isAr ? "منطلق ٢٠٢٦" : "Mountaliq 2026", textX, 262);
      ctx.fillStyle = CYAN;
      fitText(ctx, t("previewLine"), 600, 30, display, maxW);
      ctx.fillText(t("previewLine"), textX, 314);
      ctx.fillStyle = FOG;
      ctx.font = `500 26px ${display}`;
      ctx.fillText(isAr ? SUMMIT.dateShortAr : `${SUMMIT.dateShortEn} 2026`, textX, 380);
      ctx.fillText(isAr ? SUMMIT.venueAr : SUMMIT.venueEn, textX, 418);
      ctx.fillStyle = MAGENTA;
      ctx.font = `700 28px ${display}`;
      ctx.fillText("mountaliq.com", textX, 500);
      c.toBlob((b) => resolve(b), "image/png");
    });
  }

  useEffect(() => {
    const reset = () => setSharing("idle");
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  /** Uploads the card and returns its public page link, or null if that fails. */
  async function uploadCardLink(): Promise<string | null> {
    try {
      const blob = await previewBlob();
      if (!blob) return null;
      const body = new FormData();
      body.append("image", blob, "card.png");
      const res = await fetch("/api/card", { method: "POST", body });
      const data = (await res.json()) as { id?: string };
      if (!res.ok || !data.id) return null;
      const qs = new URLSearchParams();
      if (name.trim()) qs.set("n", name.trim());
      if (shareToken) qs.set("r", shareToken);
      return `https://www.mountaliq.com/${locale}/c/${data.id}${qs.toString() ? `?${qs}` : ""}`;
    } catch {
      return null;
    }
  }

  function cardLink(): Promise<string | null> {
    const key = `${name}|${photo?.src ?? ""}|${locale}`;
    if (!cardLinkRef.current || cardLinkRef.current.key !== key) {
      cardLinkRef.current = { key, link: uploadCardLink() };
    }
    return cardLinkRef.current.link;
  }

  // Once the card is finished, prepare its link so a tap on Share opens straight away.
  useEffect(() => {
    if (!li.connected || !assets) return;
    const timer = setTimeout(() => {
      const key = `${name}|${photo?.src ?? ""}|${locale}`;
      if (!cardLinkRef.current || cardLinkRef.current.key !== key) {
        cardLinkRef.current = { key, link: uploadCardLink() };
        cardLinkRef.current.link.then((l) => setPreparedLink(l));
      }
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [li.connected, assets, name, photo, locale]);

  async function goToLinkedIn() {
    setSharing("working");
    setTimeout(() => setSharing("idle"), 8000);
    const link = (await cardLink()) ?? joinUrl;
    // No hosted preview: give them the card file to attach instead.
    if (link === joinUrl) {
      download();
      await new Promise((r) => setTimeout(r, 800));
    }
    const text = `${t("shareText")}\n\n${t("joinText")} ${link}`;
    window.location.href = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
  }

  /** Phones and tablets: the system share sheet can hand the card image straight to the LinkedIn app. */
  function isMobileShare() {
    if (typeof navigator === "undefined" || !navigator.canShare) return false;
    const touch = window.matchMedia?.("(pointer: coarse)").matches;
    return !!touch && navigator.canShare({ files: [new File([""], "x.png", { type: "image/png" })] });
  }

  /** Share the card's link; LinkedIn shows the card as the link's big preview picture, and it opens registration. */
  function shareToApp() {
    if (preparedLink) {
      navigator.share({ text: t("shareText"), url: preparedLink }).catch(() => {});
      return;
    }
    // Link not ready (upload failed or still running): share the image with the caption.
    canvasRef.current?.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], fileName(), { type: "image/png" });
      try {
        await navigator.share({ files: [file], text: t("shareText") });
      } catch {
        /* closed the share sheet */
      }
    }, "image/png");
  }

  function shareOnLinkedIn() {
    if (!li.connected) {
      window.location.href = `/api/linkedin/start?locale=${locale}&share=1`;
      return;
    }
    if (isMobileShare()) shareToApp();
    else goToLinkedIn();
  }

  return (
    <div className="text-start">
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="aspect-square w-full max-w-md rounded-sm border border-line"
        aria-label={t("previewLabel")}
      />

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={saveCard}
          className="inline-flex items-center rounded-sm bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          {t(canShareFile ? "saveToPhotos" : "download")}
        </button>
        {canShareFile && (
          <button
            type="button"
            onClick={shareImage}
            className="inline-flex items-center rounded-sm border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-fg hover:bg-line"
          >
            {t("shareImage")}
          </button>
        )}
      </div>
      {canShareFile && <p className="mt-2 text-sm text-neutral-600">{t("saveHint")}</p>}
      {li.enabled ? (
        <div className="mt-6 rounded-sm border border-cyan-deep bg-cyan/5 p-5">
          <button
            type="button"
            onClick={shareOnLinkedIn}
            disabled={sharing === "working"}
            className="disabled:opacity-60 inline-flex items-center gap-2 rounded-sm bg-[#0A66C2] px-6 py-3 text-[15px] font-semibold text-white hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </svg>
            {sharing === "working" ? t("preparing") : t("connectLinkedin")}
          </button>
          {ready && <p className="mt-3 text-sm font-semibold text-fg">{t("readyMobile")}</p>}
          <p className="mt-2 text-sm text-neutral-600">{t(canShareFile ? "attachHintMobile" : "attachHint")}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-neutral-600">{t("howTo")}</p>
      )}
    </div>
  );
}
