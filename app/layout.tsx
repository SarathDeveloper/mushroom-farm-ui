import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "Vellimalai Mushroom Farm | Premium Organic Mushrooms",
    template: "%s | Vellimalai Farms",
  },
  description: "Fresh, premium mushrooms grown in the pristine Kalvarayan Hills. We offer farm-fresh delivery, pre-orders, and mushroom farming training.",
  keywords: ["organic mushrooms", "fresh mushrooms delivery", "mushroom farming training", "mushroom pre-order", "oyster mushroom", "milky mushroom", "Salem", "Tamil Nadu"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vellimalaifarms.in",
    siteName: "Vellimalai Mushroom Farm",
    title: "Vellimalai Mushroom Farm | Premium Organic Mushrooms",
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
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Vellimalai Mushroom Farm",
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
              priceRange: "₹120 - ₹520",
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
