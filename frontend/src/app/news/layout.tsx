import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Insights",
  description:
    "Real estate news, market trends and expert insights for Kenya and East Africa. Ashgate news and articles on property, land and construction.",
  openGraph: {
    title: "News & Insights | Ashgate Real Estate",
    description: "Real estate news, market trends and expert insights for Kenya and East Africa.",
    url: "https://www.ashgate.co.ke/news",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
