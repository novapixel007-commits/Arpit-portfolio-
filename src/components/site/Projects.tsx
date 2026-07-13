import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "motion/react";
import { Play, ArrowUpRight, Film } from "lucide-react";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { PROJECTS, type Project } from "@/data/projects";

// Extract YouTube ID safely
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// Year, Duration, Role mapping for projects
const PROJECT_METADATA: Record<
  number,
  { year: string; duration: string; role: string }
> = {
  7: { year: "2024", duration: "0:45", role: "Motion Designer" },
  2: { year: "2023", duration: "0:58", role: "Senior Editor" },
  3: { year: "2023", duration: "1:15", role: "Lead Editor" },
  4: { year: "2024", duration: "1:30", role: "Fusion Compositor" },
  5: { year: "2024", duration: "0:52", role: "Lead Editor" },
  1: { year: "2023", duration: "1:05", role: "Senior Editor" },
};

// ─── HERO PROJECT (HORIZONTAL CARD) ───────────────────────────────────────────
const HeroProjectCard = memo(function HeroProjectCard({
  project,
  isPlaying,
  onPlay,
  onClosePlay,
  onHover,
  prefersReducedMotion,
}: {
  project: Project;
  isPlaying: boolean;
  onPlay: () => void;
  onClosePlay: () => void;
  onHover: (hovering: boolean) => void;
  prefersReducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isCardInView = useInView(cardRef, { once: false, margin: "-100px" });

  const youtubeId = project.video ? getYouTubeId(project.video) : null;
  const isYouTube = Boolean(youtubeId);
  const meta = PROJECT_METADATA[project.id] || {
    year: "2024",
    duration: "1:00",
    role: "Editor",
  };

  const thumbnailSrc = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : project.thumbnail ?? project.image;

  // Auto-pause video when scrolled out of viewport
  useEffect(() => {
    if (!isCardInView && isPlaying) {
      onClosePlay();
    }
  }, [isCardInView, isPlaying, onClosePlay]);

  return (
    <motion.div
      ref={cardRef}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="w-full"
    >
      <div
        className="group relative rounded-[2rem] border border-white/8 bg-card/30 overflow-hidden cursor-none select-none transition-all duration-400 hover:border-white/20 hover:shadow-lg aspect-[16/9] w-full h-auto"
      >
        {/* Shine reflection sweep — disabled in prefersReducedMotion */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent rotate-[20deg] translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
          </div>
        )}

        {/* Video / Thumbnail container */}
        <div className="absolute inset-0 size-full bg-black">
          {(!isPlaying || !isYouTube) && thumbnailSrc && (
            <img
              src={thumbnailSrc}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          )}

          {/* Mount video element only when card is in view to avoid CPU decoding loads offscreen */}
          {isCardInView && !isYouTube && (
            <video
              src={project.video}
              poster={thumbnailSrc}
              controls={isPlaying}
              loop
              playsInline
              muted
              autoPlay={isPlaying}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
                isPlaying ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Mount YouTube iframe only when card is visible and actively playing */}
          {isCardInView && isYouTube && isPlaying && (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0&fs=1&iv_load_policy=3&cc_load_policy=0&disablekb=0`}
              className="absolute pointer-events-none"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              style={{
                border: "none",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: "0",
                left: "0",
              }}
              title={project.title}
              loading="lazy"
            />
          )}

          {/* Bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10" />
        </div>

        {/* Play trigger overlay */}
        {!isPlaying && (
          <button
            onClick={onPlay}
            aria-label={`Play ${project.title}`}
            className="absolute inset-0 size-full flex items-center justify-center z-30 cursor-none"
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0.9 } : { scale: 0.9, opacity: 0 }}
              whileHover={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
              className="px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center gap-2.5 transition-all duration-300 shadow-md group-hover:scale-105"
            >
              <div className="size-6 rounded-full bg-white flex items-center justify-center">
                <Play className="size-3 fill-black text-black translate-x-[0.5px]" />
              </div>
              <span className="text-white text-[12px] font-semibold uppercase tracking-wider">
                View Case Study
              </span>
            </motion.div>
          </button>
        )}

        {/* Details Overlay */}
        <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 z-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 pointer-events-none">
          <div className="text-left space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#6EE7FF] bg-[#6EE7FF]/10 border border-[#6EE7FF]/20">
              <Film className="size-3" />
              {project.category}
            </span>
            <h3 className="font-display font-bold text-[24px] lg:text-[2.2rem] text-white leading-tight tracking-tight">
              {project.title}
            </h3>
            
            <div className="flex items-center gap-6 pt-1 text-white/50 text-[11px] font-mono">
              <div>
                <span className="text-white/30 mr-1.5">YEAR:</span>
                <span className="text-white/80">{meta.year}</span>
              </div>
              <div>
                <span className="text-white/30 mr-1.5">LENGTH:</span>
                <span className="text-white/80">{meta.duration}</span>
              </div>
              <div>
                <span className="text-white/30 mr-1.5">ROLE:</span>
                <span className="text-white/80 uppercase">{meta.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/70 font-mono text-[12px] uppercase tracking-wider self-start lg:self-auto group-hover:text-white transition-colors duration-300">
            <span>View Project</span>
            <ArrowUpRight className="size-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ─── SUPPORTING PROJECT (VERTICAL CARD) ───────────────────────────────────────
const VerticalProjectCard = memo(function VerticalProjectCard({
  project,
  isPlaying,
  onPlay,
  onClosePlay,
  onHover,
  prefersReducedMotion,
}: {
  project: Project;
  isPlaying: boolean;
  onPlay: () => void;
  onClosePlay: () => void;
  onHover: (hovering: boolean) => void;
  prefersReducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isCardInView = useInView(cardRef, { once: false, margin: "-100px" });

  const youtubeId = project.video ? getYouTubeId(project.video) : null;
  const isYouTube = Boolean(youtubeId);
  const meta = PROJECT_METADATA[project.id] || {
    year: "2024",
    duration: "1:00",
    role: "Editor",
  };

  const thumbnailSrc = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : project.thumbnail ?? project.image;

  // Auto-pause video when scrolled out of view
  useEffect(() => {
    if (!isCardInView && isPlaying) {
      onClosePlay();
    }
  }, [isCardInView, isPlaying, onClosePlay]);

  return (
    <motion.div
      ref={cardRef}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="w-full"
    >
      <div
        className="group relative rounded-[2rem] border border-white/8 bg-card/30 overflow-hidden cursor-none select-none transition-all duration-400 hover:border-white/20 hover:shadow-lg aspect-[9/16] w-full h-auto"
      >
        {/* Media */}
        <div className="absolute inset-0 size-full bg-black">
          {(!isPlaying || !isYouTube) && thumbnailSrc && (
            <img
              src={thumbnailSrc}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] group-hover:brightness-90"
            />
          )}

          {/* Mount video element only when card is in view to avoid CPU decoding loads offscreen */}
          {isCardInView && !isYouTube && (
            <video
              src={project.video}
              poster={thumbnailSrc}
              controls={isPlaying}
              loop
              playsInline
              muted
              autoPlay={isPlaying}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
                isPlaying ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Mount YouTube iframe only when card is visible and actively playing */}
          {isCardInView && isYouTube && isPlaying && (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0&fs=1&iv_load_policy=3&cc_load_policy=0&disablekb=0`}
              className="absolute pointer-events-none"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              style={{
                border: "none",
                width: "316.5%",
                height: "100%",
                position: "absolute",
                top: "0",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              title={project.title}
              loading="lazy"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none z-10" />
        </div>

        {/* Play Icon Fade In */}
        {!isPlaying && (
          <button
            onClick={onPlay}
            aria-label={`Play ${project.title}`}
            className="absolute inset-0 size-full flex items-center justify-center z-30 cursor-none"
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0.9 } : { scale: 0.8, opacity: 0 }}
              whileHover={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
              className="size-14 rounded-full bg-white/10 border border-white/25 backdrop-blur-md flex items-center justify-center shadow-md transition-all duration-300"
            >
              <Play className="size-5 fill-white text-white translate-x-[1px]" />
            </motion.div>
          </button>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col items-start gap-1 text-left pointer-events-none">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#8B7CFF]">
            {project.category} · {meta.role}
          </span>
          <h3 className="font-display font-semibold text-[19px] text-white leading-tight transition-transform duration-300 group-hover:-translate-y-1">
            {project.title}
          </h3>
          <div className="flex items-center gap-1.5 text-white/50 text-[10.5px] font-mono mt-1">
            <span>{meta.duration}</span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <span>View Project</span>
              <ArrowUpRight className="size-3" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ─── PROJECTS SECTION ─────────────────────────────────────────────────────────
export function Projects() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [cursorState, setCursorState] = useState<"hidden" | "active">("hidden");

  const sectionRef = useRef<HTMLDivElement>(null);
  const isSectionInView = useInView(sectionRef, { once: false, margin: "100px" });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // High performance spring parameters
  const springCursorX = useSpring(cursorX, { stiffness: 500, damping: 35 });
  const springCursorY = useSpring(cursorY, { stiffness: 500, damping: 35 });

  // Only listen to mouse movements when the section is visible to avoid rendering updates offscreen
  useEffect(() => {
    if (typeof window === "undefined" || !isSectionInView || prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY, isSectionInView, prefersReducedMotion]);

  const handleClosePlay = useCallback((id: number) => {
    setPlayingId((current) => (current === id ? null : current));
  }, []);

  // Order of projects
  const hero1 = PROJECTS[0];
  const pair1_left = PROJECTS[1];
  const pair1_right = PROJECTS[2];
  const hero2 = PROJECTS[3];
  const pair2_left = PROJECTS[4];
  const pair2_right = PROJECTS[5];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative mt-8 py-4 lg:mt-16 scroll-mt-24 overflow-hidden"
    >
      {/* ── SECTION BACKDROP ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Floating gradient lights (Static on prefers-reduced-motion to avoid repaint overhead) */}
        {!prefersReducedMotion && (
          <>
            <motion.div
              animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[25%] left-[-15%] w-[65%] h-[55%] rounded-full opacity-[0.04]"
              style={{
                background: "radial-gradient(circle, #6EE7FF 0%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />
            <motion.div
              animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 4 }}
              className="absolute bottom-[25%] right-[-15%] w-[65%] h-[55%] rounded-full opacity-[0.04]"
              style={{
                background: "radial-gradient(circle, #8B7CFF 0%, transparent 70%)",
                filter: "blur(90px)",
              }}
            />
          </>
        )}

        {/* Subtle static grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "160px",
          }}
        />

        {/* Static decorative particles */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute top-[18%] left-[25%] size-1 rounded-full bg-[#6EE7FF]" />
          <div className="absolute top-[48%] left-[75%] size-1 rounded-full bg-[#8B7CFF]" />
          <div className="absolute top-[78%] left-[18%] size-1 rounded-full bg-[#6EE7FF]" />
        </div>
      </div>

      {/* ── CUSTOM MAGNETIC PLAY CURSOR ── */}
      {/* Optimized: Replace backdrop-filter with static high opacity bg to avoid massive repaint workloads on mouseMove */}
      <motion.div
        style={{
          x: springCursorX,
          y: springCursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: cursorState === "active" && !prefersReducedMotion ? 1 : 0,
          opacity: cursorState === "active" && !prefersReducedMotion ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="hidden lg:flex fixed pointer-events-none rounded-full bg-black/90 border border-[#6EE7FF]/30 size-14 items-center justify-center text-[10px] font-mono uppercase tracking-wider text-white mix-blend-difference z-50 shadow-md"
      >
        <span className="font-semibold tracking-wider text-[#6EE7FF]">Play</span>
      </motion.div>

      <div className="container-px mx-auto max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="pb-4 mb-8 lg:pb-8 lg:mb-12 border-b border-border text-left">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6EE7FF] mb-1">
            selected work
          </p>
          <h2 className="font-display text-[26px] lg:text-[2.6rem] font-bold leading-tight tracking-tighter text-foreground">
            Featured Projects
          </h2>
        </div>

        {/* ── PROJECTS WORKFLOW ── */}
        <div className="flex flex-col gap-[60px]">
          
          {/* Row 1: Hero Project (Horizontal) */}
          <HeroProjectCard
            project={hero1}
            isPlaying={playingId === hero1.id}
            onPlay={() => setPlayingId(hero1.id)}
            onClosePlay={() => handleClosePlay(hero1.id)}
            onHover={(h) => setCursorState(h ? "active" : "hidden")}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* Row 2: 2 Supporting Projects (Vertical Side by Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <VerticalProjectCard
              project={pair1_left}
              isPlaying={playingId === pair1_left.id}
              onPlay={() => setPlayingId(pair1_left.id)}
              onClosePlay={() => handleClosePlay(pair1_left.id)}
              onHover={(h) => setCursorState(h ? "active" : "hidden")}
              prefersReducedMotion={prefersReducedMotion}
            />
            <VerticalProjectCard
              project={pair1_right}
              isPlaying={playingId === pair1_right.id}
              onPlay={() => setPlayingId(pair1_right.id)}
              onClosePlay={() => handleClosePlay(pair1_right.id)}
              onHover={(h) => setCursorState(h ? "active" : "hidden")}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

          {/* Row 3: Hero Project (Horizontal) */}
          <HeroProjectCard
            project={hero2}
            isPlaying={playingId === hero2.id}
            onPlay={() => setPlayingId(hero2.id)}
            onClosePlay={() => handleClosePlay(hero2.id)}
            onHover={(h) => setCursorState(h ? "active" : "hidden")}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* Row 4: 2 Supporting Projects (Vertical Side by Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <VerticalProjectCard
              project={pair2_left}
              isPlaying={playingId === pair2_left.id}
              onPlay={() => setPlayingId(pair2_left.id)}
              onClosePlay={() => handleClosePlay(pair2_left.id)}
              onHover={(h) => setCursorState(h ? "active" : "hidden")}
              prefersReducedMotion={prefersReducedMotion}
            />
            <VerticalProjectCard
              project={pair2_right}
              isPlaying={playingId === pair2_right.id}
              onPlay={() => setPlayingId(pair2_right.id)}
              onClosePlay={() => handleClosePlay(pair2_right.id)}
              onHover={(h) => setCursorState(h ? "active" : "hidden")}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
