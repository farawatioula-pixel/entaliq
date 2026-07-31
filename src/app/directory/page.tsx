import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

const categoryColor: Record<Profile["category"], string> = {
  SELL: "text-cyan",
  CREATE: "text-violet",
  BUILD: "text-red",
};

const categoryCopy: Record<Profile["category"], { label: string; desc: string }> = {
  SELL: { label: "Sell", desc: "E-commerce & affiliate marketing" },
  CREATE: { label: "Create", desc: "Content, freelancing, digital products" },
  BUILD: { label: "Build", desc: "Vibe coding & AI services" },
};

const categories: Profile["category"][] = ["SELL", "CREATE", "BUILD"];

export const revalidate = 0;

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = categories.includes(category as Profile["category"])
    ? (category as Profile["category"])
    : null;

  const supabase = await createClient();

  let query = supabase.from("profiles").select("*").neq("name", "").order("updated_at", {
    ascending: false,
  });

  if (activeCategory) {
    query = query.eq("category", activeCategory);
  }

  const { data: profiles } = await query;
  const list = (profiles ?? []) as Profile[];

  return (
    <main className="bg-ink">
      <section className="border-t-4 border-cyan px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            Marketplace
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold text-fg sm:text-4xl">
            Hire the people who trained here
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-neutral-400">
            Every seller below came up through Intaleq — trained, active, and taking on
            work across Sell, Create, and Build.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark"
            >
              Become a seller
            </Link>
            <Link
              href="#browse"
              className="inline-flex items-center rounded-sm border border-line px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan"
            >
              Find work to hire out
            </Link>
          </div>
        </div>
      </section>

      <section id="browse" className="border-t border-line px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
            <Link
              href="/directory"
              className={`px-6 py-6 transition-colors ${
                !activeCategory ? "bg-paper" : "bg-surface hover:bg-paper"
              }`}
            >
              <p className="font-display text-lg font-bold text-fg">All sellers</p>
              <p className="mt-1 text-sm text-neutral-400">Browse everyone</p>
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/directory?category=${c}`}
                className={`px-6 py-6 transition-colors ${
                  activeCategory === c ? "bg-paper" : "bg-surface hover:bg-paper"
                }`}
              >
                <p className={`font-display text-lg font-bold ${categoryColor[c]}`}>
                  {categoryCopy[c].label}
                </p>
                <p className="mt-1 text-sm text-neutral-400">{categoryCopy[c].desc}</p>
              </Link>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
              <p className="text-[15px] text-neutral-400">
                No sellers in this category yet.{" "}
                <Link href="/signup" className="text-cyan hover:underline">
                  Be the first.
                </Link>
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {list.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/directory/${profile.id}`}
                  className="flex flex-col gap-3 bg-surface px-6 py-7 transition-colors hover:bg-paper"
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-widest ${categoryColor[profile.category]}`}
                  >
                    {categoryCopy[profile.category].label}
                  </p>
                  <h2 className="font-display text-xl font-bold text-fg">{profile.name}</h2>
                  {profile.headline && (
                    <p className="text-[15px] text-neutral-300">{profile.headline}</p>
                  )}
                  {profile.services.length > 0 && (
                    <p className="text-sm text-neutral-400">
                      {profile.services.length} service
                      {profile.services.length > 1 ? "s" : ""} listed
                    </p>
                  )}
                  {profile.location && (
                    <p className="mt-auto text-xs text-neutral-400">{profile.location}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
