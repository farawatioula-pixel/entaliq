"use client";

import { Suspense, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const t = useTranslations("loginPage");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    window.location.href = `/${locale}${next}`;
  }

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          {t("welcomeBack")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg">{t("title")}</h1>

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

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-neutral-600">
                {t("password")}
              </label>
              <Link href="/forgot-password" className="text-sm text-cyan-deep hover:underline">
                {t("forgotPassword")}
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-dark">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
          >
            {loading ? t("loggingIn") : t("title")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          {t("noAccount")}{" "}
          <Link href="/signup" className="text-cyan-deep hover:underline">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
