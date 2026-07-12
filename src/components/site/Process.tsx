import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CinematicHeading } from "./CinematicHeading";

const STEPS = [
  { n: "01", title: "Discovery", body: "Brief, references, audience and goals. I map the why before the what." },
  { n: "02", title: "Strategy", body: "Story arc, format and channel strategy aligned to a single goal." },
  { n: "03", title: "Storyboard", body: "Beats, frames and motion direction. Approved before a single cut." },
  { n: "04", title: "Editing", body: "Story-first edit, pacing and rhythm. Up to two structured revision rounds." },
  { n: "05", title: "Motion", body: "Hand-crafted animation, sound design and color. The premium layer." },
  { n: "06", title: "Delivery", body: "All formats, all aspect ratios, ready for launch — and the next campaign." },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="relative mt-32 scroll-mt-24 md:mt-48">
      <div className="container-px mx-auto max-w-5xl">
        <div className="max-w-2xl">
            <CinematicHeading 
              tagline="The process" 
              text="A calm, deliberate way of working." 
            />
          <p className="mt-6 max-w-lg text-[15px] text-muted-foreground">
            Six steps from kickoff to launch — clear deliverables, no surprises,
            no scope drift.
          </p>
        </div>

        <div ref={ref} className="relative mt-16 pl-8 md:pl-14">
          {/* Track */}
          <div className="absolute left-2 top-0 h-full w-px bg-hairline md:left-4" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-2 top-0 w-px origin-top bg-foreground md:left-4"
          />

          <div className="space-y-14">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <span className="absolute -left-[1.625rem] top-2 size-2.5 rounded-full bg-foreground ring-4 ring-background md:-left-[2.625rem]" />
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span className="font-mono text-[12px] text-muted-foreground">
                    {s.n}
                  </span>
                  <h3 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
