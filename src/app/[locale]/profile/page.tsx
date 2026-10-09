"use client";

import { Suspense, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { withTimeout } from "@/lib/with-timeout";
import ProfileForm from "@/components/ProfileForm";
import type { Profile } from "@/lib/types";

function ProfilePageInner() {
  const t = useTranslations("profilePage");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await withTimeout(supabase.auth.getUser(), 8000);

      if (!active) return;

      if (!user) {
        const backTo = next ? `/profile?next=${encodeURIComponent(next)}` : "/profile";
        router.push(`/login?next=${encodeURIComponent(backTo)}`);
        return;
      }

      const { data } = await withTimeout(
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        8000
      );

      if (!active) return;

      setProfile(
        (data as Profile | null) ?? {
          id: user.id,
          name: "",
          headline: "",
          bio: "",
          location: "",
          contact: user.email ?? "",
          category: "graphics-design",
          avatar_url: "",
          portfolio_images: [],
          is_admin: false,
          services: [],
          updated_at: new Date().toISOString(),
        }
      );
      setStatus("ready");
    }

    load().catch(() => {
      if (active) setStatus("error");
    });

    return () => {
      active = false;
    };
  }, [router, next]);

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-[15px] text-neutral-600">
          {t("body")}{" "}
          <Link href="/dashboard" className="text-cyan-deep hover:underline">
            {t("dashboardLink")}
          </Link>
          .
        </p>

        {status === "loading" && (
          <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
            <p className="text-[15px] text-neutral-600">{t("loading")}</p>
          </div>
        )}

        {status === "error" && (
          <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
            <p className="text-[15px] text-neutral-600">
              {t("loadError")}{" "}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-cyan-deep hover:underline"
              >
                {t("tryAgain")}
              </button>
            </p>
          </div>
        )}

        {status === "ready" && (
          <>
            {next && (
              <div className="mt-6 rounded-sm border border-cyan-deep bg-cyan/5 px-5 py-4">
                <p className="text-sm font-semibold text-cyan-deep">{t("onboardingNoticeTitle")}</p>
                <p className="mt-1 text-sm text-neutral-700">{t("onboardingNoticeBody")}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
              >
                {t("sellerDashboard")}
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
              >
                {t("myOrders")}
              </Link>
              <Link
                href="/messages"
                className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
              >
                {t("messages")}
              </Link>
              <Link
                href="/favorites"
                className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
              >
                {t("favorites")}
              </Link>
            </div>

            <ProfileForm profile={profile!} next={next} />
          </>
        )}
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageInner />
    </Suspense>
  );
}
