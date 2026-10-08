import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { ConfirmPaymentButton } from "@/components/ConfirmPaymentButton";

export const revalidate = 0;

export default async function AdminPaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("adminPaymentsPage");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) notFound();

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "*, listing:listings(id, title), buyer:profiles!orders_buyer_id_fkey(id, name), seller:profiles!orders_seller_id_fkey(id, name)"
    )
    .eq("payment_status", "submitted")
    .order("payment_submitted_at", { ascending: true });

  const list = orders ?? [];

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg sm:text-4xl">{t("title")}</h1>

        {list.length === 0 ? (
          <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
            <p className="text-[15px] text-neutral-600">{t("noPending")}</p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {list.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-line bg-surface px-5 py-4"
              >
                <div>
                  <p className="font-display text-base font-bold text-fg">
                    {order.listing?.title ?? t("listingRemoved")}
                  </p>
                  <p className="mt-1 text-xs text-neutral-600">
                    {t("buyerLabel")}: {order.buyer?.name} · {t("sellerLabel")}: {order.seller?.name}
                  </p>
                  {order.payment_reference && (
                    <p className="mt-1 text-xs text-neutral-600">
                      {t("referenceLabel")}: {order.payment_reference}
                    </p>
                  )}
                  <p className="mt-1 font-display text-lg font-bold text-fg">
                    JOD {Number(order.total_amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {t("priceBreakdown", {
                      price: Number(order.price).toFixed(2),
                      fee: Number(order.platform_fee_amount).toFixed(2),
                    })}
                  </p>
                </div>
                <ConfirmPaymentButton orderId={order.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
