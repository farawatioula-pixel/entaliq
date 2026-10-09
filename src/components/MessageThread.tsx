"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { RequestImagesUpload } from "@/components/RequestImagesUpload";
import { formatPrice, usdToJod } from "@/lib/currency";
import type { BuyerRequest, Message, Offer } from "@/lib/marketplace-types";

const POLL_MS = 4000;

type FeedItem =
  | { kind: "message"; at: string; data: Message }
  | { kind: "offer"; at: string; data: Offer }
  | { kind: "request"; at: string; data: BuyerRequest };

function mergeFeed(messages: Message[], offers: Offer[], requests: BuyerRequest[]): FeedItem[] {
  const items: FeedItem[] = [
    ...messages.map((m) => ({ kind: "message" as const, at: m.created_at, data: m })),
    ...offers.map((o) => ({ kind: "offer" as const, at: o.created_at, data: o })),
    ...requests.map((r) => ({ kind: "request" as const, at: r.created_at, data: r })),
  ];
  return items.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

export function MessageThread({
  conversationId,
  currentUserId,
  initialMessages,
  initialOffers,
  initialRequests,
  isSeller,
  sellerListings,
  defaultListingId,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
  initialOffers: Offer[];
  initialRequests: BuyerRequest[];
  isSeller: boolean;
  sellerListings: { id: string; title: string }[];
  defaultListingId: string | null;
}) {
  const t = useTranslations("messageThread");
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [requests, setRequests] = useState<BuyerRequest[]>(initialRequests);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [quotingRequestId, setQuotingRequestId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    async function poll() {
      const [{ data: msgs }, { data: offs }, { data: reqs }] = await Promise.all([
        supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true }),
        supabase
          .from("offers")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true }),
        supabase
          .from("requests")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true }),
      ]);
      if (msgs) setMessages(msgs as Message[]);
      if (offs) setOffers(offs as Offer[]);
      if (reqs) setRequests(reqs as BuyerRequest[]);
    }

    async function markRead() {
      const supabase = createClient();
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .neq("sender_id", currentUserId)
        .is("read_at", null);
    }

    markRead();
    const interval = setInterval(poll, POLL_MS);
    return () => clearInterval(interval);
  }, [conversationId, currentUserId]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, offers.length, requests.length]);

  async function send() {
    const content = text.trim();
    if (!content) return;
    setSending(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: currentUserId, content })
      .select()
      .single();
    setSending(false);
    if (!error && data) {
      setMessages((prev) => [...prev, data as Message]);
      setText("");
    }
  }

  async function respondToOffer(offerId: string, action: "accept" | "decline") {
    const res = await fetch(`/api/offers/${offerId}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const body = await res.json();
    if (!res.ok) {
      alert(body.error ?? t("somethingWentWrong"));
      return;
    }
    if (action === "accept" && body.order) {
      router.push(`/orders/${body.order.id}/pay`);
    } else {
      setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, status: "declined" } : o)));
    }
  }

  const feed = mergeFeed(messages, offers, requests);

  return (
    <div className="flex h-[60vh] flex-col rounded-sm border border-line bg-surface">
      <div ref={containerRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {feed.length === 0 && (
          <p className="text-center text-sm text-neutral-500">{t("sayHello")}</p>
        )}

        {feed.map((item) => {
          if (item.kind === "message") {
            const m = item.data;
            const mine = m.sender_id === currentUserId;
            return (
              <div key={`m-${m.id}`} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-sm px-4 py-2.5 text-sm ${
                    mine ? "bg-red text-white" : "bg-paper text-fg"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          }

          if (item.kind === "request") {
            const r = item.data;
            return (
              <div key={`r-${r.id}`} className="flex justify-center">
                <div className="w-full max-w-sm rounded-sm border border-line bg-paper px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
                    {t("requirementsLabel")}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-fg">{r.description}</p>
                  {r.desired_delivery && (
                    <p className="mt-1.5 text-xs text-neutral-600">
                      {t("desiredDeliveryLabel")}: {r.desired_delivery}
                    </p>
                  )}
                  {r.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.images.map((img, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={img + i}
                          src={img}
                          alt=""
                          className="h-16 w-16 rounded-sm border border-line object-cover"
                        />
                      ))}
                    </div>
                  )}

                  {r.status === "pending" && isSeller && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuotingRequestId(r.id);
                        setShowOfferForm(true);
                      }}
                      className="mt-4 w-full rounded-sm bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark"
                    >
                      {t("sendQuote")}
                    </button>
                  )}
                  {r.status === "pending" && !isSeller && (
                    <p className="mt-3 text-xs text-neutral-500">{t("requirementsSentWaiting")}</p>
                  )}
                  {r.status === "quoted" && (
                    <p className="mt-3 text-xs font-semibold text-cyan-deep">{t("requirementsQuoted")}</p>
                  )}
                </div>
              </div>
            );
          }

          const o = item.data;
          const isBuyerHere = o.buyer_id === currentUserId;
          return (
            <div key={`o-${o.id}`} className="flex justify-center">
              <div className="w-full max-w-sm rounded-sm border border-cyan-deep bg-paper px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-deep">
                  {t("customOffer")}
                </p>
                <p className="mt-2 font-display text-base font-bold text-fg">{o.title}</p>
                {o.description && (
                  <p className="mt-1 text-sm text-neutral-600">{o.description}</p>
                )}
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-fg">{formatPrice(o.price)}</span>
                  <span className="text-neutral-600">
                    {t("deliveryDays", { days: o.delivery_days })}
                  </span>
                </div>

                {o.status === "pending" && isBuyerHere && (
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => respondToOffer(o.id, "accept")}
                      className="flex-1 rounded-sm bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark"
                    >
                      {t("acceptOffer")}
                    </button>
                    <button
                      type="button"
                      onClick={() => respondToOffer(o.id, "decline")}
                      className="flex-1 rounded-sm border border-line px-4 py-2 text-sm font-semibold text-neutral-600 hover:border-red-dark hover:text-red-dark"
                    >
                      {t("declineOffer")}
                    </button>
                  </div>
                )}
                {o.status === "pending" && !isBuyerHere && (
                  <p className="mt-4 text-xs text-neutral-500">{t("waitingOnBuyer")}</p>
                )}
                {o.status === "accepted" && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-cyan-deep">{t("offerAccepted")}</p>
                    {o.order_id && isBuyerHere && (
                      <button
                        type="button"
                        onClick={() => router.push(`/orders/${o.order_id}/pay`)}
                        className="mt-2 w-full rounded-sm bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark"
                      >
                        {t("payNow")}
                      </button>
                    )}
                  </div>
                )}
                {o.status === "declined" && (
                  <p className="mt-4 text-xs font-semibold text-red-dark">{t("offerDeclined")}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isSeller && showRequestForm && (
        <RequestComposer
          conversationId={conversationId}
          onClose={() => setShowRequestForm(false)}
          onCreated={(request) => {
            setRequests((prev) => [...prev, request]);
            setShowRequestForm(false);
          }}
        />
      )}

      {isSeller && showOfferForm && (
        <OfferComposer
          conversationId={conversationId}
          sellerListings={sellerListings}
          defaultListingId={defaultListingId}
          requestId={quotingRequestId}
          onClose={() => {
            setShowOfferForm(false);
            setQuotingRequestId(null);
          }}
          onCreated={(offer) => {
            setOffers((prev) => [...prev, offer]);
            if (quotingRequestId) {
              setRequests((prev) =>
                prev.map((r) =>
                  r.id === quotingRequestId ? { ...r, status: "quoted", offer_id: offer.id } : r
                )
              );
            }
            setShowOfferForm(false);
            setQuotingRequestId(null);
          }}
        />
      )}

      <div className="flex gap-2 border-t border-line px-4 py-3">
        {!isSeller && (
          <button
            type="button"
            onClick={() => setShowRequestForm((v) => !v)}
            className="shrink-0 rounded-sm border border-cyan-deep px-4 py-2.5 text-sm font-semibold text-cyan-deep transition-colors hover:bg-cyan/10"
          >
            {t("sendRequirements")}
          </button>
        )}
        {isSeller && (
          <button
            type="button"
            onClick={() => {
              setQuotingRequestId(null);
              setShowOfferForm((v) => !v);
            }}
            className="shrink-0 rounded-sm border border-cyan-deep px-4 py-2.5 text-sm font-semibold text-cyan-deep transition-colors hover:bg-cyan/10"
          >
            {t("sendOffer")}
          </button>
        )}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={t("writeMessage")}
          className="flex-1 rounded-sm border border-line bg-surface px-4 py-2.5 text-sm text-fg focus:border-cyan-deep focus:outline-none"
        />
        <button
          type="button"
          onClick={send}
          disabled={sending || !text.trim()}
          className="rounded-sm bg-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-50"
        >
          {t("send")}
        </button>
      </div>
    </div>
  );
}

function RequestComposer({
  conversationId,
  onClose,
  onCreated,
}: {
  conversationId: string;
  onClose: () => void;
  onCreated: (request: BuyerRequest) => void;
}) {
  const t = useTranslations("messageThread");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUserId(data.user.id);
    });
  }, []);

  async function submit() {
    setError(null);
    if (!description.trim()) {
      setError(t("requirementsValidation"));
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: conversationId,
        description: description.trim(),
        images,
      }),
    });
    const body = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(body.error ?? t("somethingWentWrong"));
      return;
    }
    onCreated(body.request as BuyerRequest);
  }

  return (
    <div className="space-y-3 border-t border-line bg-paper px-5 py-4">
      <p className="font-display text-sm font-bold text-fg">{t("requirementsFormTitle")}</p>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t("requirementsDescriptionPlaceholder")}
        rows={3}
        className="w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
      />

      <div>
        <label className="mb-1.5 block text-xs font-medium text-neutral-600">
          {t("attachPhotos")}
        </label>
        {currentUserId && (
          <RequestImagesUpload buyerId={currentUserId} images={images} onChange={setImages} />
        )}
      </div>

      {error && <p className="text-xs text-red-dark">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="flex-1 rounded-sm bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
        >
          {submitting ? t("sendingRequirements") : t("requirementsSubmit")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm border border-line px-4 py-2 text-sm font-semibold text-neutral-600 hover:border-red-dark hover:text-red-dark"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

function OfferComposer({
  conversationId,
  sellerListings,
  defaultListingId,
  requestId,
  onClose,
  onCreated,
}: {
  conversationId: string;
  sellerListings: { id: string; title: string }[];
  defaultListingId: string | null;
  requestId: string | null;
  onClose: () => void;
  onCreated: (offer: Offer) => void;
}) {
  const t = useTranslations("messageThread");
  const [listingId, setListingId] = useState(
    defaultListingId && sellerListings.some((l) => l.id === defaultListingId)
      ? defaultListingId
      : sellerListings[0]?.id ?? ""
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("3");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setError(null);
    if (!listingId) {
      setError(t("needListing"));
      return;
    }
    if (!title.trim() || !price || Number(price) <= 0) {
      setError(t("offerValidation"));
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: conversationId,
        listing_id: listingId,
        title: title.trim(),
        description: description.trim(),
        price: usdToJod(Number(price)),
        delivery_days: Number(deliveryDays) || 1,
        request_id: requestId,
      }),
    });
    const body = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(body.error ?? t("somethingWentWrong"));
      return;
    }
    onCreated(body.offer as Offer);
  }

  if (sellerListings.length === 0) {
    return (
      <div className="border-t border-line bg-paper px-5 py-4 text-sm text-neutral-600">
        {t("noListingsForOffer")}
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t border-line bg-paper px-5 py-4">
      <p className="font-display text-sm font-bold text-fg">{t("sendOfferTitle")}</p>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-600">
          {t("listingLabel")}
        </label>
        <select
          value={listingId}
          onChange={(e) => setListingId(e.target.value)}
          className="w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
        >
          {sellerListings.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("offerTitlePlaceholder")}
        className="w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t("offerDescriptionPlaceholder")}
        rows={2}
        className="w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={t("offerPricePlaceholder")}
          className="rounded-sm border border-line bg-surface px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
        />
        <input
          type="number"
          value={deliveryDays}
          onChange={(e) => setDeliveryDays(e.target.value)}
          placeholder={t("offerDeliveryPlaceholder")}
          className="rounded-sm border border-line bg-surface px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
        />
      </div>

      {error && <p className="text-xs text-red-dark">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="flex-1 rounded-sm bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
        >
          {submitting ? t("sendingOffer") : t("sendOfferSubmit")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm border border-line px-4 py-2 text-sm font-semibold text-neutral-600 hover:border-red-dark hover:text-red-dark"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
