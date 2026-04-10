"use client";

import Link from "next/link";
import styles from "./article.module.css";
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

const APPLICATION_FILTERS = [
  {
    step: "Filter 1",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
    ),
    name: "Automated / HR Screening",
    desc: "Before a human sees your resume, automated systems scan for education level, years of experience, and required technical keywords. This filter is mechanical — your application is accepted or eliminated in milliseconds.",
    tip: "Missing required keywords = instant elimination.",
  },
  {
    step: "Filter 2",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    name: "Engineering Team Review",
    desc: "Engineers assess whether you've shipped something real and can reason through technical decisions. They're looking for hands-on credibility — concrete project outcomes, not just a list of tools.",
    tip: "Project specificity and outcomes matter most here.",
  },
  {
    step: "Filter 3",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    name: "Hiring Manager Screen",
    desc: "The manager looks for domain fit, leadership signals, and whether your background is relevant to the team's actual problems. A candidate who has worked on something adjacent to the team's domain stands out immediately.",
    tip: "Domain alignment turns interest into an interview invite.",
  },
];

const APPLICATION_CHANNELS = [
  {
    rank: "Tier 1 — Highest Yield",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    name: "Campus Career Fairs & Industry Events",
    desc: "Direct face time with recruiters actively filling roles — often same-week interview invitations. Tech conferences, meetups, and hackathons carry the same signal strength for those past the campus stage.",
    tip: "Highest conversion rate — especially for new grads.",
  },
  {
    rank: "Tier 2 — High Trust",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    name: "Internal Employee Referral",
    desc: "A current employee forwarding your resume bypasses automated filtering and signals basic credibility before anyone reads your application. Referred candidates reach the interview stage at dramatically higher rates.",
    tip: "Referred candidates are 4× more likely to be interviewed.",
  },
  {
    rank: "Tier 3 — Full Control",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    name: "Online Job Applications",
    desc: "The most accessible channel — available anytime, to any company. Callback rates are lower here, but it's the channel you control entirely. Resume quality and ATS keyword optimization are the primary levers.",
    tip: "Keyword precision and tailoring are critical at this tier.",
  },
];

