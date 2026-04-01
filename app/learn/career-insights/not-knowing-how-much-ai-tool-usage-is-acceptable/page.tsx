"use client";

import Link from "next/link";
import styles from "../shared-article.module.css";
import ThemeToggle from "@/app/components/ThemeToggle";

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

const AI_USAGE_PRINCIPLES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Own Every Line You Ship",
    desc: "AI-generated code that you haven't read, understood, and validated is a liability — not a contribution. Your name is on the PR. Make sure you can defend every line of it in a code review.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: "Use AI for Acceleration, Not Replacement of Judgment",
    desc: "AI tools are best used to eliminate boilerplate, speed up research, and generate first drafts. The architectural decisions, edge-case handling, and system design still require your engineering judgment.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: "Know When Not to Use It",
    desc: "Security-sensitive code, cryptographic implementations, authentication logic, and complex business rules with legal implications are areas where AI-generated code requires the most skepticism.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Be Transparent with Your Team",
    desc: "Using AI tools isn't something to hide. Teams that discuss how they use AI collectively develop better norms — and you avoid the professional risk of someone discovering you shipped code you can't explain.",
  },
];

const QUALITY_PROBLEMS = [
  {
    problem: "Hallucinated APIs",
    desc: "AI tools occasionally generate code using API methods or library functions that don't exist or have changed versions. This passes superficial review but fails at runtime.",
  },
  {
    problem: "Security vulnerabilities",
    desc: "AI-generated code frequently introduces subtle security issues — SQL injection vectors, improper input validation, insecure defaults — that require security-aware review to catch.",
  },
  {
    problem: "Hidden performance traps",
    desc: "Generated code often works correctly for small inputs but contains algorithmic inefficiencies — O(n²) operations, unnecessary database queries, memory leaks — that only surface at scale.",
  },
  {
    problem: "Overengineered solutions",
    desc: "AI tools tend to generate more code than necessary — unnecessary abstractions, premature generalization, boilerplate that inflates maintenance burden without adding value.",
  },
  {
    problem: "Context blindness",
    desc: "AI tools generate code without full system context. Code that's technically correct in isolation may violate naming conventions, architecture patterns, or data flow assumptions specific to your codebase.",
  },
  {
    problem: "Test coverage gaps",
    desc: "AI-generated tests often test the happy path thoroughly while missing edge cases, failure modes, and integration scenarios that matter most in production systems.",
  },
];

