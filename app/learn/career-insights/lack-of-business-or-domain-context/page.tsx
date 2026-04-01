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

const THREE_LAYERS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    layer: "Layer 1",
    title: "Technical Execution",
    desc: "Writing correct, performant, maintainable code. Using the right tools for the job. Delivering working software within constraints. This is the floor — not the ceiling.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    layer: "Layer 2",
    title: "Systems & Architectural Thinking",
    desc: "Understanding how components fit together at scale. Making trade-off decisions with non-obvious second-order effects. Designing systems that remain maintainable as teams and requirements change.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    layer: "Layer 3",
    title: "Business & Domain Context",
    desc: "Understanding what the product actually does, why it matters, and how technical decisions affect business outcomes. Translating between engineering constraints and business goals. This is the most differentiated layer — and the most neglected.",
  },
];

const DOMAIN_BUILDING_PATHS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "Build and Operate a Small Business",
    desc: "Register a legal entity, build a product, acquire customers, and manage operations. The business context this generates — user feedback, revenue decisions, support, marketing, compliance — is real domain knowledge that no amount of reading can replicate.",
    timeframe: "3–6 months for a fundable prototype",
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
    title: "Contribute to Open Source in a Specific Domain",
    desc: "Find open source projects in the domain you want to develop context in — fintech, healthtech, developer tooling, e-commerce infrastructure — and contribute meaningfully. Reading and improving real production code develops domain intuition faster than any course.",
    timeframe: "Ongoing, compound returns",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Document and Publish Your Domain Understanding",
    desc: "Writing publicly about what you're learning — technical blog posts, LinkedIn articles, GitHub READMEs — forces you to synthesize and demonstrates domain depth to future employers before they even meet you.",
    timeframe: "Start immediately, build over time",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
      </svg>
    ),
    title: "Deliberately Target Domain-Adjacent Roles",
    desc: "When applying, prioritize companies where the business domain interests you genuinely — payments, climate tech, healthcare, gaming, developer tools. Domain enthusiasm is visible in interviews and compounds quickly into real context.",
    timeframe: "Job search strategy, not a time investment",
  },
];

