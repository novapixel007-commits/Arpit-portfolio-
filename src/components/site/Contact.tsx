import { motion, AnimatePresence } from "motion/react";
import { Check, Mail, MapPin } from "lucide-react";
import { useState } from "react";

const PROJECT_TYPES = ["Commercial", "Brand film", "Product video", "Motion design", "Other"];
const BUDGETS = ["<$5k", "$5–15k", "$15–40k", "$40k+"];
const TIMELINES = ["ASAP", "1 month", "1–3 months", "Flexible"];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState(PROJECT_TYPES[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [timeline, setTimeline] = useState(TIMELINES[2]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="relative mt-32 scroll-mt-24 md:mt-48">
      <div className="container-px mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 className="mt-4 heading-display text-balance text-4xl md:text-5xl lg:text-6xl">
            Tell us about
            <br /> the project.
          </h2>
          <p className="mt-6 max-w-md text-[15px] text-muted-foreground">
            A short brief is enough. We reply within one business day with next
            steps and availability.
          </p>

          <div className="mt-10 space-y-4 text-[14px]">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-9 place-items-center rounded-full hairline bg-surface">
                <Mail className="size-4" />
              </span>
              <a href="mailto:studio@vision.work" className="text-foreground hover:underline">
                studio@vision.work
              </a>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-9 place-items-center rounded-full hairline bg-surface">
                <MapPin className="size-4" />
              </span>
              Lisbon · Berlin · Remote worldwide
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] hairline bg-surface p-6 shadow-soft md:p-10">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -10 }}
                onSubmit={onSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      required
                      placeholder="Your full name"
                      className="input"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      required
                      type="email"
                      placeholder="you@company.com"
                      className="input"
                    />
                  </Field>
                </div>

                <Field label="Project type">
                  <ChipRow options={PROJECT_TYPES} value={type} onChange={setType} />
                </Field>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Budget">
                    <ChipRow options={BUDGETS} value={budget} onChange={setBudget} />
                  </Field>
                  <Field label="Timeline">
                    <ChipRow options={TIMELINES} value={timeline} onChange={setTimeline} />
                  </Field>
                </div>

                <Field label="Message">
                  <textarea
                    required
                    rows={4}
                    placeholder="A few lines about the project, goals and references."
                    className="input resize-none"
                  />
                </Field>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-6 py-4 text-[14px] font-medium text-primary-foreground transition hover:opacity-90 sm:w-auto"
                >
                  Send brief
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.15 }}
                  className="grid size-16 place-items-center rounded-full bg-foreground text-primary-foreground"
                >
                  <Check className="size-7" strokeWidth={2.5} />
                </motion.span>
                <h3 className="mt-6 heading-display text-3xl">Brief received.</h3>
                <p className="mt-3 max-w-sm text-[14px] text-muted-foreground">
                  We'll reply within one business day with next steps. Thank you.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 14px;
          border: 1px solid var(--color-hairline);
          background: var(--color-surface-2);
          padding: 14px 16px;
          font-size: 14px;
          color: var(--color-foreground);
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .input::placeholder { color: var(--color-muted-foreground); }
        .input:focus {
          outline: none;
          border-color: var(--color-foreground);
          background: var(--color-surface);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-foreground) 8%, transparent);
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function ChipRow({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full px-4 py-2 text-[13px] transition ${
            value === o
              ? "bg-foreground text-primary-foreground"
              : "hairline bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
