import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://www.ashgate.co.ke";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ashgate - Premium Real Estate Platform | Kenya & East Africa",
    template: "%s | Ashgate",
  },
  description:
    "Find houses, apartments, land and commercial property in Kenya and East Africa. Ashgate offers premium real estate listings, property management and verified experts. Buy, rent or list property in Nairobi, Mombasa and beyond.",
  keywords: [
    "real estate Kenya",
    "houses for sale Kenya",
    "apartments for rent Nairobi",
    "land for sale East Africa",
    "property Kenya",
    "Ashgate",
    "luxury homes Kenya",
    "commercial property Nairobi",
  ],
  authors: [{ name: "Ashgate Limited", url: siteUrl }],
  creator: "Ashgate Limited",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "Ashgate - Premium Real Estate | Kenya & East Africa",
    title: "Ashgate - Premium Real Estate Platform | Kenya & East Africa",
    description:
      "Find houses, apartments, land and commercial property in Kenya and East Africa. Buy, rent or list with Ashgate.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashgate - Premium Real Estate | Kenya & East Africa",
    description: "Find houses, apartments, land and commercial property in Kenya and East Africa.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: { canonical: siteUrl },
};

import Analytics from "../components/Analytics";
import Screensaver from "../components/Screensaver";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Analytics />
        {children}
        <Screensaver />
      </body>
    </html>
  );
}