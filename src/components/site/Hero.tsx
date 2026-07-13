import { useRef, useEffect } from "react";
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
import heroMockup from "@/assets/hero-macbook.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── TRUST BADGES ────────────────────────────────────────────────────────────
const TRUST = [
  { label: "20+ Brand Partners" },
  { label: "100+ Projects Delivered" },
  { label: "Fast Turnaround" },
];

// ─── MOBILE STATS ────────────────────────────────────────────────────────────
const STATS = [
  { value: 100, suffix: "+", label: "Projects" },
  { value: 20, suffix: "+", label: "Brands" },
  { value: 2, suffix: " yrs", label: "Experience" },
  { value: 100, suffix: "+", label: "Videos" },
];

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
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
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

// ─── WORD-BY-WORD STAGGER REVEAL ─────────────────────────────────────────────
function TextReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className="inline-block">
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.22em] py-2 px-1 -my-2 -mx-1"
        >
          <motion.span
            initial={{ y: "110%", rotate: 3, filter: "blur(6px)", opacity: 0 }}
            animate={{ y: 0, rotate: 0, filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 1.2, delay: delay + i * 0.07, ease }}
            className="inline-block transform-gpu origin-left"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── MAGNETIC BUTTON WRAPPER ─────────────────────────────────────────────────
function MagneticButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.a>
  );
}

// ─── FLOATING PARTICLES ──────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  duration: Math.random() * 12 + 8,
  delay: Math.random() * 6,
}));

