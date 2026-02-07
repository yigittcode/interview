import { useState, useEffect, useRef, useCallback } from "react";

/* ════════════════════════════════════════════
   PAGES
   ════════════════════════════════════════════ */
const P = {
  LANDING: 0, ONBOARD: 1, DASH: 2, SELECT: 3,
  TECHNICAL: 4, CODING: 5, ENGLISH: 6,
  RESULTS: 7, CV: 8, PRICING: 9,
};

/* ════════════════════════════════════════════
   DESIGN TOKENS  — soft pastel turquoise
   ════════════════════════════════════════════ */
const T = {
  bg: "#F6FAFB",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F7F8",
  border: "#E2EEF0",
  borderLight: "#EDF5F6",
  text: "#1A3A3A",
  textSoft: "#5A8A8A",
  textMuted: "#8FBABA",
  accent: "#3CBCB4",
  accentLight: "#E0F5F3",
  accentSoft: "#A8DDD8",
  accentDark: "#2A9D96",
  warm: "#F2A65A",
  warmLight: "#FFF3E5",
  rose: "#E8788A",
  roseLight: "#FFF0F2",
  mint: "#6DD4A0",
  mintLight: "#EDFBF3",
  sky: "#6BB8E0",
  skyLight: "#EBF5FC",
  lavender: "#9B8EC4",
  lavenderLight: "#F3F0FA",
  shadow: "0 1px 3px rgba(60,188,180,0.06), 0 4px 16px rgba(60,188,180,0.04)",
  shadowHover: "0 2px 8px rgba(60,188,180,0.1), 0 8px 32px rgba(60,188,180,0.06)",
  radius: 14,
  radiusSm: 10,
  radiusXs: 7,
  font: "'General Sans', 'Outfit', -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

/* ════════════════════════════════════════════
   TINY ICONS (inline svg)
   ════════════════════════════════════════════ */
const I = {
  mic: (c = "currentColor", s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  code: (c = "currentColor", s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  globe: (c = "currentColor", s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  file: (c = "currentColor", s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  chart: (c = "currentColor", s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  arrow: (c = "currentColor", s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  play: (c = "currentColor", s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><polygon points="5 3 19 12 5 21"/></svg>,
  up: (c = "currentColor", s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 11 12 6 7 11"/><line x1="12" y1="6" x2="12" y2="18"/></svg>,
  check: (c = "currentColor", s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  star: (c = "currentColor", s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  megaphone: (c = "currentColor", s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
  sparkle: (c = "currentColor", s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z"/></svg>,
  x: (c = "currentColor", s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  clock: (c = "currentColor", s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

/* ════════════════════════════════════════════
   SHARED COMPONENTS
   ════════════════════════════════════════════ */
function Btn({ children, variant = "primary", style: sx = {}, ...props }) {
  const [h, setH] = useState(false);
  const base = {
    fontFamily: T.font, fontSize: 14, fontWeight: 600, cursor: "pointer",
    borderRadius: T.radiusSm, display: "inline-flex", alignItems: "center", gap: 8,
    transition: "all 0.25s cubic-bezier(.4,0,.2,1)", border: "none", lineHeight: 1,
    userSelect: "none",
  };
  const variants = {
    primary: {
      ...base, padding: "13px 26px", color: "#fff",
      background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
      boxShadow: h ? `0 4px 20px ${T.accent}40` : `0 2px 8px ${T.accent}20`,
      transform: h ? "translateY(-1px)" : "none",
    },
    secondary: {
      ...base, padding: "13px 26px", color: T.accent, background: T.accentLight,
      border: `1.5px solid ${T.accentSoft}`,
      transform: h ? "translateY(-1px)" : "none",
      boxShadow: h ? T.shadowHover : "none",
    },
    ghost: {
      ...base, padding: "11px 22px", color: T.textSoft, background: "transparent",
      border: `1.5px solid ${T.border}`,
      boxShadow: h ? T.shadow : "none",
    },
    small: {
      ...base, padding: "8px 16px", fontSize: 13, color: T.accent, background: T.accentLight,
    },
  };
  return <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ ...variants[variant], ...sx }} {...props}>{children}</button>;
}

function Card({ children, style: sx = {}, hoverable = false, ...props }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: T.surface, border: `1px solid ${(hoverable && h) ? T.accentSoft : T.border}`,
        borderRadius: T.radius, padding: 24,
        boxShadow: (hoverable && h) ? T.shadowHover : T.shadow,
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        transform: (hoverable && h) ? "translateY(-3px)" : "none",
        ...sx,
      }} {...props}>{children}</div>
  );
}

function Badge({ children, color = T.accent, bg, style: sx = {} }) {
  return (
    <span style={{
      padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      color, background: bg || `${color}18`, display: "inline-flex",
      alignItems: "center", gap: 5, lineHeight: 1, ...sx,
    }}>{children}</span>
  );
}

function Score({ value, max = 100, color = T.accent, size = 80, label }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const [v, setV] = useState(0);
  useEffect(() => { setTimeout(() => setV(value), 200); }, [value]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.borderLight} strokeWidth="5"/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={c} strokeDashoffset={c - (v / max) * c} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}/>
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: size * 0.28, fontWeight: 700, color: T.text,
        }}>{v}</div>
      </div>
      {label && <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>{label}</span>}
    </div>
  );
}

function ProgressBar({ value, color = T.accent, height = 5 }) {
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW(value), 200); }, [value]);
  return (
    <div style={{ height, borderRadius: height, background: T.borderLight, overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: height, background: color,
        width: `${w}%`, transition: "width 1s cubic-bezier(.4,0,.2,1)",
      }}/>
    </div>
  );
}

function Section({ children, style: sx = {} }) {
  return <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 28px", ...sx }}>{children}</div>;
}

function Fade({ children, delay = 0, style: sx = {} }) {
  const [v, setV] = useState(false);
  useEffect(() => { setTimeout(() => setV(true), 80 + delay * 1000); }, []);
  return (
    <div style={{
      opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(16px)",
      transition: `all 0.6s cubic-bezier(.16,1,.3,1) ${delay}s`, ...sx,
    }}>{children}</div>
  );
}

/* ════════════════════════════════════════════
   NAV
   ════════════════════════════════════════════ */
function Nav({ page, go }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    { l: "Home", p: P.LANDING },
    { l: "Pricing", p: P.PRICING },
    { l: "Dashboard", p: P.DASH },
    { l: "Interview", p: P.SELECT },
    { l: "CV Tools", p: P.CV },
    { l: "Results", p: P.RESULTS },
  ];
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 32px", background: scrolled ? "rgba(246,250,251,0.92)" : "rgba(246,250,251,0.82)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
      boxShadow: scrolled ? "0 1px 12px rgba(60,188,180,0.06)" : "none",
      position: "sticky", top: 0, zIndex: 100, fontFamily: T.font,
      transition: "all 0.3s ease",
    }}>
      <span onClick={() => go(P.LANDING)} style={{
        fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", cursor: "pointer",
        color: T.accent, userSelect: "none",
      }}>intervü<span style={{ color: T.warm }}>.</span></span>
      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
        {links.map(n => (
          <button key={n.p} onClick={() => go(n.p)} style={{
            fontFamily: T.font, padding: "8px 16px", borderRadius: T.radiusXs,
            fontSize: 13.5, fontWeight: 550, cursor: "pointer", border: "none",
            background: page === n.p ? T.accentLight : "transparent",
            color: page === n.p ? T.accentDark : T.textSoft,
            transition: "all 0.2s",
          }}>{n.l}</button>
        ))}
      </div>
    </nav>
  );
}

/* ════════════════════════════════════════════
   LANDING
   ════════════════════════════════════════════ */
