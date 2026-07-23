import Link from "next/link";
import Logo from "./Logo";
import { nextSteps } from "@/lib/data";

export default function LaunchCTA() {
  return (
    <section className="relative overflow-hidden border-t-4 border-red bg-ink text-white">
      <div className="bg-noise absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red">
              Mixed Sources Impact · 2026
            </p>
            <h2 className="mt-4 font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              Ready to launch?
            </h2>
            <p className="mt-2 font-display text-2xl text-neutral-400">Intaleq 2026</p>
          </div>
          <Link
            href="/partners#partner-with-us"
            className="inline-flex shrink-0 items-center rounded-sm bg-red px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-red-dark"
          >
            Lock In Your Partnership
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-neutral-800 pt-12 sm:grid-cols-3">
          <div>
            <Logo className="h-8 w-8" />
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-300">
              Jordan&apos;s Digital Youth Income &amp; Training Platform.
              <br />
              Annual conference in Amman + hands-on training in Ghor Al-Safi.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-red">
              Sell · Create · Build
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Next steps
            </p>
            <ol className="mt-4 space-y-3">
              {nextSteps.map((step, i) => (
                <li key={step} className="flex items-baseline gap-3 text-[15px]">
                  <span className="font-display text-sm font-bold text-red">
                    0{i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Partnership
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-300">
              Ready to partner with Intaleq 2026? Reach out to discuss sponsorship
              tiers and impact metrics.
            </p>
            <Link
              href="/partners#partner-with-us"
              className="mt-3 inline-block text-[15px] font-semibold text-red hover:underline"
            >
              Partner With Us →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
