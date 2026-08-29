"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import { NotificationBell } from "./NotificationBell";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/tracks", label: t("tracks") },
    { href: "/trainers", label: t("trainers") },
    { href: "/marketplace", label: t("marketplace") },
    { href: "/register", label: t("register") },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = `/${locale}`;
  }

  const isLoggedIn = !!userId;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Muntaliq home">
          <Logo className="h-11 w-11" />
          <span className="font-arabic text-xl font-extrabold tracking-tight text-fg">
            منطلق<span className="sr-only"> Muntaliq</span>
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
                  active ? "text-fg font-semibold" : "text-neutral-600"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {isLoggedIn && <NotificationBell />}
          <LocaleSwitcher />

          {userId === undefined ? null : isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center rounded-sm border border-line px-6 py-2.5 text-[15px] font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
              >
                My Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-[15px] font-medium text-neutral-600 transition-colors hover:text-fg"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[15px] font-medium text-neutral-600 transition-colors hover:text-fg"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center rounded-sm bg-red px-6 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
              >
                {t("registerCta")}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center lg:hidden"
          aria-label={open ? t("closeMenu") : t("openMenu")}
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
                      active ? "text-red-dark" : "text-neutral-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {userId !== undefined && isLoggedIn ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    className="block rounded-sm px-2 py-3 text-center text-base font-medium text-neutral-600"
                  >
                    My Profile
                  </Link>
                </li>
                <li className="pt-2">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full rounded-sm bg-red px-4 py-3 text-center text-base font-semibold text-white"
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="block rounded-sm px-2 py-3 text-center text-base font-medium text-neutral-600"
                  >
                    {t("login")}
                  </Link>
                </li>
                <li className="pt-2">
                  <Link
                    href="/register"
                    className="block rounded-sm bg-red px-4 py-3 text-center text-base font-semibold text-white"
                  >
                    {t("registerCta")}
                  </Link>
                </li>
              </>
            )}

            <li className="pt-3">
              <LocaleSwitcher fullWidth locale={locale} />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
