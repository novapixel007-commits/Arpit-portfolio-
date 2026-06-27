import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import heroMockup from "@/assets/hero-macbook.jpg";

const ease = [0.22, 1, 0.36, 1] as const;

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40">
      {/* Soft background orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="absolute -left-40 top-10 size-[520px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.92_0.04_250/0.55),transparent_60%)] blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.2 }}
          className="absolute -right-32 top-40 size-[460px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.95_0.02_60/0.55),transparent_60%)] blur-2xl"
        />
      </div>

      <div className="container-px mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="max-w-2xl">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full hairline bg-surface px-3 py-1.5 text-[12px] text-muted-foreground">
              <span className="relative grid place-items-center">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span className="absolute size-1.5 animate-ping rounded-full bg-emerald-500/60" />
              </span>
              Booking projects for Q3 — 2 spots open
            </div>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="mt-6 heading-display text-[clamp(2.6rem,7vw,5.6rem)] text-balance">
              Cinematic stories
              <br />
              that move{" "}
              <span className="italic text-muted-foreground">brands</span>
              <span className="text-foreground">.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.18}>
            <p className="mt-7 max-w-xl text-balance text-[17px] leading-relaxed text-muted-foreground">
              Independent studio crafting commercials, brand films, motion
              design and product videos for ambitious tech brands, founders and
              agencies.
            </p>
          </FadeUp>

          <FadeUp delay={0.28}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-[14px] font-medium text-primary-foreground transition hover:opacity-90"
              >
                View work
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full hairline bg-surface px-6 py-3.5 text-[14px] font-medium text-foreground transition hover:bg-surface-2"
              >
                Let's talk
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="mt-14 flex items-center gap-6 text-[12px] text-muted-foreground">
              <div>
                <div className="font-display text-xl font-medium text-foreground">100+</div>
                <div className="mt-1">Projects shipped</div>
              </div>
              <div className="h-8 w-px bg-hairline" />
              <div>
                <div className="font-display text-xl font-medium text-foreground">20+</div>
                <div className="mt-1">Brand partners</div>
              </div>
              <div className="h-8 w-px bg-hairline" />
              <div>
                <div className="font-display text-xl font-medium text-foreground">4.9★</div>
                <div className="mt-1">Avg. rating</div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Floating mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease, delay: 0.2 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto aspect-[4/3] w-full max-w-2xl"
          >
            <div className="absolute inset-x-10 -bottom-6 h-10 rounded-full bg-foreground/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl hairline bg-surface shadow-float">
              <img
                src={heroMockup}
                alt="MacBook displaying a cinematic motion graphics timeline"
                width={1600}
                height={1200}
                fetchPriority="high"
                className="size-full object-cover"
              />
            </div>

            {/* Floating glass chip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="glass-strong absolute -bottom-4 left-6 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-soft"
            >
              <span className="grid size-9 place-items-center rounded-full bg-foreground text-primary-foreground">
                <Play className="size-4 fill-current" />
              </span>
              <div className="text-left">
                <div className="text-[12px] text-muted-foreground">Now editing</div>
                <div className="text-[13px] font-medium">Aether — Brand Film</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
