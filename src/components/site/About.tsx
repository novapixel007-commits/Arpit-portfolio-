import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { CinematicHeading } from "./CinematicHeading";
import portrait from "@/assets/portrait.jpg.png";

const VALUES = [
  { k: "Story First", v: "If a frame doesn't serve the story, it doesn't belong in the timeline." },
  { k: "Rhythm Tuning", v: "Cuts timed precisely to breath shifts, vocal drops and organic visual weights." },
  { k: "Finishing Polish", v: "Hand-rolled color matching, scene consistency, and realistic grain composite." },
  { k: "Direct Link", v: "No account managers. Direct creative partnership from reference to delivery." },
];

const TIMELINE = [
  { year: "2024 — Now", role: "Freelance Creative Editor", company: "Founders, Creators & Studios" },
  { year: "2023 — 2024", role: "Finishing & Color Specialist", company: "Obscura Motion Lab" },
  { year: "2022 — 2023", role: "Fusion Motion Compositor", company: "Parallel Agencies" },
];

const SOFTWARE = [
  { name: "DaVinci Resolve", level: "Color Finishing & Editing" },
  { name: "Fusion Studio", level: "Node Compositing & VFX" },
  { name: "Fairlight", level: "Precision Sound Design" },
];

export function About() {
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imageX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 80, damping: 20 });
  const imageY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX / innerWidth - 0.5);
      mouseY.set(e.clientY / innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section id="about" className="relative scroll-mt-24 mt-10 py-8 lg:mt-24 lg:py-16">
      <div className="container-px mx-auto max-w-7xl">

        {/* ══════════════════════════════════════
            MOBILE LAYOUT — completely redesigned
        ══════════════════════════════════════ */}
        <div className="lg:hidden space-y-6">

          {/* Header */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8B7CFF]">philosophical spread</p>
            <h2 className="mt-1 font-display text-[26px] font-medium leading-[1.1] tracking-tighter text-foreground">
              timing isn't just edits —<br />
              <span className="text-muted-foreground font-normal italic">timing is emotion.</span>
            </h2>
          </div>

          {/* Portrait — short aspect, not 4/5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden border border-border aspect-[16/9] w-full"
          >
            <img
              src={portrait}
              alt="Arpit Sharma"
              className="absolute inset-0 size-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div>
                <span className="block text-[9px] font-mono uppercase tracking-widest text-[#6EE7FF]">The Editor</span>
                <span className="block font-display text-[14px] font-medium text-white">Arpit Sharma</span>
              </div>
              <span className="font-mono text-[9px] text-white/50 uppercase tracking-wider">Resolve / Fusion</span>
            </div>
          </motion.div>

          {/* Description — tight */}
          <p className="text-[13px] leading-snug text-muted-foreground">
            Combining color grading, audio composition, and motion animation under a single DaVinci Resolve timeline — for founders, agencies and startups who want cinematic pacing with zero generic styling.
          </p>

          {/* Timeline — ultra compact */}
          <div className="border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-surface/50">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8B7CFF]">Timeline</span>
            </div>
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`flex items-center justify-between px-4 py-3 ${i !== TIMELINE.length - 1 ? "border-b border-border/60" : ""}`}
              >
                <div>
                  <p className="font-display text-[13px] font-medium text-foreground leading-none">{item.role}</p>
                  <p className="mt-0.5 text-[9px] font-mono text-[#8B7CFF] uppercase tracking-wider">{item.year}</p>
                </div>
                <p className="text-[11px] text-muted-foreground text-right max-w-[40%] leading-tight">{item.company}</p>
              </motion.div>
            ))}
          </div>

          {/* Editorial Values — 2 col compact grid, max ~120px tall each */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8B7CFF] mb-3">Editorial Values</p>
            <div className="grid grid-cols-2 gap-2">
              {VALUES.map((val, idx) => (
                <motion.div
                  key={val.k}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.07 }}
                  className="rounded-xl border border-border bg-card/60 p-3 flex flex-col h-[110px]"
                >
                  <span className="font-display text-[12px] font-semibold text-foreground leading-tight">{val.k}</span>
                  <p className="mt-1 text-[10px] leading-snug text-muted-foreground line-clamp-3">{val.v}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Software — single horizontal row */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8B7CFF] mb-3">Resolve Finishing</p>
            <div className="flex gap-2">
              {SOFTWARE.map((tech, idx) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className="flex-1 rounded-xl border border-border bg-card p-3 flex flex-col justify-between h-[76px]"
                >
                  <span className="font-display text-[11px] font-semibold text-foreground leading-tight">{tech.name}</span>
                  <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wide mt-1">{tech.level}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════
            DESKTOP LAYOUT — original, untouched
        ══════════════════════════════════════ */}
        <div className="hidden lg:grid grid-cols-12 gap-16 items-start">

          {/* Left Column: Portrait & Timeline (5 cols) */}
          <div className="col-span-5 space-y-12">
            <motion.div
              ref={imageWrapperRef}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[2rem] overflow-hidden border border-border bg-[#020813] aspect-[4/5] w-full group cursor-none"
              data-cursor="image"
            >
              <motion.img
                src={portrait}
                alt="Arpit Sharma Portrait"
                style={{ x: imageX, y: imageY }}
                className="absolute inset-[-5%] size-[110%] object-cover scale-102 will-change-transform transition-all duration-300 group-hover:brightness-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-card/90 backdrop-blur-md border border-border shadow-soft">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#6EE7FF]">The Editor</span>
                <span className="block font-display text-base font-medium text-foreground mt-0.5">arpit sharma</span>
              </div>
            </motion.div>

            <div className="space-y-6 pt-6 text-left">
              <h3 className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7CFF] font-semibold">Timeline</h3>
              <div className="border-t border-border pt-6 space-y-6">
                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="flex flex-col sm:flex-row sm:justify-between items-start gap-2"
                  >
                    <div>
                      <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <span className="inline-block size-1.5 rounded-full bg-[#8B7CFF]" />
                        {item.year}
                      </span>
                      <h4 className="font-display text-[15px] font-medium text-foreground mt-1">{item.role}</h4>
                    </div>
                    <span className="text-[13px] text-muted-foreground sm:text-right">{item.company}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Philosophy, Values & Software (7 cols) */}
          <div className="col-span-7 space-y-12 pl-6 text-left">
            <div>
              <CinematicHeading
                tagline="philosophical spread"
                text="timing isn't just edits — timing is emotion."
              />
              <div className="mt-8 space-y-6 text-[15.5px] leading-relaxed text-muted-foreground max-w-full">
                <p>
                  A premium video production is built on dynamic structure. Combining color grading, audio composition, and vector motion animation under a single DaVinci Resolve finishers timeline removes overhead and scope drift.
                </p>
                <p>
                  I focus on creating high-end campaign structures for founders, modern agencies, and startups who want to stand out with cinematic pacing, clear storytelling, and zero generic styling.
                </p>
              </div>
            </div>

            <div className="space-y-6 border-t border-border pt-8">
              <h3 className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7CFF] font-semibold">Editorial Values</h3>
              <div className="grid grid-cols-2 gap-8 mt-6">
                {VALUES.map((val, idx) => (
                  <motion.div
                    key={val.k}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="space-y-2 group"
                  >
                    <span className="font-display text-[15px] font-semibold text-foreground group-hover:text-[#6EE7FF] transition-colors duration-300">
                      {val.k}
                    </span>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{val.v}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6 border-t border-border pt-8">
              <h3 className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7CFF] font-semibold">Resolve finishing</h3>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {SOFTWARE.map((tech, idx) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                    whileHover={{ borderColor: "rgba(110, 231, 255, 0.4)", y: -3 }}
                    className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between h-[110px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(110,231,255,0.03)] cursor-default"
                  >
                    <span className="font-display text-[14px] font-semibold text-foreground">{tech.name}</span>
                    <span className="text-[11px] font-mono text-muted-foreground mt-2 uppercase tracking-wider">{tech.level}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
