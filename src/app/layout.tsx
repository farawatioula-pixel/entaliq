import type { Metadata } from "next";
import { Space_Grotesk, Tajawal, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const tajawal = Tajawal({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Intaleq 2026 — Jordan's Digital Youth Income & Training Platform",
  description:
    "Intaleq 2026: Jordan's Digital Youth Income & Training Platform. Sell. Create. Build. An annual conference in Amman plus hands-on training in Ghor Al-Safi.",
  metadataBase: new URL("https://intaleq.example"),
  openGraph: {
    title: "Intaleq 2026 — Jordan's Digital Youth Income & Training Platform",
    description:
      "Sell. Create. Build. Jordan's national platform turning youth into digital earners — one training week at a time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${tajawal.variable} ${inter.variable} antialiased bg-ink text-fg`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
