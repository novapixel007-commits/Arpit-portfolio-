import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { PROJECTS } from "@/components/site/Projects";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.project.title ?? "Case study"} — Vision Studio` },
      {
        name: "description",
        content: loaderData?.project.description ?? "Case study",
      },
      { property: "og:title", content: loaderData?.project.title ?? "Case study" },
      { property: "og:description", content: loaderData?.project.description ?? "" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: CaseStudy,
  notFoundComponent: () => (
    <div className="container-px mx-auto max-w-3xl py-40 text-center">
      <p className="eyebrow">Not found</p>
      <h1 className="mt-4 heading-display text-5xl">Case study unavailable.</h1>
      <Link to="/" className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm text-primary-foreground">
        Back home
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-px mx-auto max-w-3xl py-40 text-center">
      <h1 className="heading-display text-3xl">Couldn't load this case study.</h1>
      <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

const SECTIONS = [
  { k: "Overview", v: "A multi-channel campaign anchored by a 90-second hero film and a system of social cutdowns." },
  { k: "Problem", v: "The launch story was strong on paper but flat in motion — pacing, sound and color all needed reframing." },
  { k: "Solution", v: "We rebuilt the edit around a single emotional beat, designed a calmer motion system, and graded for a premium feel." },
  { k: "Creative process", v: "Reference research, mood reels, frame-accurate storyboards, and two structured review rounds." },
  { k: "Storyboarding", v: "Each beat sketched and timed before shoot day — the edit was 80% solved before the first cut." },
  { k: "Editing", v: "Story-first structure, deliberate pacing, generous silences where the visuals carry the moment." },
  { k: "Color grading", v: "Cinematic LUT base, hand-rolled per-shot grade, and film emulation for grain and halation." },
  { k: "Sound design", v: "Custom sound design, original score collaboration and meticulous foley to add dimensionality." },
  { k: "Final result", v: "+38% landing-page conversion within two weeks of launch. Picked up by three industry publications." },
];

function CaseStudy() {
  const { project } = Route.useLoaderData();

  return (
    <div className="noise min-h-screen bg-background">
      <ScrollProgress />
      <Navbar />

      <article className="pb-24 pt-32 md:pt-40">
        <div className="container-px mx-auto max-w-5xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Back to work
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <span className="rounded-full hairline bg-surface px-3 py-1 text-[12px] text-muted-foreground">
              {project.category}
            </span>
            <h1 className="mt-5 heading-display text-balance text-5xl md:text-7xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative mt-12 overflow-hidden rounded-[2rem] hairline bg-surface-2 shadow-float"
          >
            <div className="aspect-[16/9]">
              <img
                src={project.image}
                alt={project.title}
                width={1600}
                height={900}
                className="size-full object-cover"
              />
            </div>
            <button
              aria-label="Play case study reel"
              className="absolute inset-0 grid place-items-center"
            >
              <span className="grid size-20 place-items-center rounded-full glass-strong shadow-float transition hover:scale-105">
                <Play className="size-7 fill-current" />
              </span>
            </button>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-hairline py-10 md:grid-cols-4">
            <Meta k="Client" v={project.title.split(" — ")[0]} />
            <Meta k="Category" v={project.category} />
            <Meta k="Year" v="2025" />
            <Meta k="Stack" v={project.tools.join(", ")} />
          </div>

          <div className="mt-20 space-y-16">
            {SECTIONS.map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr] md:gap-12"
              >
                <div>
                  <span className="font-mono text-[12px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
                    {s.k}
                  </h2>
                </div>
                <p className="text-[16px] leading-relaxed text-muted-foreground">
                  {s.v}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-2 gap-3 md:grid-cols-3">
            {[project.image, project.image, project.image].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="overflow-hidden rounded-2xl hairline bg-surface-2"
              >
                <img src={src} alt="" className="aspect-square size-full object-cover" />
              </motion.div>
            ))}
          </div>

          <div className="mt-20 rounded-[2rem] hairline bg-surface p-8 md:p-12">
            <p className="eyebrow">Client feedback</p>
            <blockquote className="mt-5 font-display text-balance text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              "Easily the best campaign we've shipped. Every detail considered,
              every deadline met."
            </blockquote>
            <div className="mt-6 text-[13px] text-muted-foreground">
              Head of Brand — {project.title.split(" — ")[0]}
            </div>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-hairline pt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[14px] text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> All projects
            </Link>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[14px] font-medium text-primary-foreground hover:opacity-90"
            >
              Start a project <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {k}
      </div>
      <div className="mt-2 text-[14px] font-medium">{v}</div>
    </div>
  );
}
