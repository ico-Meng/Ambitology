import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lack of Business or Domain Context: Why Pure Coding Is No Longer Enough | Ambitology",
  description:
    "Pure coding skill used to be sufficient. It no longer is. Hiring teams increasingly look for communication, product thinking, and domain understanding. Here's how to build and signal all three.",
  alternates: {
    canonical: "https://ambitology.com/learn/career-insights/lack-of-business-or-domain-context",
  },
  openGraph: {
    title: "Lack of Business or Domain Context: Why Pure Coding Is No Longer Enough | Ambitology",
    description:
      "Pure coding skill used to be sufficient. It no longer is. Hiring teams increasingly look for communication, product thinking, and domain understanding. Here's how to build and signal all three.",
    url: "https://ambitology.com/learn/career-insights/lack-of-business-or-domain-context",
    images: [
      {
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Team collaboration and business strategy meeting representing domain context in engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lack of Business or Domain Context: Why Pure Coding Is No Longer Enough | Ambitology",
    description:
      "Pure coding skill used to be sufficient. It no longer is. Hiring teams increasingly look for communication, product thinking, and domain understanding. Here's how to build and signal all three.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
