import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { tracks, type Track, type Locale } from "@/lib/data";

const categories: Track["category"][] = ["SELL", "CREATE", "BUILD"];

const categoryColor: Record<Track["category"], string> = {
  SELL: "text-cyan-deep",
  CREATE: "text-violet-deep",
  BUILD: "text-red-dark",
};

const categoryColorOnDark: Record<Track["category"], string> = {
  SELL: "text-cyan",
  CREATE: "text-violet",
  BUILD: "text-red",
};

const gridColsClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
};

export default function TracksGrid({ showDetail = false }: { showDetail?: boolean }) {
  const t = useTranslations("categories");
  const locale = useLocale() as Locale;

  return (
    <div className="space-y-px">
      {categories.map((category) => {
        const items = tracks.filter((tr) => tr.category === category);
        const accent = categoryColor[category];
        const accentOnDark = categoryColorOnDark[category];

        return (
          <div key={category} className="border border-line">
            <div className={`grid ${gridColsClass[2]}`}>
              <div className="flex flex-col justify-end border-b border-line bg-ink px-6 py-8 text-white sm:border-b-0 sm:border-e sm:px-8 sm:py-10">
                <p className={`text-xs font-semibold uppercase tracking-widest ${accentOnDark}`}>
                  {t("category")}
                </p>
                <p className="mt-4 font-display text-4xl font-bold tracking-tight">
                  {t(category)}
                </p>
              </div>

              {items.slice(0, 1).map((track) => (
                <div
                  key={track.title.en}
                  className="flex flex-col gap-3 border-b border-line bg-surface px-6 py-8 sm:border-b-0 sm:border-e sm:px-8 sm:py-10 last:sm:border-e-0"
                >
                  <p className={`text-xs font-semibold uppercase tracking-widest ${accent}`}>
                    {t(track.category)}
                  </p>
                  <h3 className="font-display text-xl font-bold text-fg">
                    {track.title[locale]}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-neutral-600">
                    {showDetail ? track.detail[locale] : track.description[locale]}
                  </p>
                </div>
              ))}
            </div>

            {items.length > 1 && (
              <div
                className={`grid border-t border-line ${gridColsClass[Math.min(items.length - 1, 3)]}`}
              >
                {items.slice(1).map((track, i) => (
                  <div
                    key={track.title.en}
                    className={`flex flex-col gap-3 border-line bg-surface px-6 py-8 sm:px-8 sm:py-10 ${
                      i > 0 ? "border-t sm:border-t-0 sm:border-s" : ""
                    }`}
                  >
                    <p className={`text-xs font-semibold uppercase tracking-widest ${accent}`}>
                      {t(track.category)}
                    </p>
                    <h3 className="font-display text-xl font-bold text-fg">
                      {track.title[locale]}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-neutral-600">
                      {showDetail ? track.detail[locale] : track.description[locale]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function TracksCTA() {
  const t = useTranslations("tracksPage");
  return (
    <div className="mt-10 flex justify-center">
      <Link
        href="/register"
        className="inline-flex items-center gap-2 rounded-sm bg-surface border border-line px-7 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-line"
      >
        {t("applyForTrack")}
      </Link>
    </div>
  );
}
