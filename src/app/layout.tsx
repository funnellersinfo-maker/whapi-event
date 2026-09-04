import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE_CONFIG } from "@/config/site";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.seo.siteUrl),
  title: SITE_CONFIG.seo.title,
  description: SITE_CONFIG.seo.description,
  applicationName: SITE_CONFIG.brand,
  authors: [{ name: SITE_CONFIG.brand }],
  keywords: [
    "WhatsApp IA",
    "agente IA WhatsApp",
    "WhatsApp API",
    "automatización ventas",
    "ventasher IA",
    "evento en vivo gratuito",
    "meta ads whatsapp",
  ],
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#050B08"/><path d="M32 12a19 19 0 0 0-16.4 28.6L12 52l11.8-3.4A19 19 0 1 0 32 12Z" fill="#25D366"/><path d="m24.6 21.4c.5-1.1 1-1.1 1.6-1.1h1.2c.4 0 1-.2 1.5 1.1.6 1.4 2 4.8 2.1 5.1.2.4.3.8.1 1.2-.2.4-.3.7-.6 1-.3.4-.7.9-1 1.2-.3.3-.7.7-.3 1.4.4.7 1.5 2.4 3.1 3.9 2.1 1.9 3.9 2.5 4.5 2.8.6.3 1 .3 1.3-.1.4-.4 1.5-1.7 1.9-2.3.4-.6.8-.5 1.4-.3.5.2 3.4 1.6 4 1.9.6.3 1 .4 1.1.7.2.2.2 1.2-.3 2.4-.5 1.1-2.6 2.3-3.6 2.4-1 .1-1.9.5-6.3-1.3-5.3-2.2-8.7-7.6-9-7.9-.3-.4-2.1-2.9-2.1-5.5 0-2.6 1.4-3.9 1.9-4.4.4-.6.9-.7 1.2-.7h.9c.2 0 .6-.1 1 .8Z" fill="#04120A"/></svg>`
          ),
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: SITE_CONFIG.seo.title,
    description: SITE_CONFIG.seo.description,
    url: SITE_CONFIG.seo.siteUrl,
    siteName: SITE_CONFIG.brand,
    type: "website",
    locale: "es_CO",
    images: [
      {
        url: SITE_CONFIG.seo.ogImage,
        width: 1440,
        height: 720,
        alt: SITE_CONFIG.seo.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.seo.title,
    description: SITE_CONFIG.seo.description,
    images: [SITE_CONFIG.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // móvil estático: sin pinch-zoom
  viewportFit: "cover",
  themeColor: "#050B08",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.brand,
  description: SITE_CONFIG.seo.description,
  url: SITE_CONFIG.seo.siteUrl,
};

/**
 * META PIXEL CODE — oficial, inyectado al inicio del <body> (se ejecuta
 * durante el parseo del HTML, antes de la hidratación): init + PageView.
 * Los botones de la landing disparan "Lead" vía src/lib/tracking.ts.
 */
const META_PIXEL_SNIPPET = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${SITE_CONFIG.tracking.pixelId}');
fbq('track', 'PageView');`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        {/* Meta Pixel Code */}
        {SITE_CONFIG.tracking.pixelId ? (
          <>
            <script dangerouslySetInnerHTML={{ __html: META_PIXEL_SNIPPET }} />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${SITE_CONFIG.tracking.pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        ) : null}
        {/* End Meta Pixel Code */}

        {children}
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
