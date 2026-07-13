import { motion, useMotionValue, useSpring, useTransform, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { CinematicHeading } from "./CinematicHeading";
import portrait from "@/assets/portrait.jpg.png";
import {
  BookOpen,
  Waves,
  Palette,
  Handshake,
  MapPin,
  CircleDot,
} from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: BookOpen,
    k: "Story First",
    v: "If a frame doesn't serve the story, it doesn't belong in the timeline.",
    color: "#6EE7FF",
  },
  {
    icon: Waves,
    k: "Rhythm",
    v: "Cuts timed precisely to breath shifts, vocal drops and organic visual weights.",
    color: "#8B7CFF",
  },
  {
    icon: Palette,
    k: "Color",
    v: "Hand-rolled color matching, scene consistency, and realistic grain composite.",
    color: "#6EE7FF",
  },
  {
    icon: Handshake,
    k: "Partnership",
    v: "No account managers. Direct creative link from reference to final delivery.",
    color: "#8B7CFF",
  },
];

const TIMELINE = [
  { year: "2024 — Now",  role: "Freelance Creative Editor",       company: "Founders, Creators & Studios" },
  { year: "2023 — 2024", role: "Finishing & Color Specialist",    company: "Obscura Motion Lab"            },
  { year: "2022 — 2023", role: "Fusion Motion Compositor",        company: "Parallel Agencies"             },
];

const SOFTWARE = [
  { name: "DaVinci Resolve", level: "Color Finishing & Editing",        color: "#6EE7FF" },
  { name: "Fusion Studio",   level: "Node Compositing & VFX",          color: "#8B7CFF" },
  { name: "Fairlight",       level: "Precision Sound Design",           color: "#6EE7FF" },
];

// Fixed particle positions (no Math.random for SSR safety)
const IMG_PARTICLES = [
  { x: 10, y: 20, s: 2.5, d: 7 },
  { x: 85, y: 15, s: 1.8, d: 9 },
  { x: 5,  y: 70, s: 2.0, d: 6 },
  { x: 92, y: 60, s: 1.5, d: 8 },
  { x: 50, y: 5,  s: 1.2, d: 10},
  { x: 20, y: 90, s: 2.2, d: 7 },
  { x: 78, y: 85, s: 1.6, d: 9 },
];

const ease = [0.16, 1, 0.3, 1] as const;

