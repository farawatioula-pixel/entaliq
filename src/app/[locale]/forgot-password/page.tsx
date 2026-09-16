"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPasswordPage");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <main className="border-t-4 border-cyan bg-paper px-5 py-16 text-center sm:px-8 sm:py-24">
        <h1 className="font-display text-3xl font-bold text-fg">{t("checkEmailTitle")}</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-neutral-600">
          {t("checkEmailBody1")} <span className="text-fg">{email}</span>. {t("checkEmailBody2")}
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center rounded-sm bg-red px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          {t("backToLogin")}
        </Link>
      </main>
    );
  }

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg">{t("title")}</h1>
        <p className="mt-2 text-[15px] text-neutral-600">{t("body")}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-600">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-dark">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
          >
            {loading ? t("sending") : t("sendResetLink")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          <Link href="/login" className="text-cyan-deep hover:underline">
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    </main>
  );
}
