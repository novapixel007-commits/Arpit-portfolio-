import { motion } from "motion/react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const ITEMS = [
  {
    name: "Sofia Marchetti",
    role: "Head of Brand, Aether",
    quote:
      "The film became the centerpiece of our launch. Every frame felt considered. We've never received this much inbound from a single asset.",
  },
  {
    name: "Daniel Okafor",
    role: "Founder, Northstar AI",
    quote:
      "Treated our product like it was an Apple keynote. Calm, fast, and the final cut moved metrics from day one.",
  },
  {
    name: "Maya Lindqvist",
    role: "Creative Director, Octave",
    quote:
      "A rare collaborator who pushes the work without ego. The motion system they built still anchors our brand a year later.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const item = ITEMS[i];

  return (
    <section className="relative mt-32 md:mt-48">
      <div className="container-px mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow">Kind words</p>
            <h2 className="mt-4 heading-display text-balance text-4xl md:text-6xl">
              From the founders
              <br className="hidden md:block" /> we work with.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous testimonial"
              onClick={() => setI((p) => (p - 1 + ITEMS.length) % ITEMS.length)}
              className="grid size-11 place-items-center rounded-full hairline bg-surface transition hover:bg-surface-2"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              aria-label="Next testimonial"
              onClick={() => setI((p) => (p + 1) % ITEMS.length)}
              className="grid size-11 place-items-center rounded-full hairline bg-surface transition hover:bg-surface-2"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong noise mt-12 overflow-hidden rounded-[2rem] p-8 shadow-soft md:p-14"
        >
          <Quote className="size-8 text-foreground/30" strokeWidth={1.5} />
          <blockquote className="mt-6 max-w-4xl font-display text-balance text-2xl font-medium leading-snug tracking-tight md:text-4xl">
            "{item.quote}"
          </blockquote>
          <div className="mt-10 flex items-center gap-4">
            <div className="grid size-12 place-items-center rounded-full bg-foreground font-display text-base font-medium text-primary-foreground">
              {item.name.charAt(0)}
            </div>
            <div>
              <div className="text-[15px] font-medium">{item.name}</div>
              <div className="text-[13px] text-muted-foreground">{item.role}</div>
            </div>
            <div className="ml-auto flex gap-1.5">
              {ITEMS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i ? "w-6 bg-foreground" : "w-1.5 bg-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
