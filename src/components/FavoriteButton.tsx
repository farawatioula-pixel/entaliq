"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export function FavoriteButton({
  listingId,
  size = "md",
}: {
  listingId: string;
  size?: "sm" | "md";
}) {
  const t = useTranslations("favoriteButton");
  const [userId, setUserId] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      setUserId(user?.id ?? null);
      if (!user) return;

      const { data } = await supabase
        .from("favorites")
        .select("listing_id")
        .eq("listing_id", listingId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (active) setFavorited(!!data);
    }

    init();
    return () => {
      active = false;
    };
  }, [listingId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!userId || loading) return;
    setLoading(true);
    const supabase = createClient();

    if (favorited) {
      await supabase.from("favorites").delete().eq("listing_id", listingId).eq("user_id", userId);
      setFavorited(false);
    } else {
      await supabase.from("favorites").insert({ listing_id: listingId, user_id: userId });
      setFavorited(true);
    }
    setLoading(false);
  }

  if (userId === null) return null;

  const dimension = size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-lg";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={favorited}
      aria-label={favorited ? t("removeFromFavorites") : t("addToFavorites")}
      className={`flex ${dimension} items-center justify-center rounded-full border border-line bg-surface transition-colors hover:border-red disabled:opacity-60`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={favorited ? "h-[1em] w-[1em] text-red" : "h-[1em] w-[1em] text-neutral-400"}
        aria-hidden="true"
      >
        <path d="M19.5 5.5a5 5 0 0 0-7.5 0 5 5 0 0 0-7.5 0c-2 2-2 5 0 7.5L12 21l7.5-8c2-2.5 2-5.5 0-7.5Z" />
      </svg>
    </button>
  );
}
