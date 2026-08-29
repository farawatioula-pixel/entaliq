"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const t = useTranslations("signupPage");
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/${locale}/login`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/profile");
      router.refresh();
    } else {
      // Email confirmation is required before a session exists.
      setDone(true);
    }
  }

  if (done) {
    return (
      <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:py-24 text-center sm:px-8">
        <h1 className="font-display text-3xl font-bold text-fg">{t("checkEmail")}</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-neutral-600">
          {t("checkEmailBody1")} <span className="text-fg">{email}</span>. {t("checkEmailBody2")}
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center rounded-sm bg-red px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          {t("goToLogin")}
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
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-600">
              {t("fullName")}
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
            />
          </div>

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
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-neutral-600"
            >
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-neutral-600">{t("passwordHint")}</p>
          </div>

          {error && <p className="text-sm text-red-dark">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
          >
            {loading ? t("creatingAccount") : t("createAccount")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-cyan-deep hover:underline">
            {t("logIn")}
          </Link>
        </p>
      </div>
    </main>
  );
}
