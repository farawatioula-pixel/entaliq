export type Service = {
  title: string;
  description: string;
  price: string;
};

export type ProfileCategory =
  | "graphics-design"
  | "programming-tech"
  | "digital-marketing"
  | "writing-translation"
  | "video-animation"
  | "ai-services"
  | "business-consulting"
  | "ecommerce";

export type Profile = {
  id: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  contact: string;
  category: ProfileCategory;
  avatar_url: string;
  portfolio_images: string[];
  services: Service[];
  updated_at: string;
};
