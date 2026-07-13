import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, animate } from "motion/react";
import { Play } from "lucide-react";
import heroMockup from "@/assets/hero-macbook.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

function TextReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className="inline-block">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] py-3 px-1.5 -my-3 -mx-1.5">
          <motion.span
            initial={{ y: "105%", rotate: 4, filter: "blur(8px)", opacity: 0 }}
            animate={{ y: 0, rotate: 0, filter: "blur(0px)", opacity: 1 }}
            transition={{
              duration: 1.4,
              delay: delay + i * 0.08,
              ease,
            }}
            className="inline-block transform-gpu origin-left"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

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

const STATS = [
  { value: 100, suffix: "+", label: "Projects" },
  { value: 20, suffix: "+", label: "Partners" },
  { value: 2, suffix: " yrs", label: "Experience" },
  { value: 100, suffix: "+", label: "Videos" },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 600], [0, 150]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const imageY = useTransform(scrollY, [0, 600], [0, -60]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 25, stiffness: 120 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { damping: 25, stiffness: 120 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) - 0.5);
      mouseY.set((e.clientY / innerHeight) - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden
        min-h-screen lg:min-h-[95vh]
        pt-16 pb-0 lg:pt-32 lg:pb-20 xl:pt-40"
    >
      <div className="container-px mx-auto w-full max-w-7xl">

        {/* ════════════════════════════════════════
            MOBILE LAYOUT  (hidden on lg+)
            Everything in one tight compact column
        ════════════════════════════════════════ */}
        <div className="flex flex-col lg:hidden">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="inline-flex self-start items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#6EE7FF]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6EE7FF]" />
            </span>
            Resolve Editor & Motion Designer
          </motion.div>

          {/* Heading — compact, 2 lines max */}
          <h1 className="intro-hero-text mt-3 font-display text-[38px] font-medium leading-[1.0] tracking-tighter text-foreground">
            <span className="block">
              <TextReveal text="story before" delay={0.2} />
            </span>
            <span className="block">
              <TextReveal text="style." delay={0.35} />
            </span>
            <span className="block text-[#8B7CFF] italic font-normal">
              <TextReveal text="motion with purpose." delay={0.5} />
            </span>
          </h1>

          {/* Subtitle — one short line */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease }}
            className="mt-3 text-[13px] leading-snug text-muted-foreground max-w-[85%]"
          >
            Cinematic video editing, color grading & motion design for ambitious brands.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease }}
            className="mt-4 flex items-center gap-2"
          >
            <a
              href="#work"
              className="btn-premium flex items-center justify-center h-9 bg-foreground px-5 text-[11px] font-semibold text-background rounded-full"
            >
              view work
            </a>
            <a
              href="#contact"
              className="btn-premium flex items-center justify-center h-9 border border-border bg-surface px-5 text-[11px] font-semibold text-foreground rounded-full"
            >
              start brief
            </a>
          </motion.div>

          {/* Inline Stats Strip — replaces the entire Stats section on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease }}
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

          {/* Trusted By strip */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5, ease }}
            className="mt-3 text-center text-[9px] uppercase tracking-[0.18em] text-muted-foreground/60"
          >
            Trusted by founders, agencies & creators
          </motion.p>
        </div>

        {/* ════════════════════════════════════════
            DESKTOP LAYOUT  (hidden below lg)
            Exact original layout, untouched
        ════════════════════════════════════════ */}
        <div className="hidden lg:grid grid-cols-[1.1fr_0.9fr] items-center gap-16">

          {/* Left Block */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="intro-hero-text flex flex-col items-start text-left max-w-3xl will-change-transform"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-[#6EE7FF]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6EE7FF]" />
              </span>
              Resolve Editor & Motion Designer
            </motion.div>

            <h1 className="mt-8 font-display text-[clamp(2.4rem,6vw,5.4rem)] font-medium leading-[1.05] tracking-tighter text-foreground text-balance">
              <TextReveal text="story before style." delay={0.25} />
              <br />
              <span className="text-[#8B7CFF] italic font-normal">
                <TextReveal text="motion with purpose." delay={0.4} />
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] bg-clip-text text-transparent">
                <TextReveal text="earn attention." delay={0.75} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1, ease }}
              className="mt-8 max-w-lg text-[16px] leading-relaxed text-muted-foreground"
            >
              I build immersive cinematic video productions for ambitious agencies, creators and startups. High-end color grading, precise audio Finishes, and custom Fusion graphics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3, ease }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a href="#work" className="btn-premium flex items-center justify-center bg-foreground px-8 py-4 text-[13px] font-semibold text-background">
                <span className="relative z-10">view work showcase</span>
              </a>
              <a href="#contact" className="btn-premium flex items-center justify-center border border-border bg-surface px-8 py-4 text-[13px] font-semibold text-foreground">
                start brief
              </a>
            </motion.div>
          </motion.div>

          {/* Right Block - 3D Card */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.95, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease }}
            className="intro-hero-image relative w-full aspect-[4/5] max-w-md ml-auto select-none will-change-transform"
          >
            <motion.div
              ref={cardRef}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
              className="relative size-full rounded-[2.5rem] overflow-hidden border border-border shadow-float bg-surface group"
            >
              <img
                src={heroMockup}
                alt="Resolve Timeline Detail"
                className="absolute inset-0 size-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 border border-transparent group-hover:border-[#6EE7FF]/30 transition-colors duration-500 rounded-[2.5rem] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-card/80 backdrop-blur-lg border border-border flex items-center justify-between shadow-soft transform-gpu group-hover:translate-z-10"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7FF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6EE7FF]" />
                  </span>
                  <div className="text-left">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Active Project</span>
                    <span className="block text-[13px] font-medium text-foreground mt-0.5">Aether — cinematic commercial</span>
                  </div>
                </div>
                <div className="size-10 rounded-full border border-border bg-background flex items-center justify-center text-[#6EE7FF]">
                  <Play className="size-4 fill-current ml-0.5" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
