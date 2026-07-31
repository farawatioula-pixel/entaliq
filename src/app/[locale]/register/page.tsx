"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Modal from "@/components/Modal";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  const t = useTranslations("registerPage");
  const plenaryPoints = t.raw("plenaryPoints") as string[];
  const trainingPoints = t.raw("trainingPoints") as string[];
  const [open, setOpen] = useState<"plenary" | "training" | null>(null);

  return (
    <>
      <section className="border-t-4 border-red bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
            {t("eyebrow")}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
            {t("heroBody")}
          </p>
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
            <h2 className="mt-4 font-display text-3xl font-bold">{t("plenarySession")}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
              {t("plenaryBody")}
            </p>
            <ul className="mt-6 space-y-2">
              {plenaryPoints.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">
              <span className="font-semibold">{t("whatYouNeed")}:</span> {t("plenaryRequirements")}
            </p>
            <button
              type="button"
              onClick={() => setOpen("plenary")}
              className="mt-8 flex w-full items-center justify-between rounded-sm bg-surface border border-line px-6 py-4 text-[15px] font-semibold text-fg transition-colors hover:bg-line"
            >
              {t("registerForPlenary")}
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
            <p className="mt-6 text-sm">
              <span className="font-semibold">{t("whatYouNeed")}:</span> {t("trainingRequirements")}
            </p>
            <button
              type="button"
              onClick={() => setOpen("training")}
              className="mt-8 flex w-full items-center justify-between rounded-sm bg-red px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
            >
              {t("applyForTraining")}
              <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span>
            </button>
          </div>
        </div>
      </section>

      {open && (
        <Modal
          title={open === "plenary" ? t("registerForPlenary") : t("applyForTraining")}
          onClose={() => setOpen(null)}
        >
          <RegisterForm type={open} onClose={() => setOpen(null)} />
        </Modal>
      )}
    </>
  );
}
