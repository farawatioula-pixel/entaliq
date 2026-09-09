import type { ProfileCategory } from "@/lib/types";

export const categoryOrder: ProfileCategory[] = [
  "graphics-design",
  "programming-tech",
  "digital-marketing",
  "writing-translation",
  "video-animation",
  "ai-services",
  "business-consulting",
  "ecommerce",
];

export const categoryAccent: Record<ProfileCategory, string> = {
  "graphics-design": "text-violet-deep",
  "programming-tech": "text-cyan-deep",
  "digital-marketing": "text-red-dark",
  "writing-translation": "text-violet-deep",
  "video-animation": "text-red-dark",
  "ai-services": "text-cyan-deep",
  "business-consulting": "text-violet-deep",
  ecommerce: "text-cyan-deep",
};

function iconPath(category: ProfileCategory) {
  switch (category) {
    case "graphics-design":
      return (
        <>
          <circle cx="9" cy="9" r="6.5" />
          <circle cx="15" cy="15" r="6.5" />
        </>
      );
    case "programming-tech":
      return <path d="M8 6L3 12L8 18M16 6L21 12L16 18" />;
    case "digital-marketing":
      return <path d="M3 11L21 4L14 22L11 13L3 11Z" />;
    case "writing-translation":
      return <path d="M4 20L5.5 14.5L16 4L20 8L9.5 18.5L4 20Z" />;
    case "video-animation":
      return (
        <>
          <rect x="3" y="6" width="13" height="12" rx="1.5" />
          <path d="M16 10L21 7V17L16 14" />
        </>
      );
    case "ai-services":
      return <path d="M12 3L14 9L20 11L14 13L12 19L10 13L4 11L10 9L12 3Z" />;
    case "business-consulting":
      return (
        <>
          <rect x="3" y="8" width="18" height="12" rx="1.5" />
          <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </>
      );
    case "ecommerce":
      return (
        <>
          <path d="M4 8h16l-1.5 10.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 8Z" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
        </>
      );
  }
}

export function CategoryIcon({ category, className = "" }: { category: ProfileCategory; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPath(category)}
    </svg>
  );
}
