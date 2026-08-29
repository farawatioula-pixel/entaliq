"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import ProfileForm from "@/components/ProfileForm";
import type { Profile } from "@/lib/types";

export default function ProfilePage() {
  const t = useTranslations("profilePage");
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!active) return;

      setProfile(
        (data as Profile | null) ?? {
          id: user.id,
          name: "",
          headline: "",
          bio: "",
          location: "",
          contact: user.email ?? "",
          category: "SELL",
          avatar_url: "",
          portfolio_images: [],
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
  }, [router]);

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
          <Link href="/directory" className="text-cyan-deep hover:underline">
            {t("marketplace")}
          </Link>
          .
        </p>

        {status === "loading" && (
          <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
            <p className="text-[15px] text-neutral-600">Loading your profile…</p>
          </div>
        )}

        {status === "error" && (
          <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
            <p className="text-[15px] text-neutral-600">
              Couldn&apos;t load your profile.{" "}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-cyan-deep hover:underline"
              >
                Try again
              </button>
            </p>
          </div>
        )}

        {status === "ready" && (
          <>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
              >
                Seller dashboard
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
              >
                My orders
              </Link>
              <Link
                href="/messages"
                className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
              >
                Messages
              </Link>
              <Link
                href="/favorites"
                className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
              >
                Favorites
              </Link>
            </div>

            <ProfileForm profile={profile!} />
          </>
        )}
      </div>
    </main>
  );
}
