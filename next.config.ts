import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "framer-motion",
      "embla-carousel-react",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24,
  },
  // With online ordering off (see lib/features.ts) the customer order and
  // account pages aren't reachable. /login stays for admins.
  async redirects() {
    if (process.env.NEXT_PUBLIC_ORDERS_ENABLED === "true") return [];
    return [
      { source: "/cart", destination: "/shop", permanent: false },
      { source: "/checkout", destination: "/shop", permanent: false },
      { source: "/orders", destination: "/contact", permanent: false },
      { source: "/track-order", destination: "/contact", permanent: false },
      { source: "/account", destination: "/", permanent: false },
      { source: "/register", destination: "/contact", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      // Immutable caching is correct for hashed production assets, but in
      // development Turbopack reuses chunk URLs across HMR updates. Serving
      // those with `immutable` causes stale module factories (e.g. lucide icons).
      ...(process.env.NODE_ENV === "production"
        ? [
            {
              source: "/_next/static/:path*",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
            },
          ]
        : []),
    ];
  },
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default withSentryConfig(nextConfig, {
  widenClientFileUpload: true,
  disableLogger: true,
  silent: process.env.NODE_ENV !== "development",
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
