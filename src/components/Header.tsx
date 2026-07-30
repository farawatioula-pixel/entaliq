"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Logo from "./Logo";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/tracks", label: "Tracks" },
  { href: "/trainers", label: "Trainers" },
  { href: "/directory", label: "Directory" },
  { href: "/partners", label: "Partners" },
  { href: "/register", label: "Register" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const accountHref = user ? "/profile" : "/login";
  const accountLabel = user ? "My Profile" : "Sign In";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Intaleq home">
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-extrabold tracking-tight text-fg">
            انطلق<span className="sr-only"> Intaleq</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-medium transition-colors hover:text-fg ${
                  active ? "text-fg font-semibold" : "text-neutral-400"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href={accountHref}
            className="text-[15px] font-medium text-neutral-400 transition-colors hover:text-fg"
          >
            {accountLabel}
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center rounded-sm bg-red px-6 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
          >
            Register 2026
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 bg-fg transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-6 bg-fg transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-6 bg-fg transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-line bg-surface px-5 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-sm px-2 py-3 text-base font-medium ${
                      active ? "text-red" : "text-neutral-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={accountHref}
                className="block rounded-sm px-2 py-3 text-base font-medium text-neutral-300"
              >
                {accountLabel}
              </Link>
            </li>
            <li className="pt-2">
              <Link
                href="/register"
                className="block rounded-sm bg-red px-4 py-3 text-center text-base font-semibold text-white"
              >
                Register 2026
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
