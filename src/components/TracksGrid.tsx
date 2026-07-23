import Link from "next/link";
import { tracks } from "@/lib/data";

export default function TracksGrid({
  showDetail = false,
  showCategoryTiles = true,
}: {
  showDetail?: boolean;
  showCategoryTiles?: boolean;
}) {
  const seen = new Set<string>();

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
      {tracks.map((track) => {
        const isFirstOfCategory = showCategoryTiles && !seen.has(track.category);
        if (isFirstOfCategory) seen.add(track.category);

        return (
          <div key={track.title} className="contents">
            {isFirstOfCategory && (
              <div className="flex flex-col justify-end bg-ink px-8 py-10 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-red">
                  Category
                </p>
                <p className="mt-4 font-display text-4xl font-black tracking-tight">
                  {track.category}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3 bg-white px-8 py-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-red">
                {track.category}
              </p>
              <h3 className="font-display text-xl font-bold">{track.title}</h3>
              <p className="text-[15px] leading-relaxed text-neutral-600">
                {showDetail ? track.detail : track.description}
              </p>
            </div>
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
        className="inline-flex items-center gap-2 rounded-sm bg-ink px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black"
      >
        Apply for a track
      </Link>
    </div>
  );
}