// ─── HERO COMPONENT ──────────────────────────────────────────────────────────
export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLIFrameElement | null>(null);

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 600], [0, 120]);
  const textOpacity = useTransform(scrollY, [0, 380], [1, 0]);
  const imageY = useTransform(scrollY, [0, 600], [0, -50]);
  const floatY = useTransform(scrollY, [0, 600], [0, 30]);

  // Mouse tracking for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    damping: 30,
    stiffness: 100,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    damping: 30,
    stiffness: 100,
  });

  // Breathing / float animation offset
  const floatOffset = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Gentle autonomous float loop
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      floatOffset.set(Math.sin(t * 0.6) * 10);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [floatOffset]);

  const cardFloat = useSpring(floatOffset, { damping: 18, stiffness: 40 });

  return (
    <section
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden min-h-screen lg:min-h-[95vh] pt-16 pb-0 lg:pt-32 lg:pb-20 xl:pt-40"
    >
      {/* ─── BACKGROUND: animated gradient orbs + particles ─────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[55%] h-[70%] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(ellipse, rgba(0,180,160,0.55) 0%, rgba(0,80,200,0.2) 60%, transparent 80%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 18, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[-15%] right-[-5%] w-[60%] h-[75%] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(ellipse, rgba(10,80,240,0.55) 0%, rgba(139,124,255,0.2) 60%, transparent 80%)",
            filter: "blur(100px)",
          }}
        />
        {/* Subtle light ray */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[55%] opacity-[0.08]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(110,231,255,0.8), transparent)",
          }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#6EE7FF]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: 0.12,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.06, 0.18, 0.06],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container-px mx-auto w-full max-w-7xl relative z-10">

        {/* ══════════════════════════════════════════════════════════════════
            MOBILE LAYOUT  (hidden on lg+)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:hidden">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
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
          <h1 className="intro-hero-text mt-3 font-display text-[40px] font-semibold leading-[0.98] tracking-tighter text-foreground">
            <span className="block">
              <TextReveal text="Cinematic videos" delay={0.2} />
            </span>
            <span className="block">
              <TextReveal text="that people" delay={0.34} />
            </span>
            <span className="block bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] bg-clip-text text-transparent">
              <TextReveal text="actually watch." delay={0.48} />
            </span>
          </h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease }}
            className="mt-3 text-[13px] leading-snug text-muted-foreground max-w-[88%]"
          >
            I create cinematic video edits, motion graphics and commercial content that help founders, creators and brands capture attention and increase retention.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease }}
            className="mt-4 flex items-center gap-2"
          >
            <a
              href="#work"
              className="inline-flex items-center justify-center h-9 rounded-full bg-foreground px-5 text-[11px] font-semibold text-background transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(110,231,255,0.25)] active:scale-[0.97]"
            >
              View Portfolio
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-9 rounded-full border border-border bg-surface/80 backdrop-blur-sm px-5 text-[11px] font-semibold text-foreground transition-all duration-300 hover:scale-[1.04] hover:border-[#6EE7FF]/40 active:scale-[0.97]"
            >
              Book a Call
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3, ease }}
            className="mt-4 flex flex-wrap gap-x-4 gap-y-1"
          >
            {TRUST.map((t) => (
              <span key={t.label} className="flex items-center gap-1 text-[9px] text-muted-foreground/70 uppercase tracking-wider">
                <CheckCircle2 className="size-2.5 text-[#6EE7FF] shrink-0" />
                {t.label}
              </span>
            ))}
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.45, ease }}
            className="mt-5 grid grid-cols-4 divide-x divide-border rounded-2xl border border-border bg-surface/60 backdrop-blur-sm"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-3">
                <div className="text-[18px] leading-none">
                  <MobileCounter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-0.5 text-[8px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            DESKTOP LAYOUT  (hidden below lg)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:grid grid-cols-[1.1fr_0.9fr] items-center gap-16 xl:gap-20">

          {/* Left — Text block */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="intro-hero-text flex flex-col items-start text-left max-w-3xl will-change-transform"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 backdrop-blur-sm px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-[#6EE7FF]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6EE7FF]" />
              </span>
              Resolve Editor & Motion Designer
            </motion.div>

            {/* Headline — 3 lines, big, bold, expressive */}
            <h1 className="mt-7 font-display text-[clamp(2.8rem,6.2vw,5.6rem)] font-semibold leading-[0.98] tracking-tighter text-foreground text-balance">
              <span className="block">
                <TextReveal text="Cinematic videos" delay={0.2} />
              </span>
              <span className="block">
                <TextReveal text="that people" delay={0.34} />
              </span>
              <span className="block bg-gradient-to-r from-[#6EE7FF] via-[#8B7CFF] to-[#6EE7FF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                <TextReveal text="actually watch." delay={0.5} />
              </span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1, ease }}
              className="mt-7 max-w-[480px] text-[16px] leading-relaxed text-muted-foreground"
            >
              I create cinematic video edits, motion graphics and commercial content
              that help founders, creators and brands capture attention and increase retention.
            </motion.p>

            {/* CTA Buttons — magnetic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3, ease }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <MagneticButton
                href="#work"
                className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-foreground px-8 py-4 text-[13px] font-semibold text-background transition-shadow duration-300 hover:shadow-[0_0_28px_rgba(110,231,255,0.3)] group"
              >
                <span className="relative z-10">View Portfolio</span>
                {/* Shine sweep */}
                <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </MagneticButton>

              <MagneticButton
                href="#contact"
                className="relative inline-flex items-center justify-center overflow-hidden rounded-full border border-border bg-surface/80 backdrop-blur-sm px-8 py-4 text-[13px] font-semibold text-foreground transition-all duration-300 hover:border-[#6EE7FF]/40 hover:shadow-[0_0_20px_rgba(110,231,255,0.1)] group"
              >
                <span className="relative z-10">Book a Call</span>
                <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/8 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </MagneticButton>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease }}
              className="mt-6 flex flex-wrap gap-x-5 gap-y-2"
            >
              {TRUST.map((t) => (
                <span key={t.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 uppercase tracking-wider">
                  <CheckCircle2 className="size-3 text-[#6EE7FF] shrink-0" />
                  {t.label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — 3D floating laptop card */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.92, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.4, ease }}
            className="intro-hero-image relative w-full aspect-[4/5] max-w-md ml-auto select-none will-change-transform"
          >
            {/* Outer glow aura behind the card */}
            <div
              className="absolute inset-[-8%] rounded-[3rem] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 60%, rgba(110,231,255,0.12) 0%, rgba(139,124,255,0.08) 40%, transparent 70%)",
                filter: "blur(32px)",
              }}
            />

            {/* Card with float + 3D tilt */}
            <motion.div
              ref={cardRef}
              style={{
                rotateX,
                rotateY,
                y: cardFloat,
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
              className="relative size-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-surface group shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)]"
            >
              {/* Static mockup — always visible as base */}
              <img
                src={heroMockup}
                alt="Cinematic editing timeline"
                className="absolute inset-0 size-full object-cover pointer-events-none"
              />

              {/* YouTube muted autoplay embed — fills screen, no controls */}
              <iframe
                src="https://www.youtube.com/embed/4fFSQCw_SOA?autoplay=1&mute=1&loop=1&playlist=4fFSQCw_SOA&controls=0&modestbranding=1&showinfo=0&rel=0&disablekb=1&playsinline=1&iv_load_policy=3&fs=0&cc_load_policy=0"
                allow="autoplay; encrypted-media"
                className="absolute inset-0 size-full pointer-events-none"
                style={{ border: "none" }}
                title="Cinematic reel preview"
                loading="lazy"
              />

              {/* Top glare reflection */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 45%)",
                }}
              />

              {/* Bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-[2.5rem] border border-transparent group-hover:border-[#6EE7FF]/25 transition-colors duration-500 pointer-events-none" />

              {/* Floating glass badge at bottom */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8, ease }}
                className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-between"
                style={{ transform: "translateZ(20px)" }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7FF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6EE7FF]" />
                  </span>
                  <div className="text-left">
                    <span className="block text-[9px] font-mono uppercase tracking-widest text-white/50">
                      Now Playing
                    </span>
                    <span className="block text-[12px] font-medium text-white mt-0.5">
                      Cinematic Motion System
                    </span>
                  </div>
                </div>
                <div className="text-[9px] font-mono text-[#6EE7FF] uppercase tracking-widest">
                  Live Preview
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>

        {/* ─── SCROLL INDICATOR (desktop only) ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-muted-foreground/40"
        >
          <span className="text-[9px] font-mono uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-3.5" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
