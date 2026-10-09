import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/lib/orders";
import { PaymentForm } from "@/components/PaymentForm";
import { PaymentAmountSummary } from "@/components/PaymentAmountSummary";

export const revalidate = 0;

// TODO: replace with the real Mountaliq CliQ alias once provided.
const CLIQ_ALIAS = "mountaliq";
const CLIQ_BANK = "TBD";

export default async function PayOrderPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("payOrderPage");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const result = await getOrderById(id);
  if (!result) notFound();

  const { order } = result;
  if (order.buyer_id !== user.id) notFound();

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-lg">
        <nav className="text-xs text-neutral-600">
          <Link href={`/orders/${order.id}`} className="hover:text-cyan-deep">
            #{order.id.slice(0, 8)}
          </Link>{" "}
          / <span className="text-fg">{t("eyebrow")}</span>
        </nav>

        <h1 className="mt-3 font-display text-2xl font-bold text-fg sm:text-3xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {order.listing?.title ?? t("listingRemoved")}
        </p>

        <PaymentAmountSummary
          price={order.price}
          platformFeePercent={order.platform_fee_percent}
          platformFeeAmount={order.platform_fee_amount}
          totalAmount={order.total_amount}
        />

        {order.payment_status === "confirmed" ? (
          <div className="mt-6 rounded-sm border border-cyan-deep bg-cyan/5 px-5 py-4">
            <p className="text-sm font-semibold text-cyan-deep">{t("alreadyConfirmed")}</p>
            <Link
              href={`/orders/${order.id}`}
              className="mt-3 inline-flex items-center rounded-sm bg-red px-5 py-2 text-sm font-semibold text-white hover:bg-red-dark"
            >
              {t("viewOrder")}
            </Link>
          </div>
        ) : order.payment_status === "submitted" ? (
          <div className="mt-6 rounded-sm border border-cyan-deep bg-cyan/5 px-5 py-4">
            <p className="text-sm font-semibold text-cyan-deep">{t("alreadySubmitted")}</p>
            <p className="mt-1 text-sm text-neutral-600">{t("alreadySubmittedBody")}</p>
            <Link
              href={`/orders/${order.id}`}
              className="mt-3 inline-flex items-center rounded-sm border border-line px-5 py-2 text-sm font-semibold text-fg hover:border-cyan-deep hover:text-cyan-deep"
            >
              {t("viewOrder")}
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-sm border border-red bg-red/5 px-5 py-5">
              <p className="text-sm font-semibold text-fg">{t("howToPay")}</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-neutral-700">
                <li>{t("step1")}</li>
                <li>
                  {t("step2")}{" "}
                  <span className="font-semibold text-fg">{CLIQ_ALIAS}</span>
                  {CLIQ_BANK !== "TBD" && <> ({CLIQ_BANK})</>}
                </li>
                <li>
                  {t("step3")}{" "}
                  <span className="font-semibold text-fg">JOD {order.total_amount.toFixed(2)}</span>
                </li>
                <li>{t("step4")}</li>
              </ol>
            </div>

            <PaymentForm orderId={order.id} />
          </>
        )}
      </div>
    </main>
  );
}
