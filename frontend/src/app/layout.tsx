import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ashgate - Premium Real Estate Platform | East Africa",
  description: "Discover premium properties across East Africa. From luxury homes to prime land, Ashgate connects you with the best real estate opportunities.",
  keywords: "real estate, properties, Kenya, East Africa, luxury homes, land, apartments, commercial",
  authors: [{ name: "Ashgate Ltd" }],
  openGraph: {
    title: "Ashgate - Premium Real Estate Platform",
    description: "Discover premium properties across East Africa",
    url: "https://ashgate.co.ke",
    siteName: "Ashgate",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashgate - Premium Real Estate Platform",
    description: "Discover premium properties across East Africa",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Analytics from "../components/Analytics";

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
      </body>
    </html>
  );
}