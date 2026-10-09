"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import { NotificationBell } from "./NotificationBell";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const t = useTranslations("nav");
  const tAria = useTranslations("headerAria");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [scrolled, setScrolled] = useState(false);

  const browseLinks = [
    { href: "/", label: t("home") },
    { href: "/summit", label: t("summit") },
    { href: "/about", label: t("about") },
    { href: "/tracks", label: t("tracks") },
    { href: "/trainers", label: t("trainers") },
    { href: "/marketplace", label: t("marketplace") },
    { href: "/guides", label: t("guides") },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 80);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    router.push("/");
    router.refresh();
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/marketplace?q=${encodeURIComponent(trimmed)}` : "/marketplace");
  }

  const isLoggedIn = !!userId;
  const buyHref = isLoggedIn ? "/marketplace" : "/signup?next=/marketplace";
  const sellHref = isLoggedIn ? "/dashboard" : "/signup?next=/profile";
  const registerHref = isLoggedIn ? "/register" : "/signup?next=/register";
  const isSummitPage = pathname === "/summit";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      {/* Row 1 (desktop/tablet): brand, search, account */}
      <div className="mx-auto hidden max-w-7xl items-center gap-4 px-5 py-4 sm:px-8 md:flex">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={tAria("homeLink")}>
          <Logo className="h-11 w-11" />
          <span className="font-arabic text-xl font-extrabold tracking-tight text-fg">
            منطلق<span className="sr-only"> Mountaliq</span>
          </span>
        </Link>

        <form onSubmit={handleSearchSubmit} role="search" className="flex flex-1 items-center">
          <div className="relative w-full max-w-md">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M11 11L14.5 14.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("findServices")}
              aria-label={t("findServices")}
              className="w-full rounded-sm border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-fg placeholder:text-neutral-400 transition-colors focus:border-cyan-deep focus:outline-none"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          {isSummitPage ? (
            <Link
              href={registerHref}
              className="rounded-full bg-red px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-dark"
            >
              {t("registerCta")}
            </Link>
          ) : (
            <>
              <Link
                href={buyHref}
                className="rounded-full border border-cyan-deep px-4 py-1.5 text-sm font-semibold text-cyan-deep transition-colors hover:bg-cyan/10"
              >
                {t("buyCta")}
              </Link>
              <Link
                href={sellHref}
                className="rounded-full border border-red px-4 py-1.5 text-sm font-semibold text-red-dark transition-colors hover:bg-red/10"
              >
                {t("sellCta")}
              </Link>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
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
            <Link
              href="/login"
              className="text-[15px] font-medium text-neutral-600 transition-colors hover:text-fg"
            >
              {t("login")}
            </Link>
          )}
        </div>
      </div>

      {/* Row 1 (mobile): hamburger left, logo (or search once scrolled) truly centered, Join/bell right */}
      <div className="relative flex items-center justify-between gap-3 px-5 py-4 md:hidden">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center"
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

        {scrolled ? (
          <form onSubmit={handleSearchSubmit} role="search" className="flex flex-1 items-center">
            <div className="relative w-full">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M11 11L14.5 14.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("findServices")}
                aria-label={t("findServices")}
                className="w-full rounded-sm border border-line bg-surface py-2 pl-10 pr-4 text-sm text-fg placeholder:text-neutral-400 focus:border-cyan-deep focus:outline-none"
              />
            </div>
          </form>
        ) : (
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
            aria-label={tAria("homeLink")}
          >
            <Logo className="h-9 w-9" />
            <span className="font-arabic text-lg font-extrabold tracking-tight text-fg">
              منطلق<span className="sr-only"> Mountaliq</span>
            </span>
          </Link>
        )}

        {isLoggedIn && <NotificationBell />}
      </div>

      {/* Buy/Sell (or Register, on the summit page) row: mobile only, always visible */}
      <div className="border-t border-line px-5 pb-3 pt-1 md:hidden">
        {isSummitPage ? (
          <Link
            href={registerHref}
            className="block rounded-full bg-red py-1.5 text-center text-sm font-semibold text-white transition-colors hover:bg-red-dark"
          >
            {t("registerCta")}
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={buyHref}
              className="rounded-full border border-cyan-deep py-1.5 text-center text-sm font-semibold text-cyan-deep transition-colors hover:bg-cyan/10"
            >
              {t("buyCta")}
            </Link>
            <Link
              href={sellHref}
              className="rounded-full border border-red py-1.5 text-center text-sm font-semibold text-red-dark transition-colors hover:bg-red/10"
            >
              {t("sellCta")}
            </Link>
          </div>
        )}
      </div>

      {/* Row 2: browse strip, desktop only */}
      <div className="hidden border-t border-line md:block">
        <nav
          className="mx-auto flex max-w-7xl items-center gap-7 px-5 py-2.5 sm:px-8"
          aria-label={tAria("primaryNav")}
        >
          {browseLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[14px] font-medium transition-colors hover:text-fg ${
                  active ? "text-fg font-semibold" : "text-neutral-600"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {open && (
        <nav
          className="border-t border-line bg-surface px-5 py-4 md:hidden"
          aria-label={tAria("mobileNav")}
        >
          <form onSubmit={handleSearchSubmit} role="search" className="mb-4">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M11 11L14.5 14.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("findServices")}
                aria-label={t("findServices")}
                className="w-full rounded-sm border border-line bg-paper py-2.5 pl-10 pr-4 text-sm text-fg placeholder:text-neutral-400 focus:border-cyan-deep focus:outline-none"
              />
            </div>
          </form>

          <ul className="flex flex-col gap-1">
            {browseLinks.map((link) => {
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
              <li>
                <Link
                  href="/login"
                  className="block rounded-sm px-2 py-3 text-center text-base font-medium text-neutral-600"
                >
                  {t("login")}
                </Link>
              </li>
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
