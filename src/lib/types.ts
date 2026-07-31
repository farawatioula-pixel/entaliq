export type Service = {
  title: string;
  description: string;
  price: string;
};

export type Profile = {
  id: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  contact: string;
  category: "SELL" | "CREATE" | "BUILD";
  services: Service[];
  updated_at: string;
};
