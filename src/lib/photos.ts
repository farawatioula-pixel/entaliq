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
  | "green-phone"
  | "phones-hands"
  | "lab-desk"
  | "computer-lab"
  | "whiteboard"
  | "ecommerce"
  | "screen-demo"
  | "consulting";

/** Where the eye should land when the photo is cropped (CSS object-position). */
const focus: Partial<Record<WorkPhoto, string>> = {
  sketching: "60% 40%",
  "green-phone": "50% 30%",
  "phones-hands": "55% 65%",
  "lab-desk": "50% 50%",
  whiteboard: "70% 40%",
  ecommerce: "65% 40%",
  "screen-demo": "45% 40%",
  consulting: "40% 35%",
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
  "graphics-design": { photo: "screen-demo", color: "#7C3AED" },
  "programming-tech": { photo: "computer-lab", color: "#0E7490" },
  "digital-marketing": { photo: "phones-hands", color: "#DB2777" },
  "writing-translation": { photo: "sketching", color: "#4338CA" },
  "video-animation": { photo: "green-phone", color: "#BE185D" },
  "ai-services": { photo: "whiteboard", color: "#0369A1" },
  "business-consulting": { photo: "consulting", color: "#1E293B" },
  ecommerce: { photo: "lab-desk", color: "#4D7C0F" },
};

const fallback: Look = { photo: "sketching", color: "#0D1220" };

export function lookFor(category: string | null | undefined): Look {
  return (category && categoryLook[category]) || fallback;
}

/** A second photo per category, used on guide cards so they don't repeat the category tiles. */
export const guidePhotoByCategory: Record<string, WorkPhoto> = {
  "graphics-design": "green-phone",
  "programming-tech": "lab-desk",
  "digital-marketing": "ecommerce",
  "writing-translation": "screen-demo",
  "video-animation": "phones-hands",
  "ai-services": "computer-lab",
  "business-consulting": "whiteboard",
  ecommerce: "phones-hands",
};

/** Marketplace hero collage: four different people, all mid-task. */
export const marketplaceHeroPhotos: WorkPhoto[] = ["sketching", "whiteboard", "green-phone", "screen-demo"];

/** The two doors on /start. */
export const doorPhotos = { sell: "sketching", buy: "phones-hands" } as const satisfies Record<string, WorkPhoto>;

/** Marketplace category chips keep their original colourful stock photos (Pexels, free licence). */
export const chipStockPhotos: Record<string, number> = {
  "graphics-design": 16313504,
  "programming-tech": 12899156,
  "digital-marketing": 33384205,
  "writing-translation": 6893832,
  "video-animation": 9040539,
  "ai-services": 8386440,
  "business-consulting": 8133809,
  ecommerce: 7289727,
};

export function pexels(id: number, w = 800) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}