const PRODUCT_THINKING_SKILLS = [
  {
    title: "User-Centered Problem Framing",
    desc: "Before building, ask: who has this problem, how often do they have it, and what does a good solution look like from their perspective — not from the implementation's perspective.",
  },
  {
    title: "Trade-off Communication",
    desc: "Being able to explain technical constraints in business terms: 'This approach gives us a three-week speed advantage but creates a maintenance cost that will slow feature velocity in Q3.'",
  },
  {
    title: "Scope Judgment",
    desc: "Knowing when a feature is 'good enough' to ship and when it isn't. This requires understanding business urgency, user impact, and technical risk simultaneously.",
  },
  {
    title: "Metrics Orientation",
    desc: "Connecting technical work to measurable outcomes: page load time → conversion rate, error rate → churn, latency → user retention. Engineers who speak in metrics are engineering managers' favorite engineers.",
  },
  {
    title: "Stakeholder Communication",
    desc: "Writing clearly about technical topics for non-technical audiences. In a world where remote work and asynchronous collaboration are standard, written technical communication is a core engineering skill.",
  },
  {
    title: "Cross-Functional Empathy",
    desc: "Understanding what design, product, and business teams need from engineering — and what engineering actually needs from them. This reduces friction and makes you easy to work with across organizational lines.",
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
              <span className={styles.category}>Learning & Growth</span>
              <span className={styles.metaDot} />
              <span className={styles.metaText}>March 22, 2026</span>
              <span className={styles.metaDot} />
              <span className={styles.metaText}>9 min read</span>
            </div>

            {/* Title */}
            <h1 className={styles.title}>
              Lack of Business or Domain Context: Why Pure Coding Is No Longer Enough to Stand Out
            </h1>

            {/* Lead */}
            <p className={styles.lead}>
              A new argument is gaining traction across hiring teams and engineering leadership:
              pure coding skill — without business awareness, product thinking, or domain
              understanding — is increasingly insufficient for standing out as a candidate. This
              isn't gatekeeping or credential inflation. It's a real shift in what companies need
              from engineers, driven by a structural change in what's become commoditized. Here's
              what that shift means and how to respond to it.
            </p>

            {/* Hero Image */}
            <div className={styles.heroImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop&q=80"
                alt="Team collaboration and business strategy meeting representing domain context and product thinking"
                className={styles.heroImage}
              />
              <p className={styles.imageCaption}>
                Engineering value has always been more than code output — but as code execution
                gets automated, the non-code layers become visible differentiators.
              </p>
            </div>

            {/* Section 1 */}
            <h2 className={styles.h2}>What Has Actually Changed — and Why It Matters Now</h2>
            <p className={styles.p}>
              For most of the past two decades, software engineering was a bottleneck function.
              There was more software to build than there were engineers to build it — so the
              primary premium was on anyone who could write good code at a reasonable pace.
              Domain knowledge and business context were valued, but they were supplementary
              to the core technical credential.
            </p>
            <p className={styles.p}>
              That bottleneck has shifted. AI coding tools have meaningfully compressed the time
              required to translate a design decision into working code. This doesn't mean software
              engineering is becoming easy — but it does mean the scarce resource in engineering
              teams is no longer primarily execution velocity. It's increasingly judgment: knowing
              what to build, why to build it, and how to build it in a way that serves the business
              and the user over time.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNum}>61%</span>
                <span className={styles.statLabel}>Of engineering managers say communication and product thinking are now significant factors in senior hiring decisions</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>2×</span>
                <span className={styles.statLabel}>More likely to be promoted: engineers who can explain business impact alongside technical execution</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>Top 15%</span>
                <span className={styles.statLabel}>Of engineering candidates who demonstrate domain context in interviews — creating a wide-open differentiation opportunity</span>
              </div>
            </div>

            <p className={styles.p}>
              The candidates feeling this shift most acutely are those who prepared for technical
              interviews almost exclusively by drilling coding problems. They pass the coding round
              — but fail the system design round because they approach it as a pure technical puzzle
              rather than a business-constrained architecture problem. They struggle with behavioral
              questions about cross-functional collaboration. They can't articulate why the product
              they worked on matters. These are domain context gaps — and they're becoming increasingly
              visible to interviewers.
            </p>

            <blockquote className={styles.blockquote}>
              "I can teach technical skills. I can't easily teach someone to care about the
              business we're building. When I find candidates who already understand the domain
              and have genuine product instincts, the technical bar is almost secondary."
              — Engineering Director, Series C SaaS company
            </blockquote>

            {/* Section 2 */}
            <h2 className={styles.h2}>The Three Layers of Engineering Value</h2>
            <p className={styles.p}>
              Engineering value in a company context isn't a single dimension. It stacks. And
              understanding how it stacks explains why domain and business context have become
              so important for differentiation.
            </p>

            <div className={styles.pathsGrid}>
              {THREE_LAYERS.map((layer) => (
                <div key={layer.title} className={styles.pathCard}>
                  <div className={styles.pillarIcon}>{layer.icon}</div>
                  <span className={styles.pathLabel}>{layer.layer}</span>
                  <span className={styles.pathTitle}>{layer.title}</span>
                  <span className={styles.pathDesc}>{layer.desc}</span>
                </div>
              ))}
            </div>

            <p className={styles.p}>
              The critical observation is that Layer 1 — technical execution — is the layer AI
              tools are most directly augmenting. Layer 3 — business and domain context — is
              the layer furthest from what AI currently augments. This means the relative
              value of Layer 3 is increasing precisely because Layer 1 is becoming less scarce.
              Engineers who invest in building genuine domain context are positioning themselves
              in the layer that's hardest to automate and most valued by the companies that
              are thinking carefully about what they actually need.
            </p>

            {/* Inline Image */}
            <div className={styles.inlineImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&auto=format&fit=crop&q=80"
                alt="Business strategy documentation and product planning representing domain knowledge development"
                className={styles.inlineImage}
              />
              <p className={styles.imageCaption}>
                Domain knowledge and business context are the layers of engineering value least
                affected by AI augmentation — and therefore the most differentiated.
              </p>
            </div>

            {/* Section 3 */}
            <h2 className={styles.h2}>What the Engineering Manager Is Actually Looking For in Your Resume</h2>
            <p className={styles.p}>
              Your resume gets reviewed by three distinct audiences in a typical hiring process:
              HR (filtering for keywords and basic qualification), the engineering team (evaluating
              technical depth and project quality), and the engineering manager (looking for
              leadership, domain fit, and business relevance). Most candidates optimize entirely
              for the first two — and get screened in, only to fail the manager interview because
              they haven't thought about the third.
            </p>
            <p className={styles.p}>
              Engineering managers are often the least predictable interviewers because they're
              not running from a standard playbook. They're asking themselves: does this person
              understand the kind of problems my team works on? Can they translate business
              priorities into technical decisions? Will they communicate effectively with product
              and design? Are there signals of intellectual curiosity about the domain?
            </p>

            <div className={styles.highlightBox}>
              <div className={styles.highlightBoxIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <p className={styles.highlightBoxText}>
                  <strong>The domain match advantage:</strong> If an engineering manager is hiring
                  for a payments team and your resume shows a project involving Stripe integration,
                  checkout flow optimization, or payment reconciliation — you've already differentiated
                  yourself before the first interview question. Domain fit is the highest-signal
                  resume element for engineering managers, and it's systematically underutilized
                  by most candidates.
                </p>
              </div>
            </div>

            <p className={styles.p}>
              The practical implication is that when you're choosing what projects to build,
              what open source to contribute to, or what company to start — domain alignment
              with your target job market should be an explicit input. A project in fintech
              opens doors to fintech companies. A project in healthtech demonstrates credibility
              in that space. Generic "to-do apps" and "weather apps" don't signal any domain
              interest to an engineering manager — and that's a missed opportunity.
            </p>

            {/* Section 4 */}
            <h2 className={styles.h2}>Product Thinking: The Differentiator That Isn't Optional Anymore</h2>
            <p className={styles.p}>
              Product thinking — the ability to reason about user needs, business trade-offs, and
              the relationship between technical decisions and product outcomes — has shifted from
              a bonus attribute to a real differentiator. This is especially pronounced at smaller
              companies and startups, where the line between engineering and product is intentionally
              blurry and engineers are expected to exercise judgment on both sides.
            </p>

            <div className={styles.tipsGrid}>
              {PRODUCT_THINKING_SKILLS.map((skill) => (
                <div key={skill.title} className={styles.tipCard}>
                  <div className={styles.tipIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className={styles.tipTitle}>{skill.title}</span>
                  <span className={styles.tipDesc}>{skill.desc}</span>
                </div>
              ))}
            </div>

            <p className={styles.p}>
              These skills are learnable — but they require exposure to real product decisions,
              not just technical ones. This is another reason why building and operating a real
              business, even a small one, is one of the most valuable things a software engineer
              without direct industry experience can do. It forces you to think like a product
              manager, a customer service representative, a marketer, and an operator simultaneously —
              and that multi-perspective thinking becomes visible and compelling in interviews.
            </p>

            {/* Section 5 */}
            <h2 className={styles.h2}>Four Paths to Building Real Domain Context Without Industry Experience</h2>
            <p className={styles.p}>
              The most common objection to "you need domain context" is the obvious one: how do
              you develop domain context without the industry experience that provides it? This
              is a real chicken-and-egg problem — but it has well-tested solutions. Here are
              the four highest-leverage paths.
            </p>

            <div className={styles.stepsContainer}>
              {DOMAIN_BUILDING_PATHS.map((path, index) => (
                <div key={path.title} className={styles.stepCard}>
                  <div className={styles.stepNum}>{String(index + 1).padStart(2, "0")}</div>
                  <div className={styles.stepContent}>
                    <span className={styles.stepTitle}>{path.title}</span>
                    <span className={styles.stepDesc}>{path.desc}</span>
                    <span className={styles.stepDesc} style={{fontStyle: "italic", color: "#C4A052"}}>{path.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className={styles.p}>
              Of these paths, building and operating a small business remains the single most
              powerful domain-building tool available to engineers who haven't worked in industry
              yet. It's not just a resume credential — it's an experience that systematically
              develops business context, product thinking, and communication skills across every
              function of a real operating entity. Tools like Stripe Atlas make it possible to
              incorporate a legal entity quickly; AI coding tools like Claude Code make it
              possible to build a functional product without a team; and social media platforms
              make it possible to acquire real users and feedback in days.
            </p>
            <p className={styles.p}>
              The result is a kind of mini-industry experience that checks all the boxes an
              engineering manager is looking for: real-world technical execution, product decision-making
              under real constraints, user feedback integration, and demonstrated business ownership.
              It's also something almost no other candidate is doing — which means the differentiation
              is significant.
            </p>

            {/* Section 6 */}
            <h2 className={styles.h2}>How to Signal Domain Context in Your Resume and Interviews</h2>
            <p className={styles.p}>
              Building domain context is half the work. Communicating it effectively in your
              resume and interviews is the other half — and it's where most engineers who have
              done the work still lose ground to candidates who have learned to articulate it well.
            </p>
            <p className={styles.p}>
              In your resume, domain context signals come from specific, concrete language about
              the <em>problem space</em> of your projects — not just their technical components.
              Compare: "Built a REST API with Node.js and PostgreSQL" versus "Built the payment
              reconciliation API for a consumer fintech app, processing 200+ transactions daily
              with Stripe webhook integration and idempotent retry logic." The second version
              communicates domain awareness — the author understands payments, reconciliation,
              and the reliability constraints that matter in financial software.
            </p>
            <p className={styles.p}>
              In interviews, domain context shows up when you ask sharp questions about the
              product and business — not just the technical stack. "What's the biggest domain-specific
              engineering challenge your team is working on right now?" is a question that signals
              you think about engineering in business context. Answers to behavioral questions
              that reference user impact, business outcome, or cross-functional collaboration
              consistently score higher than answers that stay purely technical.
            </p>

            {/* Ambitology Box */}
            <div className={styles.ambitologyBox}>
              <div className={styles.ambitologyBoxHeader}>
                <img src="/images/atg-logo.svg" alt="Ambitology" className={styles.ambitologyLogo} />
                <span className={styles.ambitologyBoxLabel}>How Ambitology Can Help</span>
              </div>
              <p className={styles.ambitologyBoxText}>
                Developing business and domain context is one of the hardest gaps to close
                without direct industry experience — and it's the gap that <strong>Ambitology</strong>{" "}
                is specifically designed to help you address.
              </p>
              <p className={styles.ambitologyBoxText}>
                Our{" "}
                <Link href="/knowledge" className={styles.ambitologyLink}>
                  Knowledge Base
                </Link>{" "}
                lets you build and document not just your technical skills but your domain understanding —
                the business problems you've worked on, the product decisions you've made, and the
                industry context behind each project. This creates a structured professional profile
                that goes far beyond a one-page resume and gives recruiters a complete picture
                of your engineering judgment.
              </p>
              <p className={styles.ambitologyBoxText}>
                When you build a{" "}
                <Link href="/resume" className={styles.ambitologyLink}>
                  targeted resume through Ambitology
                </Link>
                , the system helps you frame your projects in terms of business impact and domain
                relevance — not just technical stack. For each target role, you can draw from your
                full knowledge base and select the domain context most relevant to that specific
                company and team, making every application feel like it was written by someone
                who genuinely understands the space.
              </p>
              <p className={styles.ambitologyBoxText}>
                Ambitology also maintains a planned expanding knowledge base feature, where you
                can document the domain areas you're actively learning — so recruiters can see
                not just where you are, but where you're headed. That growth trajectory is itself
                a signal of the intellectual curiosity that engineering managers are looking for.
              </p>
            </div>

            {/* CTA */}
            <div className={styles.ctaSection}>
              <h3 className={styles.ctaTitle}>Go beyond the code. Build the context that makes you irreplaceable.</h3>
              <p className={styles.ctaDesc}>
                Document your domain expertise, frame your projects with business impact,
                and build a professional profile that speaks to every level of the hiring team.
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
