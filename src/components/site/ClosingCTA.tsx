import { motion } from "motion/react";

export function ClosingCTA() {
  return (
    <section className="relative mt-32 md:mt-48">
      <div className="container-px mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="noise relative overflow-hidden rounded-[2.5rem] bg-foreground px-6 py-20 text-center text-primary-foreground md:px-12 md:py-32"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-10 size-[480px] rounded-full bg-[radial-gradient(circle,oklch(0.6_0.12_250/0.45),transparent_60%)] blur-3xl" />
            <div className="absolute -right-32 bottom-0 size-[420px] rounded-full bg-[radial-gradient(circle,oklch(0.85_0.04_60/0.25),transparent_60%)] blur-3xl" />
          </div>

          <p className="relative text-[11px] uppercase tracking-[0.22em] text-primary-foreground/60">
            Now booking — Q3
          </p>
          <h2 className="relative mx-auto mt-6 max-w-4xl heading-display text-balance text-5xl font-medium md:text-7xl">
            Let's build something
            <br /> unforgettable.
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-[15px] text-primary-foreground/70">
            We take on a small number of projects each quarter so every story
            gets the time it deserves. Tell us about yours.
          </p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-primary-foreground px-7 py-3.5 text-[14px] font-medium text-foreground transition hover:opacity-90"
            >
              Book a call
            </a>
            <a
              href="#contact"
              className="rounded-full border border-primary-foreground/25 px-7 py-3.5 text-[14px] font-medium text-primary-foreground transition hover:bg-primary-foreground/10"
            >
              Start a project
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
