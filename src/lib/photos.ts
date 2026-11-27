/**
 * Mountaliq's own photos from the training camps (Ghor Al-Safi and Amman),
 * resized into public/photos/work/. Each has a large version (1200px) and a
 * small thumbnail ("-sm", 240px) for icons and chips.
 *
 * To add more: drop the original into public/photos/, make the two sizes,
 * and add the name to WorkPhoto below.
 */

export type WorkPhoto =
  | "sketching"
  | "client-chat"
  | "phones"
  | "teamwork"
  | "huddle"
  | "computer-lab"
  | "whiteboard"
  | "ecommerce"
  | "screen-demo"
  | "consulting"
  | "classroom"
  | "listening";

/** Where the eye should land when the photo is cropped (CSS object-position). */
const focus: Partial<Record<WorkPhoto, string>> = {
  sketching: "60% 40%",
  "client-chat": "70% 35%",
  phones: "55% 40%",
  teamwork: "45% 35%",
  huddle: "45% 40%",
  whiteboard: "70% 40%",
  ecommerce: "65% 40%",
  "screen-demo": "50% 40%",
  consulting: "40% 35%",
  classroom: "60% 50%",
  listening: "40% 70%",
};

export function photo(name: WorkPhoto, size: "lg" | "sm" = "lg") {
  return `/photos/work/${name}${size === "sm" ? "-sm" : ""}.jpg`;
}

export function photoFocus(name: WorkPhoto) {
  return focus[name] ?? "50% 50%";
}

type Look = { photo: WorkPhoto; color: string };

/** One strong colour + one photo per marketplace category (Fiverr-style cards). */
export const categoryLook: Record<string, Look> = {
  "graphics-design": { photo: "sketching", color: "#7C3AED" },
  "programming-tech": { photo: "computer-lab", color: "#0E7490" },
  "digital-marketing": { photo: "phones", color: "#DB2777" },
  "writing-translation": { photo: "client-chat", color: "#4338CA" },
  "video-animation": { photo: "screen-demo", color: "#BE185D" },
  "ai-services": { photo: "whiteboard", color: "#0369A1" },
  "business-consulting": { photo: "consulting", color: "#1E293B" },
  ecommerce: { photo: "huddle", color: "#4D7C0F" },
};

const fallback: Look = { photo: "teamwork", color: "#0D1220" };

export function lookFor(category: string | null | undefined): Look {
  return (category && categoryLook[category]) || fallback;
}

/** A second photo per category, used on guide cards so they don't repeat the category tiles. */
export const guidePhotoByCategory: Record<string, WorkPhoto> = {
  "graphics-design": "teamwork",
  "programming-tech": "classroom",
  "digital-marketing": "ecommerce",
  "writing-translation": "sketching",
  "video-animation": "listening",
  "ai-services": "computer-lab",
  "business-consulting": "client-chat",
  ecommerce: "phones",
};

/** Marketplace hero collage: people at work. */
export const marketplaceHeroPhotos: WorkPhoto[] = ["sketching", "client-chat", "phones", "teamwork"];

/** The two doors on /start. */
export const doorPhotos = { sell: "sketching", buy: "client-chat" } as const satisfies Record<string, WorkPhoto>;
