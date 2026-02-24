import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ashgate Community - Verified Real Estate Experts",
  description:
    "Connect with verified lawyers, agents, solar installers, movers and property experts in Kenya and East Africa. Ashgate Community - trusted professionals for your property journey.",
  openGraph: {
    title: "Community | Ashgate - Verified Real Estate Experts",
    description: "Legal, solar, movers, agents and more. Verified experts for property in Kenya and East Africa.",
    url: "https://www.ashgate.co.ke/community",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
