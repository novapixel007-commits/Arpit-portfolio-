import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";

export const PROJECTS = [
  {
    slug: "aether-brand-film",
    title: "Aether — Brand Film",
    category: "Brand Film",
    description:
      "A cinematic film capturing the founding philosophy of a wellness brand.",
    tools: ["Premiere Pro", "DaVinci Resolve", "Dehancer"],
    image: p4,
    size: "lg" as const,
  },
  {
    slug: "lumen-product-launch",
    title: "Lumen — Product Launch",
    category: "Commercial",
    description: "Luxury product film for a Series-A skincare launch in EMEA.",
    tools: ["After Effects", "Cinema 4D", "Octane"],
    image: p1,
    size: "md" as const,
  },
  {
    slug: "octave-motion-system",
    title: "Octave — Motion System",
    category: "Motion Design",
    description: "Brand motion system and 3D explorations for a music platform.",
    tools: ["After Effects", "Blender"],
    image: p2,
    size: "md" as const,
  },
  {
    slug: "northstar-saas-explainer",
    title: "Northstar — SaaS Explainer",
    category: "Product Video",
    description:
      "Crisp 60-second product walkthrough for an AI analytics platform.",
    tools: ["Figma", "After Effects", "Lottie"],
    image: p3,
    size: "lg" as const,
  },
];

function Card({
  p,
  index,
}: {
  p: (typeof PROJECTS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={p.size === "lg" ? "md:col-span-7" : "md:col-span-5"}
    >
      <Link
        to="/work/$slug"
        params={{ slug: p.slug }}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-3xl hairline bg-surface-2">
          <div className="aspect-[16/10] overflow-hidden">
            <motion.img
              src={p.image}
              alt={p.title}
              loading="lazy"
              width={1400}
              height={900}
              className="size-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
          </div>
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-end justify-between p-5 md:p-7">
            <span className="rounded-full glass-strong px-3 py-1.5 text-[11px] font-medium tracking-wide text-foreground">
              {p.category}
            </span>
            <span className="grid size-12 place-items-center rounded-full glass-strong text-foreground shadow-soft transition-all duration-500 group-hover:scale-110 group-hover:bg-foreground group-hover:text-primary-foreground">
              <Play className="size-4 fill-current" />
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4 px-1">
          <div className="min-w-0">
            <h3 className="font-display text-[20px] font-medium tracking-tight">
              {p.title}
            </h3>
            <p className="mt-1.5 text-[14px] text-muted-foreground">
              {p.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full hairline bg-surface px-2.5 py-1 text-[11px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>
      </Link>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="work" className="relative mt-32 scroll-mt-24 md:mt-48">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-4 heading-display text-balance text-4xl md:text-6xl">
              Stories shaped frame
              <br className="hidden md:block" /> by frame.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] text-muted-foreground">
            A curated set of recent projects across commercials, brand films and
            product motion. Every cut is hand-crafted.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-8 md:gap-y-16">
          {PROJECTS.map((p, i) => (
            <Card key={p.slug} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
