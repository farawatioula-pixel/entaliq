import Link from "next/link";
import { tracks, type Track } from "@/lib/data";

const categories: Track["category"][] = ["SELL", "CREATE", "BUILD"];

const categoryColor: Record<Track["category"], string> = {
  SELL: "text-cyan",
  CREATE: "text-muted",
  BUILD: "text-red",
};

export default function TracksGrid({ showDetail = false }: { showDetail?: boolean }) {
  return (
    <div className="space-y-px">
      {categories.map((category) => {
        const items = tracks.filter((t) => t.category === category);
        const cols = Math.min(items.length, 3);
        const accent = categoryColor[category];

        return (
          <div key={category} className="border border-line">
            <div
              className="grid"
              style={{ gridTemplateColumns: `minmax(0,1fr) repeat(${cols - 1}, minmax(0,1fr))` }}
            >
              <div className="flex flex-col justify-end border-b border-line bg-ink px-8 py-10 text-white sm:border-b-0 sm:border-r">
                <p className={`text-xs font-semibold uppercase tracking-widest ${accent}`}>
                  Category
                </p>
                <p className="mt-4 font-display text-4xl font-black tracking-tight">
                  {category}
                </p>
              </div>

              {items.slice(0, 1).map((track) => (
                <div
                  key={track.title}
                  className="flex flex-col gap-3 border-b border-line bg-surface px-8 py-10 sm:border-b-0 sm:border-r last:sm:border-r-0"
                >
                  <p className={`text-xs font-semibold uppercase tracking-widest ${accent}`}>
                    {track.category}
                  </p>
                  <h3 className="font-display text-xl font-bold text-fg">{track.title}</h3>
                  <p className="text-[15px] leading-relaxed text-neutral-300">
                    {showDetail ? track.detail : track.description}
                  </p>
                </div>
              ))}
            </div>

            {items.length > 1 && (
              <div
                className="grid border-t border-line"
                style={{ gridTemplateColumns: `repeat(${Math.min(items.length - 1, 3)}, minmax(0,1fr))` }}
              >
                {items.slice(1).map((track, i) => (
                  <div
                    key={track.title}
                    className={`flex flex-col gap-3 border-line bg-surface px-8 py-10 ${
                      i > 0 ? "border-t sm:border-t-0 sm:border-l" : ""
                    }`}
                  >
                    <p className={`text-xs font-semibold uppercase tracking-widest ${accent}`}>
                      {track.category}
                    </p>
                    <h3 className="font-display text-xl font-bold text-fg">{track.title}</h3>
                    <p className="text-[15px] leading-relaxed text-neutral-300">
                      {showDetail ? track.detail : track.description}
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
  return (
    <div className="mt-10 flex justify-center">
      <Link
        href="/register"
        className="inline-flex items-center gap-2 rounded-sm bg-surface border border-line px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-line"
      >
        Apply for a track
      </Link>
    </div>
  );
}
