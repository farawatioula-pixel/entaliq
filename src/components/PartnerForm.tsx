"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export default function PartnerForm() {
  const t = useTranslations("partnerForm");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    const nextErrors: Record<string, string> = {};
    if (!String(payload.name || "").trim()) nextErrors.name = t("errors.name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email || ""))) {
      nextErrors.email = t("errors.email");
    }
    if (!String(payload.organisation || "").trim()) {
      nextErrors.organisation = t("errors.organisation");
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "partner", ...payload }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-line bg-surface p-8 text-center">
        <p className="font-display text-xl font-bold text-fg">{t("successTitle")}</p>
        <p className="mt-2 text-[15px] text-neutral-600">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-fg" htmlFor="p-name">
            {t("fullName")}
          </label>
          <input
            id="p-name"
            name="name"
            autoComplete="name"
            className={`w-full rounded-sm border bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-neutral-500 focus:border-red ${
              errors.name ? "border-red" : "border-line"
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-dark">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-fg" htmlFor="p-org">
            {t("organisation")}
          </label>
          <input
            id="p-org"
            name="organisation"
            autoComplete="organization"
            className={`w-full rounded-sm border bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-neutral-500 focus:border-red ${
              errors.organisation ? "border-red" : "border-line"
            }`}
          />
          {errors.organisation && (
            <p className="mt-1 text-sm text-red-dark">{errors.organisation}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-fg" htmlFor="p-email">
          {t("emailAddress")}
        </label>
        <input
          id="p-email"
          name="email"
          type="email"
          autoComplete="email"
          className={`w-full rounded-sm border bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-neutral-500 focus:border-red ${
            errors.email ? "border-red" : "border-line"
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-dark">{errors.email}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-fg" htmlFor="p-message">
          {t("messageLabel")}
        </label>
        <textarea
          id="p-message"
          name="message"
          rows={4}
          placeholder={t("messagePlaceholder")}
          className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-neutral-500 focus:border-red"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-dark">{t("submitError")}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-sm bg-red px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? t("sending") : t("sendInquiry")}
      </button>
    </form>
  );
}
