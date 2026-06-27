import { motion } from "motion/react";
import portrait from "@/assets/portrait.jpg";

const VALUES = [
  { k: "Craft", v: "Treat every frame as the final frame." },
  { k: "Calm", v: "Steady process, no chaos, no surprises." },
  { k: "Clarity", v: "Story before style — always." },
  { k: "Care", v: "Long-term partners, not one-off vendors." },
];

export function About() {
  return (
    <section id="about" className="relative mt-32 scroll-mt-24 md:mt-48">
      <div className="container-px mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[2rem] hairline bg-surface-2">
            <img
              src={portrait}
              alt="Portrait of the studio founder"
              loading="lazy"
              width={1200}
              height={1500}
              className="aspect-[4/5] size-full object-cover"
            />
          </div>
          <div className="glass-strong absolute -bottom-5 left-5 right-5 rounded-2xl px-5 py-4 shadow-soft md:left-auto md:right-5 md:w-[64%]">
            <div className="text-[12px] text-muted-foreground">Founder & lead editor</div>
            <div className="mt-1 font-display text-[16px] font-medium">Elias Moreau</div>
          </div>
        </motion.div>

        <div>
          <p className="eyebrow">About the studio</p>
          <h2 className="mt-4 heading-display text-balance text-4xl md:text-5xl lg:text-6xl">
            Quietly obsessed with the
            <span className="italic text-muted-foreground"> in-between</span> frames.
          </h2>
          <div className="mt-7 space-y-5 text-[16px] leading-relaxed text-muted-foreground">
            <p>
              Vision Studio is an independent creative practice based between
              Lisbon and Berlin, working with technology brands, agencies and
              founders who care deeply about how their story is told.
            </p>
            <p>
              We're a small, hand-picked team. No account managers, no layers —
              just the people doing the work. That intimacy is the entire point:
              it's how we keep the craft honest and the pace humane.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.k}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
              >
                <div className="font-display text-lg font-medium">{v.k}</div>
                <div className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {v.v}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