// ─── CINEMATIC PORTRAIT CARD ──────────────────────────────────────────────────
function PortraitCard({
  mouseX,
  mouseY,
}: {
  mouseX: ReturnType<typeof useMotionValue>;
  mouseY: ReturnType<typeof useMotionValue>;
}) {
  const imageX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 70, damping: 20 });
  const imageY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), { stiffness: 70, damping: 20 });
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 60, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 60, damping: 22 });

  // Autonomous slow float
  const rawFloat = useMotionValue(0);
  const floatY = useSpring(rawFloat, { damping: 14, stiffness: 30 });
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      rawFloat.set(Math.sin(((ts - start) / 1000) * 0.45) * 8);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [rawFloat]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.2, ease }}
      className="relative will-change-transform"
      style={{ perspective: 1000 }}
    >
      {/* Cinematic particles behind */}
      <div className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true">
        {IMG_PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#6EE7FF]"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, opacity: 0.15 }}
            animate={{ y: [-6, 6, -6], opacity: [0.08, 0.22, 0.08] }}
            transition={{ duration: p.d, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Glow aura */}
      <div
        className="absolute -inset-6 pointer-events-none rounded-[3rem]"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, rgba(110,231,255,0.12) 0%, rgba(139,124,255,0.07) 50%, transparent 75%)",
          filter: "blur(36px)",
        }}
      />

      {/* Card shell */}
      <motion.div
        style={{ rotateX, rotateY, y: floatY, transformStyle: "preserve-3d" }}
        className="relative rounded-[2.2rem] overflow-hidden border border-white/10 bg-[#020813] aspect-[4/5] w-full group"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.4, ease }}
      >
        {/* Gradient border overlay */}
        <div
          className="absolute inset-0 rounded-[2.2rem] pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(135deg, rgba(110,231,255,0.12) 0%, transparent 45%, rgba(139,124,255,0.08) 100%)",
          }}
        />

        {/* Portrait image */}
        <motion.img
          src={portrait}
          alt="Arpit Sharma"
          style={{ x: imageX, y: imageY }}
          className="absolute inset-[-5%] size-[110%] object-cover object-top will-change-transform group-hover:brightness-90 transition-all duration-500"
          loading="lazy"
        />

        {/* Grain overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "160px",
          }}
        />

        {/* Light reflection sweep */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
        />

        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent z-10 pointer-events-none" />

        {/* Glass editor card at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8, ease }}
          className="absolute bottom-5 left-5 right-5 z-20 p-4 rounded-2xl border border-white/12 bg-black/60 backdrop-blur-2xl"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#6EE7FF]">
                The Editor
              </p>
              <p className="mt-0.5 font-display text-[15px] font-semibold text-white">
                Arpit Sharma
              </p>
              <p className="text-[10px] text-white/50 mt-0.5">
                Creative Video Editor
              </p>
              <p className="text-[9px] text-white/35 mt-0.5">
                Helping founders grow using cinematic storytelling
              </p>
            </div>
            {/* Availability indicator */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-[9px] font-mono text-green-400/80 uppercase tracking-wider">
                  Available
                </span>
              </div>
              <div className="flex items-center gap-1 text-[8px] text-white/30">
                <MapPin className="size-2.5" />
                Worldwide
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── TIMELINE ITEM ────────────────────────────────────────────────────────────
function TimelineItem({
  item,
  i,
  isLast,
}: {
  item: (typeof TIMELINE)[0];
  i: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="relative flex gap-5">
      {/* Left: glowing vertical line + dot */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: i * 0.12, ease }}
          className="relative z-10 size-3 rounded-full flex-shrink-0 mt-1"
          style={{
            background: "linear-gradient(135deg, #6EE7FF, #8B7CFF)",
            boxShadow: "0 0 12px rgba(110,231,255,0.5)",
          }}
        >
          <CircleDot className="size-3 text-transparent absolute inset-0" />
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12 + 0.2, ease }}
            className="origin-top mt-1 flex-1 w-px"
            style={{
              background: "linear-gradient(to bottom, rgba(110,231,255,0.3), transparent)",
              minHeight: 40,
            }}
          />
        )}
      </div>

      {/* Right: content */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: i * 0.12, ease }}
        className="pb-8 flex-1"
      >
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-widest text-[#6EE7FF] border border-[#6EE7FF]/20 bg-[#6EE7FF]/6 mb-2"
        >
          {item.year}
        </span>
        <h4 className="font-display text-[14.5px] font-semibold text-foreground">
          {item.role}
        </h4>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{item.company}</p>
      </motion.div>
    </div>
  );
}

