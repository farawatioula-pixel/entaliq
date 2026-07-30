import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-neutral-400">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <span className="font-display text-base font-extrabold text-white">
                انطلق
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Jordan&apos;s Digital Youth Income &amp; Training Platform.
              Sell · Create · Build.
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Platform
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/tracks" className="hover:text-white">Tracks</Link></li>
              <li><Link href="/trainers" className="hover:text-white">Trainers</Link></li>
              <li><Link href="/partners" className="hover:text-white">Partners</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Get involved
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-white">Register for the plenary</Link></li>
              <li><Link href="/register" className="hover:text-white">Apply for training</Link></li>
              <li><Link href="/partners#partner-with-us" className="hover:text-white">Partner with us</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Locations
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Amman — annual conference</li>
              <li>Ghor Al-Safi — hands-on training</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Intaleq — Mixed Sources Impact. All rights reserved.</p>
          <p>Amman · Ghor Al-Safi · Jordan</p>
        </div>
      </div>
    </footer>
  );
}
