import { createFileRoute } from "@tanstack/react-router";
import React, { Suspense, lazy } from "react";

import { Hero } from "@/components/site/Hero";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { IntroLoader } from "@/components/site/IntroLoader";
import { useRef, useState } from "react";

// Lazy load below-the-fold sections for optimized initial bundle loading
const Stats = lazy(() => import("@/components/site/Stats").then(m => ({ default: m.Stats })));
const Projects = lazy(() => import("@/components/site/Projects").then(m => ({ default: m.Projects })));
const Process = lazy(() => import("@/components/site/Process").then(m => ({ default: m.Process })));
const Testimonials = lazy(() => import("@/components/site/Testimonials").then(m => ({ default: m.Testimonials })));
const About = lazy(() => import("@/components/site/About").then(m => ({ default: m.About })));
const ClosingCTA = lazy(() => import("@/components/site/ClosingCTA").then(m => ({ default: m.ClosingCTA })));
const Contact = lazy(() => import("@/components/site/Contact").then(m => ({ default: m.Contact })));
const Footer = lazy(() => import("@/components/site/Footer").then(m => ({ default: m.Footer })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arpit Sharma — Cinematic Video Editing & Motion Design" },
      {
        name: "description",
        content:
          "Premium video editing, color grading and motion design for ambitious creators, startups and brands.",
      },
      { property: "og:title", content: "Arpit Sharma — Cinematic Video Editing & Motion Design" },
      {
        property: "og:description",
        content:
          "Independent creative studio crafting commercials, brand films, motion design and product videos.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const [introActive, setIntroActive] = useState(true);
  const [showSsrOverlay, setShowSsrOverlay] = useState(true);
  const pageRef = useRef<HTMLDivElement | null>(null);

  // Failsafe: Force reveal website after 2.8s maximum to guarantee it never gets stuck blank
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroActive(false);
      setShowSsrOverlay(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* SSR black overlay to prevent hydration flashes on first-visit */}
      {showSsrOverlay && <div className="fixed inset-0 bg-[#050505] z-[9999]" id="ssr-overlay" />}

      {/* Homepage Content wrapper revealed by clip-path mask */}
      <div
        ref={pageRef}
        className={introActive ? "noise relative size-full opacity-0" : "noise relative size-full"}
      >
        <ScrollProgress />
        <main>
          <Hero />
          <Suspense fallback={null}>
            <Stats />
            <Projects />
            <Process />
            <Testimonials />
            <About />
            <ClosingCTA />
            <Contact />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>

      {introActive && (
        <IntroLoader
          pageRef={pageRef}
          onComplete={() => {
            setIntroActive(false);
            setShowSsrOverlay(false);
          }}
        />
      )}
    </div>
  );
}