const BULLET_COMPONENTS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "01 — Project Overview",
    desc: "What does it do, and who does it benefit? Give the reviewer context before they process anything else. One clear sentence about purpose is worth more than three sentences about implementation.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "02 — Tech Stack Used",
    desc: "Name the most important tools and frameworks — especially those listed in the target job description. If the role mentions three specific tools and you used all three, make sure all three appear explicitly.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "03 — Measurable Impact",
    desc: "How did performance change? What happened to load time, conversion, error rate, or revenue? Even rough metrics — 'reduced API latency by roughly 40%' — are far more persuasive than qualitative descriptions.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "04 — Collaboration Signal",
    desc: "Any leadership or teamwork involved — even modest — registers with hiring managers. Coordinating a deployment, reviewing a teammate's PR, or leading a sprint are all worth naming explicitly.",
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
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
              <span className={styles.category}>Job Search Strategy</span>
              <span className={styles.metaDot} />
              <span className={styles.metaText}>March 24, 2026</span>
              <span className={styles.metaDot} />
              <span className={styles.metaText}>9 min read</span>
            </div>

            {/* Title */}
            <h1 className={styles.title}>
              How to Get More Callbacks with Fewer Wasted Applications
            </h1>

            {/* Lead */}
            <p className={styles.lead}>
              Most job seekers facing a low callback rate assume the fix is sending more applications.
              So they send more. The callbacks still don&apos;t come. The frustrating truth is that
              application volume is rarely the problem. What actually determines your callback rate
              happens before and after you hit submit — your targeting, your resume content, and whether
              your background sends the right signals to the right people. Here&apos;s how to fix all three.
            </p>

            {/* Hero Image */}
            <div className={styles.heroImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80"
                alt="Futuristic AI robot representing intelligent automation and the evolving job market landscape"
                className={styles.heroImage}
              />
              <p className={styles.imageCaption}>
                AI is reshaping who gets hired and why. A smarter, targeted strategy — not more volume — is what separates callbacks from silence.
              </p>
            </div>

            {/* Section 1 */}
            <h2 className={styles.h2}>The Three Filters That Decide Your Callback Rate</h2>
            <p className={styles.p}>
              Before fixing anything, understand what actually happens to your application. At most
              companies, your resume passes through at least three distinct filters before anyone
              calls you — and each filter has a completely different rejection mechanism. Knowing
              which one is cutting you off matters, because the fix is different every time.
            </p>

            <div className={styles.hiringGrid}>
              {APPLICATION_FILTERS.map((filter) => (
                <div key={filter.name} className={styles.hiringCard}>
                  <span className={styles.hiringRank}>{filter.step}</span>
                  <div className={styles.hiringIcon}>{filter.icon}</div>
                  <span className={styles.hiringName}>{filter.name}</span>
                  <span className={styles.hiringDesc}>{filter.desc}</span>
                  <span className={styles.hiringTip}>{filter.tip}</span>
                </div>
              ))}
            </div>

            <p className={styles.p}>
              Most candidates write their resume for none of these readers specifically — and as a
              result, it works for none of them. A resume that clears HR screening needs keyword
              density. One that impresses engineers needs project specificity and concrete outcomes.
              One that excites a hiring manager needs domain alignment. These goals are compatible,
              but they do require intentional structure.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>2–3%</span>
                <span className={styles.statLabel}>Average callback rate for cold online applications in tech</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>4×</span>
                <span className={styles.statLabel}>Higher interview rate for referred candidates vs. cold applicants</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>80%+</span>
                <span className={styles.statLabel}>Of roles involve some form of networking or referral in the hiring process</span>
              </div>
            </div>

            <blockquote className={styles.blockquote}>
              &ldquo;A 2–3% callback rate on cold applications isn&apos;t a failure — it&apos;s the baseline. 97 rejections
              out of 100 is entirely normal for strong candidates. Internalize that math, and rejection
              loses most of its sting.&rdquo;
            </blockquote>

            {/* Section 2 */}
            <h2 className={styles.h2}>Fix Your Targeting Before You Fix Your Resume</h2>
            <p className={styles.p}>
              One of the most consistent reasons for low callbacks has nothing to do with resume quality.
              It&apos;s that people are applying to the wrong pool of companies. Large, well-known tech firms
              have been on a sustained hiring slowdown after years of aggressive expansion. The applicant
              volume for the roles they do post is enormous — thousands of candidates competing for a
              handful of positions. Even a strong resume can disappear in that noise.
            </p>
            <p className={styles.p}>
              Meanwhile, a significant wave of well-funded startups and mid-size companies are actively
              hiring right now — often with leaner teams and faster decision cycles. They&apos;re less
              visible on job boards, which means far less competition per role.
            </p>

            <div className={styles.compareGrid}>
              <div className={`${styles.compareCard} ${styles.sideProject}`}>
                <span className={styles.compareLabel}>High Competition</span>
                <span className={styles.compareName}>Large Tech Companies</span>
                <ul className={styles.compareItems}>
                  <li>Post-overhiring correction: fewer open roles</li>
                  <li>Thousands of applicants per posted position</li>
                  <li>Heavily automated filtering at scale</li>
                  <li>Long, multi-stage interview cycles</li>
                  <li>Brand visibility = crowded applicant pool</li>
                </ul>
              </div>
              <div className={`${styles.compareCard} ${styles.workExperience}`}>
                <span className={styles.compareLabel}>Better Odds</span>
                <span className={styles.compareName}>Funded Startups &amp; Mid-Size Companies</span>
                <ul className={styles.compareItems}>
                  <li>AI tooling boom: more well-funded companies hiring</li>
                  <li>Fewer applicants per role due to lower visibility</li>
                  <li>Faster hiring cycles, direct access to decision-makers</li>
                  <li>More weight placed on initiative and shipped work</li>
                  <li>Faster career growth once inside the door</li>
                </ul>
              </div>
            </div>

            <p className={styles.p}>
              The level you&apos;re targeting matters equally. Entry-level roles have become
              disproportionately competitive — partly because AI tools have compressed how fast
              someone can develop working software, raising the baseline expectation. Applying
              for a role slightly above where you&apos;d naturally self-classify, supported by
              strong project evidence, often puts you in front of a meaningfully smaller
              applicant pool.
            </p>

            <div className={styles.highlightBox}>
              <div className={styles.highlightBoxIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <p className={styles.highlightBoxText}>
                  <strong>Practical rule:</strong> If the majority of your applications target large
                  household-name tech companies, shifting even a third of your effort toward well-funded
                  startups or growth-stage mid-size companies will almost immediately change your callback
                  rate — not because your resume improved, but because the competition ratio improved.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <h2 className={styles.h2}>Where You Apply Matters as Much as How Often</h2>
            <p className={styles.p}>
              The channel through which you apply is one of the most underestimated variables in
              job search outcomes. Most people spend nearly all of their time on the lowest-yield
              channel while mostly ignoring the two channels with dramatically better conversion rates.
            </p>

            <div className={styles.hiringGrid}>
              {APPLICATION_CHANNELS.map((channel) => (
                <div key={channel.name} className={styles.hiringCard}>
                  <span className={styles.hiringRank}>{channel.rank}</span>
                  <div className={styles.hiringIcon}>{channel.icon}</div>
                  <span className={styles.hiringName}>{channel.name}</span>
                  <span className={styles.hiringDesc}>{channel.desc}</span>
                  <span className={styles.hiringTip}>{channel.tip}</span>
                </div>
              ))}
            </div>

            <p className={styles.p}>
              This doesn&apos;t mean abandoning online applications — it means diversifying deliberately.
              Career fairs are most accessible when you&apos;re connected to a university network.
              Referrals require cultivated relationships inside target companies, which takes time
              to build. But having a strong, visible professional profile — one that signals genuine
              capability and ongoing growth — is the prerequisite for attracting both. A well-built
              profile increases the probability that someone who knows you will think to refer you,
              or that a recruiter browsing a candidate pool will reach out directly.
            </p>

            {/* Inline image */}
            <div className={styles.inlineImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=900&auto=format&fit=crop&q=80"
                alt="Two professionals in a collaborative work discussion representing networking and referral dynamics"
                className={styles.inlineImage}
              />
              <p className={styles.imageCaption}>
                Referrals and in-person events consistently outperform cold online applications — yet most job seekers invest almost entirely in the lowest-yield channel.
              </p>
            </div>

            {/* Section 4 */}
            <h2 className={styles.h2}>Tailor Your Resume — but Do It Strategically</h2>
            <p className={styles.p}>
              Tailoring your resume is widely recommended and widely ignored because it feels like
              a lot of effort for uncertain payoff. But here&apos;s what most people miss: most
              candidates already have more relevant experience than their current resume communicates.
              A resume sent unchanged to ten different roles is almost certainly underselling the
              candidate to nine of them.
            </p>
            <p className={styles.p}>
              The goal of tailoring isn&apos;t to fabricate experience. It&apos;s to surface the most relevant
              subset of what you already know, and make sure the language mirrors what the employer
              is looking for. If a job description lists three specific frameworks and you have
              genuine experience with all three, those terms need to appear in your resume —
              explicitly, in context, not buried or vague.
            </p>
            <p className={styles.p}>
              In the AI era, skills grow faster than resumes reflect. With tools like Claude Code
              and Cursor, it&apos;s possible to learn a new technology and ship something real with it
              faster than ever before. Your actual capability is frequently broader than any static
              document suggests. Selecting the most precise subset of your skills to match each
              target role isn&apos;t just helpful — at this point, it&apos;s the minimum standard.
            </p>

            <blockquote className={styles.blockquote}>
              &ldquo;An automated system scanning for &lsquo;Kubernetes&rsquo; won&apos;t infer it from
              &lsquo;managed containerized deployments.&rsquo; The exact term has to be there. Keyword
              matching is a precision game, not a context-reading exercise.&rdquo;
            </blockquote>

            {/* Section 5 */}
            <h2 className={styles.h2}>Fix How Your Projects Are Written</h2>
            <p className={styles.p}>
              Even when the right experience exists, it&apos;s often written in a way that fails to
              communicate its value. Spending weeks building something real and then describing it
              in a single vague sentence is one of the most common — and most fixable — resume
              mistakes. Strong technical project bullets need four specific components to do their job.
            </p>

            <div className={styles.tipsGrid}>
              {BULLET_COMPONENTS.map((component) => (
                <div key={component.title} className={styles.tipCard}>
                  <div className={styles.tipIcon}>{component.icon}</div>
                  <span className={styles.tipTitle}>{component.title}</span>
                  <span className={styles.tipDesc}>{component.desc}</span>
                </div>
              ))}
            </div>

            <p className={styles.p}>
              Bullet points that only describe what something does — without context, the relevant
              stack, and a quantified outcome — give the reviewer nothing to anchor on. The
              engineering team filter in particular is looking for the combination of credible
              tools and concrete results. Without both, even an impressive project gets dismissed
              as unclear or unverifiable.
            </p>

            {/* Section 6 */}
            <h2 className={styles.h2}>Build Experience Signals If You Don&apos;t Have Them Yet</h2>
            <p className={styles.p}>
              One of the most consistent factors in callback rate is whether the resume shows
              any professional working experience. Projects matter — but even a short period of
              professional work, in any context, changes how a resume reads to all three filters
              described above.
            </p>
            <p className={styles.p}>
              If you don&apos;t have formal employment history yet, one increasingly practical route
              is to establish a small legal business entity and operate a real project through it.
              This isn&apos;t a workaround. If you&apos;re building a product, acquiring even a handful of
              users, handling deployment and reliability, and managing customer feedback — that&apos;s
              genuine working experience. It can be represented honestly on a resume with a clear
              description of what the business does and what your role is.
            </p>
            <p className={styles.p}>
              The tools for this have become genuinely accessible. Services like Stripe Atlas handle
              U.S. company formation quickly and affordably. AI-assisted development tools let you
              build a working product significantly faster than was possible even two years ago.
              Social media provides real distribution without paid marketing. The combination makes
              building something real — and documenting it honestly as professional experience —
              a realistic option earlier in a career than it used to be.
            </p>
            <p className={styles.p}>
              One thing worth stating plainly: the goal of the first job search isn&apos;t landing a
              prestigious role. It&apos;s acquiring professional experience, full stop. A modest position
              at a smaller company becomes your springboard. Every subsequent application is
              dramatically easier once that first professional credential exists — because the
              fundamental barrier is gone.
            </p>

            {/* Ambitology box */}
            <div className={styles.ambitologyBox}>
              <div className={styles.ambitologyBoxHeader}>
                <img src="/images/atg-logo.svg" alt="Ambitology" className={styles.ambitologyLogo} />
                <span className={styles.ambitologyBoxLabel}>How Ambitology Can Help</span>
              </div>
              <p className={styles.ambitologyBoxText}>
                The tactical advice in this article works — the hard part is executing it consistently
                across a job search that may span weeks or months, while also building new skills and
                managing everything else.
              </p>
              <p className={styles.ambitologyBoxText}>
                <strong>Ambitology&apos;s{" "}
                <Link href="/resume" className={styles.ambitologyLink}>
                  resume builder
                </Link></strong>{" "}
                is designed specifically for the kind of targeted tailoring described here. Rather than
                editing one document over and over, you can build a version of your resume precisely
                optimized for each target role — surfacing the right keywords, framing the right
                projects, and adjusting emphasis without starting from scratch every time.
              </p>
              <p className={styles.ambitologyBoxText}>
                Beyond the resume, Ambitology supports a{" "}
                <Link href="/knowledge" className={styles.ambitologyLink}>
                  technical knowledge base
                </Link>{" "}
                where you document current skills, active projects, and technologies you&apos;re learning
                right now. The gap between when you start applying and your first interview is often
                months — and your skills keep growing during that time. Ambitology lets recruiters see
                your full technical picture and career growth trajectory, not just a static snapshot
                from when you last updated your resume.
              </p>
              <p className={styles.ambitologyBoxText}>
                A well-built Ambitology profile also places you in front of referral networks and
                recruiter searches — turning a low-yield cold application strategy into something
                with active inbound potential.
              </p>
            </div>

            {/* CTA */}
            <div className={styles.ctaSection}>
              <h3 className={styles.ctaTitle}>Stop applying broadly. Start applying precisely.</h3>
              <p className={styles.ctaDesc}>
                Build a targeted resume, document your full skill set, and position yourself
                where recruiters are already looking.
              </p>
              <Link href="/resume" className={styles.ctaButton}>
                Build Your Resume
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
