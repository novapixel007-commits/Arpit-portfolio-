import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  animate,
} from "motion/react";
import { ArrowDown, CheckCircle2 } from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

const TRUST = [
  { label: "Worked with 5 Brands" },
  { label: "100+ Projects Delivered" },
  { label: "Cinematic Editing & Motion Graphics" },
];

const STATS = [
  { value: 100, suffix: "+", label: "Projects" },
  { value: 5, suffix: "+", label: "Brands" },
  { value: 2, suffix: " yrs", label: "Experience" },
  { value: 100, suffix: "+", label: "Videos" },
];

// Floating skill labels that orbit the MacBook
const FLOAT_LABELS = [
  { text: "DaVinci Resolve", x: "-22%", y: "18%",  delay: 0.8,  duration: 6 },
  { text: "Motion Graphics", x: "88%",  y: "12%",  delay: 1.2,  duration: 7 },
  { text: "Color Grading",   x: "-18%", y: "72%",  delay: 1.6,  duration: 5.5 },
  { text: "Fusion VFX",      x: "82%",  y: "68%",  delay: 2.0,  duration: 6.5 },
  { text: "Commercial Ads",  x: "30%",  y: "-8%",  delay: 1.0,  duration: 7 },
];

// Fixed particle positions (no Math.random at module level for SSR safety)
const PARTICLES = [
  { x: 12,  y: 18,  s: 1.8, d: 12, dl: 0   },
  { x: 28,  y: 65,  s: 1.2, d: 9,  dl: 2   },
  { x: 45,  y: 30,  s: 2.0, d: 14, dl: 1   },
  { x: 60,  y: 80,  s: 1.4, d: 10, dl: 3   },
  { x: 75,  y: 20,  s: 1.6, d: 11, dl: 0.5 },
  { x: 88,  y: 55,  s: 1.1, d: 8,  dl: 4   },
  { x: 33,  y: 88,  s: 2.2, d: 13, dl: 1.5 },
  { x: 55,  y: 10,  s: 1.3, d: 9,  dl: 2.5 },
  { x: 8,   y: 45,  s: 1.7, d: 15, dl: 0.8 },
  { x: 92,  y: 38,  s: 1.5, d: 11, dl: 3.5 },
  { x: 70,  y: 92,  s: 1.9, d: 12, dl: 1.2 },
  { x: 18,  y: 76,  s: 1.0, d: 8,  dl: 4.5 },
];

// ─── ANIMATED COUNTER (mobile) ───────────────────────────────────────────────
function MobileCounter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    if (inView) {
      const c = animate(mv, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
      return c.stop;
    }
  }, [inView, to, mv]);
  return (
    <span ref={ref} className="tabular-nums font-display font-semibold text-foreground">
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

// ─── LINE REVEAL (per-line stagger) ──────────────────────────────────────────
function LineReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
        animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
function MagneticButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18 });
  const sy = useSpring(y, { stiffness: 180, damping: 18 });

  return (
    <motion.a
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.38);
        y.set((e.clientY - r.top - r.height / 2) * 0.38);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

