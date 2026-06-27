import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vision Studio — Cinematic Video Editing & Motion Design" },
      {
        name: "description",
        content:
          "Independent creative studio crafting commercials, brand films, motion design and product videos for ambitious tech brands and founders.",
      },
      { property: "og:title", content: "Vision Studio — Cinematic Video Editing & Motion Design" },
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
  return (
    <div className="noise relative min-h-screen bg-background">
      <ScrollProgress />
      <Navbar />
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
  );
}