function Landing({ go }) {
  const features = [
    { icon: I.mic(T.accent), title: "Technical Interview", desc: "Real-time voice technical interview with an AI senior engineer.", color: T.accent, bg: T.accentLight },
    { icon: I.code(T.sky), title: "Coding Challenge", desc: "Solve problems in a real IDE, get automatic tests and analysis.", color: T.sky, bg: T.skyLight },
    { icon: I.globe(T.warm), title: "English Test", desc: "Grammar, vocabulary, listening and AI-powered speaking assessment.", color: T.warm, bg: T.warmLight },
    { icon: I.file(T.mint), title: "CV Tools", desc: "Create, analyze and optimize your CV for each position with AI.", color: T.mint, bg: T.mintLight },
    { icon: I.chart(T.lavender), title: "Detailed Report", desc: "Performance breakdown, weak points and personal development roadmap.", color: T.lavender, bg: T.lavenderLight },
  ];

  return (
    <div style={{ fontFamily: T.font }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(170deg, ${T.bg} 0%, ${T.accentLight} 50%, ${T.bg} 100%)`,
        paddingTop: 100, paddingBottom: 100, position: "relative", overflow: "hidden",
      }}>
        {/* decorative blobs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}08 0%, transparent 70%)` }}/>
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${T.warm}06 0%, transparent 70%)` }}/>

        <Section>
          <Fade>
            <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
              <Badge color={T.accentDark} bg={T.accentLight} style={{ marginBottom: 20 }}>
                {I.sparkle(T.accent)} AI-Powered Interview Platform
              </Badge>
              <h1 style={{
                fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.1,
                letterSpacing: "-1.5px", color: T.text, margin: "0 0 20px",
              }}>
                Prepare for Your Interview,<br/>
                <span style={{ color: T.accent }}>Stand Out.</span>
              </h1>
              <p style={{ fontSize: 17, color: T.textSoft, lineHeight: 1.7, margin: "0 auto 36px", maxWidth: 520 }}>
                Realistic AI interview simulations, smart CV tools and personalized performance analysis.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <Btn onClick={() => go(P.ONBOARD)}>Get Started {I.arrow("#fff")}</Btn>
                <Btn variant="ghost" onClick={() => go(P.DASH)}>Try Demo</Btn>
              </div>
            </div>
          </Fade>
        </Section>
      </div>

      {/* Features */}
      <Section style={{ paddingTop: 72, paddingBottom: 72 }}>
        <Fade delay={0.15}>
          <h2 style={{ fontSize: 24, fontWeight: 750, textAlign: "center", marginBottom: 36, color: T.text, letterSpacing: "-0.5px" }}>
            What We Offer?
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}>
            {features.map((f, i) => (
              <Card key={i} hoverable style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: T.radiusSm, flexShrink: 0,
                  background: f.bg, display: "flex", alignItems: "center", justifyContent: "center",
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 13.5, color: T.textSoft, lineHeight: 1.55 }}>{f.desc}</div>
                </div>
              </Card>
            ))}
          </div>
        </Fade>
      </Section>

      {/* Steps */}
      <Section style={{ paddingBottom: 40 }}>
        <Fade delay={0.25}>
          <h2 style={{ fontSize: 26, fontWeight: 750, textAlign: "center", marginBottom: 44, color: T.text, letterSpacing: "-0.5px" }}>
            How It Works?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
            <div style={{ position: "absolute", top: 28, left: "15%", right: "15%", height: 2, background: T.border, zIndex: 0 }}/>
            {[
              { n: "1", t: "Create Profile", d: "Upload CV or choose manually" },
              { n: "2", t: "Choose Interview", d: "Full package or single module" },
              { n: "3", t: "Start Interview", d: "Realistic experience with AI" },
              { n: "4", t: "Get Report", d: "Analysis and development roadmap" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px",
                  background: T.surface, border: `2.5px solid ${T.accent}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 800, color: T.accent,
                  boxShadow: `0 2px 12px ${T.accent}15`,
                }}>{s.n}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>{s.d}</div>
              </div>
            ))}
          </div>
        </Fade>
      </Section>

      {/* V2 / For companies */}
      <Section style={{ paddingBottom: 72 }}>
        <Fade delay={0.2}>
          <Card style={{
            padding: "36px 32px",
            background: `linear-gradient(135deg, ${T.lavenderLight}, ${T.surface})`,
            border: `1.5px solid ${T.lavender}40`,
          }}>
            <Badge color={T.lavender} bg={`${T.lavender}20`} style={{ marginBottom: 14 }}>Coming in v2</Badge>
            <h3 style={{ fontSize: 22, fontWeight: 750, color: T.text, marginBottom: 12, letterSpacing: "-0.3px" }}>
              For companies: run interviews on the platform
            </h3>
            <p style={{ fontSize: 14.5, color: T.textSoft, lineHeight: 1.65, marginBottom: 20, maxWidth: 560 }}>
              In v2 we’re turning intervü into the place where companies conduct their technical and coding interviews. Hire with one platform: screen candidates, run live or async coding tests, and use AI-assisted evaluation — all in one flow.
            </p>
            <p style={{ fontSize: 13, color: T.textMuted }}>
              Interested? We’ll share early access when it’s ready.
            </p>
          </Card>
        </Fade>
      </Section>

      {/* CTA */}
      <Section style={{ paddingBottom: 80 }}>
        <Fade delay={0.3}>
          <Card style={{
            padding: "40px 32px", textAlign: "center",
            background: `linear-gradient(135deg, ${T.accentLight}, ${T.surface})`,
            border: `1.5px solid ${T.accentSoft}`,
          }}>
            <h3 style={{ fontSize: 22, fontWeight: 750, color: T.text, marginBottom: 10, letterSpacing: "-0.3px" }}>
              Get One Step Ahead in Your Career
            </h3>
            <p style={{ fontSize: 14.5, color: T.textSoft, marginBottom: 24, maxWidth: 420, margin: "0 auto 24px" }}>
              Create a free account and discover the AI-powered interview experience.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Btn onClick={() => go(P.ONBOARD)}>Start for Free {I.arrow("#fff")}</Btn>
              <Btn variant="secondary" onClick={() => go(P.DASH)}>View Demo</Btn>
            </div>
          </Card>
        </Fade>
      </Section>
    </div>
  );
}

/* ════════════════════════════════════════════
   ONBOARDING
   ════════════════════════════════════════════ */
