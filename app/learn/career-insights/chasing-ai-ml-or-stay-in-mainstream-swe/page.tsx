"use client";

import Link from "next/link";
import styles from "../shared-article.module.css";

const globalReset = `
  html, body {
    height: auto !important;
    min-height: 100vh !important;
    width: 100% !important;
    display: block !important;
    background: #faf9f6 !important;
    background-image: none !important;
    justify-content: unset !important;
    align-items: unset !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  a { font-weight: inherit !important; }
`;

const CAREER_PATHS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "The AI/ML Specialist",
    desc: "Deep expertise in model architecture, training pipelines, MLOps, and research. Requires strong math foundations (linear algebra, probability, calculus) and comfort with Python-heavy ecosystems like PyTorch and TensorFlow.",
    fit: "Best for: Those with academic research background, genuine curiosity about the theory, or experience working with large datasets.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "The AI-Augmented SWE",
    desc: "Mainstream software engineer who fluently uses AI tools, integrates LLM APIs, builds on top of AI infrastructure, and understands enough ML to collaborate productively with data science teams.",
    fit: "Best for: Most engineers. This is where the market is largest — and where AI tool fluency is now a baseline expectation.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
    title: "The AI-Informed Generalist",
    desc: "Broad technical stack with working knowledge of AI/ML concepts — enough to architect systems that incorporate AI components without building models from scratch. Architecture-first, tools-savvy.",
    fit: "Best for: Senior engineers, tech leads, and those who prefer building products over training models.",
  },
];

const AI_BASELINE_SKILLS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "LLM API Integration",
    desc: "Knowing how to call OpenAI, Anthropic, or other LLM APIs, handle context windows, and build prompt-chaining logic is now expected in most product engineering roles.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    title: "Vector Databases & Embeddings",
    desc: "Understanding how semantic search and retrieval-augmented generation (RAG) work is increasingly relevant for backend and full-stack engineers building modern applications.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "AI Workflow Orchestration",
    desc: "Tools like LangChain, LlamaIndex, and agent frameworks are becoming part of the standard stack. Understanding agentic patterns is a growing differentiator.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
    title: "Evaluation & Safety Fundamentals",
    desc: "Knowing how to evaluate LLM output quality, handle hallucinations, and implement basic guardrails is no longer optional for engineers shipping AI-adjacent features.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: "AI Coding Tools Proficiency",
    desc: "Claude Code, Cursor, GitHub Copilot — being a fluent, critical user of AI coding assistants is now a baseline expectation, not a differentiator.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "Conceptual ML Literacy",
    desc: "You don't need to build models — but understanding what a model is, how training works broadly, and when ML is the right tool is now part of good engineering judgment.",
  },
];

const PIVOT_CHECKLIST = [
  "You find yourself reading ML papers out of genuine curiosity, not obligation",
  "You have (or are willing to invest in) strong math foundations: linear algebra, probability, statistics",
  "You're drawn to data-intensive problems, model optimization, and research-style thinking",
  "You have access to a relevant graduate program or direct research opportunity",
  "Your target companies are primarily AI-first firms (OpenAI, Anthropic, DeepMind, research labs)",
  "You're willing to accept a potential short-term income plateau while building ML-specific credibility",
];

