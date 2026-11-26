/**
 * Stock photos from Pexels (free licence, https://www.pexels.com/license/),
 * served straight from the Pexels CDN, plus a bold colour per category.
 */

export function pexels(id: number, w = 800) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

type Look = { photo: number; color: string };

/** One strong colour + one photo per marketplace category (Fiverr-style cards). */
export const categoryLook: Record<string, Look> = {
  "graphics-design": { photo: 16313504, color: "#7C3AED" },
  "programming-tech": { photo: 12899156, color: "#0E7490" },
  "digital-marketing": { photo: 33384205, color: "#DB2777" },
  "writing-translation": { photo: 6893832, color: "#4338CA" },
  "video-animation": { photo: 9040539, color: "#BE185D" },
  "ai-services": { photo: 8386440, color: "#0369A1" },
  "business-consulting": { photo: 8133809, color: "#1E293B" },
  ecommerce: { photo: 7289727, color: "#4D7C0F" },
};

const fallback: Look = { photo: 3966236, color: "#0D1220" };

export function lookFor(category: string | null | undefined): Look {
  return (category && categoryLook[category]) || fallback;
}

/** A second photo per category, used on guide cards so they don't repeat the category tiles. */
export const guidePhotoByCategory: Record<string, number> = {
  "graphics-design": 7015034,
  "programming-tech": 7988086,
  "digital-marketing": 7634159,
  "writing-translation": 4240571,
  "video-animation": 8770482,
  "ai-services": 8386437,
  "business-consulting": 7679568,
  ecommerce: 7857553,
};

/** Marketplace hero collage. */
export const marketplaceHeroPhotos = [3966236, 16313504, 7289727, 12899156];
