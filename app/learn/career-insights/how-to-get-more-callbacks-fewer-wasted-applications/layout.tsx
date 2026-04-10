import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Get More Job Callbacks with Fewer Wasted Applications | Ambitology",
  description:
    "Sending dozens of applications and hearing nothing? The problem usually isn't effort — it's targeting, resume positioning, and experience signals. Here's how to fix your callback rate with a smarter approach.",
  alternates: {
    canonical: "https://ambitology.com/learn/career-insights/how-to-get-more-callbacks-fewer-wasted-applications",
  },
  openGraph: {
    title: "How to Get More Job Callbacks with Fewer Wasted Applications | Ambitology",
    description:
      "Sending dozens of applications and hearing nothing? The problem usually isn't effort — it's targeting, resume positioning, and experience signals. Here's how to fix your callback rate with a smarter approach.",
    url: "https://ambitology.com/learn/career-insights/how-to-get-more-callbacks-fewer-wasted-applications",
    images: [
      {
        url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Futuristic AI robot representing intelligent automation and the evolving job market landscape",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Get More Job Callbacks with Fewer Wasted Applications | Ambitology",
    description:
      "Sending dozens of applications and hearing nothing? The problem usually isn't effort — it's targeting, resume positioning, and experience signals. Here's how to fix your callback rate with a smarter approach.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
