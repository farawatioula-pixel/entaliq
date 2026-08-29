import { redirect, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSellerStats } from "@/lib/orders";

export const revalidate = 0;

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const stats = await getSellerStats(user.id);

  const cards = [
    { label: "Total earnings", value: `JOD ${stats.totalEarnings.toFixed(0)}` },
    { label: "Active orders", value: stats.activeOrders },
    { label: "Completed orders", value: stats.completedOrders },
    { label: "Published listings", value: `${stats.publishedListings}/${stats.totalListings}` },
    { label: "Listing views", value: stats.totalViews },
    { label: "Average rating", value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—" },
  ];

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          Dashboard
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg sm:text-4xl">
          Your seller overview
        </h1>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard/listings"
            className="rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg hover:border-cyan-deep hover:text-cyan-deep"
          >
            My listings
          </Link>
          <Link
            href="/dashboard/listings/new"
            className="rounded-sm bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
          >
            Create listing
          </Link>
          <Link
            href="/orders"
            className="rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg hover:border-cyan-deep hover:text-cyan-deep"
          >
            Orders
          </Link>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="bg-surface px-6 py-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
                {c.label}
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-fg">{c.value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
