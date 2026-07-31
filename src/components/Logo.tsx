export default function Logo({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-icon.png"
      alt=""
      aria-hidden="true"
      className={`${className} rounded-[22%] object-contain`}
    />
  );
}
