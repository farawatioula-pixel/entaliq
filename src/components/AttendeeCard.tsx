"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SUMMIT } from "@/lib/summit";

const SIZE = 1200;
const INK = "#05070D";
const CYAN = "#22D3EE";
const MAGENTA = "#FF3D9A";
const VIOLET = "#8B5CF6";
const WHITE = "#F4F6FB";
const FOG = "#8B93A7";

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

export default function AttendeeCard({ defaultName = "" }: { defaultName?: string }) {
  const t = useTranslations("attendeeCard");
  const locale = useLocale();
  const isAr = locale === "ar";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState(defaultName);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [assets, setAssets] = useState<{ icon: HTMLImageElement | null; logos: (HTMLImageElement | null)[] } | null>(null);
  const [canShareFile, setCanShareFile] = useState(false);

  useEffect(() => {
    Promise.all([loadImage("/logo-icon.png"), Promise.all(LOGOS.map(loadImage))]).then(([icon, logos]) =>
      setAssets({ icon, logos }),
    );
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !assets) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const display = isAr ? cssFont("--font-arabic", "Tahoma, sans-serif") : cssFont("--font-display", "Arial, sans-serif");
    const body = isAr ? display : cssFont("--font-body", "Arial, sans-serif");
    ctx.direction = isAr ? "rtl" : "ltr";

    // Background with the site's diagonal lines.
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 2;
    for (let x = -SIZE; x < SIZE * 2; x += 46) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + SIZE * 0.45, SIZE);
      ctx.stroke();
    }

    // Brand mark, top corner.
    const iconSize = 92;
    const iconX = isAr ? SIZE - 60 - iconSize : 60;
    if (assets.icon) ctx.drawImage(assets.icon, iconX, 56, iconSize, iconSize);
    ctx.fillStyle = WHITE;
    ctx.textAlign = isAr ? "right" : "left";
    ctx.textBaseline = "middle";
    ctx.font = `700 40px ${display}`;
    ctx.fillText(isAr ? "منطلق ٢٠٢٦" : "Mountaliq 2026", isAr ? iconX - 24 : iconX + iconSize + 24, 102);

    // Eyebrow.
    ctx.textAlign = "center";
    ctx.fillStyle = MAGENTA;
    ctx.font = `700 ${isAr ? 46 : 38}px ${display}`;
    ctx.fillText(t("cardEyebrow"), SIZE / 2, 228);

    // Photo circle.
    const cx = SIZE / 2;
    const cy = 470;
    const r = 190;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 16, 0, Math.PI * 2);
    const ring = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    ring.addColorStop(0, CYAN);
    ring.addColorStop(0.55, VIOLET);
    ring.addColorStop(1, MAGENTA);
    ctx.fillStyle = ring;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    if (photo) {
      const s = Math.min(photo.width, photo.height);
      const sx = (photo.width - s) / 2;
      const sy = Math.max(0, (photo.height - s) * 0.3);
      ctx.drawImage(photo, sx, sy, s, s, cx - r, cy - r, r * 2, r * 2);
    } else {
      ctx.fillStyle = "#0D1220";
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.fillStyle = FOG;
      ctx.font = `500 30px ${body}`;
      ctx.fillText(t("photoPlaceholder"), cx, cy);
    }
    ctx.restore();

    // Name and event details.
    ctx.textAlign = "center";
    ctx.fillStyle = WHITE;
    fitText(ctx, name.trim() || t("namePlaceholder"), 800, 68, display, SIZE - 160);
    ctx.fillText(name.trim() || t("namePlaceholder"), SIZE / 2, 742);

    ctx.fillStyle = CYAN;
    fitText(ctx, t("cardEvent"), 600, 36, display, SIZE - 160);
    ctx.fillText(t("cardEvent"), SIZE / 2, 818);

    ctx.fillStyle = FOG;
    ctx.font = `500 32px ${body}`;
    const details = isAr
      ? `${SUMMIT.dateShortAr} · ${SUMMIT.venueAr}`
      : `${SUMMIT.dateShortEn} 2026 · ${SUMMIT.venueEn}`;
    ctx.fillText(details, SIZE / 2, 872);

    // Partner strip.
    const bandTop = 960;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, bandTop, SIZE, SIZE - bandTop);
    const logos = assets.logos.filter((l): l is HTMLImageElement => !!l);
    const slot = SIZE / Math.max(logos.length, 1);
    const ordered = isAr ? [...logos].reverse() : logos;
    ordered.forEach((logo, i) => {
      const maxW = slot - 70;
      const maxH = 150;
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

  function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    loadImage(url).then((img) => setPhoto(img));
  }

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

  return (
    <div className="text-start">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-fg" htmlFor="card-name">
            {t("nameLabel")}
          </label>
          <input
            id="card-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-fg" htmlFor="card-photo">
            {t("photoLabel")}
          </label>
          <input
            id="card-photo"
            type="file"
            accept="image/*"
            onChange={onPhoto}
            className="block w-full text-sm text-neutral-600 file:me-3 file:rounded-sm file:border file:border-line file:bg-surface file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-fg"
          />
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="mt-6 aspect-square w-full max-w-md rounded-sm border border-line"
        aria-label={t("previewLabel")}
      />

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center rounded-sm bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          {t("download")}
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
      <p className="mt-3 text-sm text-neutral-600">{t("howTo")}</p>
    </div>
  );
}
