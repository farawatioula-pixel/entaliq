import { notFound } from "next/navigation";
import { redirect, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/lib/orders";
import { OrderStatusActions } from "@/components/OrderStatusActions";

export const revalidate = 0;

const statusSteps = ["pending", "accepted", "in_progress", "delivered", "completed"];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
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

  const { order, files, review } = result;

  const isBuyer = order.buyer_id === user.id;
  const isSeller = order.seller_id === user.id;
  if (!isBuyer && !isSeller) notFound();

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <nav className="text-xs text-neutral-600">
          <Link href="/orders" className="hover:text-cyan-deep">
            Orders
          </Link>{" "}
          / <span className="text-fg">#{order.id.slice(0, 8)}</span>
        </nav>

        <h1 className="mt-3 font-display text-2xl font-bold text-fg sm:text-3xl">
          {order.listing?.title ?? "Listing removed"}
        </h1>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-line bg-surface px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
              {isBuyer ? "Seller" : "Buyer"}
            </p>
            <p className="mt-1 text-sm font-semibold text-fg">
              {isBuyer ? order.seller?.name : order.buyer?.name}
            </p>
          </div>
          <div className="rounded-sm border border-line bg-surface px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
              Price
            </p>
            <p className="mt-1 text-sm font-semibold text-fg">JOD {order.price.toFixed(0)}</p>
          </div>
        </div>

        {order.status !== "cancelled" && (
          <div className="mt-8 flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex flex-1 items-center">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    i <= currentStepIndex
                      ? "border-red bg-red text-white"
                      : "border-line bg-surface text-neutral-400"
                  }`}
                >
                  {i + 1}
                </div>
                {i < statusSteps.length - 1 && (
                  <div
                    className={`mx-1 h-0.5 flex-1 ${i < currentStepIndex ? "bg-red" : "bg-line"}`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {order.status !== "cancelled" && (
          <p className="mt-2 text-center text-xs font-semibold uppercase tracking-widest text-neutral-600">
            {order.status.replace("_", " ")}
          </p>
        )}
        {order.status === "cancelled" && (
          <p className="mt-6 text-center text-sm font-semibold text-red-dark">Order cancelled</p>
        )}

        {order.requirements && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-fg">Requirements</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-neutral-700">
              {order.requirements}
            </p>
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-fg">Files</h2>
            <ul className="mt-2 space-y-1">
              {files.map((f) => (
                <li key={f.id}>
                  <a
                    href={f.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-cyan-deep hover:underline"
                  >
                    {f.file_type === "delivery" ? "Delivered file" : "Requirement file"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {review && (
          <div className="mt-8 rounded-sm border border-line bg-surface px-5 py-4">
            <p className="text-sm font-semibold text-fg">★ {review.rating} review submitted</p>
            {review.comment && <p className="mt-1 text-sm text-neutral-600">{review.comment}</p>}
          </div>
        )}

        <OrderStatusActions
          orderId={order.id}
          status={order.status}
          isSeller={isSeller}
          isBuyer={isBuyer}
          hasReview={!!review}
        />
      </div>
    </main>
  );
}
