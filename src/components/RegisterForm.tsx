"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

type FormType = "ceremony" | "training";

export default function RegisterForm({
  type,
  onClose,
}: {
  type: FormType;
  onClose: () => void;
}) {
  const t = useTranslations("registerForm");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const trainingBackgrounds = t.raw("backgrounds") as string[];
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shareUrl, setShareUrl] = useState<string | null>(null);

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
    if (type === "ceremony" && !String(payload.organisation || "").trim()) {
      nextErrors.organisation = t("errors.organisation");
    }
    if (type === "ceremony" && !String(payload.phone || "").trim()) {
      nextErrors.phone = t("errors.phone");
    }
    if (type === "training") {
      if (!String(payload.phone || "").trim()) nextErrors.phone = t("errors.phone");
      const age = Number(payload.age);
      if (!age || age < 15 || age > 40) nextErrors.age = t("errors.age");
      if (!String(payload.background || "").trim()) nextErrors.background = t("errors.background");
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          locale,
          ref: searchParams.get("ref") ?? undefined,
          ...payload,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json().catch(() => ({}))) as { shareUrl?: string | null };
      setShareUrl(data.shareUrl ?? null);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-line bg-paper p-8 text-center">
        <p className="font-display text-xl font-bold">{t("successTitle")}</p>
        <p className="mt-2 text-[15px] text-neutral-600">
          {type === "ceremony" ? t("successCeremony") : t("successTraining")}
        </p>

        {shareUrl && (
          <div className="mt-6 rounded-sm border border-cyan-deep bg-cyan/5 px-5 py-5">
            <p className="text-sm font-semibold text-fg">{t("shareHeading")}</p>
            <p className="mt-1.5 text-sm text-neutral-600">{t("shareBody")}</p>
            <a
              href={shareUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-sm bg-[#0A66C2] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
              {t("shareCta")}
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center rounded-sm bg-surface border border-line px-6 py-2.5 text-sm font-semibold text-fg hover:bg-line"
        >
          {t("done")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field label={t("fullName")} name="name" error={errors.name} required autoComplete="name" />
      <Field
        label={t("emailAddress")}
        name="email"
        type="email"
        error={errors.email}
        required
        autoComplete="email"
      />

      {type === "ceremony" && (
        <>
          <Field
            label={t("organisation")}
            name="organisation"
            error={errors.organisation}
            required
            autoComplete="organization"
          />
          <Field
            label={t("phoneNumber")}
            name="phone"
            type="tel"
            error={errors.phone}
            required
            autoComplete="tel"
          />
        </>
      )}

      {type === "training" && (
        <>
          <Field
            label={t("phoneNumber")}
            name="phone"
            type="tel"
            error={errors.phone}
            required
            autoComplete="tel"
          />
          <Field label={t("age")} name="age" type="number" error={errors.age} required />
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="background">
              {t("background")}
            </label>
            <select
              id="background"
              name="background"
              defaultValue=""
              className={`w-full rounded-sm border bg-surface px-4 py-3 text-[15px] text-fg focus:border-red ${
                errors.background ? "border-red" : "border-line"
              }`}
            >
              <option value="" disabled>
                {t("selectOne")}
              </option>
              {trainingBackgrounds.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {errors.background && (
              <p className="mt-1 text-sm text-red-dark">{errors.background}</p>
            )}
          </div>
        </>
      )}

      {status === "error" && (
        <p className="text-sm text-red-dark">{t("submitError")}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex flex-1 items-center justify-center rounded-sm bg-red px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
        >
          {status === "submitting"
            ? t("submitting")
            : type === "ceremony"
              ? t("registerForCeremony")
              : t("applyForTraining")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm border border-line px-5 py-3.5 text-[15px] font-semibold text-neutral-600 hover:bg-paper"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={`w-full rounded-sm border bg-surface px-4 py-3 text-[15px] text-fg focus:border-red ${
          error ? "border-red" : "border-line"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-dark">{error}</p>}
    </div>
  );
}
