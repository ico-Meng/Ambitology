import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Much AI Tool Usage Is Acceptable at Work? The Engineer's Guide | Ambitology",
  description:
    "There's real tension between using AI to ship faster and proving you have genuine engineering judgment. Here's how to navigate it — and why the concern about AI-generated code is more valid than most admit.",
  alternates: {
    canonical: "https://ambitology.com/learn/career-insights/not-knowing-how-much-ai-tool-usage-is-acceptable",
  },
  openGraph: {
    title: "How Much AI Tool Usage Is Acceptable at Work? The Engineer's Guide | Ambitology",
    description:
      "There's real tension between using AI to ship faster and proving you have genuine engineering judgment. Here's how to navigate it — and why the concern about AI-generated code is more valid than most admit.",
    url: "https://ambitology.com/learn/career-insights/not-knowing-how-much-ai-tool-usage-is-acceptable",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Code reflected in developer glasses representing careful engineering judgment and AI-assisted code review",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Much AI Tool Usage Is Acceptable at Work? The Engineer's Guide | Ambitology",
    description:
      "There's real tension between using AI to ship faster and proving you have genuine engineering judgment. Here's how to navigate it — and why the concern about AI-generated code is more valid than most admit.",
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