// ─── VALUE CARD ───────────────────────────────────────────────────────────────
function ValueCard({ val, idx }: { val: (typeof VALUES)[0]; idx: number }) {
  const Icon = val.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay: idx * 0.09, ease }}
      whileHover={{ y: -3, scale: 1.02 }}
      className="group relative rounded-2xl border border-white/8 bg-card/50 backdrop-blur-sm p-5 flex flex-col gap-3 cursor-default overflow-hidden"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)" }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          boxShadow: `0 0 30px ${val.color}14, inset 0 0 20px ${val.color}06`,
          border: `1px solid ${val.color}28`,
        }}
      />

      {/* Animated border on hover */}
      <div
        className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to right, transparent, ${val.color}50, transparent)`,
        }}
      />

      {/* Icon */}
      <div
        className="size-9 rounded-xl flex items-center justify-center"
        style={{ background: `${val.color}12`, border: `1px solid ${val.color}20` }}
      >
        <Icon className="size-4" style={{ color: val.color }} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <span
        className="font-display text-[14px] font-semibold text-foreground group-hover:transition-colors duration-300"
        style={{ transition: "color 0.3s" }}
      >
        {val.k}
      </span>

      {/* Description */}
      <p className="text-[12px] leading-relaxed text-muted-foreground">{val.v}</p>
    </motion.div>
  );
}

// ─── SOFTWARE CARD ────────────────────────────────────────────────────────────
function SoftwareCard({ tech, idx }: { tech: (typeof SOFTWARE)[0]; idx: number }) {
  return (
    <motion.div
      key={tech.name}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.1, ease }}
      whileHover={{ y: -4, scale: 1.02, borderColor: `${tech.color}50` }}
      className="group relative rounded-xl border border-white/8 bg-card/60 backdrop-blur-sm p-5 flex flex-col justify-between h-[120px] cursor-default overflow-hidden"
      style={{
        boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "all 0.35s ease",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-xl"
        style={{ boxShadow: `0 0 24px ${tech.color}10, inset 0 0 16px ${tech.color}06` }}
      />

      {/* Color dot */}
      <div
        className="size-2 rounded-full mb-1"
        style={{ background: tech.color, boxShadow: `0 0 8px ${tech.color}60` }}
      />

      <div>
        <p className="font-display text-[14px] font-semibold text-foreground">{tech.name}</p>
        <p className="mt-1 text-[11px] font-mono text-muted-foreground uppercase tracking-wider leading-tight">
          {tech.level}
        </p>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `linear-gradient(to right, transparent, ${tech.color}50, transparent)` }}
      />
    </motion.div>
  );
}

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isSectionInView = useInView(sectionRef, { once: false, margin: "100px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined" || !isSectionInView) return;
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, isSectionInView]);

  return (
    <section id="about" ref={sectionRef} className="relative scroll-mt-24 mt-10 py-8 lg:mt-24 lg:py-16">
      <div className="container-px mx-auto max-w-7xl">

        {/* ══ MOBILE ══ (hidden lg+) ══════════════════════════════════════ */}
        <div className="lg:hidden space-y-6">

          {/* Header */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8B7CFF]">philosophical spread</p>
            <h2 className="mt-1 font-display text-[26px] font-medium leading-[1.1] tracking-tighter text-foreground">
              timing isn't just edits —<br />
              <span className="text-muted-foreground font-normal italic">timing is emotion.</span>
            </h2>
          </div>

          {/* Portrait — vertical aspect (prevention from cut off) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden border border-border aspect-[3/4] w-full max-w-[340px] mx-auto"
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
              <div className="flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                </span>
                <span className="font-mono text-[9px] text-white/50 uppercase tracking-wider">Available</span>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <p className="text-[13px] leading-snug text-muted-foreground">
            Combining color grading, audio composition, and motion animation under a single DaVinci Resolve timeline — for founders, agencies and startups who want cinematic pacing with zero generic styling.
          </p>

          {/* Timeline */}
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

          {/* Editorial Values */}
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

          {/* Software */}
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

        {/* ══ DESKTOP ══ (hidden below lg) ════════════════════════════════ */}
        <div className="hidden lg:grid grid-cols-12 gap-16 items-start">

          {/* Left Column — Portrait + Timeline */}
          <div className="col-span-5 space-y-12">
            <PortraitCard mouseX={mouseX} mouseY={mouseY} />

            {/* Timeline */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-display text-[10px] uppercase tracking-[0.22em] text-[#8B7CFF] font-semibold">
                  Timeline
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-[#8B7CFF]/30 to-transparent" />
              </div>
              {TIMELINE.map((item, i) => (
                <TimelineItem key={i} item={item} i={i} isLast={i === TIMELINE.length - 1} />
              ))}
            </div>
          </div>

          {/* Right Column — Philosophy + Values + Software */}
          <div className="col-span-7 space-y-14 pl-4 text-left">

            {/* Heading */}
            <div>
              <CinematicHeading
                tagline="philosophical spread"
                text="timing isn't just edits — timing is emotion."
              />

              {/* 3 compact description blocks */}
              <div className="mt-8 space-y-4">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1, ease }}
                  className="text-[15px] leading-relaxed text-muted-foreground"
                >
                  Every great video starts with structure — not style.
                  I build cinematic timelines that combine color grading, audio finishing
                  and motion design under a single DaVinci Resolve session.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.18, ease }}
                  className="text-[15px] leading-relaxed text-muted-foreground"
                >
                  I partner with founders, creators and startups who want work that
                  captures attention, builds brand authority and converts viewers into customers.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.26, ease }}
                  className="text-[15px] leading-relaxed text-muted-foreground"
                >
                  Zero generic styling. Zero account managers.
                  Direct creative partnership from first reference to final delivery.
                </motion.p>
              </div>
            </div>

            {/* Editorial Values */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-display text-[10px] uppercase tracking-[0.22em] text-[#8B7CFF] font-semibold">
                  Editorial Values
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-[#8B7CFF]/30 to-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {VALUES.map((val, idx) => (
                  <ValueCard key={val.k} val={val} idx={idx} />
                ))}
              </div>
            </div>

            {/* Resolve Finishing */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-display text-[10px] uppercase tracking-[0.22em] text-[#8B7CFF] font-semibold">
                  Resolve Finishing
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-[#8B7CFF]/30 to-transparent" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {SOFTWARE.map((tech, idx) => (
                  <SoftwareCard key={tech.name} tech={tech} idx={idx} />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
