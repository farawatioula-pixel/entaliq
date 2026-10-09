"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { RequestImagesUpload } from "@/components/RequestImagesUpload";

const DELIVERY_OPTIONS = ["24h", "3d", "7d", "other"] as const;
type DeliveryOption = (typeof DELIVERY_OPTIONS)[number];

export function ContactSellerButton({
  sellerId,
  sellerName,
  listingId,
}: {
  sellerId: string;
  sellerName?: string;
  listingId: string;
}) {
  const t = useTranslations("contactSellerButton");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function ensureConversation(): Promise<string | null> {
    setError(null);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return null;
    }

    if (user.id === sellerId) {
      setError(t("cannotMessageSelf"));
      return null;
    }

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("buyer_id", user.id)
      .eq("seller_id", sellerId)
      .eq("listing_id", listingId)
      .maybeSingle();

    if (existing?.id) return existing.id as string;

    const { data: created, error: createError } = await supabase
      .from("conversations")
      .insert({ buyer_id: user.id, seller_id: sellerId, listing_id: listingId })
      .select("id")
      .single();

    if (createError || !created) {
      setError(createError?.message ?? t("couldNotStartConversation"));
      return null;
    }
    return created.id as string;
  }

  async function handleAskQuestion() {
    setMenuOpen(false);
    setLoading(true);
    const conversationId = await ensureConversation();
    setLoading(false);
    if (conversationId) router.push(`/messages/${conversationId}`);
  }

  function handleGetQuote() {
    setMenuOpen(false);
    setError(null);
    setQuoteOpen(true);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        disabled={loading}
        className="w-full rounded-sm border border-line px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-cyan-deep hover:text-cyan-deep disabled:opacity-60"
      >
        {loading ? t("opening") : t("contactSeller")}
      </button>
      {error && <p className="mt-2 text-xs text-red-dark">{error}</p>}

      {menuOpen && (
        <div className="absolute left-0 right-0 z-20 mt-2 rounded-sm border border-line bg-surface p-2 shadow-lg">
          <p className="px-3 py-2 font-display text-sm font-bold text-fg">{t("howCanIHelp")}</p>
          <button
            type="button"
            onClick={handleGetQuote}
            className="flex w-full items-center justify-between gap-3 rounded-sm px-3 py-3 text-left hover:bg-paper"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-base">
                📋
              </span>
              <span className="text-sm font-semibold text-fg">{t("getAQuote")}</span>
            </span>
            <span className="text-neutral-400">→</span>
          </button>
          <button
            type="button"
            onClick={handleAskQuestion}
            className="flex w-full items-center justify-between gap-3 rounded-sm px-3 py-3 text-left hover:bg-paper"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-base">
                💬
              </span>
              <span className="text-sm font-semibold text-fg">{t("askAQuestion")}</span>
            </span>
            <span className="text-neutral-400">→</span>
          </button>
        </div>
      )}

      {quoteOpen && (
        <GetQuoteModal
          sellerName={sellerName}
          onClose={() => setQuoteOpen(false)}
          ensureConversation={ensureConversation}
        />
      )}
    </div>
  );
}

function GetQuoteModal({
  sellerName,
  onClose,
  ensureConversation,
}: {
  sellerName?: string;
  onClose: () => void;
  ensureConversation: () => Promise<string | null>;
}) {
  const t = useTranslations("contactSellerButton");
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [delivery, setDelivery] = useState<DeliveryOption | null>(null);
  const [customDelivery, setCustomDelivery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const deliveryLabel: Record<DeliveryOption, string> = {
    "24h": t("delivery24h"),
    "3d": t("delivery3d"),
    "7d": t("delivery7d"),
    other: t("deliveryOther"),
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUserId(data.user.id);
    });
  }, []);

  async function submit() {
    setError(null);
    if (!description.trim()) {
      setError(t("requestValidation"));
      return;
    }

    setSubmitting(true);
    const conversationId = await ensureConversation();
    if (!conversationId) {
      setSubmitting(false);
      setError(t("couldNotStartConversation"));
      return;
    }

    const desiredDelivery =
      delivery === "other" ? customDelivery.trim() : delivery ? deliveryLabel[delivery] : "";

    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: conversationId,
        description: description.trim(),
        images,
        desired_delivery: desiredDelivery || undefined,
      }),
    });
    const body = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(body.error ?? t("somethingWentWrong"));
      return;
    }

    router.push(`/messages/${conversationId}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <p className="font-display text-lg font-bold text-fg">{t("requestAQuote")}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="text-xl text-neutral-500 hover:text-fg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="flex items-start gap-3 border-b border-line pb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-paper">
              <span className="font-display text-sm font-bold text-neutral-400">
                {(sellerName ?? "?").trim().charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg">{sellerName}</p>
              <p className="mt-1 text-sm text-neutral-600">{t("quoteGreeting")}</p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-fg">
              {t("describeService")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 2500))}
              placeholder={t("describeServicePlaceholder")}
              rows={5}
              className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-fg focus:border-cyan-deep focus:outline-none"
            />
            <p className="mt-1 text-right text-xs text-neutral-500">{description.length}/2500</p>
          </div>

          <div>
            {currentUserId && (
              <RequestImagesUpload buyerId={currentUserId} images={images} onChange={setImages} />
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-fg">
              {t("whenDelivered")}
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DELIVERY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDelivery(opt)}
                  className={`rounded-sm border px-3 py-2.5 text-sm font-semibold transition-colors ${
                    delivery === opt
                      ? "border-cyan-deep bg-cyan/10 text-cyan-deep"
                      : "border-line text-fg hover:border-cyan-deep"
                  }`}
                >
                  {deliveryLabel[opt]}
                </button>
              ))}
            </div>
            {delivery === "other" && (
              <input
                type="text"
                value={customDelivery}
                onChange={(e) => setCustomDelivery(e.target.value)}
                placeholder={t("customDeliveryPlaceholder")}
                className="mt-2 w-full rounded-sm border border-line bg-paper px-4 py-2.5 text-sm text-fg focus:border-cyan-deep focus:outline-none"
              />
            )}
          </div>

          {error && <p className="text-sm text-red-dark">{error}</p>}

          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="w-full rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
          >
            {submitting ? t("sendingRequest") : t("sendRequest")}
          </button>
        </div>
      </div>
    </div>
  );
}
