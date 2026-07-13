import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";
import { Clapperboard, Users, Clock, Play } from "lucide-react";

const STATS = [
  {
    value: 100,
    suffix: "+",
    label: "Projects Delivered",
    sub: "Across brands & studios",
    icon: Clapperboard,
    color: "#6EE7FF",
  },
  {
    value: 20,
    suffix: "+",
    label: "Brands Worked With",
    sub: "From startups to agencies",
    icon: Users,
    color: "#8B7CFF",
  },
  {
    value: 2,
    suffix: "+",
    label: "Years Experience",
    sub: "DaVinci Resolve specialist",
    icon: Clock,
    color: "#6EE7FF",
  },
  {
    value: 100,
    suffix: "+",
    label: "Videos Edited",
    sub: "Cinematic & motion work",
    icon: Play,
    color: "#8B7CFF",
  },
];

const BRANDS = [
  "AETHER",
  "NORTHSTAR",
  "LUMEN",
  "OCTAVE",
  "PARALLEL",
  "MERIDIAN",
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration: 2, ease: [0.22, 1, 0.36, 1] });
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
    <section className="relative mt-20 lg:mt-36">
      <div className="container-px mx-auto max-w-7xl">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-center gap-3"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
            by the numbers
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
        </motion.div>

        {/* Stat cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative rounded-2xl border border-white/8 bg-card/60 backdrop-blur-xl p-6 flex flex-col gap-4 cursor-default overflow-hidden"
                style={{
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                  transition: "box-shadow 0.4s ease, transform 0.4s ease",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{
                    boxShadow: `0 0 40px ${s.color}18, inset 0 0 30px ${s.color}08`,
                    border: `1px solid ${s.color}30`,
                  }}
                />

                {/* Ambient radial behind number */}
                <div
                  className="absolute -top-8 -left-8 w-28 h-28 rounded-full pointer-events-none opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${s.color} 0%, transparent 70%)`,
                    filter: "blur(24px)",
                  }}
                />

                {/* Icon */}
                <div
                  className="size-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}14`, border: `1px solid ${s.color}22` }}
                >
                  <Icon className="size-4" style={{ color: s.color }} strokeWidth={1.5} />
                </div>

                {/* Number */}
                <div>
                  <div
                    className="font-display text-[2.2rem] sm:text-[3.2rem] font-semibold leading-none tracking-tighter"
                    style={{
                      background: `linear-gradient(135deg, #fff 30%, ${s.color} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-[13px] font-medium text-foreground/80">{s.label}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{s.sub}</div>
                </div>

                {/* Bottom gradient border */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px"
                  style={{
                    background: `linear-gradient(to right, transparent, ${s.color}40, transparent)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Brands / Worked With strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              Worked with
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
          </div>

          <div className="flex items-center justify-center gap-x-6 gap-y-3 lg:gap-10 flex-wrap">
            {BRANDS.map((brand, i) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.06 }}
                whileHover={{ opacity: 1 }}
                className="font-display text-[13px] font-semibold tracking-[0.18em] text-foreground/35 uppercase hover:text-foreground/70 transition-colors duration-300 cursor-default"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
