import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Projects } from "@/components/site/Projects";
import { Services } from "@/components/site/Services";
import { Process } from "@/components/site/Process";
import { Testimonials } from "@/components/site/Testimonials";
import { About } from "@/components/site/About";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { IntroLoader } from "@/components/site/IntroLoader";
import { useRef, useState } from "react";

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
          <Stats />
          <Projects />
          <Services />
          <Process />
          <Testimonials />
          <About />
          <ClosingCTA />
          <Contact />
        </main>
        <Footer />
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