function Onboard({ go }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const [stacks, setStacks] = useState([]);
  const [level, setLevel] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  const roles = ["Backend", "Frontend", "Fullstack", "Mobile", "DevOps", "Data Engineer"];
  const stackMap = {
    Backend: ["Node.js", "Python", "Go", "Java", "C#", "Rust"],
    Frontend: ["React", "Vue", "Angular", "Svelte", "Next.js"],
    Fullstack: ["React + Node", "Next.js", "Django", "Rails"],
    Mobile: ["React Native", "Flutter", "Swift", "Kotlin"],
    DevOps: ["AWS", "GCP", "Azure", "Kubernetes", "Terraform"],
    "Data Engineer": ["Python", "Spark", "Airflow", "dbt"],
  };
  const levels = [
    { l: "Junior", d: "0-2 years experience" },
    { l: "Mid", d: "2-5 years experience" },
    { l: "Senior", d: "5+ years experience" },
    { l: "Lead", d: "Team leadership experience" },
  ];

  const analyzeLines = [
    "Analyzing CV structure...",
    "Role detected: Backend Developer",
    "Stack: Node.js, TypeScript, PostgreSQL, AWS",
    "Experience level: Mid-Level (~3 years)",
    "Preparing profile...",
  ];

  useEffect(() => {
    if (!analyzing) return;
    if (analyzeStep < analyzeLines.length) {
      const t = setTimeout(() => setAnalyzeStep(s => s + 1), 800);
      return () => clearTimeout(t);
    } else {
      setTimeout(() => go(P.DASH), 600);
    }
  }, [analyzing, analyzeStep]);

  // Step 0: choose path
  if (step === 0) return (
    <Section style={{ paddingTop: 56 }}>
      <Fade><div style={{ maxWidth: 580, margin: "0 auto" }}>
        <h2 style={{ fontSize: 26, fontWeight: 750, color: T.text, marginBottom: 6 }}>Welcome! 👋</h2>
        <p style={{ color: T.textSoft, marginBottom: 36, fontSize: 15 }}>Choose a path to get started.</p>
        {[
          { id: "upload", icon: I.up(T.accent), title: "Upload CV", desc: "Let AI analyze and build your profile automatically", c: T.accent },
          { id: "build", icon: I.sparkle(T.mint, 18), title: "Create CV", desc: "Build a CV from scratch with our templates", c: T.mint },
          { id: "skip", icon: I.arrow(T.warm), title: "Continue Without CV", desc: "Pick role and stack, start right away", c: T.warm },
        ].map(o => (
          <Card key={o.id} hoverable style={{ marginBottom: 12, cursor: "pointer", display: "flex", gap: 16, alignItems: "center" }}
            onClick={() => {
              if (o.id === "skip") setStep(1);
              else if (o.id === "upload") setStep(3);
              else go(P.CV, { builderOnly: true });
            }}>
            <div style={{ width: 46, height: 46, borderRadius: T.radiusSm, background: `${o.c}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{o.icon}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 650, color: T.text }}>{o.title}</div>
              <div style={{ fontSize: 13, color: T.textMuted }}>{o.desc}</div>
            </div>
          </Card>
        ))}
      </div></Fade>
    </Section>
  );

  // Step 3: upload & analyze
  if (step === 3) return (
    <Section style={{ paddingTop: 56 }}>
      <Fade><div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
        {!analyzing ? <>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 28 }}>Upload Your CV</h2>
          <Card style={{ padding: 48, cursor: "pointer", borderStyle: "dashed", borderWidth: 2, borderColor: T.accentSoft }}
            onClick={() => setAnalyzing(true)}>
            <div style={{ color: T.accent, marginBottom: 12 }}>{I.up(T.accent, 32)}</div>
            <div style={{ fontSize: 16, fontWeight: 650, color: T.text, marginBottom: 6 }}>Select PDF or DOCX file</div>
            <div style={{ fontSize: 13, color: T.textMuted }}>Drag and drop or click to upload</div>
          </Card>
        </> : <>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: "0 auto 20px",
            background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center",
          }}>{I.sparkle(T.accent, 24)}</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 24 }}>AI is Analyzing Your CV</h3>
          <ProgressBar value={analyzeStep / analyzeLines.length * 100} height={6} />
          <div style={{ textAlign: "left", marginTop: 24 }}>
            {analyzeLines.slice(0, analyzeStep).map((l, i) => (
              <div key={i} style={{
                padding: "8px 0", fontSize: 14,
                color: i === analyzeStep - 1 ? T.accent : T.textSoft,
                animation: "fadeUp .3s ease",
              }}>{i === analyzeLines.length - 1 && analyzeStep > i ? "✓ " : "→ "}{l}</div>
            ))}
          </div>
        </>}
      </div></Fade>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </Section>
  );

  // Step 1: role selection
  if (step === 1) return (
    <Section style={{ paddingTop: 56 }}>
      <Fade><div style={{ maxWidth: 580, margin: "0 auto" }}>
        <ProgressBar value={33} />
        <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginTop: 28, marginBottom: 28 }}>Choose Role</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
          {roles.map(r => (
            <Card key={r} hoverable style={{
              cursor: "pointer", textAlign: "center", padding: "18px 12px",
              border: role === r ? `2px solid ${T.accent}` : `1.5px solid ${T.border}`,
              background: role === r ? T.accentLight : T.surface,
            }} onClick={() => { setRole(r); setTimeout(() => setStep(2), 300); }}>
              <span style={{ fontSize: 14, fontWeight: 650, color: role === r ? T.accentDark : T.text }}>{r}</span>
            </Card>
          ))}
        </div>
      </div></Fade>
    </Section>
  );

  // Step 2: stack & level
  return (
    <Section style={{ paddingTop: 56 }}>
      <Fade><div style={{ maxWidth: 580, margin: "0 auto" }}>
        <ProgressBar value={66} />
        <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginTop: 28, marginBottom: 6 }}>Stack & Level</h2>
        <p style={{ color: T.textMuted, marginBottom: 28, fontSize: 14 }}>Select technologies and experience for {role}.</p>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 650, color: T.textSoft, marginBottom: 10 }}>TECHNOLOGIES</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(stackMap[role] || []).map(s => (
              <button key={s} onClick={() => setStacks(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])}
                style={{
                  fontFamily: T.font, padding: "8px 16px", borderRadius: T.radiusXs, fontSize: 13, fontWeight: 550,
                  cursor: "pointer", transition: "all 0.2s",
                  border: stacks.includes(s) ? `1.5px solid ${T.accent}` : `1.5px solid ${T.border}`,
                  background: stacks.includes(s) ? T.accentLight : T.surface,
                  color: stacks.includes(s) ? T.accentDark : T.textSoft,
                }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 650, color: T.textSoft, marginBottom: 10 }}>LEVEL</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {levels.map(lv => (
              <Card key={lv.l} hoverable style={{
                cursor: "pointer", padding: "14px 18px",
                border: level === lv.l ? `2px solid ${T.accent}` : `1.5px solid ${T.border}`,
                background: level === lv.l ? T.accentLight : T.surface,
              }} onClick={() => setLevel(lv.l)}>
                <div style={{ fontSize: 14, fontWeight: 650, color: level === lv.l ? T.accentDark : T.text }}>{lv.l}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{lv.d}</div>
              </Card>
            ))}
          </div>
        </div>

        <Btn onClick={() => go(P.DASH)} style={{ width: "100%", justifyContent: "center" }}>
          Create Profile {I.arrow("#fff")}
        </Btn>
      </div></Fade>
    </Section>
  );
}

/* ════════════════════════════════════════════
   PRICING
   ════════════════════════════════════════════ */
function Pricing({ go }) {
  const [selectedPlan, setSelectedPlan] = useState("free");
  const pricingPlans = [
    { id: "free", name: "Free", price: "0", period: "forever", desc: "3 interviews/month", features: ["Technical + Coding + English", "Basic CV tools", "Summary report"], color: T.textSoft, recommended: false },
    { id: "pro", name: "Pro", price: "19", period: "month", desc: "Unlimited interviews", features: ["Unlimited practice", "Full reports & roadmap", "CV optimization", "Priority support"], color: T.accent, recommended: true },
    { id: "team", name: "Team", price: "49", period: "month", desc: "Per seat", features: ["Everything in Pro", "Team dashboard", "Bulk assessments", "Admin controls"], color: T.lavender, recommended: false },
  ];
  return (
    <Section style={{ paddingTop: 80, paddingBottom: 80 }}>
      <Fade><div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontSize: 26, fontWeight: 750, color: T.text, marginBottom: 6, textAlign: "center" }}>Choose your plan</h2>
        <p style={{ color: T.textSoft, marginBottom: 32, fontSize: 15, textAlign: "center" }}>Start free, upgrade when you need more.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>
          {pricingPlans.map(plan => (
            <Card key={plan.id} hoverable style={{
              cursor: "pointer", position: "relative",
              border: selectedPlan === plan.id ? `2px solid ${plan.color}` : `1.5px solid ${T.border}`,
              background: selectedPlan === plan.id ? `${plan.color}08` : T.surface,
            }} onClick={() => setSelectedPlan(plan.id)}>
              {plan.recommended && (
                <Badge color="#fff" bg={plan.color} style={{ position: "absolute", top: -10, right: 16 }}>Recommended</Badge>
              )}
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: plan.color }}>${plan.price}</span>
                <span style={{ fontSize: 13, color: T.textMuted }}>/ {plan.period}</span>
              </div>
              <div style={{ fontSize: 13, color: T.textSoft, marginBottom: 16 }}>{plan.desc}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textSoft }}>
                    {I.check(plan.color, 14)} {f}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div></Fade>
    </Section>
  );
}

/* ════════════════════════════════════════════
   DASHBOARD
   ════════════════════════════════════════════ */
function Dash({ go }) {
  const quicks = [
    { icon: I.mic(T.accent), t: "Technical Interview", d: "AI Voice", c: T.accent, bg: T.accentLight, p: P.TECHNICAL },
    { icon: I.code(T.sky), t: "Coding Challenge", d: "Solve problems", c: T.sky, bg: T.skyLight, p: P.CODING },
    { icon: I.globe(T.warm), t: "English Test", d: "Measure your level", c: T.warm, bg: T.warmLight, p: P.ENGLISH },
    { icon: I.file(T.mint), t: "CV Tools", d: "Analysis & Builder", c: T.mint, bg: T.mintLight, p: P.CV },
  ];
  const history = [
    { type: "Full Package", date: "2 days ago", score: 74, color: T.warm },
    { type: "Technical Interview", date: "5 days ago", score: 82, color: T.accent },
    { type: "Coding Challenge", date: "1 week ago", score: 65, color: T.sky },
  ];

  return (
    <Section style={{ paddingTop: 40, paddingBottom: 60, fontFamily: T.font }}>
      <Fade>
        {/* Profile bar */}
        <Card style={{
          marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16, background: `linear-gradient(135deg, ${T.accentLight}, ${T.surface})`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: T.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 700, color: "#fff",
            }}>Y</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Welcome!</div>
              <div style={{ fontSize: 13, color: T.textSoft }}>Backend Developer · Mid-Level · Node.js, TypeScript</div>
            </div>
          </div>
          <Btn onClick={() => go(P.SELECT)}>{I.play("#fff")} Start Interview</Btn>
        </Card>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12, marginBottom: 36 }}>
          {quicks.map((q, i) => (
            <Card key={i} hoverable style={{ cursor: "pointer", padding: 20 }}
              onClick={() => go(q.p)}>
              <div style={{
                width: 40, height: 40, borderRadius: T.radiusSm, background: q.bg,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
              }}>{q.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 650, color: T.text, marginBottom: 2 }}>{q.t}</div>
              <div style={{ fontSize: 12, color: T.textMuted }}>{q.d}</div>
            </Card>
          ))}
        </div>

        {/* History */}
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 14 }}>Recent Interviews</div>
        {history.map((h, i) => (
          <Card key={i} hoverable style={{
            marginBottom: 8, display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "14px 20px", cursor: "pointer",
          }} onClick={() => go(P.RESULTS)}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{h.type}</div>
              <div style={{ fontSize: 12, color: T.textMuted }}>{h.date}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Badge color={h.score >= 75 ? T.mint : T.warm}>{h.score}/100</Badge>
              {I.arrow(T.textMuted)}
            </div>
          </Card>
        ))}
      </Fade>
    </Section>
  );
}

/* ════════════════════════════════════════════
   INTERVIEW SELECT
   ════════════════════════════════════════════ */
function Select({ go }) {
  const mods = [
    { icon: I.mic(T.accent), t: "Technical Interview", time: "25-40 min", c: T.accent, p: P.TECHNICAL },
    { icon: I.code(T.sky), t: "Coding Challenge", time: "30-45 min", c: T.sky, p: P.CODING },
    { icon: I.globe(T.warm), t: "English Test", time: "15-20 min", c: T.warm, p: P.ENGLISH },
  ];
  return (
    <Section style={{ paddingTop: 48, paddingBottom: 60, fontFamily: T.font }}>
      <Fade>
        <h2 style={{ fontSize: 26, fontWeight: 750, color: T.text, marginBottom: 6, letterSpacing: "-0.5px" }}>Choose Interview Type</h2>
        <p style={{ color: T.textSoft, marginBottom: 32, fontSize: 15 }}>Full simulation or focus on a single module.</p>

        {/* Full package */}
        <Card hoverable style={{
          marginBottom: 24, cursor: "pointer", padding: 28,
          background: `linear-gradient(135deg, ${T.accentLight}, ${T.surface})`,
          border: `2px solid ${T.accentSoft}`,
        }} onClick={() => go(P.TECHNICAL)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
            <div>
              <Badge color={T.accentDark} bg={T.accentLight} style={{ marginBottom: 10 }}>
                {I.sparkle(T.accent)} RECOMMENDED
              </Badge>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: T.text, margin: "0 0 6px" }}>Full Interview Simulation</h3>
              <p style={{ fontSize: 14, color: T.textSoft, margin: 0 }}>Intro → Technical → Coding → English → Soft Skills</p>
            </div>
            <span style={{ fontSize: 13, color: T.textMuted, display: "flex", alignItems: "center", gap: 4 }}>{I.clock(T.textMuted)} ~90 min</span>
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {mods.map((m, i) => (
            <Card key={i} hoverable style={{ cursor: "pointer", padding: 20 }}
              onClick={() => go(m.p)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: T.radiusSm, background: `${m.c}14`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{m.icon}</div>
                <span style={{ fontSize: 12, color: T.textMuted }}>{m.time}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 650, color: T.text }}>{m.t}</div>
            </Card>
          ))}
        </div>
      </Fade>
    </Section>
  );
}

/* ════════════════════════════════════════════
   TECHNICAL INTERVIEW (AI Voice)
   ════════════════════════════════════════════ */
const TECHNICAL_CONV = [
  { r: "ai", t: "Hello! I'll be conducting your technical interview today. I see on your profile you work with Node.js and TypeScript. Could you tell me about your last project?" },
  { r: "user", t: "Hi, in my last project I built an event-driven system with a microservices architecture. We used RabbitMQ as the message broker." },
  { r: "ai", t: "Good. So how would you evaluate the trade-offs between RabbitMQ and Kafka? In terms of throughput, ordering guarantees and delivery semantics?" },
];

function Technical({ go }) {
  const [started, setStarted] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [aiTalking, setAiTalking] = useState(false);
  const [sec, setSec] = useState(0);
  const convIndexRef = useRef(0);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const conv = TECHNICAL_CONV;
    const clearAll = () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
      timeoutsRef.current = [];
    };
    const addTimeout = (fn, delay) => {
      const id = setTimeout(() => { fn(); }, delay);
      timeoutsRef.current.push(id);
    };
    const next = () => {
      const i = convIndexRef.current;
      if (i >= conv.length) return;
      if (conv[i].r === "ai") setAiTalking(true);
      const delay = conv[i].r === "ai" ? 1800 : 400;
      addTimeout(() => {
        setMsgs(p => [...p, conv[i]]);
        setAiTalking(false);
        convIndexRef.current = i + 1;
        if (convIndexRef.current < conv.length) addTimeout(next, 2200);
      }, delay);
    };
    addTimeout(next, 1200);
    return clearAll;
  }, [started]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  if (!started) return (
    <Section style={{ paddingTop: 60, fontFamily: T.font }}>
      <Fade><div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18, margin: "0 auto 20px",
          background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center",
        }}>{I.mic(T.accent, 28)}</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 8 }}>Technical Interview</h2>
        <p style={{ color: T.textSoft, marginBottom: 28, fontSize: 15 }}>Voice interview with AI Senior Engineer</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          {["System Design", "In-depth Questions", "Problem Solving", "Trade-off"].map((t, i) => (
            <Badge key={i} color={T.textSoft} bg={T.surfaceAlt}>{t}</Badge>
          ))}
        </div>
        <Card style={{ textAlign: "left", marginBottom: 28, padding: 20 }}>
          {[
            "Duration: about 25-40 minutes",
            "Microphone permission required",
            "Questions will be tailored to your profile",
            "You can end anytime",
          ].map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "5px 0", fontSize: 13.5, color: T.textSoft }}>
              {I.check(T.accent, 14)} {l}
            </div>
          ))}
        </Card>
        <Btn onClick={() => setStarted(true)}>{I.mic("#fff")} Start Interview</Btn>
      </div></Fade>
    </Section>
  );

  return (
    <Section style={{ paddingTop: 24, paddingBottom: 40, fontFamily: T.font }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.rose, animation: "blink 1.5s infinite" }}/>
            <span style={{ fontSize: 13, fontWeight: 650, color: T.rose }}>LIVE</span>
            <span style={{ fontSize: 13, color: T.textMuted, fontFamily: T.mono }}>{fmt(sec)}</span>
          </div>
          <Btn variant="small" onClick={() => go(P.RESULTS)}>End Interview</Btn>
        </div>
        <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>

        {/* AI Avatar */}
        <Card style={{
          textAlign: "center", marginBottom: 20, padding: 28,
          background: aiTalking ? `linear-gradient(135deg, ${T.accentLight}, ${T.surface})` : T.surface,
          transition: "background 0.5s",
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%", margin: "0 auto 12px",
            background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: aiTalking ? `0 0 32px ${T.accent}30` : "none", transition: "box-shadow 0.4s",
            color: "#fff", fontSize: 24,
          }}>🎙</div>
          <div style={{ fontSize: 15, fontWeight: 650, color: T.text }}>AI Senior Engineer</div>
          <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 14 }}>{aiTalking ? "Speaking..." : "Listening..."}</div>
          {/* Mini waveform */}
          <div style={{ display: "flex", justifyContent: "center", gap: 3, height: 28 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{
                width: 3, borderRadius: 2, background: aiTalking ? T.accent : T.border,
                animation: aiTalking ? `wave 1s ease-in-out ${i * .05}s infinite alternate` : "none",
                height: aiTalking ? undefined : 4,
              }}/>
            ))}
          </div>
          <style>{`@keyframes wave{0%{height:4px}100%{height:24px}}`}</style>
        </Card>

        {/* Messages */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: m.r === "user" ? "flex-end" : "flex-start",
              animation: "fadeUp .4s ease",
            }}>
              <div style={{
                maxWidth: "80%", padding: "12px 18px", borderRadius: 16, fontSize: 14, lineHeight: 1.65,
                background: m.r === "user" ? T.accent : T.surface,
                color: m.r === "user" ? "#fff" : T.text,
                border: m.r === "ai" ? `1.5px solid ${T.border}` : "none",
                borderBottomRightRadius: m.r === "user" ? 4 : 16,
                borderBottomLeftRadius: m.r === "ai" ? 4 : 16,
              }}>{m.t}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </Section>
  );
}

/* ════════════════════════════════════════════
   CODING CHALLENGE
   ════════════════════════════════════════════ */
function Coding({ go }) {
  const [code, setCode] = useState(`function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}`);
  const [lang, setLang] = useState("JavaScript");
  const [tests, setTests] = useState(null);
  const [tab, setTab] = useState("desc");
  const [extensionAccepted, setExtensionAccepted] = useState(null); // null = show modal, true = accepted, false = declined
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [wasHidden, setWasHidden] = useState(false);
  const lines = code.split("\n");

  // Simulate proctoring extension: detect leaving tab (switch tab, minimize, etc.)
  useEffect(() => {
    if (extensionAccepted !== true) return;
    const onVisibilityChange = () => {
      if (document.hidden) setWasHidden(true);
      else {
        if (wasHidden) {
          setTabSwitchCount(c => c + 1);
          setShowTabSwitchWarning(true);
        }
        setWasHidden(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [extensionAccepted, wasHidden]);

  // First-time extension consent modal
  if (extensionAccepted === null) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 54px)", fontFamily: T.font, background: T.bg, padding: 24 }}>
      <Card style={{ maxWidth: 440, padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: "0 auto 16px",
            background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center",
          }}>🔒</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 12 }}>Coding test rules</h2>
          <p style={{ fontSize: 14, color: T.textSoft, lineHeight: 1.65 }}>
            During the test you cannot switch tabs or leave this page. We will require you to install a proctoring extension so that tab changes are detected and recorded.
          </p>
          <p style={{ fontSize: 13, color: T.textMuted, marginTop: 12 }}>
            Do you accept these terms to continue?
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn onClick={() => setExtensionAccepted(true)}>Accept</Btn>
          <Btn variant="ghost" onClick={() => go(P.SELECT)}>Don't accept</Btn>
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "calc(100vh - 54px)", fontFamily: T.font, background: T.bg, position: "relative" }}>
      {/* LEFT: Problem */}
      <div style={{ width: "40%", borderRight: `1.5px solid ${T.border}`, display: "flex", flexDirection: "column", background: T.surface }}>
        <div style={{ display: "flex", borderBottom: `1.5px solid ${T.border}` }}>
          {[
            { k: "desc", l: "Problem" },
            { k: "tests", l: "Test Cases" },
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              fontFamily: T.font, padding: "12px 18px", fontSize: 13, fontWeight: 600,
              border: "none", background: "transparent", cursor: "pointer",
              color: tab === t.k ? T.accent : T.textMuted,
              borderBottom: tab === t.k ? `2px solid ${T.accent}` : "2px solid transparent",
            }}>{t.l}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {tab === "desc" ? <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
              <Badge color={T.warm} bg={T.warmLight}>Medium</Badge>
              <span style={{ fontSize: 12, color: T.textMuted, display: "flex", alignItems: "center", gap: 4 }}>{I.clock(T.textMuted)} 30 min</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 14 }}>Two Sum</h2>
            <div style={{ fontSize: 14, color: T.textSoft, lineHeight: 1.75 }}>
              <p style={{ margin: "0 0 12px" }}>
                Given an integer array <code style={{ background: T.accentLight, padding: "2px 8px", borderRadius: 5, color: T.accentDark, fontSize: 13, fontFamily: T.mono }}>nums</code> and
                an integer <code style={{ background: T.accentLight, padding: "2px 8px", borderRadius: 5, color: T.accentDark, fontSize: 13, fontFamily: T.mono }}>target</code>,
                return the indices of the two numbers that add up to target.
              </p>
              <p style={{ margin: "0 0 16px" }}>You may assume each input has exactly one solution. You may not use the same element twice.</p>

              {[
                { i: "nums = [2,7,11,15], target = 9", o: "[0,1]", e: "nums[0] + nums[1] = 2 + 7 = 9" },
                { i: "nums = [3,2,4], target = 6", o: "[1,2]", e: "nums[1] + nums[2] = 2 + 4 = 6" },
              ].map((ex, i) => (
                <Card key={i} style={{ padding: 14, marginBottom: 10, fontFamily: T.mono, fontSize: 13, lineHeight: 1.7 }}>
                  <div style={{ color: T.textMuted, fontWeight: 600, marginBottom: 6, fontFamily: T.font, fontSize: 12 }}>Example {i + 1}</div>
                  <div><span style={{ color: T.accent }}>Input:</span> <span style={{ color: T.text }}>{ex.i}</span></div>
                  <div><span style={{ color: T.accent }}>Output:</span> <span style={{ color: T.text }}>{ex.o}</span></div>
                  <div style={{ color: T.textMuted, fontSize: 12, marginTop: 4 }}>{ex.e}</div>
                </Card>
              ))}

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 650, color: T.text, marginBottom: 6 }}>Constraints:</div>
                <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.8 }}>
                  2 ≤ nums.length ≤ 10⁴<br/>
                  -10⁹ ≤ nums[i] ≤ 10⁹<br/>
                  -10⁹ ≤ target ≤ 10⁹
                </div>
              </div>
            </div>
          </> : <>
            {/* Test Cases tab */}
            {[
              { i: "[2,7,11,15], 9", e: "[0,1]" },
              { i: "[3,2,4], 6", e: "[1,2]" },
              { i: "[3,3], 6", e: "[0,1]" },
              { i: "[-1,-2,-3,-4,-5], -8", e: "[2,4]" },
            ].map((tc, i) => (
              <Card key={i} style={{ padding: 14, marginBottom: 8, fontFamily: T.mono, fontSize: 13 }}>
                <div style={{ color: T.textMuted, marginBottom: 4, fontFamily: T.font, fontSize: 12, fontWeight: 600 }}>Case {i + 1}</div>
                <div><span style={{ color: T.accent }}>Input:</span> {tc.i}</div>
                <div><span style={{ color: T.accent }}>Expected:</span> {tc.e}</div>
              </Card>
            ))}
          </>}
        </div>
      </div>

      {/* RIGHT: IDE */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Toolbar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 16px", borderBottom: `1.5px solid ${T.border}`, background: T.surface,
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select value={lang} onChange={e => setLang(e.target.value)} style={{
              fontFamily: T.font, background: T.surfaceAlt, border: `1.5px solid ${T.border}`,
              borderRadius: T.radiusXs, color: T.text, padding: "6px 12px", fontSize: 13,
            }}>
              {["JavaScript", "Python", "TypeScript", "Go", "Java"].map(l => <option key={l}>{l}</option>)}
            </select>
            <span style={{ fontSize: 12, color: T.textMuted, fontFamily: T.mono }}>UTF-8</span>
            <span style={{
              fontSize: 11, fontWeight: 600, color: T.mint, background: `${T.mint}18`,
              padding: "4px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4,
            }}>🔒 Proctoring active</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" style={{ padding: "7px 14px", fontSize: 13 }}
              onClick={() => setTests([
                { i: "[2,7,11,15], 9", e: "[0,1]", o: "[0,1]", p: true },
                { i: "[3,2,4], 6", e: "[1,2]", o: "[1,2]", p: true },
                { i: "[3,3], 6", e: "[0,1]", o: "[0,1]", p: true },
              ])}>▶ Run</Btn>
            <Btn style={{ padding: "7px 14px", fontSize: 13 }}
              onClick={() => go(P.RESULTS)}>Submit</Btn>
          </div>
        </div>

        {/* Editor */}
        <div style={{ flex: 1, display: "flex", overflow: "auto", background: "#0F1419" }}>
          {/* Line numbers */}
          <div style={{
            padding: "16px 0", minWidth: 48, textAlign: "right",
            fontFamily: T.mono, fontSize: 13, lineHeight: "22px",
            color: "#3D4752", userSelect: "none", background: "#0B0F14",
            borderRight: "1px solid #1A2028",
          }}>
            {lines.map((_, i) => (
              <div key={i} style={{ paddingRight: 12 }}>{i + 1}</div>
            ))}
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
            style={{
              flex: 1, resize: "none", border: "none", outline: "none",
              background: "transparent", color: "#D4D4D4",
              padding: "16px 18px", fontFamily: T.mono, fontSize: 13,
              lineHeight: "22px", tabSize: 2,
            }}/>
        </div>

        {/* Test output */}
        {tests && (
          <div style={{
            borderTop: `1.5px solid #1A2028`, padding: 14, background: "#0B0F14",
            maxHeight: 160, overflow: "auto",
          }}>
            <div style={{
              fontSize: 13, fontWeight: 600, marginBottom: 10, fontFamily: T.font,
              color: tests.every(t => t.p) ? "#6DD4A0" : T.rose,
            }}>
              {tests.every(t => t.p) ? "✓" : "✗"} {tests.filter(t => t.p).length}/{tests.length} tests passed
            </div>
            {tests.map((t, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, padding: "4px 0",
                fontFamily: T.mono, fontSize: 12, color: "#8B949E",
              }}>
                <span style={{ color: t.p ? "#6DD4A0" : "#E8788A" }}>{t.p ? "✓" : "✗"}</span>
                <span>({t.i})</span>
                <span style={{ color: "#D4D4D4" }}>→ {t.o}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tab switch warning overlay (proctoring extension simulation) */}
      {showTabSwitchWarning && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }} onClick={() => setShowTabSwitchWarning(false)}>
          <div style={{
            background: T.surface, borderRadius: T.radius, padding: 32, maxWidth: 420,
            boxShadow: "0 24px 48px rgba(0,0,0,0.3)", border: `1px solid ${T.border}`,
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", margin: "0 auto 20px",
              background: T.roseLight, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28,
            }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 10, textAlign: "center" }}>
              Tab switch detected
            </h3>
            <p style={{ fontSize: 14, color: T.textSoft, lineHeight: 1.6, marginBottom: 20, textAlign: "center" }}>
              You left the test window. This has been recorded. Do not switch tabs or open other windows during the assessment.
            </p>
            {tabSwitchCount > 1 && (
              <p style={{ fontSize: 12, color: T.rose, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>
                Tab switches recorded: {tabSwitchCount}
              </p>
            )}
            <Btn style={{ width: "100%" }} onClick={() => setShowTabSwitchWarning(false)}>
              I understand — Continue
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   ENGLISH TEST
   ════════════════════════════════════════════ */
function English({ go }) {
  const [section, setSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [speaking, setSpeaking] = useState(false);

  const grammar = [
    { q: "She ___ to the office every day.", opts: ["go", "goes", "going", "gone"], correct: 1 },
    { q: "If I ___ you, I would accept the offer.", opts: ["am", "was", "were", "be"], correct: 2 },
    { q: "The project ___ by the team last week.", opts: ["completed", "was completed", "has completed", "completing"], correct: 1 },
  ];
  const vocab = [
    { q: "What does 'meticulous' mean?", opts: ["Careless", "Extremely careful", "Fast", "Angry"], correct: 1 },
    { q: "Choose the synonym of 'ubiquitous':", opts: ["Rare", "Everywhere", "Small", "Hidden"], correct: 1 },
    { q: "'Mitigate' is closest in meaning to:", opts: ["Increase", "Reduce", "Create", "Ignore"], correct: 1 },
  ];

  const sections = [
    { title: "Grammar", icon: "📝", questions: grammar },
    { title: "Vocabulary", icon: "📖", questions: vocab },
    { title: "Speaking", icon: "🗣️", questions: null },
  ];

  return (
    <Section style={{ paddingTop: 48, paddingBottom: 60, fontFamily: T.font }}>
      <Fade>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 6 }}>English Assessment</h2>
          <p style={{ color: T.textSoft, marginBottom: 24, fontSize: 14 }}>Measure grammar, vocabulary and speaking skills.</p>

          {/* Section tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {sections.map((s, i) => (
              <button key={i} onClick={() => setSection(i)} style={{
                fontFamily: T.font, flex: 1, padding: "12px 16px", borderRadius: T.radiusSm,
                fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                border: section === i ? `2px solid ${T.accent}` : `1.5px solid ${T.border}`,
                background: section === i ? T.accentLight : T.surface,
                color: section === i ? T.accentDark : T.textSoft,
              }}>{s.icon} {s.title}</button>
            ))}
          </div>

          {/* Questions */}
          {section < 2 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sections[section].questions.map((q, qi) => {
                const key = `${section}-${qi}`;
                return (
                  <Card key={qi} style={{ padding: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 14 }}>
                      {qi + 1}. {q.q}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {q.opts.map((o, oi) => {
                        const selected = answers[key] === oi;
                        const isCorrect = answers[key] !== undefined && oi === q.correct;
                        const isWrong = selected && oi !== q.correct;
                        return (
                          <button key={oi} onClick={() => setAnswers(p => ({ ...p, [key]: oi }))}
                            style={{
                              fontFamily: T.font, padding: "10px 14px", borderRadius: T.radiusXs,
                              fontSize: 13.5, cursor: "pointer", textAlign: "left",
                              border: isCorrect ? `2px solid ${T.mint}` : isWrong ? `2px solid ${T.rose}` : selected ? `2px solid ${T.accent}` : `1.5px solid ${T.border}`,
                              background: isCorrect ? T.mintLight : isWrong ? T.roseLight : selected ? T.accentLight : T.surface,
                              color: T.text, fontWeight: selected ? 600 : 500,
                              transition: "all 0.2s",
                            }}>
                            <span style={{ color: T.textMuted, marginRight: 8 }}>{String.fromCharCode(65 + oi)})</span>
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                {section < 1 && <Btn onClick={() => setSection(s => s + 1)}>Next Section {I.arrow("#fff")}</Btn>}
                {section === 1 && <Btn onClick={() => setSection(2)}>Go to Speaking {I.arrow("#fff")}</Btn>}
              </div>
            </div>
          ) : (
            /* Speaking section */
            <div>
              <Card style={{ padding: 28, textAlign: "center", marginBottom: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
                  background: speaking ? `linear-gradient(135deg, ${T.accent}, ${T.accentDark})` : T.accentLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: speaking ? `0 0 32px ${T.accent}30` : "none",
                  transition: "all 0.4s", cursor: "pointer", color: speaking ? "#fff" : T.accent,
                }} onClick={() => setSpeaking(!speaking)}>
                  {I.mic(speaking ? "#fff" : T.accent, 24)}
                </div>
                <div style={{ fontSize: 15, fontWeight: 650, color: T.text, marginBottom: 6 }}>
                  {speaking ? "Listening... Start speaking" : "Click the mic and speak"}
                </div>
                <div style={{ fontSize: 13, color: T.textMuted }}>
                  {speaking ? "Click again when you finish your answer" : "Answer the question below in English"}
                </div>
                {speaking && (
                  <div style={{ display: "flex", justifyContent: "center", gap: 3, height: 24, marginTop: 16 }}>
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} style={{
                        width: 3, borderRadius: 2, background: T.accent,
                        animation: `wave 1s ease-in-out ${i * .06}s infinite alternate`,
                      }}/>
                    ))}
                  </div>
                )}
                <style>{`@keyframes wave{0%{height:4px}100%{height:20px}}`}</style>
              </Card>

              {[
                "Tell me about a challenging project you worked on recently.",
                "How do you handle disagreements with team members?",
                "Describe your ideal work environment.",
              ].map((q, i) => (
                <Card key={i} style={{ padding: 16, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.accent, marginBottom: 4 }}>Question {i + 1}</div>
                  <div style={{ fontSize: 14, color: T.text, fontStyle: "italic" }}>{q}</div>
                </Card>
              ))}

              <Btn onClick={() => go(P.RESULTS)} style={{ marginTop: 16 }}>
                Finish Test {I.arrow("#fff")}
              </Btn>
            </div>
          )}
        </div>
      </Fade>
    </Section>
  );
}

/* ════════════════════════════════════════════
   RESULTS
   ════════════════════════════════════════════ */
function Results({ go }) {
  const cats = [
    { label: "Technical", score: 82, color: T.accent },
    { label: "Coding", score: 65, color: T.sky },
    { label: "English", score: 71, color: T.warm },
  ];
  const details = [
    { cat: "Technical Interview", color: T.accent, items: [
      { n: "System Design", s: 85 }, { n: "Technical Depth", s: 78 },
      { n: "Problem Solving", s: 82 }, { n: "Trade-off Analysis", s: 80 },
    ]},
    { cat: "Coding", color: T.sky, items: [
      { n: "Correctness", s: 70 }, { n: "Time Complexity", s: 60 },
      { n: "Code Quality", s: 72 }, { n: "Edge Case Handling", s: 55 },
    ]},
    { cat: "English", color: T.warm, items: [
      { n: "Grammar", s: 80 }, { n: "Vocabulary", s: 68 },
      { n: "Speaking Fluency", s: 65 }, { n: "Pronunciation", s: 70 },
    ]},
  ];
  const roadmap = [
    { p: "High", c: T.rose, t: "Edge case handling — think through boundary conditions systematically for every problem" },
    { p: "High", c: T.rose, t: "Apply Big-O analysis habit to every solution" },
    { p: "Medium", c: T.warm, t: "Expand technical English vocabulary, especially system design terminology" },
    { p: "Low", c: T.mint, t: "Make budget allocation rationale more concrete in marketing case studies" },
  ];

  return (
    <Section style={{ paddingTop: 48, paddingBottom: 60, fontFamily: T.font }}>
      <Fade>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 26, fontWeight: 750, color: T.text, marginBottom: 6 }}>Assessment Report</h2>
            <p style={{ color: T.textMuted, fontSize: 14 }}>Full Package Simulation · Feb 7, 2026</p>
          </div>

          {/* Overall */}
          <Card style={{
            textAlign: "center", marginBottom: 28, padding: 36,
            background: `linear-gradient(135deg, ${T.accentLight}, ${T.surface})`,
          }}>
            <Score value={74} size={110} label="OVERALL SCORE" color={T.accent} />
            <div style={{ marginTop: 16 }}>
              <Badge color={T.warm} bg={T.warmLight}>Areas to Improve</Badge>
            </div>
          </Card>

          {/* Category scores */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
            {cats.map((c, i) => (
              <Card key={i} style={{ textAlign: "center", padding: 20 }}>
                <Score value={c.score} size={72} label={c.label} color={c.color} />
              </Card>
            ))}
          </div>

          {/* Detailed */}
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 14 }}>Detailed Analysis</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {details.map((d, i) => (
              <Card key={i} style={{ padding: 22 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: d.color, marginBottom: 16 }}>{d.cat}</div>
                {d.items.map((it, j) => (
                  <div key={j} style={{ marginBottom: j < d.items.length - 1 ? 12 : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13.5 }}>
                      <span style={{ color: T.textSoft }}>{it.n}</span>
                      <span style={{ fontWeight: 650, color: it.s >= 75 ? T.mint : it.s >= 60 ? T.warm : T.rose }}>{it.s}</span>
                    </div>
                    <ProgressBar value={it.s} color={it.s >= 75 ? T.mint : it.s >= 60 ? T.warm : T.rose} />
                  </div>
                ))}
              </Card>
            ))}
          </div>

          {/* Roadmap */}
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 14 }}>📈 Improvement Roadmap</div>
          <Card style={{ padding: 22, marginBottom: 28 }}>
            {roadmap.map((r, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, padding: "12px 0",
                borderBottom: i < roadmap.length - 1 ? `1px solid ${T.borderLight}` : "none",
              }}>
                <Badge color={r.c} bg={`${r.c}18`} style={{ flexShrink: 0, height: "fit-content" }}>{r.p}</Badge>
                <span style={{ fontSize: 13.5, color: T.textSoft, lineHeight: 1.6 }}>{r.t}</span>
              </div>
            ))}
          </Card>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Btn onClick={() => go(P.SELECT)}>Try Again</Btn>
            <Btn variant="secondary" onClick={() => go(P.DASH)}>Back to Dashboard</Btn>
          </div>
        </div>
      </Fade>
    </Section>
  );
}