const JUDGMENT_SIGNALS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "System-Level Thinking",
    desc: "Can you articulate why the architecture works at the system level — not just whether the function returns the right value? This is engineering judgment.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "Trade-off Articulation",
    desc: "When you make a technical decision, can you explain what you traded away and why the trade was worth it? AI tools pick solutions — engineers choose them with context.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Code Review Depth",
    desc: "Do your code reviews catch logical errors, not just style issues? Engineers who use AI tools heavily and still review code rigorously demonstrate that judgment is intact.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "Production Ownership",
    desc: "Owning your code means caring about its behavior in production — monitoring, incident response, performance under real load. This is the dimension AI tools cannot own for you.",
  },
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <nav className={styles.breadcrumb}>
                <Link href="/" className={styles.breadcrumbLink}>Home</Link>
                <span className={styles.breadcrumbSep}>/</span>
                <Link href="/learn/career-insights" className={styles.breadcrumbLink}>Career Insights</Link>
                <span className={styles.breadcrumbSep}>/</span>
                <span className={styles.breadcrumbCurrent}>Article</span>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* ── Article ── */}
        <main className={styles.main}>
          <article className={styles.article}>

            {/* Meta */}
            <div className={styles.meta}>
              <span className={styles.category}>Engineering & AI</span>
              <span className={styles.metaDot} />
              <span className={styles.metaText}>March 20, 2026</span>
              <span className={styles.metaDot} />
              <span className={styles.metaText}>8 min read</span>
            </div>

            {/* Title */}
            <h1 className={styles.title}>
              Not Knowing How Much AI Tool Usage Is Acceptable? Here's How to Think About It.
            </h1>

            {/* Lead */}
            <p className={styles.lead}>
              There's a real and growing tension in engineering teams everywhere: using AI to move
              faster feels like table stakes, but the concern about low-quality AI-generated code —
              and the risk of looking like you can't actually engineer anything yourself — is equally
              real. The engineers asking this question aren't paranoid. They're picking up on a genuine
              professional signal that deserves a clear answer.
            </p>

            {/* Hero Image */}
            <div className={styles.heroImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&auto=format&fit=crop&q=80"
                alt="Code reflected in developer glasses representing careful engineering judgment and AI-assisted code review"
                className={styles.heroImage}
              />
              <p className={styles.imageCaption}>
                The question isn't whether to use AI tools — it's whether your engineering judgment
                remains the dominant force in what ships.
              </p>
            </div>

            {/* Section 1 */}
            <h2 className={styles.h2}>The Tension Is Real — and Both Sides Have a Point</h2>
            <p className={styles.p}>
              The pressure to use AI coding tools to move faster is legitimate. Tools like Claude Code,
              Cursor, and GitHub Copilot have genuinely changed the velocity at which skilled engineers
              can ship. Teams that adopt them effectively can accomplish more — and companies are
              beginning to price in that productivity gain when staffing their engineering teams.
            </p>
            <p className={styles.p}>
              The concern about AI-generated code quality is also legitimate. Across engineering teams
              that have adopted these tools rapidly, a consistent pattern has emerged: some engineers
              use AI as an accelerant for their own judgment, while others use it as a replacement for
              judgment they haven't developed yet. The outputs look the same on the surface. The
              difference only becomes visible in code reviews, incident retrospectives, and performance
              degradations that surface three months after the code was merged.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNum}>40%</span>
                <span className={styles.statLabel}>Of engineers report their teams have explicit or informal guidelines on AI tool usage in code review</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>67%</span>
                <span className={styles.statLabel}>Of engineering managers say AI-generated code quality concerns are now a real factor in their review process</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>3–5×</span>
                <span className={styles.statLabel}>Speed advantage of fluent AI tool users — but only when genuine engineering judgment accompanies the speed</span>
              </div>
            </div>

            <blockquote className={styles.blockquote}>
              "The engineers I trust most with AI tools aren't the ones who generate the most code
              fastest. They're the ones who ask the hardest questions about the code the AI generates."
              — Engineering Manager, Series B fintech company
            </blockquote>

            {/* Section 2 */}
            <h2 className={styles.h2}>The Six Quality Problems That Make AI Code Risky Without Oversight</h2>
            <p className={styles.p}>
              Before establishing your personal framework for AI tool usage, it helps to be concrete
              about what can go wrong when AI-generated code is accepted without adequate engineering
              judgment. These aren't edge cases — they're patterns observed consistently across
              production systems.
            </p>

            <div className={styles.techGrid}>
              {QUALITY_PROBLEMS.map((item) => (
                <div key={item.problem} className={styles.techCard}>
                  <div className={styles.techContent}>
                    <span className={styles.techName}>{item.problem}</span>
                    <span className={styles.techDesc}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className={styles.p}>
              These failure modes don't mean AI tools are untrustworthy — they mean they require
              the same engineering scrutiny as any other code you didn't write yourself. In traditional
              software development, junior engineers' code gets reviewed carefully before merging.
              AI-generated code deserves the same treatment, regardless of who generated it or how
              confident the tool sounded when it produced it.
            </p>

            {/* Inline Image */}
            <div className={styles.inlineImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900&auto=format&fit=crop&q=80"
                alt="Code review process on screen representing engineering quality standards"
                className={styles.inlineImage}
              />
              <p className={styles.imageCaption}>
                Thorough code review is the mechanism that keeps AI-accelerated development safe.
                The speed gains are real — but so are the risks when review discipline slips.
              </p>
            </div>

            {/* Section 3 */}
            <h2 className={styles.h2}>The Framework: AI as Accelerant, Not Replacement</h2>
            <p className={styles.p}>
              The most useful mental model for professional AI tool usage is this: AI tools should
              accelerate your engineering process, not replace the engineering judgment that makes
              the process produce good outcomes. This maps to a clear set of principles that successful
              AI-augmented engineers actually follow — even if most don't articulate them explicitly.
            </p>

            <div className={styles.pillarsGrid}>
              {AI_USAGE_PRINCIPLES.map((principle) => (
                <div key={principle.title} className={styles.pillar}>
                  <div className={styles.pillarIcon}>{principle.icon}</div>
                  <span className={styles.pillarTitle}>{principle.title}</span>
                  <span className={styles.pillarDesc}>{principle.desc}</span>
                </div>
              ))}
            </div>

            <p className={styles.p}>
              These principles are also how you avoid the professional risk that comes with heavy
              AI tool usage: the perception — or reality — that you can generate code but can't
              independently evaluate it. In code reviews, interviews, and incident investigations,
              engineering judgment is what becomes visible. Velocity is invisible to observers;
              quality isn't.
            </p>

            {/* Section 4 */}
            <h2 className={styles.h2}>Engineering Is Not Just Coding — and This Changes the Entire Calculation</h2>
            <p className={styles.p}>
              The anxiety around AI tool usage often contains a flawed underlying assumption:
              that if AI can generate code quickly, the value of being an engineer is primarily
              in writing code quickly. This is wrong, and understanding why changes how you
              should think about the acceptability question entirely.
            </p>
            <p className={styles.p}>
              Engineering as a professional discipline includes: systems thinking and architecture
              design; understanding the business context and constraints that shape technical decisions;
              managing complexity across codebases, teams, and time; navigating organizational dynamics
              and communicating technical trade-offs to non-technical stakeholders; debugging production
              systems under pressure; and developing judgment about when to build versus buy, when to
              abstract versus inline, and when good enough is genuinely good enough.
            </p>

            <div className={styles.highlightBox}>
              <div className={styles.highlightBoxIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <p className={styles.highlightBoxText}>
                  <strong>The real leverage of AI tools:</strong> They compress the time required
                  for the coding execution part of engineering — the translation of a design decision
                  into working code. They don't compress the time required for making the right design
                  decision. Engineers who understand this distinction are the ones who benefit most from AI tools without becoming dependent on them.
                </p>
              </div>
            </div>

            <p className={styles.p}>
              None of those dimensions of engineering are being replaced by AI coding tools. In fact,
              as the coding execution layer gets faster, the relative value of the non-coding layers
              increases. The engineers who are struggling in the AI era are typically the ones whose
              primary professional identity was "writes code fast" rather than "solves engineering
              problems well." The question isn't how much AI tool usage is acceptable — it's whether
              your engineering judgment is strong enough to make AI acceleration safe.
            </p>

            {/* Section 5 */}
            <h2 className={styles.h2}>How to Signal Genuine Engineering Judgment in a World of AI-Generated Code</h2>
            <p className={styles.p}>
              The professional concern about AI tool usage is partly about perception management:
              how do colleagues, managers, and interviewers know that you have real engineering
              judgment, not just access to good AI tools? The answer is that genuine judgment
              shows up in specific, observable ways — and deliberately demonstrating those signals
              resolves the tension.
            </p>

            <div className={styles.tipsGrid}>
              {JUDGMENT_SIGNALS.map((signal) => (
                <div key={signal.title} className={styles.tipCard}>
                  <div className={styles.tipIcon}>{signal.icon}</div>
                  <span className={styles.tipTitle}>{signal.title}</span>
                  <span className={styles.tipDesc}>{signal.desc}</span>
                </div>
              ))}
            </div>

            <p className={styles.p}>
              The practical implication for interviews is important: technical interview rounds test
              coding ability directly, and candidates who have relied heavily on AI tools without
              understanding what the tools produce will fail these rounds. The coding question exists
              precisely because it's a hands-on implementation test — AI assistance is typically not
              available, and the problem needs to be solved in front of the interviewer in real time.
              This is the floor that every engineer needs to maintain regardless of how good their
              AI tool workflow is.
            </p>
            <p className={styles.p}>
              The system design round, by contrast, is a knowledge test — and this is where broad
              technical exposure, including AI system architecture, pays dividends. Candidates who
              can discuss how to integrate AI components into a larger system, handle LLM latency
              and reliability, and make architectural decisions about AI-native versus AI-augmented
              system design demonstrate a kind of fluency that's genuinely valuable and increasingly
              expected.
            </p>

            {/* Section 6 */}
            <h2 className={styles.h2}>The Career Strategy: Build Faster, Deeper, and More Demonstrably</h2>
            <p className={styles.p}>
              The resolution to the AI tool usage tension isn't to use fewer AI tools — it's to ensure
              that everything you build with AI tools is backed by genuine engineering understanding.
              The practical approach: use AI tools to build more projects than you could otherwise,
              but treat every AI-generated component as something you need to own, understand, and
              be able to explain in depth. Build a small legal business, ship a real product, use
              AI tools to build faster — and then demonstrate that you understand every technical
              decision in that product.
            </p>
            <p className={styles.p}>
              This strategy produces something powerful: a resume that demonstrates both breadth
              (you built multiple things) and depth (you can speak technically to every decision
              made in each project). It's a profile that's distinctly hard to fabricate — and
              interviewers can verify it quickly through technical questions about your own work.
            </p>

            {/* Ambitology Box */}
            <div className={styles.ambitologyBox}>
              <div className={styles.ambitologyBoxHeader}>
                <img src="/images/atg-logo.svg" alt="Ambitology" className={styles.ambitologyLogo} />
                <span className={styles.ambitologyBoxLabel}>How Ambitology Can Help</span>
              </div>
              <p className={styles.ambitologyBoxText}>
                The core challenge with AI-augmented development isn't the tools — it's building
                and demonstrating the engineering depth that makes AI tool usage credible.
                <strong> Ambitology</strong> is built to help you do exactly that.
              </p>
              <p className={styles.ambitologyBoxText}>
                Our{" "}
                <Link href="/knowledge" className={styles.ambitologyLink}>
                  Knowledge Base
                </Link>{" "}
                lets you document not just what you've built, but what you understand: the technical
                decisions, architectural trade-offs, and domain knowledge behind each project. This
                creates a structured record of your engineering judgment — not just your output velocity.
              </p>
              <p className={styles.ambitologyBoxText}>
                When you build your{" "}
                <Link href="/resume" className={styles.ambitologyLink}>
                  resume through Ambitology
                </Link>
                , you're drawing from a documented knowledge base that reflects real understanding —
                which means recruiters can assess your depth, not just your keywords. Ambitology also
                helps you identify which AI-adjacent technical skills are most relevant for your target
                roles, so the skills you develop fill real gaps rather than just expanding your
                keyword count.
              </p>
            </div>

            {/* CTA */}
            <div className={styles.ctaSection}>
              <h3 className={styles.ctaTitle}>Build faster. Ship smarter. Prove the depth behind it.</h3>
              <p className={styles.ctaDesc}>
                Document your engineering knowledge, showcase your real technical judgment, and let
                your resume reflect the engineer you actually are — not just the tools you use.
              </p>
              <Link href="/knowledge" className={styles.ctaButton}>
                Build Your Knowledge Base
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
