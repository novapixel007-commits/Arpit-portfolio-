import { motion } from "motion/react";
import { useState } from "react";
import { CinematicHeading } from "./CinematicHeading";
import {
  Film,
  Sparkles,
  Scissors,
  Wand2,
  Package,
  Palette,
} from "lucide-react";

const SERVICES = [
  {
    icon: Scissors,
    number: "01",
    title: "Talking Head Editing",
    desc: "Polished, story-first cuts tailored for maximum retention, pacing and conversational flow.",
    tags: ["DaVinci Resolve", "Flow", "Retention"],
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Motion Graphics",
    desc: "Bespoke 2D/3D motion designs and interface walkthroughs built entirely in Fusion.",
    tags: ["DaVinci Fusion", "3D Nodes", "TACTILE"],
  },
  {
    icon: Film,
    number: "03",
    title: "Commercial Ads",
    desc: "High-end commercial and product editing crafted to capture brand aesthetics.",
    tags: ["Commercial", "Advertising", "Rhythm"],
  },
  {
    icon: Wand2,
    number: "04",
    title: "Brand Films",
    desc: "Cinematic, narrative-driven editing that communicates core founder and agency values.",
    tags: ["Storytelling", "Color Finish", "Audio"],
  },
  {
    icon: Package,
    number: "05",
    title: "Product Videos",
    desc: "Refined showcase videos combining clean macro tracking edits with kinetic motion.",
    tags: ["Product Spot", "Motion", "Timing"],
  },
  {
    icon: Palette,
    number: "06",
    title: "Color Grading",
    desc: "Professional color finishing, scene matching, and custom film print emulation.",
    tags: ["Color LUTs", "Grading Node", "HDR"],
  },
];

interface ServiceCardProps {
  service: (typeof SERVICES)[0];
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className="group relative h-full rounded-[2rem] p-[1.5px] overflow-hidden bg-border transition-all duration-300 w-[85vw] md:w-full flex-none snap-center"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        background: isHovering 
          ? `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, #6EE7FF 0%, #8B7CFF 50%, rgba(255,255,255,0.08) 100%)`
          : "rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="relative h-full rounded-[2rem] bg-card p-5 lg:p-8 flex flex-col justify-between overflow-hidden">
        {/* Spotlight coordinates highlight */}
        {isHovering && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-100"
            style={{
              background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(110, 231, 255, 0.08) 0%, rgba(139, 124, 255, 0.03) 50%, transparent 100%)`,
            }}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          {/* Icon container */}
          <div className="relative size-12 rounded-xl bg-surface border border-border flex items-center justify-center text-[#6EE7FF] group-hover:text-[#8B7CFF] transition-colors duration-300">
            <service.icon className="size-5" strokeWidth={1.5} />
          </div>

          {/* Index Number */}
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
            {service.number}
          </span>
        </div>

        {/* Content */}
        <div className="text-left relative z-10">
          <h3 className="font-display text-xl font-medium tracking-tight text-foreground mb-3 transition-colors duration-300 group-hover:text-[#6EE7FF]">
            {service.title}
          </h3>
          <p className="text-[13.5px] leading-relaxed text-muted-foreground mb-6">
            {service.desc}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto relative z-10">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex px-2.5 py-0.5 rounded-full border border-border bg-surface/50 text-[10px] uppercase tracking-widest text-muted-foreground font-mono transition-colors group-hover:border-[#6EE7FF]/30 group-hover:text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className="relative mt-10 lg:mt-24 scroll-mt-24">
      {/* ══════════════════
          MOBILE LAYOUT
      ══════════════════ */}
      <div className="lg:hidden container-px mx-auto">
        <div className="mb-4">
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">capabilities</p>
          <h2 className="mt-1 font-display text-[24px] font-medium leading-[1.1] tracking-tighter text-foreground">
            focused workflows,<br />premium results.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-border bg-card p-4 flex flex-col"
            >
              <div className="flex items-center justify-between mb-2">
                <service.icon className="size-4 text-[#6EE7FF]" strokeWidth={1.5} />
                <span className="font-mono text-[9px] tracking-wider text-muted-foreground">{service.number}</span>
              </div>
              <h3 className="font-display text-[13px] font-semibold text-foreground leading-tight">{service.title}</h3>
              <p className="text-[11px] leading-snug text-muted-foreground mt-1 line-clamp-3">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════
          DESKTOP LAYOUT
      ══════════════════ */}
      <div className="hidden lg:block container-px mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-border pb-12 mb-16 md:flex-row md:items-end">
          <CinematicHeading tagline="capabilities" text="focused workflows, premium results." />
          <p className="text-[15px] leading-relaxed text-muted-foreground max-w-sm md:ml-auto text-left">
            No bloated studio structures. Directly partnering with creators, agencies and brands using standard finishing technologies inside Resolve.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.number} service={service} index={index} />
          ))}
        </div>
      </div>

    </section>
  );
}
