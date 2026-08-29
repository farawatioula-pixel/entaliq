import { redirect, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrdersForUser } from "@/lib/orders";

export const revalidate = 0;

const statusColor: Record<string, string> = {
  pending: "text-neutral-600",
  accepted: "text-cyan-deep",
  in_progress: "text-cyan-deep",
  delivered: "text-violet-deep",
  revision_requested: "text-red-dark",
  completed: "text-cyan-deep",
  cancelled: "text-red-dark",
};

export default async function OrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ as?: string }>;
}) {
  const { locale } = await params;
  const { as } = await searchParams;
  const role = as === "seller" ? "seller" : "buyer";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const orders = await getOrdersForUser(user.id, role);

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">Orders</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg sm:text-4xl">Your orders</h1>

        <div className="mt-6 flex gap-2">
          <Link
            href="/orders?as=buyer"
            className={`rounded-sm px-4 py-2 text-sm font-semibold ${
              role === "buyer" ? "bg-fg text-white" : "border border-line text-neutral-600"
            }`}
          >
            As buyer
          </Link>
          <Link
            href="/orders?as=seller"
            className={`rounded-sm px-4 py-2 text-sm font-semibold ${
              role === "seller" ? "bg-fg text-white" : "border border-line text-neutral-600"
            }`}
          >
            As seller
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
            <p className="text-[15px] text-neutral-600">No orders yet.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-line bg-surface px-5 py-4 transition-colors hover:border-cyan-deep"
              >
                <div>
                  <p className="font-display text-base font-bold text-fg">
                    {order.listing?.title ?? "Listing removed"}
                  </p>
                  <p className="mt-1 text-xs text-neutral-600">
                    {role === "buyer" ? order.seller?.name : order.buyer?.name} · JOD{" "}
                    {order.price.toFixed(0)}
                  </p>
                </div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${statusColor[order.status]}`}>
                  {order.status.replace("_", " ")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