// ─── CSS MACBOOK PRO MOCKUP ───────────────────────────────────────────────────
function MacBookMockup({
  rotateX,
  rotateY,
  floatY,
  mouseX,
  mouseY,
}: {
  rotateX: ReturnType<typeof useSpring>;
  rotateY: ReturnType<typeof useSpring>;
  floatY: ReturnType<typeof useSpring>;
  mouseX: ReturnType<typeof useMotionValue>;
  mouseY: ReturnType<typeof useMotionValue>;
}) {
  // Parallax offsets for floating labels
  const labelX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 60, damping: 20 });
  const labelY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-6, 6]), { stiffness: 60, damping: 20 });

  return (
    <div className="relative w-full" style={{ perspective: "1200px" }}>
      {/* ── Screen glow aura ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-15% -10%",
          background: "radial-gradient(ellipse at 50% 45%, rgba(110,231,255,0.18) 0%, rgba(139,124,255,0.10) 40%, transparent 70%)",
          filter: "blur(48px)",
          zIndex: 0,
        }}
      />

      {/* ── Breathing shadow ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ bottom: "-6%", left: "5%", right: "5%", height: "40px", zIndex: 0 }}
        animate={{ opacity: [0.35, 0.55, 0.35], scaleX: [0.9, 1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "radial-gradient(ellipse at 50% 50%, rgba(0,20,60,0.9) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </motion.div>

      {/* ── Floating skill labels ── */}
      {FLOAT_LABELS.map((fl, i) => (
        <motion.div
          key={fl.text}
          className="absolute z-20 pointer-events-none"
          style={{ left: fl.x, top: fl.y, x: labelX, y: labelY }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: fl.delay + 0.6, duration: 0.7, ease }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: fl.duration, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            className="whitespace-nowrap rounded-full border border-white/12 bg-black/50 backdrop-blur-xl px-3 py-1.5 text-[10px] font-mono text-white/60 tracking-wider shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          >
            {fl.text}
          </motion.div>
        </motion.div>
      ))}

      {/* ── The MacBook shell ── */}
      <motion.div
        style={{ rotateX, rotateY, y: floatY, transformStyle: "preserve-3d" }}
        className="relative z-10 will-change-transform"
      >
        {/* Lid (screen) */}
        <div
          className="relative mx-auto w-full"
          style={{
            // MacBook 16" aspect: lid ~16:10
            aspectRatio: "16/10",
            borderRadius: "12px 12px 0 0",
            background: "linear-gradient(160deg, #2a2a2e 0%, #1a1a1e 60%, #111114 100%)",
            border: "1.5px solid rgba(255,255,255,0.10)",
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.7)",
            overflow: "hidden",
          }}
        >
          {/* Outer bezel */}
          <div
            className="absolute inset-0 rounded-[10px] pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
              zIndex: 2,
            }}
          />

          {/* Screen surround (bezel) */}
          <div
            className="absolute"
            style={{
              inset: "4.5%",
              borderRadius: "6px",
              overflow: "hidden",
              background: "#000",
              zIndex: 1,
            }}
          >
            {/* ── VIDEO fills screen exactly ── */}
            {/* Ratio trick: 16:9 video inside 16:10 bezel — letterbox with black */}
            <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
              {/* YouTube embed — 16:9 scaled to cover full bezel height */}
              <iframe
                src="https://www.youtube.com/embed/4fFSQCw_SOA?autoplay=1&mute=1&loop=1&playlist=4fFSQCw_SOA&controls=0&modestbranding=1&showinfo=0&rel=0&disablekb=1&playsinline=1&iv_load_policy=3&fs=0&cc_load_policy=0&enablejsapi=0"
                allow="autoplay; encrypted-media; picture-in-picture"
                className="absolute pointer-events-none"
                style={{
                  border: "none",
                  // Scale up to cover the extra vertical space (16:10 vs 16:9)
                  // 10/9 = 1.111... so scale by ~1.12 vertically or use w/h trick
                  width: "178%",
                  height: "178%",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                title="Cinematic reel preview"
                loading="eager"
              />
              {/* Screen glare reflection */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%), linear-gradient(225deg, rgba(255,255,255,0.03) 0%, transparent 35%)",
                }}
              />
            </div>
          </div>

          {/* Notch / camera dot */}
          <div
            className="absolute top-[1.8%] left-1/2 -translate-x-1/2 z-10 size-[7px] rounded-full"
            style={{ background: "#1a1a1e" }}
          />
          <div
            className="absolute top-[1.8%] left-1/2 -translate-x-1/2 z-10 size-[4px] rounded-full translate-y-[1.5px]"
            style={{ background: "#2c2c30" }}
          />
        </div>

        {/* Hinge */}
        <div
          style={{
            height: "6px",
            background: "linear-gradient(to bottom, #1c1c20, #111)",
            borderRadius: "0 0 3px 3px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        />

        {/* Base / keyboard deck */}
        <div
          style={{
            height: "28px",
            borderRadius: "0 0 14px 14px",
            background: "linear-gradient(160deg, #2c2c30 0%, #1e1e22 50%, #181819 100%)",
            border: "1.5px solid rgba(255,255,255,0.07)",
            borderTop: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(255,255,255,0.04)",
            position: "relative",
          }}
        >
          {/* Trackpad hint */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[30%]"
            style={{
              width: "22%",
              height: "55%",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>
      </motion.div>

      {/* ── Floating glass badge (Now Playing) ── */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 2.0, duration: 0.8, ease }}
        className="absolute bottom-[6%] right-[-5%] z-30 pointer-events-none"
      >
        <div className="flex items-center gap-2.5 rounded-2xl border border-white/12 bg-black/70 backdrop-blur-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6EE7FF]" />
          </span>
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-white/40">Now Playing</p>
            <p className="text-[11px] font-semibold text-white mt-0.5 whitespace-nowrap">Cinematic Motion System</p>
          </div>
        </div>
      </motion.div>

      {/* ── Second floating label (top-left) ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, duration: 0.8, ease }}
        className="absolute top-[8%] left-[-8%] z-30 pointer-events-none"
      >
        <div className="rounded-xl border border-white/12 bg-black/60 backdrop-blur-2xl px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <p className="text-[8px] font-mono uppercase tracking-widest text-[#6EE7FF]/70 mb-0.5">Resolution</p>
          <p className="text-[11px] font-semibold text-white">4K · 60fps</p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const textOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const imageY = useTransform(scrollY, [0, 500], [0, -40]);

  // Mouse-driven values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    damping: 35,
    stiffness: 90,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    damping: 35,
    stiffness: 90,
  });

  // Autonomous float
  const rawFloat = useMotionValue(0);
  const floatY = useSpring(rawFloat, { damping: 16, stiffness: 35 });

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      rawFloat.set(Math.sin(((ts - start) / 1000) * 0.55) * 12);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [rawFloat]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mouseX.set(nx);
      mouseY.set(ny);
      setSpotlightPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden min-h-screen lg:min-h-[95vh] pt-16 pb-0 lg:pt-28 lg:pb-16 xl:pt-36"
    >
      {/* ── BACKGROUND LAYER ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Mouse-following spotlight */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(110,231,255,0.04) 0%, transparent 60%)`,
          }}
        />

        {/* Animated orb 1 — teal */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -24, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            top: "-15%", left: "-8%",
            width: "58%", height: "72%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0,200,180,0.22) 0%, rgba(0,100,220,0.10) 55%, transparent 80%)",
            filter: "blur(90px)",
          }}
        />

        {/* Animated orb 2 — purple */}
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 22, 0], scale: [1, 1.07, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute"
          style={{
            bottom: "-18%", right: "-8%",
            width: "62%", height: "78%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(20,80,255,0.20) 0%, rgba(139,124,255,0.10) 55%, transparent 80%)",
            filter: "blur(110px)",
          }}
        />

        {/* Vertical light ray */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: "1px",
            height: "50%",
            background: "linear-gradient(to bottom, rgba(110,231,255,0.15), transparent)",
          }}
        />

        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "160px",
          }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#6EE7FF]"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
            animate={{ y: [-8, 8, -8], opacity: [0.06, 0.2, 0.06] }}
            transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <div className="container-px mx-auto w-full max-w-7xl relative z-10">

        {/* ══ MOBILE ══ (hidden lg+) ═══════════════════════════════════════ */}
        <div className="flex flex-col lg:hidden">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="inline-flex self-start items-center gap-2 rounded-full border border-border bg-surface/80 backdrop-blur-sm px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#6EE7FF]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6EE7FF]" />
            </span>
            Resolve Editor & Motion Designer
          </motion.div>

          {/* Headline */}
          <h1 className="intro-hero-text mt-3 font-display text-[40px] font-semibold leading-[0.96] tracking-tighter text-foreground">
            <LineReveal delay={0.2}>Cinematic videos</LineReveal>
            <LineReveal delay={0.34}>that people</LineReveal>
            <LineReveal
              delay={0.48}
              className="bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] bg-clip-text text-transparent"
            >
              actually watch.
            </LineReveal>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease }}
            className="mt-3 text-[13px] leading-snug text-muted-foreground max-w-[88%]"
          >
            I create cinematic video edits, motion graphics and commercial content that help
            founders, creators and brands capture attention and increase retention.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease }}
            className="mt-5 flex items-center gap-2"
          >
            <a
              href="#work"
              className="inline-flex items-center justify-center h-10 rounded-full bg-foreground px-5 text-[11px] font-semibold text-background transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_22px_rgba(110,231,255,0.3)] active:scale-[0.97]"
            >
              View Portfolio
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-10 rounded-full border border-border bg-surface/80 backdrop-blur-sm px-5 text-[11px] font-semibold text-foreground transition-all duration-300 hover:scale-[1.04] hover:border-[#6EE7FF]/40 active:scale-[0.97]"
            >
              Book a Call
            </a>
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.35, ease }}
            className="mt-4 flex flex-col gap-1.5"
          >
            {TRUST.map((t) => (
              <span key={t.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                <CheckCircle2 className="size-3 text-[#6EE7FF] shrink-0" />
                {t.label}
              </span>
            ))}
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, ease }}
            className="mt-5 grid grid-cols-4 divide-x divide-border rounded-2xl border border-border bg-surface/60 backdrop-blur-sm"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-3">
                <div className="text-[17px] leading-none">
                  <MobileCounter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-0.5 text-[8px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══ DESKTOP ══ (hidden below lg) ══════════════════════════════════ */}
        <div className="hidden lg:grid grid-cols-[1fr_1.05fr] items-center gap-12 xl:gap-16">

          {/* Left — typography */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="intro-hero-text flex flex-col items-start text-left will-change-transform"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 backdrop-blur-sm px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-[#6EE7FF]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6EE7FF]" />
              </span>
              Resolve Editor & Motion Designer
            </motion.div>

            {/* Headline — line-by-line reveal */}
            <h1 className="mt-6 font-display text-[clamp(3rem,5.8vw,5.6rem)] font-semibold leading-[0.96] tracking-tighter text-foreground">
              <LineReveal delay={0.22}>Cinematic videos</LineReveal>
              <LineReveal delay={0.36}>that people</LineReveal>
              <LineReveal
                delay={0.50}
                className="bg-gradient-to-r from-[#6EE7FF] via-[#8B7CFF] to-[#6EE7FF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
              >
                actually watch.
              </LineReveal>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1, ease }}
              className="mt-6 max-w-[440px] text-[15.5px] leading-relaxed text-muted-foreground"
            >
              I create cinematic video edits, motion graphics and commercial content
              that help founders, creators and brands capture attention and increase retention.
            </motion.p>

            {/* CTA Buttons — magnetic + shine */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.28, ease }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <MagneticButton
                href="#work"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-foreground px-8 py-3.5 text-[13px] font-semibold text-background transition-shadow duration-300 hover:shadow-[0_0_32px_rgba(110,231,255,0.35)]"
              >
                <span className="relative z-10">View Portfolio</span>
                <span className="absolute inset-0 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-600 ease-out" />
              </MagneticButton>

              <MagneticButton
                href="#contact"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-border bg-surface/80 backdrop-blur-sm px-8 py-3.5 text-[13px] font-semibold text-foreground transition-all duration-300 hover:border-[#6EE7FF]/40 hover:shadow-[0_0_24px_rgba(110,231,255,0.12)]"
              >
                <span className="relative z-10">Book a Call</span>
                <span className="absolute inset-0 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/8 to-transparent group-hover:translate-x-full transition-transform duration-600 ease-out" />
              </MagneticButton>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease }}
              className="mt-6 flex flex-col gap-2"
            >
              {TRUST.map((t, i) => (
                <motion.span
                  key={t.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.55 + i * 0.08, duration: 0.5, ease }}
                  className="flex items-center gap-2 text-[11.5px] text-muted-foreground/75 tracking-wide"
                >
                  <CheckCircle2 className="size-3.5 text-[#6EE7FF] shrink-0" />
                  {t.label}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — MacBook */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.3, ease }}
            className="intro-hero-image relative select-none will-change-transform px-8 xl:px-6"
          >
            <MacBookMockup
              rotateX={rotateX}
              rotateY={rotateY}
              floatY={floatY}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          </motion.div>

        </div>

        {/* ── SCROLL INDICATOR (desktop only) ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1 }}
          className="hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-muted-foreground/35"
        >
          <span className="text-[8.5px] font-mono uppercase tracking-[0.22em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-3" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
