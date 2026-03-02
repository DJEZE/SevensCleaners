import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sevenscleaners.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Sevens Cleaners — Professional Home Cleaning in Houston",
    template: "%s | Sevens Cleaners",
  },
  description:
    "Book professional residential cleaning in the Greater Houston area. Vetted, insured cleaners. Flat-rate pricing starting at $120. Real-time SMS updates. No phone calls — book in under 3 minutes.",
  keywords: [
    "house cleaning Houston",
    "home cleaning service Houston",
    "residential cleaning Houston TX",
    "apartment cleaning Houston",
    "maid service Houston",
    "deep cleaning Houston",
    "move in move out cleaning Houston",
    "book cleaning online",
    "Sevens Cleaners",
  ],
  authors: [{ name: "Sevens Cleaners" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Sevens Cleaners",
    title: "Sevens Cleaners — Professional Home Cleaning in Houston",
    description:
      "Vetted, insured cleaners. Flat-rate pricing starting at $120. Book your cleaning online in under 3 minutes. Real-time SMS and email updates.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Sevens Cleaners logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Sevens Cleaners — Professional Home Cleaning in Houston",
    description:
      "Flat-rate residential cleaning starting at $120. Book online, pay securely, get real-time updates. Greater Houston area.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: APP_URL,
  },
  other: {
    "llms-txt": `${APP_URL}/llms.txt`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": APP_URL,
  name: "Sevens Cleaners",
  description:
    "Professional residential cleaning service in the Greater Houston area. Book online in minutes. Vetted, insured cleaners. Flat-rate pricing.",
  url: APP_URL,
  email: "Support@Sevenscleaners.com",
  image: `${APP_URL}/logo.png`,
  priceRange: "$$",
  currenciesAccepted: "USD",
  paymentAccepted: "Credit Card, Debit Card",
  areaServed: {
    "@type": "City",
    name: "Houston",
    containedInPlace: {
      "@type": "State",
      name: "Texas",
    },
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Residential Cleaning Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "1 Bedroom Cleaning",
          description: "Full standard clean of a 1-bedroom home or apartment.",
        },
        price: "120.00",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "2 Bedroom Cleaning",
          description: "Full standard clean of a 2-bedroom home or apartment.",
        },
        price: "175.00",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Deep Clean Add-On",
          description: "Baseboards, inside cabinets, window sills & all the spots a regular clean skips.",
        },
        price: "50.00",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Move In / Move Out Cleaning",
          description: "Top-to-bottom deep clean to get your deposit back or start fresh in a new place.",
        },
        price: "75.00",
        priceCurrency: "USD",
      },
    ],
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
