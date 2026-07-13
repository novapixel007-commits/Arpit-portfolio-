import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useState } from "react";
import { PROJECTS, type Project } from "@/data/projects";
import { CinematicHeading } from "./CinematicHeading";

// Extract YouTube video ID from various YouTube URL formats
// Handles: watch?v=, embed/, shorts/, youtu.be/
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
}

function ProjectCard({ project, index, isPlaying, onPlay }: ProjectCardProps) {
  const isHorizontal = project.orientation === "horizontal";

  // Varied entries on scroll
  const yOffset = index % 2 === 0 ? 40 : 80;
  const transitionDelay = (index % 3) * 0.15;

  const youtubeId = project.video ? getYouTubeId(project.video) : null;
  const isYouTube = Boolean(youtubeId);

  // Thumbnail: always use YouTube's image for YT videos
  const thumbnailSrc = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : (project.thumbnail ?? project.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay: transitionDelay, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col select-none ${
        isHorizontal 
          ? "w-full col-span-1 md:col-span-2" 
          : "w-full col-span-1 mx-auto md:mx-0"
      }`}
    >
      {/* Video frame — zero text overlays inside */}
      <div
        className={`relative overflow-hidden rounded-[1.75rem] border border-border/80
          bg-card shadow-soft
          transition-all duration-300 ease-out
          hover:translate-y-[-3px]
          hover:border-white/20
          hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]
          ${isHorizontal ? "aspect-[16/9]" : "aspect-[9/14] md:aspect-[9/13]"}
        `}
      >
        {/* Glass reflection sweep on hover */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[1.75rem]">
          <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent rotate-[25deg] translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-700 ease-out" />
        </div>

        {/* Media area */}
        <div className="absolute inset-0 size-full bg-black">
          {/* Thumbnail — shown before play, hidden after for YT */}
          {(!isPlaying || !isYouTube) && thumbnailSrc && (
            <img
              src={thumbnailSrc}
              alt={project.title}
              className={`absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
                isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />
          )}

          {/* Non-YouTube video */}
          {!isYouTube && (
            <video
              src={project.video}
              poster={thumbnailSrc}
              controls={isPlaying}
              loop
              playsInline
              autoPlay={isPlaying}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
                isPlaying ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* YouTube iframe — lazy, created only after click */}
          {isYouTube && isPlaying && (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1&controls=1&modestbranding=1&rel=0&fs=1&iv_load_policy=3&cc_load_policy=0&disablekb=0`}
              className="absolute inset-0 size-full"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              style={{ border: "none" }}
              title={project.title}
              loading="lazy"
            />
          )}

          {/* Subtle bottom vignette before play only */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none z-10" />
          )}
        </div>

        {/* Small static play button — hides once playing */}
        {!isPlaying && (
          <button
            onClick={onPlay}
            aria-label={`Play ${project.title}`}
            className="absolute inset-0 size-full flex items-center justify-center z-30 cursor-pointer"
          >
            <span
              className="
                grid size-11 place-items-center rounded-full
                bg-white/10 backdrop-blur-md
                border border-white/25
                shadow-[0_4px_24px_rgba(0,0,0,0.4)]
                transition-all duration-300 ease-out
                group-hover:bg-white/18
                group-hover:scale-110
                group-hover:border-white/40
              "
            >
              <Play className="size-4 fill-white text-white translate-x-[1px]" />
            </span>
          </button>
        )}
      </div>

      {/* Editorial label below — category + title only, no overlays */}
      <div className="mt-4 pl-1">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/70">
          {project.category}
        </p>
        <h3 className="mt-1.5 font-display text-[15px] md:text-[17px] font-medium tracking-tight text-foreground leading-snug">
          {project.title}
        </h3>
      </div>
    </motion.div>
  );
}

export function Projects() {
  // Shared playing state — only one video plays at a time
  const [playingId, setPlayingId] = useState<number | null>(null);

  return (
    <section id="work" className="relative mt-6 py-8 lg:mt-24 lg:py-20 scroll-mt-24 md:mt-36">
      <div className="container-px mx-auto max-w-7xl">
        {/* Magazine Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-4 lg:gap-8 items-end border-b border-border pb-4 mb-6 lg:pb-12 lg:mb-16">
            <CinematicHeading 
              tagline="selected films" 
              text="editorial cuts, cinematic finishing." 
            />
          <p className="text-[15px] leading-relaxed text-muted-foreground max-w-sm md:ml-auto">
            A curated showcase of commercials, talking heads, and high-impact launch sequences. Each project is crafted with storyboarded intent.
          </p>
        </div>

        {/* Asymmetric Magazine Poster Layout Grid — exactly 6 cards */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-8 lg:gap-y-14 items-start -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {/* Card 1: Horizontal */}
          <div className="w-[85vw] md:w-auto flex-none snap-center md:col-span-2">
            <ProjectCard
              project={PROJECTS[0]}
              index={0}
              isPlaying={playingId === PROJECTS[0].id}
              onPlay={() => setPlayingId(PROJECTS[0].id)}
            />
          </div>

          {/* Card 2: Vertical (offset top) */}
          <div className="w-[75vw] md:w-auto flex-none snap-center md:mt-12">
            <ProjectCard
              project={PROJECTS[1]}
              index={1}
              isPlaying={playingId === PROJECTS[1].id}
              onPlay={() => setPlayingId(PROJECTS[1].id)}
            />
          </div>

          {/* Card 3: Vertical */}
          <div className="w-[75vw] md:w-auto flex-none snap-center md:mt-0">
            <ProjectCard
              project={PROJECTS[2]}
              index={2}
              isPlaying={playingId === PROJECTS[2].id}
              onPlay={() => setPlayingId(PROJECTS[2].id)}
            />
          </div>

          {/* Card 4: Horizontal */}
          <div className="w-[85vw] md:w-auto flex-none snap-center md:col-span-2 md:py-8">
            <ProjectCard
              project={PROJECTS[3]}
              index={3}
              isPlaying={playingId === PROJECTS[3].id}
              onPlay={() => setPlayingId(PROJECTS[3].id)}
            />
          </div>

          {/* Card 5: Vertical (offset top) */}
          <div className="w-[75vw] md:w-auto flex-none snap-center md:mt-12">
            <ProjectCard
              project={PROJECTS[4]}
              index={4}
              isPlaying={playingId === PROJECTS[4].id}
              onPlay={() => setPlayingId(PROJECTS[4].id)}
            />
          </div>

          {/* Card 6: Vertical */}
          <div className="w-[75vw] md:w-auto flex-none snap-center md:mt-0">
            <ProjectCard
              project={PROJECTS[5]}
              index={5}
              isPlaying={playingId === PROJECTS[5].id}
              onPlay={() => setPlayingId(PROJECTS[5].id)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
