import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Listings - Houses, Apartments, Land & Commercial",
  description:
    "Browse houses for sale and rent, apartments, land and commercial property in Kenya and East Africa. Filter by location, price and type. Ashgate premium real estate listings.",
  openGraph: {
    title: "Property Listings | Ashgate - Kenya & East Africa",
    description: "Browse houses, apartments, land and commercial property. Buy or rent in Kenya and East Africa.",
    url: "https://www.ashgate.co.ke/listings",
  },
};

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
