import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type CursorType = "default" | "link" | "button" | "video" | "image" | "text";

export function CustomCursor() {
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [isVisible, setIsVisible] = useState(false);

  // Position trackers
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring configurations for smooth interpolation
  const springConfig = { damping: 32, stiffness: 260, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable custom cursor on mobile touch screens or if reduced motion is requested
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReducedMotion) {
      return;
    }

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const closestLink = target.closest("a, [role='link']");
      const closestButton = target.closest("button, [role='button']");
      const closestVideoContainer = target.closest("[data-cursor='video']");
      const closestImageContainer = target.closest("[data-cursor='image']");
      const closestTextContainer = target.closest("p, h1, h2, h3, blockquote, li");

      if (closestVideoContainer) {
        setCursorType("video");
      } else if (closestImageContainer) {
        setCursorType("image");
      } else if (closestButton) {
        setCursorType("button");
      } else if (closestLink) {
        setCursorType("link");
      } else if (closestTextContainer) {
        setCursorType("text");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  // Outer Ring Variants
  const ringVariants = {
    default: {
      width: 18,
      height: 18,
      backgroundColor: "var(--cursor-bg)",
      backdropFilter: "blur(1.5px)",
      border: "1.2px solid var(--cursor-border)",
      borderRadius: "50%",
      x: -9,
      y: -9,
    },
    link: {
      width: 38,
      height: 38,
      backgroundColor: "var(--cursor-bg)",
      backdropFilter: "blur(2px)",
      border: "1.5px solid var(--color-accent)",
      borderRadius: "50%",
      x: -19,
      y: -19,
    },
    button: {
      width: 42,
      height: 42,
      backgroundColor: "var(--cursor-bg)",
      backdropFilter: "blur(2.5px)",
      border: "1.5px solid var(--color-accent)",
      borderRadius: "50%",
      x: -21,
      y: -21,
    },
    video: {
      width: 18,
      height: 18,
      backgroundColor: "var(--cursor-bg)",
      backdropFilter: "blur(1.5px)",
      border: "1.2px solid var(--cursor-border)",
      borderRadius: "50%",
      x: -9,
      y: -9,
    },
    image: {
      width: 64,
      height: 64,
      backgroundColor: "var(--cursor-bg)",
      backdropFilter: "blur(2px)",
      border: "1.5px solid var(--color-accent)",
      borderRadius: "50%",
      x: -32,
      y: -32,
    },
    text: {
      width: 0,
      height: 0,
      border: "none",
      x: 0,
      y: 0,
    },
  };

  // Inner Dot Variants
  const dotVariants = {
    default: {
      width: 4,
      height: 4,
      borderRadius: "50%",
      backgroundColor: "var(--cursor-dot)",
      opacity: 1,
    },
    link: {
      width: 0,
      height: 0,
      opacity: 0,
    },
    button: {
      width: 0,
      height: 0,
      opacity: 0,
    },
    video: {
      width: 4,
      height: 4,
      borderRadius: "50%",
      backgroundColor: "var(--cursor-dot)",
      opacity: 1,
    },
    image: {
      width: 0,
      height: 0,
      opacity: 0,
    },
    text: {
      width: 1.5,
      height: 15,
      borderRadius: 1,
      backgroundColor: "var(--color-accent)",
      opacity: 1,
    },
  };

  return (
    <>
      {/* Outer Spring Ring */}
      <motion.div
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
        }}
        variants={ringVariants}
        animate={cursorType}
        transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.7 }}
        className="hidden md:flex items-center justify-center overflow-hidden"
      >

        {cursorType === "image" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-[9px] font-bold tracking-widest text-[var(--color-accent)] uppercase"
          >
            View
          </motion.span>
        )}
      </motion.div>

      {/* Inner Dot tracking perfectly */}
      <motion.div
        style={{
          position: "fixed",
          left: mouseX,
          top: mouseY,
          pointerEvents: "none",
          zIndex: 10000,
          transform: "translate(-50%, -50%)",
          transformOrigin: "center center",
        }}
        variants={dotVariants}
        animate={cursorType}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="hidden md:block"
      />
    </>
  );
}
