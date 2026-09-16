"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const t = useTranslations("resetPasswordPage");
  const [ready, setReady] = useState(false);
  const [validLink, setValidLink] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase's browser client parses the recovery token out of the URL
    // (from the emailed link) and establishes a temporary session for it
    // automatically. We just need to wait for that before allowing submit.
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidLink(true);
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidLink(!!session);
      setReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("passwordsDontMatch"));
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
  }

  if (!ready) {
    return null;
  }

  if (done) {
    return (
      <main className="border-t-4 border-cyan bg-paper px-5 py-16 text-center sm:px-8 sm:py-24">
        <h1 className="font-display text-3xl font-bold text-fg">{t("successTitle")}</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-neutral-600">{t("successBody")}</p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center rounded-sm bg-red px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          {t("goToLogin")}
        </Link>
      </main>
    );
  }

  if (!validLink) {
    return (
      <main className="border-t-4 border-cyan bg-paper px-5 py-16 text-center sm:px-8 sm:py-24">
        <p className="text-[15px] text-neutral-600">{t("invalidLink")}</p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex items-center rounded-sm bg-red px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          {t("requestNewLink")}
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

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-600">
              {t("newPassword")}
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-neutral-600"
            >
              {t("confirmPassword")}
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-dark">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
          >
            {loading ? t("saving") : t("savePassword")}
          </button>
        </form>
      </div>
    </main>
  );
}
