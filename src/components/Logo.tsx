export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 24C10 12 20 6 34 8C28 10 22 16 20 24C18 30 14 34 6 34C10 30 11 27 4 24Z"
        stroke="#2f8f3f"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="31" cy="10" r="2" fill="#e0332b" />
    </svg>
  );
}
