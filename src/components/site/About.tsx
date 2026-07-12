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
  { year: "2024 — Present", role: "Freelance Creative Editor", company: "Founders, Creators & Studios" },
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

  // Mouse coordinate mapping for portrait parallax offsets
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
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <section id="about" className="relative mt-24 py-16 scroll-mt-24 md:mt-36">
      <div className="container-px mx-auto max-w-7xl">
        {/* Main Spread Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Portrait & Timeline (5 cols) */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div
              ref={imageWrapperRef}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[2rem] overflow-hidden border border-border bg-[#020813] aspect-[4/5] w-full group cursor-none"
              data-cursor="image"
            >
              {/* Parallax inner image */}
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

            {/* Timeline Spread */}
            <div className="space-y-6 pt-6 text-left">
              <h3 className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7CFF] font-semibold">
                Timeline
              </h3>
              <div className="border-t border-border pt-6 space-y-6">
                {TIMELINE.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row sm:justify-between items-start gap-2"
                  >
                    <div>
                      <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                        {item.year}
                      </span>
                      <h4 className="font-display text-[15px] font-medium text-foreground mt-1">
                        {item.role}
                      </h4>
                    </div>
                    <span className="text-[13px] text-muted-foreground mt-1 sm:mt-0 sm:text-right">
                      {item.company}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Philosophy, Quotes & Chips (7 cols) */}
          <div className="lg:col-span-7 space-y-12 lg:pl-6 text-left">
            <div>
              <CinematicHeading 
                tagline="philosophical spread" 
                text="timing isn't just edits — timing is emotion." 
              />

              <div className="mt-8 space-y-6 text-[15.5px] leading-relaxed text-muted-foreground">
                <p>
                  A premium video production is built on dynamic structure. Combining color grading, audio composition, and vector motion animation under a single DaVinci Resolve finishers timeline removes overhead and scope drift.
                </p>
                <p>
                  I focus on creating high-end campaign structures for founders, modern agencies, and startups who want to stand out with cinematic pacing, clear storytelling, and zero generic styling.
                </p>
              </div>
            </div>

            {/* Core Values Asymmetric Grid */}
            <div className="space-y-6 border-t border-border pt-8">
              <h3 className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7CFF] font-semibold">
                Editorial Values
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
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
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      {val.v}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Software Capabilities - Glowing Tech cards */}
            <div className="space-y-6 border-t border-border pt-8">
              <h3 className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7CFF] font-semibold">
                Resolve finishing
              </h3>
              <div className="flex flex-wrap gap-4 mt-4">
                {SOFTWARE.map((tech, idx) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                    whileHover={{ borderColor: "rgba(110, 231, 255, 0.4)", y: -3 }}
                    className="flex-1 min-w-[140px] rounded-xl border border-border bg-card p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_20px_rgba(110,231,255,0.03)] cursor-default"
                  >
                    <span className="font-display text-[14px] font-semibold text-foreground">
                      {tech.name}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground mt-2 uppercase tracking-wider">
                      {tech.level}
                    </span>
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
