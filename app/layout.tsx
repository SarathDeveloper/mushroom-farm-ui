import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { formatCurrency } from "@/lib/utils";

const effra = localFont({
  src: [
    {
      path: "./fonts/effra/EffraVF_Trial_Wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/effra/EffraVF_Trial_WghtItal.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Sri Amman Mushroom Farms | Premium Organic Mushrooms",
    template: "%s | Sri Amman Mushroom Farms",
  },
  description: "Fresh, premium mushrooms grown in the pristine Kalvarayan Hills. We offer farm-fresh delivery, pre-orders, and mushroom farming training.",
  keywords: ["organic mushrooms", "fresh mushrooms delivery", "mushroom farming training", "mushroom pre-order", "oyster mushroom", "milky mushroom", "Salem", "Tamil Nadu"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vellimalaifarms.in",
    siteName: "Sri Amman Mushroom Farms",
    title: "Sri Amman Mushroom Farms | Premium Organic Mushrooms",
    description: "Fresh, premium mushrooms grown in the pristine Kalvarayan Hills.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${effra.variable} ${playfair.variable} h-full antialiased`}
      style={{ ["--font-heading" as string]: "var(--font-sans)" }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Sri Amman Mushroom Farms",
              description: "Premium organic mushrooms grown in the Kalvarayan Hills, Tamil Nadu",
              url: "https://vellimalaifarms.in",
              telephone: "+919876543210",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Vellimalai, Kalvarayan Hills",
                addressLocality: "Salem",
                addressRegion: "Tamil Nadu",
                postalCode: "636001",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "11.7480",
                longitude: "78.5580",
              },
              openingHours: "Mo-Sa 08:00-18:00",
              priceRange: `${formatCurrency(120)} - ${formatCurrency(520)}`,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "432",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
