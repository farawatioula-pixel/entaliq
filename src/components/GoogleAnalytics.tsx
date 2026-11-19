import Script from "next/script";

/**
 * Google Analytics 4 for the mountaliq.com property.
 *
 * A Measurement ID is not a secret: it is served to every visitor in the page
 * source of any GA site, so it lives here rather than in a secret store, the
 * same way the canonical site URL does in the layout. NEXT_PUBLIC_GA_ID still
 * overrides it, which is what a separate staging property would use.
 */
const DEFAULT_GA_ID = "G-3J4H3GDRHT";

export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID?.trim() || DEFAULT_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
