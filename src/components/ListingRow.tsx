"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/navigation";
import type { Listing } from "@/lib/marketplace-types";

const statusColor: Record<Listing["status"], string> = {
  draft: "text-neutral-600",
  published: "text-cyan-deep",
  unpublished: "text-red-dark",
};

export function ListingRow({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(status: Listing["status"]) {
    setBusy(true);
    const supabase = createClient();
    await supabase.from("listings").update({ status }).eq("id", listing.id);
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Delete "${listing.title}"? This cannot be undone.`)) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("listings").delete().eq("id", listing.id);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-line bg-surface px-5 py-4">
      <div>
        <p className="font-display text-base font-bold text-fg">{listing.title || "Untitled"}</p>
        <p className={`mt-1 text-xs font-semibold uppercase tracking-widest ${statusColor[listing.status]}`}>
          {listing.status}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {listing.status === "published" && (
          <Link
            href={`/marketplace/${listing.id}`}
            className="rounded-sm border border-line px-3 py-1.5 text-xs font-semibold text-fg hover:border-cyan-deep hover:text-cyan-deep"
          >
            View
          </Link>
        )}
        <Link
          href={`/dashboard/listings/${listing.id}/edit`}
          className="rounded-sm border border-line px-3 py-1.5 text-xs font-semibold text-fg hover:border-cyan-deep hover:text-cyan-deep"
        >
          Edit
        </Link>
        {listing.status === "published" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => setStatus("unpublished")}
            className="rounded-sm border border-line px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:border-red-dark hover:text-red-dark disabled:opacity-50"
          >
            Unpublish
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => setStatus("published")}
            className="rounded-sm border border-line px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:border-cyan-deep hover:text-cyan-deep disabled:opacity-50"
          >
            Publish
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={remove}
          className="rounded-sm border border-line px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:border-red-dark hover:text-red-dark disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
