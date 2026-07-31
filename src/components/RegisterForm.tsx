"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type FormType = "plenary" | "training";

export default function RegisterForm({
  type,
  onClose,
}: {
  type: FormType;
  onClose: () => void;
}) {
  const t = useTranslations("registerForm");
  const trainingBackgrounds = t.raw("backgrounds") as string[];
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
    if (type === "plenary" && !String(payload.organisation || "").trim()) {
      nextErrors.organisation = t("errors.organisation");
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
        body: JSON.stringify({ type, ...payload }),
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
      <div className="rounded-sm border border-line bg-paper p-8 text-center">
        <p className="font-display text-xl font-bold">{t("successTitle")}</p>
        <p className="mt-2 text-[15px] text-neutral-600">
          {type === "plenary" ? t("successPlenary") : t("successTraining")}
        </p>
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

      {type === "plenary" && (
        <Field
          label={t("organisation")}
          name="organisation"
          error={errors.organisation}
          required
          autoComplete="organization"
        />
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
            : type === "plenary"
              ? t("registerForPlenary")
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
