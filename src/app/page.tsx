import Link from "next/link";
import { stats } from "@/lib/data";
import PartnerLogos from "@/components/PartnerLogos";
import LaunchCTA from "@/components/LaunchCTA";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

const worlds: {
  category: Profile["category"];
  title: string;
  desc: string;
  accent: string;
  bg: string;
}[] = [
  {
    category: "SELL",
    title: "Sell",
    desc: "E-commerce & affiliate marketing",
    accent: "text-cyan-deep",
    bg: "bg-cyan/10",
  },
  {
    category: "CREATE",
    title: "Create",
    desc: "Content, freelancing, digital products",
    accent: "text-violet-deep",
    bg: "bg-violet/10",
  },
  {
    category: "BUILD",
    title: "Build",
    desc: "Vibe coding & AI services",
    accent: "text-red-dark",
    bg: "bg-red/10",
  },
];

const categoryColor: Record<Profile["category"], string> = {
  SELL: "text-cyan-deep",
  CREATE: "text-violet-deep",
  BUILD: "text-red-dark",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .neq("name", "")
    .order("updated_at", { ascending: false })
    .limit(3);

  const featured = (profiles ?? []) as Profile[];

  return (
    <>
      {/* Hero */}
      <section className="border-b-4 border-red bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
            Intaleq 2026
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[0.98] tracking-tight text-fg sm:text-6xl">
            Jordan&apos;s digital youth income &amp; training platform
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
            One week of hands-on training. A marketplace to sell into after. Sell,
            Create, or Build a real income — no degree, no capital required.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center rounded-sm bg-red px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
            >
              Register for 2026
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center rounded-sm border border-line px-7 py-3.5 text-[15px] font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
            >
              Browse the marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line bg-surface py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.value} className="flex items-baseline gap-3">
                <p className="font-display text-3xl font-bold text-red-dark">
                  {stat.value}
                </p>
                <p className="text-sm leading-snug text-neutral-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Three worlds
        </p>
        <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl">
          Pick a world. Start earning.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {worlds.map((world) => (
            <Link
              key={world.category}
              href={`/directory?category=${world.category}`}
              className={`rounded-sm border border-line ${world.bg} px-8 py-10 transition-colors hover:border-cyan`}
            >
              <p className={`font-display text-2xl font-bold ${world.accent}`}>
                {world.title}
              </p>
              <p className="mt-2 text-[15px] text-neutral-600">{world.desc}</p>
              <p className={`mt-6 text-sm font-semibold ${world.accent}`}>
                Browse sellers →
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-neutral-500">
          Want the full breakdown of all seven tracks?{" "}
          <Link href="/tracks" className="text-cyan-deep hover:underline">
            See the training tracks
          </Link>
        </p>
      </section>

      {/* Featured sellers */}
      <section className="border-y border-line bg-surface py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                From the marketplace
              </p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl">
                Hire a graduate
              </h2>
            </div>
            <Link
              href="/directory"
              className="text-sm font-semibold text-cyan-deep hover:underline"
            >
              See all sellers →
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="mt-12 rounded-sm border border-line bg-paper px-8 py-16 text-center">
              <p className="text-[15px] text-neutral-600">
                No sellers listed yet.{" "}
                <Link href="/signup" className="text-cyan-deep hover:underline">
                  Be the first.
                </Link>
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
              {featured.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/directory/${profile.id}`}
                  className="flex flex-col gap-3 bg-paper px-6 py-7 transition-colors hover:bg-surface"
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-widest ${categoryColor[profile.category]}`}
                  >
                    {profile.category}
                  </p>
                  <h3 className="font-display text-xl font-bold text-fg">
                    {profile.name}
                  </h3>
                  {profile.headline && (
                    <p className="text-[15px] text-neutral-600">{profile.headline}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Become a seller */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 rounded-sm border border-line bg-cyan/10 px-8 py-14 sm:flex-row sm:items-center sm:px-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-deep">
              After the training
            </p>
            <h2 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl">
              List your services. Find your first clients.
            </h2>
          </div>
          <Link
            href="/signup"
            className="inline-flex shrink-0 items-center rounded-sm bg-red px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
          >
            Become a seller
          </Link>
        </div>
      </section>

      {/* Trust logos */}
      <section className="border-t border-line bg-surface py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <PartnerLogos />
        </div>
      </section>

      <LaunchCTA />
    </>
  );
}
