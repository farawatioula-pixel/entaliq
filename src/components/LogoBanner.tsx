import Logo from "./Logo";

export default function LogoBanner() {
  return (
    <div
      className="relative mx-auto h-14 w-full max-w-sm sm:h-16 sm:max-w-md"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan to-transparent" />
      <div className="logo-travel-icon h-10 w-10 rounded-[22%] bg-ink shadow-[0_0_18px_2px_rgba(34,211,238,0.45)] sm:h-11 sm:w-11">
        <Logo className="h-full w-full" />
      </div>
    </div>
  );
}