export default function ArticlePage() {
  return (
    <>
      <style>{globalReset}</style>
      <div className={styles.page}>

        {/* ── Header ── */}
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              <img src="/images/atg-logo.svg" alt="Ambitology" className={styles.logoIcon} />
              Ambitology
            </Link>
            <nav className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <Link href="/learn/career-insights" className={styles.breadcrumbLink}>Career Insights</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>Chasing AI/ML vs. Mainstream SWE</span>
            </nav>
          </div>
        </header>

        {/* ── Article ── */}
        <main className={styles.main}>
          <article className={styles.article}>

            {/* Meta */}
            <div className={styles.meta}>
              <span className={styles.category}>Engineering & AI</span>
              <span className={styles.metaDot} />
              <span className={styles.metaText}>March 18, 2026</span>
              <span className={styles.metaDot} />
              <span className={styles.metaText}>9 min read</span>
            </div>

            {/* Title */}
            <h1 className={styles.title}>
              Chasing AI/ML? Or Stay in Mainstream SWE? Here's the Honest Answer.
            </h1>

            {/* Lead */}
            <p className={styles.lead}>
              If you're asking this question, there's a good chance you're already working in software
              engineering — or studying toward it — and the AI/ML wave is making you second-guess your
              direction. The uncertainty is understandable. But the answer most career advice skips is
              this: for the vast majority of software engineers, the pivot framing is a false binary.
              Here's how to think about it clearly.
            </p>

            {/* Hero Image */}
            <div className={styles.heroImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80"
                alt="AI neural network visualization with glowing nodes representing machine learning and deep learning concepts"
                className={styles.heroImage}
              />
              <p className={styles.imageCaption}>
                The AI/ML vs. SWE debate is less a fork in the road and more a spectrum — and where you
                land on it matters less than people think.
              </p>
            </div>

            {/* Section 1 */}
            <h2 className={styles.h2}>Why You're Asking This Question (and What It Actually Reveals)</h2>
            <p className={styles.p}>
              The fact that you're asking "should I chase AI/ML or stay in mainstream SWE?" is itself
              a meaningful data point. It typically signals one of three things: you've seen the job
              market shift toward AI-related roles and feel pressure to adapt; you've worked with AI
              tools long enough to find them genuinely interesting; or you're watching colleagues
              make moves in the AI direction and wondering if you're falling behind.
            </p>
            <p className={styles.p}>
              All three motivations are valid. But they lead to very different decisions. Responding to
              external market pressure is a different move than following genuine intellectual interest
              — and conflating the two is where most career mistakes in this space get made. The first
              step is being honest with yourself about which one is driving the question.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNum}>73%</span>
                <span className={styles.statLabel}>Of tech job postings now mention AI/ML proficiency as a plus — not a hard requirement</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>~12%</span>
                <span className={styles.statLabel}>Of engineering roles are truly AI/ML-specialist positions requiring model development expertise</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>3–5x</span>
                <span className={styles.statLabel}>Speed multiplier that AI coding tools provide for mainstream SWEs — making broad skills more executable than ever</span>
              </div>
            </div>

            <p className={styles.p}>
              The numbers tell a nuanced story. AI/ML is everywhere in job descriptions, but genuine
              AI/ML specialist roles — positions where you're actually developing, training, or
              fine-tuning models — represent a much smaller slice of the market than the noise suggests.
              The larger opportunity, and the one most engineers should be focused on, is becoming an
              AI-augmented software engineer: someone who builds mainstream software fluently, and
              integrates AI capabilities as a native part of their toolkit.
            </p>

            {/* Section 2 */}
            <h2 className={styles.h2}>Three Career Profiles, Not Two</h2>
            <p className={styles.p}>
              The "AI/ML versus SWE" framing collapses what's actually a spectrum into a false binary.
              In practice, there are three distinct profiles emerging in the market — and the right one
              for you depends on your background, interest, and where you want to be in five years.
            </p>

            <div className={styles.pathsGrid}>
              {CAREER_PATHS.map((path) => (
                <div key={path.title} className={styles.pathCard}>
                  <div className={styles.pillarIcon}>{path.icon}</div>
                  <span className={styles.pathTitle}>{path.title}</span>
                  <span className={styles.pathDesc}>{path.desc}</span>
                  <span className={styles.pathLabel}>{path.fit}</span>
                </div>
              ))}
            </div>

            <p className={styles.p}>
              For most working software engineers, the second profile — the AI-augmented SWE — is the
              highest-leverage career move available right now. It doesn't require a pivot, a master's
              degree, or abandoning your existing skills. It requires expanding your technical toolkit
              horizontally to include AI-native capabilities, and using those capabilities to build
              faster, better, and more ambitiously than before.
            </p>

            <blockquote className={styles.blockquote}>
              "The engineers winning in the current market aren't the ones who pivoted hardest into
              AI/ML. They're the ones who learned to make AI do the heavy lifting while they focused
              on judgment, architecture, and delivery."
            </blockquote>

            {/* Section 3 */}
            <h2 className={styles.h2}>What AI Literacy Is Now Baseline for General SWE Roles</h2>
            <p className={styles.p}>
              Regardless of whether you pursue AI/ML specialization, there is a set of AI-adjacent
              skills that have quietly become baseline expectations for general software engineering
              roles — especially at companies that have integrated AI into their product stack. These
              are not optional nice-to-haves. They are increasingly the bar just to be considered
              a fluent practitioner.
            </p>

            <div className={styles.tipsGrid}>
              {AI_BASELINE_SKILLS.map((skill) => (
                <div key={skill.title} className={styles.tipCard}>
                  <div className={styles.tipIcon}>{skill.icon}</div>
                  <span className={styles.tipTitle}>{skill.title}</span>
                  <span className={styles.tipDesc}>{skill.desc}</span>
                </div>
              ))}
            </div>

            <p className={styles.p}>
              The important distinction here is between <em>using</em> AI tools and <em>building</em>
              {" "}AI systems. Most general SWE roles now expect some level of the former. Very few
              require the latter unless you're explicitly in an AI/ML role. The confusion often
              comes from job descriptions that use "AI" loosely — what they actually want is someone
              comfortable building on top of existing AI infrastructure, not someone who can
              architect a training pipeline from scratch.
            </p>

            {/* Inline Image */}
            <div className={styles.inlineImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80"
                alt="Code on screen representing modern software engineering with AI tools"
                className={styles.inlineImage}
              />
              <p className={styles.imageCaption}>
                The line between "uses AI tools" and "builds AI" is widening — and most companies
                are hiring for the former, not the latter.
              </p>
            </div>

            {/* Section 4 */}
            <h2 className={styles.h2}>When Pivoting to AI/ML Actually Makes Sense</h2>
            <p className={styles.p}>
              There are real scenarios where a deliberate move into AI/ML specialization is the right
              call — but they require specific conditions. Before committing to a pivot, honestly
              check yourself against this list:
            </p>

            <ul className={styles.ul}>
              {PIVOT_CHECKLIST.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <p className={styles.p}>
              If three or more of these are genuinely true, a pivot toward AI/ML specialization
              deserves serious consideration. If you're checking boxes primarily out of market
              anxiety rather than actual interest, the pivot will likely feel hollow at the two-year
              mark — and the time investment may not translate into the career acceleration you expected.
            </p>
            <p className={styles.p}>
              One practical path that many engineers underutilize: start building products using
              AI/ML APIs and infrastructure before deciding whether to go deeper. If you build a
              small application that uses LLM APIs, vector search, and AI-generated content pipelines,
              and you find yourself wanting to optimize the models rather than just call them — that's
              a genuine signal. If you're satisfied with making the API calls work, mainstream SWE
              with strong AI fluency is likely your highest-value lane.
            </p>

            {/* Section 5 */}
            <h2 className={styles.h2}>The Horizontal Expansion Strategy: Why Breadth Wins Right Now</h2>
            <p className={styles.p}>
              In the AI era, the most consistent career advantage doesn't belong to the deepest
              specialist or the broadest generalist — it belongs to engineers who expand horizontally
              with intention. Here's why this works, and why AI has made it more achievable than ever.
            </p>
            <p className={styles.p}>
              With tools like Claude Code, Cursor, and GitHub Copilot, an engineer with a working
              understanding of a technology can build meaningful projects with it far faster than
              was previously possible. This changes the career math. You no longer need to spend
              six months mastering every corner case of a framework before you can build something
              worth putting on your resume. You need enough foundational understanding to direct
              the tools effectively — and then you build.
            </p>

            <div className={styles.highlightBox}>
              <div className={styles.highlightBoxIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <p className={styles.highlightBoxText}>
                  <strong>The AI-era advantage for SWEs:</strong> AI coding tools don't replace
                  engineering judgment — they amplify it. An engineer with broad architectural
                  knowledge and strong product instincts can now build what previously required
                  a team of three. The horizontal expansion strategy is specifically designed
                  to leverage this leverage.
                </p>
              </div>
            </div>

            <p className={styles.p}>
              The horizontal expansion strategy works like this: anchor in your current strongest
              domain — whether that's backend systems, frontend, mobile, or infrastructure — and
              systematically add adjacent capabilities. For mainstream SWEs, this means adding
              AI integration fluency (LLM APIs, vector databases, agent patterns), expanding to
              a second or third area of the stack, and building products that demonstrate the
              combined capability. You don't need to go deep in AI/ML to benefit enormously
              from the AI wave. You need to be fluent enough to build with it.
            </p>
            <p className={styles.p}>
              For job positioning, this strategy is particularly powerful. Interview technical
              rounds typically don't require deep expertise in any specific tool — they test
              your ability to think architecturally, solve problems pragmatically, and speak
              fluently about systems you've worked with. A candidate who has built across
              multiple domains and can talk credibly about AI-integrated architectures is
              compelling to a wide range of hiring teams — both in AI-focused companies and
              in mainstream product engineering organizations.
            </p>

            {/* Section 6 */}
            <h2 className={styles.h2}>The Signal That Matters in Interviews: What Are Companies Really Testing?</h2>
            <p className={styles.p}>
              When companies interview for engineering roles — even AI-adjacent ones — they're
              typically testing two distinct things: hands-on coding ability (algorithm and data
              structure problems that require real, live implementation) and architectural and
              domain knowledge (the breadth of your understanding, your ability to discuss systems,
              your conceptual fluency). The second category is where AI/ML literacy — at the
              appropriate level — matters.
            </p>
            <p className={styles.p}>
              For a mainstream SWE role at a company that uses AI in its product, the technical
              knowledge test might touch on how LLMs work at a high level, how you'd architect
              a system that uses embeddings for semantic search, or how you'd approach integrating
              an AI feature without degrading system reliability. These questions don't require
              PhD-level knowledge — they require informed, architectural thinking about AI as
              a system component.
            </p>
            <p className={styles.p}>
              This means you can confidently list "LLM integration," "RAG architecture," and
              "AI workflow orchestration" in your skills section after building a few projects
              that genuinely use them — because these are knowledge-test items, not implementation-from-scratch tests. The key is that your understanding must be real enough to discuss with depth.
            </p>

            {/* Ambitology Box */}
            <div className={styles.ambitologyBox}>
              <div className={styles.ambitologyBoxHeader}>
                <img src="/images/atg-logo.svg" alt="Ambitology" className={styles.ambitologyLogo} />
                <span className={styles.ambitologyBoxLabel}>How Ambitology Can Help</span>
              </div>
              <p className={styles.ambitologyBoxText}>
                Whether you're deciding between AI/ML and mainstream SWE, or figuring out how to
                position your expanding technical profile, <strong>Ambitology</strong> is built
                for exactly this kind of career inflection point.
              </p>
              <p className={styles.ambitologyBoxText}>
                Our{" "}
                <Link href="/knowledge" className={styles.ambitologyLink}>
                  Knowledge Base builder
                </Link>{" "}
                lets you map out your current technical skills, plan your horizontal expansion into
                AI-adjacent areas, and track your progress as you build projects. When you're ready
                to apply, your knowledge scope is already documented — and your resume can draw
                precisely from the skills most relevant to each target role.
              </p>
              <p className={styles.ambitologyBoxText}>
                Ambitology's AI system helps you identify which AI/ML adjacent skills are most
                in-demand for the specific roles you're targeting, so you're not expanding blindly —
                you're expanding strategically. And when you build projects that demonstrate your
                new capabilities, Ambitology helps you translate them into compelling resume bullets
                that speak the language interviewers actually evaluate.
              </p>
              <p className={styles.ambitologyBoxText}>
                Build your{" "}
                <Link href="/resume" className={styles.ambitologyLink}>
                  targeted resume
                </Link>{" "}
                that positions you precisely where you want to go — whether that's AI/ML specialist,
                AI-augmented SWE, or something in between.
              </p>
            </div>

            {/* CTA */}
            <div className={styles.ctaSection}>
              <h3 className={styles.ctaTitle}>Stop guessing. Start positioning strategically.</h3>
              <p className={styles.ctaDesc}>
                Map your technical knowledge, identify the right expansion path, and build a resume
                that reflects where you're going — not just where you've been.
              </p>
              <Link href="/resume" className={styles.ctaButton}>
                Build Your Targeted Resume
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

          </article>
        </main>

        {/* ── Footer ── */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <Link href="/" className={styles.footerLogo}>
              <img src="/images/atg-logo.svg" alt="Ambitology" className={styles.logoIcon} />
              Ambitology
            </Link>
            <div className={styles.footerLinks}>
              <Link href="/learn/career-insights" className={styles.footerLink}>Career Insights</Link>
              <Link href="/mission" className={styles.footerLink}>Mission</Link>
              <Link href="/contact" className={styles.footerLink}>Contact</Link>
            </div>
            <p className={styles.footerCopy}>© {new Date().getFullYear()} Ambitology. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </>
  );
}
