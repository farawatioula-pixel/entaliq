import type { Metadata } from "next";
import { Space_Grotesk, Tajawal, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/summit";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import SourceCapture from "@/components/SourceCapture";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(siteUrl()),
    // "./" resolves against metadataBase plus the current route, so each page
    // declares itself canonical on the www host. Without this there is no
    // canonical tag at all and the www and bare hosts compete as duplicates.
    alternates: { canonical: "./" },
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      type: "website",
      url: "./",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${spaceGrotesk.variable} ${tajawal.variable} ${inter.variable} antialiased bg-paper text-fg ${
          locale === "ar" ? "font-arabic" : ""
        }`}
      >
        <script
          type="application/ld+json"
          // Tells Google that "منطلق" and the Latin spellings are one organisation.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "منطلق",
              alternateName: ["Mountaliq", "Muntaliq", "Muntalaq", "Montaliq", "منطلق 2026"],
              url: `${siteUrl()}/ar`,
              logo: `${siteUrl()}/logo-icon.png`,
              description:
                "منطلق: القمة العربية لمهارات الاقتصاد الرقمي، وسوق للعمل الحر وتدريب عملي في عمّان، الأردن.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Amman",
                addressCountry: "JO",
              },
              parentOrganization: {
                "@type": "Organization",
                name: "Mixed Sources Impact Strategy & Communications",
              },
            }),
          }}
        />
        <NextIntlClientProvider>
          <ServiceWorkerRegister />
          <SourceCapture />
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
