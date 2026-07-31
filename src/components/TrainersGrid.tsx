import { trainers } from "@/lib/data";

export default function TrainersGrid({ showBio = false }: { showBio?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {trainers.map((trainer) => (
        <div key={trainer.number} className="relative overflow-hidden bg-paper px-8 py-10">
          <span className="absolute right-4 top-2 font-display text-6xl font-bold text-ink/5">
            {trainer.number}
          </span>
          <p className="relative font-display text-sm font-bold text-red-dark">{trainer.number}</p>
          <h3 className="relative mt-3 font-display text-xl font-bold text-fg">{trainer.name}</h3>
          <p className="relative mt-1 text-[15px] text-neutral-600">{trainer.focus}</p>
          {showBio && (
            <p className="relative mt-4 text-sm leading-relaxed text-neutral-600">
              {trainer.bio}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
