import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";

export function BackgroundCanvas() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Mouse coordinate tracking for spring-damped parallax offsets
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springMouseX = useSpring(mouseX, { stiffness: 45, damping: 24 });
  const springMouseY = useSpring(mouseY, { stiffness: 45, damping: 24 });

  // Scroll tracking values using Framer Motion
  const { scrollYProgress } = useScroll();

  // Scroll reaction: Subtle vertical shift of the giant Aurora and perspective grid
  const auroraScrollY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const springAuroraY = useSpring(auroraScrollY, { stiffness: 50, damping: 22 });

  const gridScrollY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const springGridY = useSpring(gridScrollY, { stiffness: 50, damping: 22 });

  // Mouse drift mapping offsets (subtle: max 12px translation in either direction)
  const mouseMoveX = useTransform(springMouseX, [0, 1], [-12, 12]);
  const mouseMoveY = useTransform(springMouseY, [0, 1], [-12, 12]);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    // Monitor theme changes on documentElement class
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX / innerWidth);
      mouseY.set(e.clientY / innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Accessibility reduced motion check
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Single global color system (no section-specific variations or restarts)
  // Soft Cyan: #73E8FF, Soft Purple: #9B8CFF, White highlights.
  const gradientStyles = isDark 
    ? {
        background: `
          radial-gradient(circle at 35% 30%, rgba(115, 232, 255, 0.12) 0%, transparent 60%),
          radial-gradient(circle at 65% 70%, rgba(155, 140, 255, 0.10) 0%, transparent 65%),
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 40%)
        `
      }
    : {
        background: `
          radial-gradient(circle at 35% 30%, rgba(2, 132, 199, 0.05) 0%, transparent 60%),
          radial-gradient(circle at 65% 70%, rgba(124, 58, 237, 0.04) 0%, transparent 65%),
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.015) 0%, transparent 40%)
        `
      };

  if (prefersReducedMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 -z-50 size-full overflow-hidden bg-background">
        {/* Layer 2: Ambient Aurora Static */}
        <div 
          className="absolute inset-[-10%] opacity-90"
          style={gradientStyles}
        />
        {/* Layer 6: Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(5,5,5,0.25)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_40%,rgba(5,5,5,0.45)_100%)]" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-50 size-full overflow-hidden bg-background transition-colors duration-1000">
      
      {/* LAYER 02 & 03: Giant Animated Aurora & Mesh Lighting (Continuous Flow) */}
      {mounted && (
        <motion.div
          style={{
            y: springAuroraY,
            x: mouseMoveX,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-[-40%] flex items-center justify-center will-change-transform"
        >
          {/* 2500px x 2500px Giant Aurora Flowing Light Field */}
          <div
            className="w-[2500px] h-[2500px] rounded-full opacity-[0.95] filter blur-[220px] mix-blend-screen dark:mix-blend-plus-lighter animate-[aurora-flow_105s_linear_infinite] will-change-transform"
            style={{
              ...gradientStyles,
              transition: "background 1.5s ease-in-out",
            }}
          />
        </motion.div>
      )}

      {/* LAYER 04: Perspective 3D Grid (linked to scroll parallax) */}
      <motion.div 
        style={{ y: springGridY }}
        className="absolute inset-0 opacity-[0.015] pointer-events-none origin-bottom will-change-transform"
      >
        <div 
          className="w-full h-[220vh] bg-repeat transition-colors duration-1000"
          style={{
            backgroundImage: isDark
              ? `
                linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
              `
              : `
                linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)
              `,
            backgroundSize: "90px 90px",
            transform: "perspective(1000px) rotateX(72deg) scale(1.6) translateY(-5%)",
            maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 65%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 65%)",
          }}
        />
      </motion.div>

      {/* LAYER 05: Animated Film Grain Overlay (2% opacity) */}
      <div 
        className="absolute inset-[-100%] opacity-[0.02] mix-blend-overlay bg-repeat pointer-events-none will-change-transform animate-[grain_8s_steps(10)_infinite]"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23noise)'/></svg>")`,
        }}
      />

      {/* Edge Vignette overlay (center highlight focus) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(5,5,5,0.18)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_40%,rgba(5,5,5,0.45)_100%)] transition-colors duration-1000" />
      
      {/* Global Grain and Aurora Keyframes */}
      <style>{`
        @keyframes grain {
          0%, 100% { transform:translate(0, 0) }
          10% { transform:translate(-1%, -1%) }
          20% { transform:translate(-2%, 1%) }
          30% { transform:translate(1%, -2%) }
          40% { transform:translate(-1%, 3%) }
          50% { transform:translate(-2%, 1%) }
          60% { transform:translate(3%, -1%) }
          70% { transform:translate(2%, 1%) }
          80% { transform:translate(-3%, -1%) }
          90% { transform:translate(1%, 2%) }
        }
        @keyframes aurora-flow {
          0% { transform: rotate(0deg) scale(1) translate(-2%, -2%); }
          50% { transform: rotate(180deg) scale(1.05) translate(2%, 2%); }
          100% { transform: rotate(360deg) scale(1) translate(-2%, -2%); }
        }
      `}</style>
    </div>
  );
}
