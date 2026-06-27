import { motion } from "motion/react";
import {
  Film,
  Sparkles,
  Wand2,
  MonitorPlay,
  Bot,
  PlayCircle,
  Package,
  Youtube,
  Instagram,
  Scissors,
} from "lucide-react";

const SERVICES = [
  { icon: Film, title: "Commercial ads", desc: "Cinematic spots for brands that need to feel premium from the first frame." },
  { icon: Scissors, title: "Video editing", desc: "Story-first editorial that holds attention and serves the message." },
  { icon: Sparkles, title: "Motion design", desc: "Custom animation systems with intent and rhythm — never templated." },
  { icon: Wand2, title: "Brand videos", desc: "Films that translate values into atmosphere, pace and tone." },
  { icon: Bot, title: "AI content", desc: "Generative and hybrid pipelines used with restraint and craft." },
  { icon: PlayCircle, title: "Explainer videos", desc: "Clear product narratives for SaaS and technical audiences." },
  { icon: Package, title: "Product videos", desc: "Studio-grade product films and 3D-inspired motion." },
  { icon: Youtube, title: "YouTube editing", desc: "High-retention editing for founders and creators." },
  { icon: Instagram, title: "Instagram reels", desc: "Short-form built to feel like a campaign, not content slop." },
  { icon: MonitorPlay, title: "UI animations", desc: "Interface motion and prototypes that ship to product." },
];

export function Services() {
  return (
    <section id="services" className="relative mt-32 scroll-mt-24 md:mt-48">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">What we craft</p>
            <h2 className="mt-4 heading-display text-balance text-4xl md:text-6xl">
              A studio practice,
              <br className="hidden md:block" /> not a service menu.
            </h2>
          </div>
          <p className="max-w-md text-[15px] text-muted-foreground">
            Each engagement is treated like a small film production — strategy,
            craft and finish. Here's the range.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group rounded-3xl hairline bg-surface p-7 transition-shadow duration-500 hover:shadow-float"
            >
              <div className="flex items-center justify-between">
                <div className="grid size-11 place-items-center rounded-2xl bg-surface-2 text-foreground transition-colors duration-500 group-hover:bg-foreground group-hover:text-primary-foreground">
                  <s.icon className="size-5" strokeWidth={1.5} />
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-7 font-display text-[19px] font-medium tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
