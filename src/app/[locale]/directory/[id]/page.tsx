import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import PortfolioGallery from "@/components/PortfolioGallery";
import ServicePackages from "@/components/ServicePackages";
import type { Profile } from "@/lib/types";

const categoryColor: Record<Profile["category"], string> = {
  SELL: "text-cyan-deep",
  CREATE: "text-violet-deep",
  BUILD: "text-red-dark",
};

const categoryBg: Record<Profile["category"], string> = {
  SELL: "bg-cyan/10",
  CREATE: "bg-violet/10",
  BUILD: "bg-red/10",
};

export default async function DirectoryProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("directoryProfilePage");
  const categoryLabels = t.raw("categoryLabels") as Record<Profile["category"], string>;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile || !profile.name) {
    notFound();
  }

  const p = profile as Profile;
  const initial = p.name.trim().charAt(0).toUpperCase() || "?";
  const portfolioImages = p.portfolio_images ?? [];

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/directory"
          className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-fg"
        >
          <span className="inline-block rtl:-scale-x-100">←</span> {t("backToDirectory")}
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div
            className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line ${categoryBg[p.category]} sm:h-28 sm:w-28`}
          >
            {p.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.avatar_url}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className={`font-display text-4xl font-bold ${categoryColor[p.category]}`}>
                {initial}
              </span>
            )}
          </div>

          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${categoryColor[p.category]}`}>
              {categoryLabels[p.category]}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-fg sm:text-4xl">{p.name}</h1>
            {p.headline && <p className="mt-2 text-lg text-neutral-600">{p.headline}</p>}
            {p.location && <p className="mt-1 text-sm text-neutral-600">{p.location}</p>}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main column */}
          <div>
            {portfolioImages.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 font-display text-xl font-bold text-fg">{t("portfolio")}</h2>
                <PortfolioGallery images={portfolioImages} />
              </div>
            )}

            {p.bio && (
              <div>
                <h2 className="font-display text-xl font-bold text-fg">{t("about")}</h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
                  {p.bio}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ServicePackages
              services={p.services}
              contact={p.contact}
              servicesLabel={t("services")}
              contactLabel={t("contact")}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
