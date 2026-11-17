"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const inputClass = (hasError: boolean) =>
  `w-full rounded-sm border bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-neutral-500 focus:border-red ${
    hasError ? "border-red" : "border-line"
  }`;

function Label({ htmlFor, children, required }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-fg" htmlFor={htmlFor}>
      {children}
      {required && (
        <span className="ms-1 text-orange-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export default function TrainerForm() {
  const t = useTranslations("trainerForm");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    const nextErrors: Record<string, string> = {};
    if (!String(payload.name || "").trim()) nextErrors.name = t("errors.name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email || ""))) {
      nextErrors.email = t("errors.email");
    }
    if (!String(payload.phone || "").trim()) nextErrors.phone = t("errors.phone");
    if (!String(payload.background || "").trim()) nextErrors.background = t("errors.field");
    if (!String(payload.message || "").trim()) nextErrors.message = t("errors.bio");

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "trainer", locale, ...payload }),
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
          <Label htmlFor="t-name" required>{t("fullName")}</Label>
          <input id="t-name" name="name" autoComplete="name" className={inputClass(!!errors.name)} />
          {errors.name && <p className="mt-1 text-sm text-red-dark">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="t-phone" required>{t("phoneNumber")}</Label>
          <input id="t-phone" name="phone" type="tel" autoComplete="tel" className={inputClass(!!errors.phone)} />
          {errors.phone && <p className="mt-1 text-sm text-red-dark">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="t-email" required>{t("emailAddress")}</Label>
        <input id="t-email" name="email" type="email" autoComplete="email" className={inputClass(!!errors.email)} />
        {errors.email && <p className="mt-1 text-sm text-red-dark">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="t-field" required>{t("field")}</Label>
        <input id="t-field" name="background" placeholder={t("fieldPlaceholder")} className={inputClass(!!errors.background)} />
        {errors.background && <p className="mt-1 text-sm text-red-dark">{errors.background}</p>}
      </div>

      <div>
        <Label htmlFor="t-bio" required>{t("bio")}</Label>
        <textarea id="t-bio" name="message" rows={5} placeholder={t("bioPlaceholder")} className={inputClass(!!errors.message)} />
        {errors.message && <p className="mt-1 text-sm text-red-dark">{errors.message}</p>}
      </div>

      <div>
        <Label htmlFor="t-links">{t("links")}</Label>
        <input id="t-links" name="links" type="url" placeholder={t("linksPlaceholder")} className={inputClass(false)} />
      </div>

      {status === "error" && <p className="text-sm text-red-dark">{t("submitError")}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-sm bg-red px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
