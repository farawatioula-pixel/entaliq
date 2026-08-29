"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/marketplace-types";

export function OrderStatusActions({
  orderId,
  status,
  isSeller,
  isBuyer,
  hasReview,
}: {
  orderId: string;
  status: OrderStatus;
  isSeller: boolean;
  isBuyer: boolean;
  hasReview: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function updateStatus(newStatus: OrderStatus) {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.refresh();
  }

  async function submitReview() {
    setBusy(true);
    setError(null);
    const supabase = createClient();

    const { data: order } = await supabase
      .from("orders")
      .select("listing_id, buyer_id, seller_id")
      .eq("id", orderId)
      .single();

    if (!order) {
      setBusy(false);
      setError("Order not found.");
      return;
    }

    const { error: reviewError } = await supabase.from("reviews").insert({
      order_id: orderId,
      listing_id: order.listing_id,
      buyer_id: order.buyer_id,
      seller_id: order.seller_id,
      rating,
      comment: comment.trim(),
    });

    setBusy(false);
    if (reviewError) {
      setError(reviewError.message);
      return;
    }
    setShowReview(false);
    router.refresh();
  }

  const actions: { label: string; next: OrderStatus; primary?: boolean }[] = [];

  if (isSeller) {
    if (status === "pending") actions.push({ label: "Accept order", next: "accepted", primary: true });
    if (status === "accepted") actions.push({ label: "Start work", next: "in_progress", primary: true });
    if (status === "in_progress" || status === "revision_requested")
      actions.push({ label: "Mark as delivered", next: "delivered", primary: true });
    if (["pending", "accepted"].includes(status))
      actions.push({ label: "Cancel order", next: "cancelled" });
  }

  if (isBuyer) {
    if (status === "delivered") {
      actions.push({ label: "Accept delivery", next: "completed", primary: true });
      actions.push({ label: "Request revision", next: "revision_requested" });
    }
  }

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-4 rounded-sm border border-red-dark/30 bg-red/5 px-4 py-3 text-sm text-red-dark">
          {error}
        </div>
      )}

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <button
              key={a.next}
              type="button"
              disabled={busy}
              onClick={() => updateStatus(a.next)}
              className={`rounded-sm px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
                a.primary
                  ? "bg-red text-white hover:bg-red-dark"
                  : "border border-line text-neutral-600 hover:border-red-dark hover:text-red-dark"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {isBuyer && status === "completed" && !hasReview && !showReview && (
        <button
          type="button"
          onClick={() => setShowReview(true)}
          className="rounded-sm bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          Leave a review
        </button>
      )}

      {showReview && (
        <div className="mt-4 rounded-sm border border-line bg-surface p-5">
          <label className="block text-sm font-semibold text-fg">Rating</label>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-2xl ${n <= rating ? "text-red" : "text-line"}`}
              >
                ★
              </button>
            ))}
          </div>
          <label className="mt-4 block text-sm font-semibold text-fg">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-sm border border-line px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
          />
          <button
            type="button"
            disabled={busy}
            onClick={submitReview}
            className="mt-3 rounded-sm bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
          >
            {busy ? "Submitting..." : "Submit review"}
          </button>
        </div>
      )}
    </div>
  );
}
