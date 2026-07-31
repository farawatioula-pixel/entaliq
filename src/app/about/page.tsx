import type { Metadata } from "next";
import Link from "next/link";
import { stats, gaps, promise } from "@/lib/data";
import LaunchCTA from "@/components/LaunchCTA";

export const metadata: Metadata = {
  title: "About — Intaleq 2026",
  description:
    "Why Intaleq exists: the economic and geographic gap it closes, and the self-sustaining model behind Jordan's Digital Youth Income & Training Platform.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-t-4 border-red bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
            About Intaleq
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
            A real gap. A real solution.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            Intaleq — Arabic for &ldquo;launch&rdquo; — is Jordan&apos;s digital
            youth income and training platform. It exists because free content
            and one-off grants haven&apos;t closed the gap between Jordan&apos;s
            youth and the global digital economy.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface px-8 py-10">
              <p className="font-display text-6xl font-bold text-red-dark">{stat.value}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-12 sm:grid-cols-2">
          {gaps.map((gap) => (
            <div key={gap.title} className="border-l-2 border-red pl-5">
              <h2 className="font-display text-xl font-bold">{gap.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                {gap.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            The model
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Built to outlast its own funding.
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
            Traditional programs rely on a grant and stop once it runs out.
            Intaleq is modeled on ArabNet: a self-sustaining annual event, with
            an Amman plenary that funds and anchors a hands-on training week in
            Ghor Al-Safi. Once the model is proven there, it&apos;s built to
            expand to other governorates.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {promise.map((item) => (
              <div key={item.title} className="bg-surface px-8 py-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-dark">
                  {item.title}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Where it happens
        </p>
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          <div className="bg-surface px-8 py-10">
            <h3 className="font-display text-2xl font-bold">Amman</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              The annual Intaleq plenary — panels, keynotes, and Jordan&apos;s
              digital economy practitioners in one room, one day.
            </p>
            <Link
              href="/register"
              className="mt-5 inline-block text-[15px] font-semibold text-red-dark hover:underline"
            >
              Register for the plenary →
            </Link>
          </div>
          <div className="bg-paper px-8 py-10">
            <h3 className="font-display text-2xl font-bold">Ghor Al-Safi</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              A hands-on training week, in partnership with Jordan Bromine
              Company, across seven digital income tracks.
            </p>
            <Link
              href="/register"
              className="mt-5 inline-block text-[15px] font-semibold text-red-dark hover:underline"
            >
              Apply for training →
            </Link>
          </div>
        </div>
      </section>

      <LaunchCTA />
    </>
  );
}
