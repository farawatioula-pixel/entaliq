import Link from "next/link";
import { stats, gaps, promise } from "@/lib/data";
import TracksGrid, { TracksCTA } from "@/components/TracksGrid";
import TrainersGrid from "@/components/TrainersGrid";
import PartnerLogos from "@/components/PartnerLogos";
import LaunchCTA from "@/components/LaunchCTA";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b-4 border-red bg-ink text-white">
        <div className="bg-noise absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            Intaleq 2026
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
            Jordan&apos;s Digital Youth Income &amp; Training Platform
          </h1>
          <p className="mt-8 font-display text-xl font-bold tracking-[0.15em] text-neutral-300 sm:text-2xl">
            SELL &nbsp;·&nbsp; CREATE &nbsp;·&nbsp; BUILD
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/partners#partner-with-us"
              className="inline-flex items-center rounded-sm bg-red px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
            >
              Partner With Us
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center rounded-sm border border-white/40 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee band */}
      <div className="overflow-hidden bg-red py-5">
        <div className="marquee flex whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              className="mx-6 font-display text-2xl font-bold uppercase tracking-widest text-white"
              aria-hidden={i === 1}
            >
              Sell &nbsp;·&nbsp; Create &nbsp;·&nbsp; Build &nbsp;·&nbsp; Sell &nbsp;·&nbsp; Create &nbsp;·&nbsp; Build
            </span>
          ))}
        </div>
      </div>

      {/* Why Intaleq */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Why Intaleq
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          A real gap.
          <br />A real solution.
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface px-8 py-10">
              <p className="font-display text-6xl font-bold text-red">{stat.value}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 sm:grid-cols-2">
          {gaps.map((gap) => (
            <div key={gap.title} className="border-l-2 border-red pl-5">
              <h3 className="font-display text-lg font-bold">{gap.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-300">
                {gap.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Promise */}
      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            The Intaleq Promise
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Built for everyone
            <br />in the ecosystem.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {promise.map((item) => (
              <div key={item.title} className="bg-surface px-8 py-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-red">
                  {item.title}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-300">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big statement band */}
      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <div className="bg-noise absolute inset-0" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-display text-4xl font-bold uppercase leading-none tracking-tight text-neutral-700 sm:text-6xl lg:max-w-2xl">
            Sell &nbsp;·&nbsp; Create &nbsp;·&nbsp; Build
          </p>
          <p className="max-w-xs text-lg leading-relaxed text-neutral-300">
            Seven tracks. Three worlds.
            <br />One platform built for Jordan.
          </p>
        </div>
      </section>

      {/* Tracks */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Seven tracks · Three worlds
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Every path leads
          <br />to income.
        </h2>

        <div className="mt-14">
          <TracksGrid />
        </div>
        <TracksCTA />
      </section>

      {/* Marketplace */}
      <section className="border-y border-line bg-ink py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            After the training
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Where graduates
            <br />find their first clients.
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-neutral-300">
            Every Intaleq graduate can list their services in the marketplace — a
            searchable directory of sellers across Sell, Create, and Build, built so the
            income doesn&apos;t stop when the training does.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-sm bg-red px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
            >
              Become a seller
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center rounded-sm border border-line px-7 py-3.5 text-[15px] font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan"
            >
              Browse the marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Who&apos;s leading the training
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Practitioners,
            <br />not lecturers.
          </h2>

          <div className="mt-14">
            <TrainersGrid />
          </div>

          <div className="mt-20">
            <PartnerLogos />
          </div>
        </div>
      </section>

      <LaunchCTA />
    </>
  );
}
