import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { CinematicHeading } from "./CinematicHeading";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const ITEMS = [
  {
    name: "Sofia Marchetti",
    role: "Head of Brand",
    company: "Aether",
    initials: "SM",
    color: "#6EE7FF",
    quote:
      "The film became the centerpiece of our launch. Every frame felt considered. We've never received this much inbound from a single asset.",
  },
  {
    name: "Daniel Okafor",
    role: "Founder",
    company: "Northstar AI",
    initials: "DO",
    color: "#8B7CFF",
    quote:
      "Treated our product like it was an Apple keynote. Calm, fast, and the final cut moved metrics from day one.",
  },
  {
    name: "Maya Lindqvist",
    role: "Creative Director",
    company: "Octave",
    initials: "ML",
    color: "#6EE7FF",
    quote:
      "A rare collaborator who pushes the work without ego. The motion system they built still anchors our brand a year later.",
  },
];

export function Testimonials() {
  const [idx, setIdx] = useState(0);
  const item = ITEMS[idx];

  const prev = () => setIdx((p) => (p - 1 + ITEMS.length) % ITEMS.length);
  const next = () => setIdx((p) => (p + 1) % ITEMS.length);

  return (
    <section className="relative mt-32 md:mt-48 overflow-hidden">
      {/* Background ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[70%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(110,231,255,0.04) 0%, rgba(139,124,255,0.03) 50%, transparent 75%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="container-px mx-auto max-w-6xl relative z-10">

        {/* Header row */}
        <div className="flex items-end justify-between gap-6">
          <div>
            {/* Animated top line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="origin-left h-px w-16 bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] mb-4"
            />
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground mb-2">
              Trusted by founders
            </p>
            <CinematicHeading
              tagline=""
              text="From the founders we work with."
            />
          </div>

          {/* Premium nav buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              aria-label="Previous testimonial"
              onClick={prev}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="group relative size-12 flex items-center justify-center rounded-full border border-white/10 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:border-[#6EE7FF]/30 hover:shadow-[0_0_18px_rgba(110,231,255,0.1)]"
            >
              <ChevronLeft className="size-4 text-foreground/60 group-hover:text-foreground transition-colors" />
            </motion.button>
            <motion.button
              aria-label="Next testimonial"
              onClick={next}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="group relative size-12 flex items-center justify-center rounded-full border border-white/10 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:border-[#6EE7FF]/30 hover:shadow-[0_0_18px_rgba(110,231,255,0.1)]"
            >
              <ChevronRight className="size-4 text-foreground/60 group-hover:text-foreground transition-colors" />
            </motion.button>
          </div>
        </div>

        {/* Testimonial card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)", scale: 0.98 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)", scale: 0.99 }}
            transition={{ duration: 0.55, ease }}
            className="relative mt-10 rounded-[2rem] overflow-hidden"
          >
            {/* Glass background */}
            <div
              className="absolute inset-0 rounded-[2rem]"
              style={{
                background:
                  "color-mix(in oklab, var(--color-card) 65%, transparent)",
                backdropFilter: "blur(32px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            />

            {/* Glow behind card matching current person's color */}
            <div
              className="absolute -inset-4 rounded-[3rem] pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 80%, ${item.color}08 0%, transparent 65%)`,
                filter: "blur(32px)",
              }}
            />

            <div className="relative z-10 p-8 md:p-14">
              {/* Large animated quotation mark */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease }}
                className="font-display text-[96px] leading-none font-bold select-none"
                style={{
                  background: `linear-gradient(135deg, ${item.color}60 0%, ${item.color}18 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 0.7,
                  marginBottom: "16px",
                }}
              >
                &ldquo;
              </motion.div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
                  >
                    <Star
                      className="size-4 fill-[#FFB800] text-[#FFB800]"
                      strokeWidth={0}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="max-w-4xl font-display text-balance text-2xl font-medium leading-snug tracking-tight md:text-[2.1rem] text-foreground/90">
                {item.quote}
              </blockquote>

              {/* Author row */}
              <div className="mt-10 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="size-12 rounded-full flex items-center justify-center font-display text-sm font-bold text-background flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${item.color} 0%, #8B7CFF 100%)`,
                      boxShadow: `0 0 16px ${item.color}30`,
                    }}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-foreground">
                      {item.name}
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">
                      {item.role}, {item.company}
                    </div>
                  </div>
                </div>

                {/* Company text logo */}
                <div
                  className="font-display text-[13px] font-semibold tracking-[0.18em] uppercase"
                  style={{ color: `${item.color}70` }}
                >
                  {item.company}
                </div>

                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {ITEMS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === idx ? "w-6" : "w-1.5 bg-foreground/25"
                      }`}
                      style={i === idx ? { background: item.color } : {}}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
