"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function FavoriteButton({
  listingId,
  size = "md",
}: {
  listingId: string;
  size?: "sm" | "md";
}) {
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
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      className={`flex ${dimension} items-center justify-center rounded-full border border-line bg-surface transition-colors hover:border-red disabled:opacity-60`}
    >
      <span className={favorited ? "text-red" : "text-neutral-400"}>{favorited ? "♥" : "♡"}</span>
    </button>
  );
}
