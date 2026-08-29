import { getTranslations } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/ProfileForm";
import type { Profile } from "@/lib/types";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("profilePage");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const initialProfile: Profile = profile ?? {
    id: user.id,
    name: "",
    headline: "",
    bio: "",
    location: "",
    contact: user.email ?? "",
    category: "SELL",
    avatar_url: "",
    portfolio_images: [],
    services: [],
    updated_at: new Date().toISOString(),
  };

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-[15px] text-neutral-600">
          {t("body")}{" "}
          <Link href="/directory" className="text-cyan-deep hover:underline">
            {t("marketplace")}
          </Link>
          .
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
          >
            Seller dashboard
          </Link>
          <Link
            href="/orders"
            className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
          >
            My orders
          </Link>
          <Link
            href="/messages"
            className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
          >
            Messages
          </Link>
          <Link
            href="/favorites"
            className="inline-flex items-center rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep"
          >
            Favorites
          </Link>
        </div>

        <ProfileForm profile={initialProfile} />
      </div>
    </main>
  );
}
