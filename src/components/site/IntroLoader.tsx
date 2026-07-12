import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface IntroLoaderProps {
  pageRef: React.RefObject<HTMLDivElement | null>;
  onComplete: () => void;
}

export function IntroLoader({ pageRef, onComplete }: IntroLoaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const lineContainerRef = useRef<HTMLDivElement | null>(null);
  const lineFillRef = useRef<HTMLDivElement | null>(null);

  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const seen = localStorage.getItem("portfolio_intro_seen") === "true";
    setIsFirstVisit(!seen);

    // Disable full sequence if accessibility reduced motion is requested
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // 1. REPEAT VISIT or REDUCED MOTION: Fast 400ms fade transition
      if (seen || prefersReducedMotion) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            // Restore page defaults
            if (pageRef.current) {
              pageRef.current.style.clipPath = "none";
              pageRef.current.style.opacity = "1";
            }
            onComplete();
          },
        });
        return;
      }

      // 2. FIRST VISIT: Full cinematic GSAP timeline
      localStorage.setItem("portfolio_intro_seen", "true");
      
      // Ensure page container is hidden initially
      if (pageRef.current) {
        pageRef.current.style.clipPath = "circle(0% at 50% 50%)";
        pageRef.current.style.opacity = "1";
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (pageRef.current) {
            pageRef.current.style.clipPath = "none";
          }
          // Fade out loader panel completely
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete,
          });
        },
      });

      // Step 1: Complete darkness for 400ms (built into timeline start delay)
      tl.to({}, { duration: 0.4 });

      // Step 2: Tiny white dot appears in the center
      tl.fromTo(
        dotRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.75)",
        }
      );

      // Step 3: Dot expands into a thin glowing ring and pulses
      tl.to(
        dotRef.current,
        {
          width: 110,
          height: 110,
          backgroundColor: "transparent",
          border: "1.5px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 0 16px rgba(255, 255, 255, 0.15)",
          duration: 0.7,
          ease: "expo.out",
        },
        "+=0.1"
      );

      // Pulse ring once
      tl.fromTo(
        ringRef.current,
        { scale: 0.9, opacity: 0, border: "1px solid rgba(255, 255, 255, 0.4)" },
        {
          scale: 1.35,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.5"
      );

      // Step 4: Inside the ring, reveal logo text (opacity + blur)
      tl.fromTo(
        titleRef.current,
        { opacity: 0, filter: "blur(10px)", scale: 0.95 },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.8,
          ease: "power4.out",
        },
        "-=0.3"
      );

      // Step 5: Below the name, stagger reveal subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Step 6: Thin loading line appears and fills smoothly
      tl.fromTo(
        lineContainerRef.current,
        { opacity: 0, scaleX: 0.8 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.2"
      );

      tl.fromTo(
        lineFillRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power3.inOut",
        }
      );

      // Step 7 & 8: Exit & Reveal homepage via clip-path
      // Dissolve loading line
      tl.to(lineContainerRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.25,
        ease: "power2.in",
      });

      // Expand ring rapidly
      tl.to(
        dotRef.current,
        {
          width: window.innerWidth * 2,
          height: window.innerWidth * 2,
          borderWidth: "8px",
          opacity: 0,
          duration: 1.1,
          ease: "power4.inOut",
        },
        "-=0.1"
      );

      // Animate homepage clip-path reveal mask (center outward)
      tl.to(
        pageRef.current,
        {
          clipPath: "circle(150% at 50% 50%)",
          duration: 1.2,
          ease: "power4.inOut",
        },
        "-=1.1"
      );

      // Concurrently stagger inner child elements
      tl.fromTo(
        ".intro-navbar",
        { y: -32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" },
        "-=0.9"
      );

      tl.fromTo(
        ".intro-hero-text",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power4.out", stagger: 0.12 },
        "-=0.8"
      );

      tl.fromTo(
        ".intro-hero-image",
        { scale: 0.96, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: 1.3, ease: "power4.out" },
        "-=0.9"
      );
    });

    return () => ctx.revert();
  }, [pageRef, onComplete]);

  // Keep it pure premium black (#050505)
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none cursor-none"
    >
      {/* Center Group */}
      <div className="relative size-60 flex flex-col items-center justify-center">
        {/* Expanding Ring & Dot */}
        <div
          ref={dotRef}
          className="absolute size-2 bg-white rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.7)]"
        />

        {/* Pulse helper element */}
        <div
          ref={ringRef}
          className="absolute size-28 rounded-full opacity-0 pointer-events-none"
        />

        {/* Logo Text (Step 4) */}
        <h1
          ref={titleRef}
          className="absolute font-display text-[22px] md:text-[24px] font-semibold tracking-[0.25em] text-[#F7F7F7] uppercase opacity-0 text-center select-none"
        >
          Arpit Sharma
        </h1>

        {/* Subtitle Text (Step 5) */}
        <div
          ref={subtitleRef}
          className="absolute mt-20 flex flex-col items-center text-center opacity-0 select-none"
        >
          <span className="font-mono text-[9px] tracking-[0.16em] text-[#A1A1AA] uppercase">
            Video Editor
          </span>
          <span className="font-mono text-[8px] tracking-[0.14em] text-[#A1A1AA]/60 uppercase mt-1">
            • Motion Designer •
          </span>
        </div>
      </div>

      {/* Loading Progress Line (Step 6) */}
      <div
        ref={lineContainerRef}
        className="absolute bottom-20 w-40 h-[1.5px] bg-white/10 rounded-full overflow-hidden opacity-0"
      >
        <div
          ref={lineFillRef}
          className="absolute left-0 top-0 h-full w-full bg-white origin-left transform-gpu scale-x-0"
        />
      </div>
    </div>
  );
}
