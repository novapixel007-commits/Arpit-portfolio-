import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface CinematicHeadingProps {
  text: string;
  tagline?: string;
  className?: string;
  delay?: number;
}

export function CinematicHeading({ text, tagline, className = "", delay = 0 }: CinematicHeadingProps) {
  const [inView, setInView] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  const words = text.split(" ");

  return (
    <div ref={setRef} className={className}>
      {tagline && (
        <span 
          className="eyebrow block mb-3 transition-all duration-1000 ease-out" 
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(12px)",
            transitionDelay: `${delay}s`
          }}
        >
          {tagline}
        </span>
      )}
      <h2 className="heading-display text-4xl md:text-6xl text-balance leading-[1.12]">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em] py-2 px-1 -my-2 -mx-1">
            <motion.span
              initial={{ y: "105%", rotate: 3, filter: "blur(6px)", opacity: 0 }}
              animate={inView ? { y: 0, rotate: 0, filter: "blur(0px)", opacity: 1 } : {}}
              transition={{
                duration: 1.2,
                delay: delay + i * 0.05,
                ease: [0.16, 1, 0.3, 1], // expo.out
              }}
              className="inline-block transform-gpu origin-left"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h2>
    </div>
  );
}
