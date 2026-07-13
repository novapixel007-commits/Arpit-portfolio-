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
import { ArrowDown, CheckCircle2, Play } from "lucide-react";

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

// Fixed particle positions for SSR safety
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

// ─── LINE REVEAL ─────────────────────────────────────────────────────────────
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

// ─── FLOATING SKILL TAG COMPONENT ─────────────────────────────────────────────
function FloatingTag({
  text,
  className = "",
  style = {},
  delay = 0,
  duration = 6,
  mouseX,
  mouseY,
  parallaxMultiplier = 1,
  prefersReducedMotion = false,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  mouseX: ReturnType<typeof useMotionValue>;
  mouseY: ReturnType<typeof useMotionValue>;
  parallaxMultiplier?: number;
  prefersReducedMotion?: boolean;
}) {
  const pX = useSpring(useTransform(mouseX, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-25 * parallaxMultiplier, 25 * parallaxMultiplier]), { stiffness: 50, damping: 22 });
  const pY = useSpring(useTransform(mouseY, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-20 * parallaxMultiplier, 20 * parallaxMultiplier]), { stiffness: 50, damping: 22 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.5, duration: 0.8, ease }}
      style={{ ...style, x: pX, y: pY }}
      className={`absolute z-30 pointer-events-auto ${className}`}
    >
      <motion.div
        animate={prefersReducedMotion ? {} : { y: [0, -5, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        className="flex items-center gap-2 whitespace-nowrap rounded-[14px] border border-white/10 bg-[#0f121c]/65 backdrop-blur-md px-3.5 py-2 text-[11px] font-mono text-white/80 tracking-wider shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(110,231,255,0.15)] cursor-default"
      >
        <span className="size-1.5 rounded-full bg-[#6EE7FF] inline-block shrink-0 shadow-[0_0_6px_#6EE7FF]" />
        {text}
      </motion.div>
    </motion.div>
  );
}

// ─── CSS MACBOOK PRO MOCKUP (REDESIGNED) ──────────────────────────────────────
function MacBookMockup({
  rotateX,
  rotateY,
  floatY,
  mouseX,
  mouseY,
  prefersReducedMotion = false,
}: {
  rotateX: ReturnType<typeof useSpring>;
  rotateY: ReturnType<typeof useSpring>;
  floatY: ReturnType<typeof useSpring>;
  mouseX: ReturnType<typeof useMotionValue>;
  mouseY: ReturnType<typeof useMotionValue>;
  prefersReducedMotion?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTouch = window.matchMedia("(pointer: coarse)").matches || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(isTouch);
      setIsPlaying(!isTouch);
    }
  }, []);

  const laptopX = useSpring(useTransform(mouseX, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-8, 8]), { stiffness: 60, damping: 20 });
  const laptopY = useSpring(useTransform(mouseY, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-6, 6]), { stiffness: 60, damping: 20 });

  return (
    <div className="relative w-full max-w-[760px] mx-auto" style={{ perspective: "1500px" }}>
      
      {/* ── Premium Ambient Background Radial Glow ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-20% -15%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(110,231,255,0.22) 0%, rgba(139,124,255,0.08) 45%, transparent 75%)",
          filter: "blur(56px)",
          zIndex: 0,
        }}
      />

      {/* ── Realistic drop shadow beneath laptop ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ bottom: "-5%", left: "8%", right: "8%", height: "24px", zIndex: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: [0.4, 0.6, 0.4], scaleX: [0.95, 1.02, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "radial-gradient(ellipse at 50% 50%, rgba(0,10,40,0.85) 0%, transparent 75%)",
            filter: "blur(16px)",
          }}
        />
      </motion.div>

      {/* ── Redesigned 5 Floating Skill Tags (Orbital layout with 40-70px gap) ── */}
      {/* Top Center: Commercial Ads */}
      <FloatingTag
        text="Commercial Ads"
        style={{ top: "-15%", left: "50%", transform: "translateX(-50%)" }}
        delay={0.6}
        duration={6}
        mouseX={mouseX}
        mouseY={mouseY}
        parallaxMultiplier={1.4}
        prefersReducedMotion={prefersReducedMotion}
      />
      {/* Top Left: DaVinci Resolve */}
      <FloatingTag
        text="DaVinci Resolve"
        style={{ top: "0%", left: "-18%" }}
        delay={0.8}
        duration={5.5}
        mouseX={mouseX}
        mouseY={mouseY}
        parallaxMultiplier={1.1}
        prefersReducedMotion={prefersReducedMotion}
      />
      {/* Upper Right: Motion Graphics */}
      <FloatingTag
        text="Motion Graphics"
        style={{ top: "8%", right: "-18%" }}
        delay={1.0}
        duration={6.5}
        mouseX={mouseX}
        mouseY={mouseY}
        parallaxMultiplier={1.2}
        prefersReducedMotion={prefersReducedMotion}
      />
      {/* Bottom Left: Color Grading */}
      <FloatingTag
        text="Color Grading"
        style={{ bottom: "5%", left: "-16%" }}
        delay={1.2}
        duration={5}
        mouseX={mouseX}
        mouseY={mouseY}
        parallaxMultiplier={1.3}
        prefersReducedMotion={prefersReducedMotion}
      />
      {/* Bottom Right: 4K • 60fps */}
      <FloatingTag
        text="4K • 60fps"
        style={{ bottom: "12%", right: "-16%" }}
        delay={1.4}
        duration={7}
        mouseX={mouseX}
        mouseY={mouseY}
        parallaxMultiplier={1.0}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* ── Laptop frame with Parallax & Tilt ── */}
      <motion.div
        style={{ rotateX, rotateY, x: laptopX, y: laptopY, transformStyle: "preserve-3d" }}
        className="relative z-10 will-change-transform transition-all"
      >
        {/* Lid (screen) with 16:9 proportion */}
        <div
          className="relative mx-auto w-full overflow-hidden transition-all"
          style={{
            aspectRatio: "16/9.8", // realistic laptop frame aspect
            borderRadius: "10px 10px 0 0",
            background: "linear-gradient(160deg, #2e2e32 0%, #17171a 60%, #0d0d0f 100%)",
            border: "1.2px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 0 0 1.5px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.65)",
          }}
        >
          {/* Inner bezel wrapper — reduced from 4.5% to 2.8% bezel thickness for edge-to-edge feel */}
          <div
            className="absolute"
            style={{
              inset: "2.8%",
              borderRadius: "4px",
              overflow: "hidden",
              background: "#000",
              zIndex: 1,
            }}
          >
            {/* Screen Content */}
            <div 
              onClick={() => { if (!isPlaying) setIsPlaying(true); }}
              className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden ${!isPlaying ? "cursor-pointer" : ""}`}
            >
              {isPlaying ? (
                <iframe
                  src="https://www.youtube.com/embed/4fFSQCw_SOA?autoplay=1&mute=1&loop=1&playlist=4fFSQCw_SOA&controls=0&modestbranding=1&showinfo=0&rel=0&disablekb=1&playsinline=1&iv_load_policy=3&fs=0&cc_load_policy=0&enablejsapi=0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  className="absolute pointer-events-none"
                  style={{
                    border: "none",
                    width: "116%",
                    height: "116%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  title="Cinematic reel preview"
                  loading="eager"
                />
              ) : (
                <div className="absolute inset-0 size-full flex items-center justify-center">
                  <img
                    src="https://img.youtube.com/vi/4fFSQCw_SOA/maxresdefault.jpg"
                    alt="Play Cinematic Reel"
                    className="absolute inset-0 size-full object-cover brightness-[0.75]"
                    loading="eager"
                  />
                  {/* Glowing glassmorphic play button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <motion.div
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="size-14 rounded-full bg-white/10 border border-white/35 backdrop-blur-sm flex items-center justify-center shadow-lg"
                    >
                      <Play className="size-5 fill-white text-white translate-x-[1px]" />
                    </motion.div>
                  </div>
                </div>
              )}
              
              {/* Screen soft ambient glow reflection */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 45%), linear-gradient(225deg, rgba(255,255,255,0.04) 0%, transparent 35%)",
                }}
              />
            </div>
          </div>

          {/* Notch / camera dot */}
          <div
            className="absolute top-[1.2%] left-1/2 -translate-x-1/2 z-10 size-[5px] rounded-full"
            style={{ background: "#0d0d0f" }}
          />
        </div>

        {/* Hinge */}
        <div
          style={{
            height: "5px",
            background: "linear-gradient(to bottom, #1f1f24, #0d0d10)",
            borderRadius: "0 0 2px 2px",
            boxShadow: "0 1.5px 6px rgba(0,0,0,0.85)",
          }}
        />

        {/* Base / keyboard deck */}
        <div
          style={{
            height: "20px",
            borderRadius: "0 0 10px 10px",
            background: "linear-gradient(160deg, #2f2f33 0%, #1d1d21 50%, #141416 100%)",
            border: "1.2px solid rgba(255,255,255,0.08)",
            borderTop: "none",
            boxShadow: "0 6px 24px rgba(0,0,0,0.55)",
            position: "relative",
          }}
        >
          {/* Trackpad hint */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[25%]"
            style={{
              width: "20%",
              height: "50%",
              borderRadius: "3px",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(containerRef, { once: false, margin: "100px" });
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const textOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const imageY = useTransform(scrollY, [0, 500], [0, -30]);

  // Mouse-driven values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Balanced maximum tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [2.5, -2.5]), {
    damping: 40,
    stiffness: 80,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], prefersReducedMotion ? [0, 0] : [-2.5, 2.5]), {
    damping: 40,
    stiffness: 80,
  });

  // Autonomous float
  const rawFloat = useMotionValue(0);
  const floatY = useSpring(rawFloat, { damping: 20, stiffness: 25 });

  useEffect(() => {
    if (prefersReducedMotion) {
      rawFloat.set(0);
      return;
    }
    let frame: number;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      rawFloat.set(Math.sin(((ts - start) / 1000) * 0.35) * 6);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [rawFloat, prefersReducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined" || !isHeroInView) return;
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
  }, [mouseX, mouseY, isHeroInView]);

  return (
    <section
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden min-h-screen lg:min-h-[95vh] pt-16 pb-0 lg:pt-28 lg:pb-16 xl:pt-36"
    >
      {/* ── BACKGROUND LAYER ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Mouse-following spotlight */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: isHeroInView ? `radial-gradient(500px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(110,231,255,0.035) 0%, transparent 60%)` : "transparent",
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

        {/* Responsive layout container: stacks vertically below xl, splits side-by-side above xl */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.35fr] items-center gap-12 lg:gap-16 xl:gap-20 pt-4 lg:pt-10">

          {/* Left Column (Typography) */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="intro-hero-text flex flex-col items-center xl:items-start text-center xl:text-left will-change-transform"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 backdrop-blur-sm px-4 py-1.5 text-[10px] lg:text-[11px] font-mono uppercase tracking-widest text-[#6EE7FF]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6EE7FF]" />
              </span>
              Resolve Editor & Motion Designer
            </motion.div>

            {/* Headline — line-by-line reveal */}
            <h1 className="mt-5 lg:mt-6 font-display text-[36px] sm:text-[46px] lg:text-[clamp(2.8rem,5vw,5rem)] font-bold leading-[0.96] tracking-tighter text-foreground">
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
              className="mt-5 lg:mt-6 max-w-[480px] text-[13.5px] lg:text-[15.5px] leading-relaxed text-muted-foreground"
            >
              I create cinematic video edits, motion graphics and commercial content
              that help founders, creators and brands capture attention and increase retention.
            </motion.p>

            {/* CTA Buttons — magnetic + shine */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.28, ease }}
              className="mt-6 lg:mt-7 flex flex-wrap items-center justify-center xl:justify-start gap-3"
            >
              <MagneticButton
                href="#work"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-foreground px-6 lg:px-8 py-3 lg:py-3.5 text-[12px] lg:text-[13px] font-semibold text-background transition-shadow duration-300 hover:shadow-[0_0_32px_rgba(110,231,255,0.35)]"
              >
                <span className="relative z-10">View Portfolio</span>
                <span className="absolute inset-0 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-600 ease-out" />
              </MagneticButton>

              <MagneticButton
                href="#contact"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-border bg-surface/80 backdrop-blur-sm px-6 lg:px-8 py-3 lg:py-3.5 text-[12px] lg:text-[13px] font-semibold text-foreground transition-all duration-300 hover:border-[#6EE7FF]/40 hover:shadow-[0_0_24px_rgba(110,231,255,0.12)]"
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
              className="mt-5 lg:mt-6 flex flex-col sm:flex-row xl:flex-col items-center xl:items-start gap-2.5 sm:gap-6 xl:gap-2"
            >
              {TRUST.map((t, i) => (
                <motion.span
                  key={t.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.55 + i * 0.08, duration: 0.5, ease }}
                  className="flex items-center gap-2 text-[10.5px] lg:text-[11.5px] text-muted-foreground/75 tracking-wide uppercase font-mono"
                >
                  <CheckCircle2 className="size-3 lg:size-3.5 text-[#6EE7FF] shrink-0" />
                  {t.label}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column (MacBook) — stacks below left col on mobile/tablet */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease }}
            className="intro-hero-image w-full max-w-[580px] xl:max-w-none mx-auto justify-self-center xl:justify-self-end select-none will-change-transform pt-4 xl:pt-0"
          >
            <MacBookMockup
              rotateX={rotateX}
              rotateY={rotateY}
              floatY={floatY}
              mouseX={mouseX}
              mouseY={mouseY}
              prefersReducedMotion={prefersReducedMotion}
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
