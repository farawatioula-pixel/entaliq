"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export function ContactSellerButton({
  sellerId,
  listingId,
}: {
  sellerId: string;
  listingId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.id === sellerId) {
      setError("You cannot message yourself.");
      setLoading(false);
      return;
    }

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("buyer_id", user.id)
      .eq("seller_id", sellerId)
      .eq("listing_id", listingId)
      .maybeSingle();

    let conversationId = existing?.id;

    if (!conversationId) {
      const { data: created, error: createError } = await supabase
        .from("conversations")
        .insert({ buyer_id: user.id, seller_id: sellerId, listing_id: listingId })
        .select("id")
        .single();

      if (createError || !created) {
        setError(createError?.message ?? "Could not start conversation.");
        setLoading(false);
        return;
      }
      conversationId = created.id;
    }

    router.push(`/messages/${conversationId}`);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-sm border border-line px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-cyan-deep hover:text-cyan-deep disabled:opacity-60"
      >
        {loading ? "Opening..." : "Contact seller"}
      </button>
      {error && <p className="mt-2 text-xs text-red-dark">{error}</p>}
    </div>
  );
}