/* ════════════════════════════════════════════
   CV TOOLS
   ════════════════════════════════════════════ */
function CV({ go, builderOnly = false }) {
  const [tab, setTab] = useState(builderOnly ? "builder" : "analyze");
  const [analyzed, setAnalyzed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Yiğit Özdemir",
    title: "Backend Developer",
    summary: "Node.js/TypeScript developer with 3+ years of experience. Expert in microservices, event-driven systems and AWS infrastructure.",
    skills: ["Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "RabbitMQ"],
    experience: "TechCorp — Backend Developer (2022-Present)\n• Set up event-driven microservices architecture\n• RabbitMQ integration and message queue optimization\n• 40% response time improvement",
  });

  const tabs = [
    { k: "analyze", l: "AI Assessment", icon: I.sparkle(null, 12) },
    { k: "builder", l: "CV Builder", icon: I.file(null, 14) },
    { k: "optimize", l: "Job-Specific", icon: I.star(null, 12) },
  ];

  // Builder-only mode (from onboarding "Create CV"): only builder UI, then go to interview
  if (builderOnly) return (
    <Section style={{ paddingTop: 48, paddingBottom: 60, fontFamily: T.font }}>
      <Fade>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 750, color: T.text, marginBottom: 6 }}>Create your CV</h2>
          <p style={{ color: T.textSoft, marginBottom: 24, fontSize: 14 }}>Fill in your details. When done, you’ll go straight to the interview.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <Card style={{ padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 650, color: T.text, marginBottom: 14 }}>Edit Info</div>
                {[
                  { l: "Name", k: "name" },
                  { l: "Title", k: "title" },
                ].map(f => (
                  <div key={f.k} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, display: "block", marginBottom: 4 }}>{f.l}</label>
                    <input value={formData[f.k]} onChange={e => setFormData(p => ({ ...p, [f.k]: e.target.value }))}
                      style={{
                        width: "100%", padding: "9px 12px", borderRadius: T.radiusXs,
                        border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: T.font,
                        color: T.text, outline: "none", background: T.surfaceAlt,
                        boxSizing: "border-box",
                      }}/>
                  </div>
                ))}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, display: "block", marginBottom: 4 }}>Summary</label>
                  <textarea value={formData.summary} onChange={e => setFormData(p => ({ ...p, summary: e.target.value }))}
                    style={{
                      width: "100%", minHeight: 70, padding: "9px 12px", borderRadius: T.radiusXs,
                      border: `1.5px solid ${T.border}`, fontSize: 13, fontFamily: T.font,
                      color: T.text, outline: "none", background: T.surfaceAlt, resize: "vertical",
                      lineHeight: 1.5, boxSizing: "border-box",
                    }}/>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, display: "block", marginBottom: 4 }}>Skills</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {formData.skills.map((s, i) => (
                      <span key={i} style={{
                        padding: "5px 10px", borderRadius: T.radiusXs, fontSize: 12,
                        background: T.accentLight, color: T.accentDark, fontWeight: 550,
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        {s}
                        <span style={{ cursor: "pointer", opacity: 0.5 }}
                          onClick={() => setFormData(p => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }))}>×</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
            <Card style={{ padding: 24, background: "#fff" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 14 }}>PREVIEW</div>
              <div style={{ borderBottom: `3px solid ${T.accent}`, paddingBottom: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: "-0.5px" }}>{formData.name}</div>
                <div style={{ fontSize: 14, color: T.accent, fontWeight: 600 }}>{formData.title}</div>
              </div>
              <div style={{ fontSize: 12.5, color: T.textSoft, lineHeight: 1.6, marginBottom: 14 }}>{formData.summary}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                {formData.skills.map((s, i) => (
                  <span key={i} style={{ padding: "3px 8px", borderRadius: 4, fontSize: 11, background: T.surfaceAlt, color: T.textSoft }}>{s}</span>
                ))}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Experience</div>
              <div style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{formData.experience}</div>
            </Card>
          </div>
          <Btn onClick={() => go(P.DASH)} style={{ marginTop: 24, width: "100%", justifyContent: "center" }}>
            Done — go to interview {I.arrow("#fff")}
          </Btn>
        </div>
      </Fade>
    </Section>
  );

  return (
    <Section style={{ paddingTop: 48, paddingBottom: 60, fontFamily: T.font }}>
      <Fade>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 750, color: T.text, marginBottom: 6 }}>CV Tools</h2>
          <p style={{ color: T.textSoft, marginBottom: 24, fontSize: 14 }}>Create, analyze and optimize your CV.</p>

          <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
            {tabs.map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                fontFamily: T.font, padding: "10px 18px", borderRadius: T.radiusSm,
                fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                border: tab === t.k ? `2px solid ${T.accent}` : `1.5px solid ${T.border}`,
                background: tab === t.k ? T.accentLight : T.surface,
                color: tab === t.k ? T.accentDark : T.textSoft,
                display: "flex", alignItems: "center", gap: 6,
              }}><span style={{ color: tab === t.k ? T.accent : T.textMuted }}>{t.icon}</span> {t.l}</button>
            ))}
          </div>

          {/* ANALYZE TAB */}
          {tab === "analyze" && (
            !analyzed ? (
              <Card style={{ padding: 40, textAlign: "center", cursor: "pointer", borderStyle: "dashed", borderWidth: 2, borderColor: T.accentSoft }}
                onClick={() => setAnalyzed(true)}>
                <div style={{ color: T.accent, marginBottom: 12 }}>{I.up(T.accent, 28)}</div>
                <div style={{ fontSize: 16, fontWeight: 650, color: T.text, marginBottom: 6 }}>Upload your CV for AI analysis</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>PDF or DOCX — Click or drag</div>
              </Card>
            ) : (
              <div>
                <Card style={{ padding: 24, marginBottom: 16, display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <Score value={68} size={100} label="CV Score" color={T.accent} />
                  <div style={{ flex: 1, minWidth: 250 }}>
                    <div style={{ fontSize: 14, fontWeight: 650, color: T.text, marginBottom: 12 }}>Analysis Results</div>
                    {[
                      { s: "error", t: "Measurable success metrics missing — support with numbers", c: T.rose },
                      { s: "warn", t: "Technical skills list too long — focus on top 6-8 skills", c: T.warm },
                      { s: "ok", t: "Project descriptions are well structured", c: T.mint },
                      { s: "ok", t: "Work experience is in chronological order and consistent", c: T.mint },
                      { s: "warn", t: "Summary section could be more specific", c: T.warm },
                    ].map((i, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", fontSize: 13.5, color: T.textSoft }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: i.c, marginTop: 5, flexShrink: 0 }}/>
                        {i.t}
                      </div>
                    ))}
                  </div>
                </Card>
                <Card style={{ padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 650, color: T.accent, marginBottom: 10 }}>AI Suggestions</div>
                  <div style={{ fontSize: 13.5, color: T.textSoft, lineHeight: 1.7 }}>
                    Add a concrete achievement to your summary like "Built 2 production-grade microservice architectures in 3 years". Remove PHP and jQuery from skills — not aligned with the role. Metrics like "40% response time improvement" in experience are great; add similar numbers to other bullets.
                  </div>
                </Card>
              </div>
            )
          )}

          {/* BUILDER TAB */}
          {tab === "builder" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Edit side */}
              <div>
                <Card style={{ padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 650, color: T.text, marginBottom: 14 }}>Edit Info</div>
                  {[
                    { l: "Name", k: "name" },
                    { l: "Title", k: "title" },
                  ].map(f => (
                    <div key={f.k} style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, display: "block", marginBottom: 4 }}>{f.l}</label>
                      <input value={formData[f.k]} onChange={e => setFormData(p => ({ ...p, [f.k]: e.target.value }))}
                        style={{
                          width: "100%", padding: "9px 12px", borderRadius: T.radiusXs,
                          border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: T.font,
                          color: T.text, outline: "none", background: T.surfaceAlt,
                          boxSizing: "border-box",
                        }}/>
                    </div>
                  ))}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, display: "block", marginBottom: 4 }}>Summary</label>
                    <textarea value={formData.summary} onChange={e => setFormData(p => ({ ...p, summary: e.target.value }))}
                      style={{
                        width: "100%", minHeight: 70, padding: "9px 12px", borderRadius: T.radiusXs,
                        border: `1.5px solid ${T.border}`, fontSize: 13, fontFamily: T.font,
                        color: T.text, outline: "none", background: T.surfaceAlt, resize: "vertical",
                        lineHeight: 1.5, boxSizing: "border-box",
                      }}/>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, display: "block", marginBottom: 4 }}>Skills</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {formData.skills.map((s, i) => (
                        <span key={i} style={{
                          padding: "5px 10px", borderRadius: T.radiusXs, fontSize: 12,
                          background: T.accentLight, color: T.accentDark, fontWeight: 550,
                          display: "flex", alignItems: "center", gap: 4,
                        }}>
                          {s}
                          <span style={{ cursor: "pointer", opacity: 0.5 }}
                            onClick={() => setFormData(p => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }))}>×</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <Btn variant="small" style={{ marginTop: 4 }}>{I.sparkle(T.accent)} Improve with AI</Btn>
                </Card>
              </div>

              {/* Preview side */}
              <Card style={{ padding: 24, background: "#fff" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 14 }}>PREVIEW</div>
                <div style={{ borderBottom: `3px solid ${T.accent}`, paddingBottom: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: "-0.5px" }}>{formData.name}</div>
                  <div style={{ fontSize: 14, color: T.accent, fontWeight: 600 }}>{formData.title}</div>
                </div>
                <div style={{ fontSize: 12.5, color: T.textSoft, lineHeight: 1.6, marginBottom: 14 }}>{formData.summary}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                  {formData.skills.map((s, i) => (
                    <span key={i} style={{ padding: "3px 8px", borderRadius: 4, fontSize: 11, background: T.surfaceAlt, color: T.textSoft }}>{s}</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Experience</div>
                <div style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{formData.experience}</div>
              </Card>
            </div>
          )}

          {/* OPTIMIZE TAB */}
          {tab === "optimize" && (
            <div>
              <Card style={{ padding: 22, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 650, color: T.text, marginBottom: 12 }}>Paste Job Description</div>
                <textarea placeholder="Paste the job description here... AI will optimize your CV for this role."
                  style={{
                    width: "100%", minHeight: 120, resize: "vertical", border: `1.5px solid ${T.border}`,
                    borderRadius: T.radiusSm, padding: 14, fontSize: 14, fontFamily: T.font,
                    outline: "none", color: T.text, background: T.surfaceAlt, lineHeight: 1.6,
                    boxSizing: "border-box",
                  }}/>
                <Btn style={{ marginTop: 12 }}>{I.sparkle("#fff", 12)} Optimize CV</Btn>
              </Card>
              <Card style={{ padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 650, color: T.accent, marginBottom: 10 }}>How It Works?</div>
                {[
                  "Identifies keywords and requirements from the job posting",
                  "Reorders and highlights your experience to match the role",
                  "Suggests missing keywords for summary and skills sections",
                  "Provides ATS (Applicant Tracking System) compatibility score",
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 13.5, color: T.textSoft }}>
                    <span style={{ color: T.accent }}>{I.check(T.accent, 14)}</span> {s}
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>
      </Fade>
    </Section>
  );
}

/* ════════════════════════════════════════════
   ROOT APP
   ════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState(P.LANDING);
  const [pageOptions, setPageOptions] = useState({});
  const go = useCallback((p, opts) => {
    setPage(p);
    setPageOptions(opts || {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const render = () => {
    switch (page) {
      case P.LANDING: return <Landing go={go} />;
      case P.ONBOARD: return <Onboard go={go} />;
      case P.DASH: return <Dash go={go} />;
      case P.SELECT: return <Select go={go} />;
      case P.TECHNICAL: return <Technical go={go} />;
      case P.CODING: return <Coding go={go} />;
      case P.ENGLISH: return <English go={go} />;
      case P.RESULTS: return <Results go={go} />;
      case P.CV: return <CV go={go} builderOnly={pageOptions.builderOnly} />;
      case P.PRICING: return <Pricing go={go} />;
      default: return <Landing go={go} />;
    }
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: T.font, display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
      <Nav page={page} go={go} />
      <div style={{ flex: 1 }}>{render()}</div>
      {page !== P.CODING && (
        <footer style={{
          padding: "32px 28px", textAlign: "center",
          borderTop: `1px solid ${T.borderLight}`,
          background: T.surface,
        }}>
          <span onClick={() => go(P.LANDING)} style={{
            fontSize: 18, fontWeight: 800, color: T.accent, cursor: "pointer",
            letterSpacing: "-0.4px",
          }}>intervü<span style={{ color: T.warm }}>.</span></span>
          <p style={{ fontSize: 12.5, color: T.textMuted, marginTop: 8, marginBottom: 0 }}>
            AI-Powered Interview Platform · 2026
          </p>
        </footer>
      )}
    </div>
  );
}