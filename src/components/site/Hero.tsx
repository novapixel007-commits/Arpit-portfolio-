import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
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

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Scroll parallax configurations using Framer Motion (extremely performant, runs on compositor thread)
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 600], [0, 150]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const imageY = useTransform(scrollY, [0, 600], [0, -60]);

  // Spring-bound mouse tracking for 3D card tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 25, stiffness: 120 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { damping: 25, stiffness: 120 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalize mouse positions to range [-0.5, 0.5]
      mouseX.set((e.clientX / innerWidth) - 0.5);
      mouseY.set((e.clientY / innerHeight) - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[auto] lg:min-h-[95vh] flex items-center justify-center overflow-hidden pt-20 pb-4 lg:pt-32 lg:pb-20 xl:pt-40"
    >
      <div className="container-px mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          
          {/* Left Block - Typographic Display with scroll parallax */}
          <motion.div 
            style={{ y: textY, opacity: textOpacity }}
            className="intro-hero-text flex flex-col items-start text-left max-w-3xl will-change-transform"
          >
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-[#6EE7FF]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6EE7FF]"></span>
              </span>
              Resolve Editor & Motion Designer
            </motion.div>

            {/* Massive Awwwards-Level Heading */}
            <h1 className="mt-2 lg:mt-8 font-display text-[clamp(36px,8vw,42px)] lg:text-[clamp(2.4rem,6vw,5.4rem)] font-medium leading-[1.05] tracking-tighter text-foreground text-balance">
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

            {/* Detailed copy description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1, ease }}
              className="mt-3 lg:mt-8 max-w-lg text-[14px] lg:text-[16px] leading-snug lg:leading-relaxed text-muted-foreground"
            >
              I build immersive cinematic video productions for ambitious agencies, creators and startups. High-end color grading, precise audio Finishes, and custom Fusion graphics.
            </motion.p>

            {/* Inverted luxury CTA triggers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3, ease }}
              className="mt-4 lg:mt-10 flex flex-wrap items-center gap-2 lg:gap-4"
            >
              <a
                href="#work"
                className="btn-premium flex items-center justify-center h-10 lg:h-auto bg-foreground px-6 lg:px-8 lg:py-4 text-[12px] lg:text-[13px] font-semibold text-background"
              >
                <span className="relative z-10">view work showcase</span>
              </a>
              <a
                href="#contact"
                className="btn-premium flex items-center justify-center h-10 lg:h-auto border border-border bg-surface px-6 lg:px-8 lg:py-4 text-[12px] lg:text-[13px] font-semibold text-foreground"
              >
                start brief
              </a>
            </motion.div>
          </motion.div>

          {/* Right Block - 3D Perspective Card Tilt */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.95, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease }}
            className="intro-hero-image relative w-full aspect-[4/5] max-w-md lg:ml-auto select-none will-change-transform"
          >
            <motion.div
              ref={cardRef}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
              className="relative size-full rounded-[2.5rem] overflow-hidden border border-border shadow-float bg-surface group"
            >
              {/* MacBook Mockup Image */}
              <img
                src={heroMockup}
                alt="Resolve Timeline Detail"
                className="absolute inset-0 size-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
              />

              {/* Glowing Gradient Border overlay on card hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-[#6EE7FF]/30 transition-colors duration-500 rounded-[2.5rem] pointer-events-none" />

              {/* Ambient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              {/* Dynamic Glass Capsule Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-card/80 backdrop-blur-lg border border-border flex items-center justify-between shadow-soft transform-gpu group-hover:translate-z-10"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6EE7FF]"></span>
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
