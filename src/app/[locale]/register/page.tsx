"use client";

import { Suspense, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Modal from "@/components/Modal";
import RegisterForm from "@/components/RegisterForm";
import { SUMMIT } from "@/lib/summit";

function RegisterPageInner() {
  const t = useTranslations("registerPage");
  const locale = useLocale();
  const isAr = locale === "ar";
  const ceremonyPoints = t.raw("ceremonyPoints") as string[];
  const trainingPoints = t.raw("trainingPoints") as string[];
  const [open, setOpen] = useState<"ceremony" | null>(null);

  const eventFacts = [
    {
      label: t("dateLabel"),
      value: isAr
        ? `${SUMMIT.weekdayAr} ${SUMMIT.dateAr}`
        : `${SUMMIT.weekdayEn}, ${SUMMIT.dateEn}`,
    },
    { label: t("timeLabel"), value: isAr ? SUMMIT.timeRangeAr : SUMMIT.timeRangeEn },
    { label: t("venueLabel"), value: isAr ? SUMMIT.venueAr : SUMMIT.venueEn },
  ];

  return (
    <>
      <section className="border-t-4 border-red bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
            {t("eyebrow")}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl sm:leading-[0.95] lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
            {t("heroBody")}
          </p>

          <dl className="mt-10 grid max-w-3xl grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {eventFacts.map((fact) => (
              <div key={fact.label} className="bg-surface px-6 py-5">
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {fact.label}
                </dt>
                <dd className="mt-2 font-display text-lg font-bold text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t("chooseYourPath")}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line lg:grid-cols-2">
          <div className="bg-surface px-8 py-10 sm:px-12 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-dark">
              {t("option01")}
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold">{t("closingCeremony")}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
              {t("ceremonyBody")}
            </p>
            <ul className="mt-6 space-y-2">
              {ceremonyPoints.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">
              <span className="font-semibold">{t("whatYouNeed")}:</span> {t("ceremonyRequirements")}
            </p>
            <button
              type="button"
              onClick={() => setOpen("ceremony")}
              className="mt-8 flex w-full items-center justify-between rounded-sm bg-red px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
            >
              {t("registerForCeremony")}
              <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span>
            </button>
          </div>

          <div className="bg-paper px-8 py-10 sm:px-12 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-dark">
              {t("option02")}
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold">{t("trainingProgram")}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
              {t("trainingBody")}
            </p>
            <ul className="mt-6 space-y-2">
              {trainingPoints.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-sm border border-line bg-surface px-6 py-5">
              <p className="text-sm font-semibold text-fg">{t("trainingClosedTitle")}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                {t("trainingClosedBody")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {open && (
        <Modal title={t("registerForCeremony")} onClose={() => setOpen(null)}>
          <RegisterForm type={open} onClose={() => setOpen(null)} />
        </Modal>
      )}
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  );
}
