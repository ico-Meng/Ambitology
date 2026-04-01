import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chasing AI/ML or Stay in Mainstream SWE? The Honest Answer | Ambitology",
  description:
    "Confused whether to pivot into AI/ML or double down on mainstream software engineering? Here's the nuanced, experience-backed answer to one of the most searched career questions in tech right now.",
  alternates: {
    canonical: "https://ambitology.com/learn/career-insights/chasing-ai-ml-or-stay-in-mainstream-swe",
  },
  openGraph: {
    title: "Chasing AI/ML or Stay in Mainstream SWE? The Honest Answer | Ambitology",
    description:
      "Confused whether to pivot into AI/ML or double down on mainstream software engineering? Here's the nuanced, experience-backed answer to one of the most searched career questions in tech right now.",
    url: "https://ambitology.com/learn/career-insights/chasing-ai-ml-or-stay-in-mainstream-swe",
    images: [
      {
        url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "AI neural network visualization with glowing nodes representing machine learning and deep learning concepts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chasing AI/ML or Stay in Mainstream SWE? The Honest Answer | Ambitology",
    description:
      "Confused whether to pivot into AI/ML or double down on mainstream software engineering? Here's the nuanced, experience-backed answer to one of the most searched career questions in tech right now.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
