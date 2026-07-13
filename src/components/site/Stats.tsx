import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";

const STATS = [
  { value: 100, suffix: "+", label: "Projects delivered" },
  { value: 20, suffix: "+", label: "Brand partners" },
  { value: 2, suffix: " yrs", label: "Crafting visuals" },
  { value: 100, suffix: "+", label: "Videos Edited" },
];

const LOGOS = ["AETHER", "NORTHSTAR", "LUMEN", "OCTAVE", "PARALLEL", "MERIDIAN", "OBSCURA"];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1] });
      return controls.stop;
    }
  }, [inView, to, mv]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative hidden lg:block mt-44">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid grid-cols-4 gap-0 rounded-3xl hairline bg-surface px-6 py-12 md:px-12 md:py-14">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col justify-center h-auto text-left ${i !== 0 ? "border-l border-hairline pl-12" : ""}`}
            >
              <div className="heading-display text-5xl md:text-6xl font-medium">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-[13px] text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-14"
        >
          <p className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by teams building the next chapter
          </p>
          <div className="mt-7 grid grid-cols-7 items-center gap-6 opacity-60">
            {LOGOS.map((l) => (
              <div
                key={l}
                className="text-center font-display text-[14px] font-semibold tracking-[0.18em] text-foreground/70"
              >
                {l}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
