export type Track = {
  category: "SELL" | "CREATE" | "BUILD";
  title: string;
  description: string;
  detail: string;
};

export const tracks: Track[] = [
  {
    category: "SELL",
    title: "E-commerce & Online Selling",
    description:
      "Build and run an online store from scratch — products, logistics, and cash-on-delivery.",
    detail:
      "Trainees set up a real storefront, source or list products, and learn the cash-on-delivery logistics that make or break online selling in Jordan. By the end of the week, the store is live.",
  },
  {
    category: "SELL",
    title: "Affiliate Marketing",
    description:
      "Earn commissions promoting products you don't own — no inventory, no upfront cost.",
    detail:
      "No inventory, no upfront capital. Trainees learn to pick offers, build an audience, and track commissions across platforms that pay out in Jordan.",
  },
  {
    category: "CREATE",
    title: "Content Creation & Monetization",
    description:
      "Turn your voice, camera, or keyboard into a revenue stream across platforms.",
    detail:
      "From short-form video to written content, trainees learn the monetization mechanics of each platform and leave with a content system they can keep running after the week ends.",
  },
  {
    category: "CREATE",
    title: "Freelancing & Remote Services",
    description:
      "Sell your skills to clients worldwide — design, writing, translation, and more.",
    detail:
      "Trainees build a portfolio, set up a profile on global freelance platforms, and land their pricing and pitch for design, writing, translation, and other in-demand remote services.",
  },
  {
    category: "CREATE",
    title: "Digital Products",
    description:
      "Create once, sell forever — templates, guides, courses, and downloadable assets.",
    detail:
      "One product, sold indefinitely. Trainees design and package a template, guide, or mini-course and set up the storefront to sell it without ongoing labor.",
  },
  {
    category: "BUILD",
    title: "AI-Powered Coding (Vibe Coding / No-Code)",
    description:
      "Build real apps and tools using AI — no coding background required.",
    detail:
      "No computer science degree required. Trainees use AI-assisted and no-code tools to ship a working app or automation by the end of the training.",
  },
  {
    category: "BUILD",
    title: "Paid AI Services",
    description:
      "Offer AI-powered services to local businesses — automation, content, and more.",
    detail:
      "Trainees learn to package AI capabilities — automation, content generation, chat support — into services they can pitch and sell to local businesses.",
  },
];

export type Trainer = {
  number: string;
  name: string;
  focus: string;
  bio: string;
};

export const trainers: Trainer[] = [
  {
    number: "01",
    name: "Abdallah Battah",
    focus: "Marketing Strategy & Sales",
    bio: "Leads trainees through positioning, pricing, and the sales conversations that turn a new digital skill into paying clients.",
  },
  {
    number: "02",
    name: "Othman Hato",
    focus: "Affiliate Marketing",
    bio: "Practitioner in commission-based marketing, teaching trainees how to choose offers and build an audience that converts.",
  },
  {
    number: "03",
    name: "Hala Abu Shalbak",
    focus: "Vibe Coding & AI Business Automation",
    bio: "Shows trainees how to use AI tools to build real software and automate business processes with no coding background.",
  },
  {
    number: "04",
    name: "Diaa Abu Shamlah",
    focus: "E-commerce — eBay & Amazon",
    bio: "Runs cross-border e-commerce operations and trains sellers on sourcing, listing, and logistics for global marketplaces.",
  },
];

export const partners = ["Orange Jordan", "Bromine", "JBC", "Talabat Jordan"];

export const stats = [
  {
    value: "46%",
    label: "Youth unemployment rate in Jordan — one of the highest in the region",
  },
  {
    value: "7",
    label: "Digital economy sectors requiring zero capital, no degree, no connections",
  },
  {
    value: "80%",
    label: "Of Jordan's youth opportunities concentrated in Amman — leaving the governorates behind",
  },
];

export const gaps = [
  {
    title: "A Real Economic Gap",
    body: "The global digital economy — freelancing, e-commerce, affiliate marketing, AI services — requires no degree, no connections, and no large capital. Just a skill, a phone, and an internet connection.",
  },
  {
    title: "Free Content Isn't Enough",
    body: "What's available online is theoretical and scattered, and doesn't address Jordan's market specifically: cash-on-delivery logistics, the difficulty of building complex websites, and a beginner's limited starting capital.",
  },
  {
    title: "The Geographic Gap",
    body: "Training and job opportunities are concentrated in Amman; youth in the governorates and rural areas — like Ghor Al-Safi — are geographically distant from them, even though digital work requires no relocation at all.",
  },
  {
    title: "A Model That Doesn't End With the Funding",
    body: "Traditional initiatives rely on a grant or temporary funding and stop once it runs out. Intaleq is designed as a self-sustaining event — modeled on ArabNet — so the platform continues beyond any initial support.",
  },
];

export const promise = [
  {
    title: "For the Trainee",
    body: "A marketable skill within days, not months — and a real product or project ready to sell by the end of training, not just a certificate of attendance.",
  },
  {
    title: "For the Local Community",
    body: "A new income source that grows from within it — its crafts, products, and services — instead of full dependence on aid or migrating elsewhere for work.",
  },
  {
    title: "For Partners & Sponsors",
    body: "A national annual platform that directly ties your name to youth economic empowerment, with measurable impact: number of trainees, income generated, projects actually launched.",
  },
  {
    title: "For the Sector",
    body: "A tested, replicable model that can be expanded to other governorates once its success in Ghor Al-Safi is proven.",
  },
];

export const nextSteps = [
  "Lock in the 2026 partnership",
  "Set the dates",
  "Close out the trainer team",
  "Open registration",
  "Logistics",
];
