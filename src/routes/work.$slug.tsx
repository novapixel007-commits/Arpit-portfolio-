import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowLeft, ArrowRight, Play, Check } from "lucide-react";

import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { PROJECTS } from "@/data/projects";
import { useRef, useState } from "react";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.project.title ?? "Case Study"} — Arpit Sharma` },
      {
        name: "description",
        content: loaderData?.project.description ?? "Case Study",
      },
      { property: "og:title", content: loaderData?.project.title ?? "Case Study" },
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

function CaseStudy() {
  const { project } = Route.useLoaderData();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Find next project in sequence
  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  // Scroll parallax for video player element
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const videoScale = useSpring(useTransform(scrollYProgress, [0, 0.5], [0.95, 1.0]), { stiffness: 80, damping: 20 });

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    }
  };

  return (
    <div className="noise min-h-screen">
      <ScrollProgress />

      <article className="pb-24 pt-32 md:pt-40 text-left">
        <div className="container-px mx-auto max-w-5xl">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition hover:text-foreground group"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" /> back to showcase
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <span className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[11px] text-[#6EE7FF] uppercase tracking-widest font-mono">
              {project.category}
            </span>
            <h1 className="mt-6 heading-display text-balance text-5xl md:text-7xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </motion.div>

          {/* Main Cinematic Video Player with scroll parallax scale */}
          <motion.div
            ref={containerRef}
            style={{ scale: videoScale }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative mt-12 overflow-hidden rounded-[2.5rem] border border-border bg-surface shadow-float will-change-transform"
            data-cursor="video"
          >
            <div className="aspect-[16/9] w-full bg-black relative flex items-center justify-center">
              <video
                ref={videoRef}
                src={project.video}
                poster={project.image}
                controls={isPlaying}
                loop
                playsInline
                className="size-full object-contain"
              />
              
              {!isPlaying && (
                <button
                  onClick={handlePlayClick}
                  aria-label="Play video"
                  className="absolute inset-0 size-full flex items-center justify-center bg-black/35 hover:bg-black/45 transition-colors duration-300"
                >
                  <span className="grid size-20 place-items-center rounded-full bg-card/90 backdrop-blur-md border border-border shadow-float transition hover:scale-105">
                    <Play className="size-6 text-[#6EE7FF] fill-current ml-1" />
                  </span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Metadata Grid */}
          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-border py-10 md:grid-cols-4">
            <Meta k="Role" v={project.role} />
            <Meta k="Category" v={project.category} />
            <Meta k="Year" v="2025" />
            <Meta k="Software" v={project.software.join(", ")} />
          </div>

          {/* Detailed Editorial Sections */}
          <div className="mt-20 space-y-16">
            {/* Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2.2fr] md:gap-12"
            >
              <div>
                <span className="font-mono text-[11px] text-[#8B7CFF] uppercase tracking-widest">[ 01 ]</span>
                <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
                  The Challenge
                </h2>
              </div>
              <p className="text-[15.5px] leading-relaxed text-muted-foreground">
                {project.challenge}
              </p>
            </motion.div>

            {/* Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2.2fr] md:gap-12"
            >
              <div>
                <span className="font-mono text-[11px] text-[#8B7CFF] uppercase tracking-widest">[ 02 ]</span>
                <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
                  Creative Process
                </h2>
              </div>
              <div className="space-y-6">
                {project.process.map((p, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <span className="font-mono text-[11.5px] text-[#6EE7FF] mt-0.5">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                    <div>
                      <h4 className="font-display text-[15px] font-semibold text-foreground">
                        {p.step}
                      </h4>
                      <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                        {p.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Result */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2.2fr] md:gap-12"
            >
              <div>
                <span className="font-mono text-[11px] text-[#8B7CFF] uppercase tracking-widest">[ 03 ]</span>
                <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
                  The Result
                </h2>
              </div>
              <div className="flex gap-3 items-start">
                <div className="size-7 rounded-full bg-[#6EE7FF]/10 flex items-center justify-center text-[#6EE7FF] shrink-0 mt-0.5">
                  <Check className="size-4" strokeWidth={2.5} />
                </div>
                <p className="text-[15.5px] leading-relaxed text-muted-foreground">
                  {project.result}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Gallery Spread with Image Cursor Morph triggers */}
          <div className="mt-24">
            <span className="block text-[10px] uppercase tracking-widest text-[#8B7CFF] font-mono mb-6 text-center">
              Detail Frames
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.gallery.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  data-cursor="image"
                  className="overflow-hidden rounded-2xl border border-border bg-surface cursor-none group"
                >
                  <img src={src} alt="Detail Frame" className="aspect-square size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Next Project Magazine Banner */}
          <div className="mt-28 border-t border-border pt-16">
            <Link
              to="/work/$slug"
              params={{ slug: nextProject.slug }}
              className="group block relative overflow-hidden rounded-[2rem] border border-border bg-card p-10 md:p-14 hover:shadow-soft transition-all duration-300"
            >
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <span className="eyebrow text-[#8B7CFF]">Next Case Study</span>
                  <h3 className="mt-3 font-display text-3xl md:text-5xl font-medium tracking-tight text-foreground transition-colors group-hover:text-[#6EE7FF]">
                    {nextProject.title}
                  </h3>
                  <p className="mt-3 text-[14px] text-muted-foreground max-w-md">
                    {nextProject.description}
                  </p>
                </div>
                <div className="inline-flex size-14 items-center justify-center rounded-full border border-border bg-surface text-foreground transition duration-300 group-hover:scale-105 group-hover:bg-[#6EE7FF] group-hover:text-background shrink-0 self-start md:self-center">
                  <ArrowRight className="size-6" />
                </div>
              </div>
            </Link>
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
      <div className="text-[10px] font-mono uppercase tracking-widest text-[#8B7CFF]">
        {k}
      </div>
      <div className="mt-2.5 text-[14px] font-semibold text-foreground">{v}</div>
    </div>
  );
}
