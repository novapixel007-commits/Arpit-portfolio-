import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { Check, Mail, MapPin, Instagram, Linkedin, ArrowUpRight, Loader2 } from "lucide-react";
import { CinematicHeading } from "./CinematicHeading";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/emailjs";

// ─── Constants ─────────────────────────────────────────────────────────────────

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/i.arpitsharma_?igsh=Ynp0MXVrcTNxOXVt",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/arpit-sharma-484457379?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    icon: Linkedin,
  },
];

const PROJECT_TYPES = ["Commercial", "Brand film", "Product video", "Motion design", "Other"];
const TIMELINES = ["ASAP", "1 month", "1–3 months", "Flexible"];
const BUDGET_OPTIONS = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000+",
  "Let's Discuss",
];

// ─── Validation ────────────────────────────────────────────────────────────────

interface FormValues {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  budget?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.budget) {
    errors.budget = "Please select a budget range.";
  }

  if (!values.message.trim()) {
    errors.message = "Message is required.";
  } else if (values.message.trim().length < 20) {
    errors.message = "Message must be at least 20 characters.";
  }

  return errors;
}

// ─── Inline error label ────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.span
          key={message}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="mt-1.5 block text-[11px] font-mono text-red-400"
          role="alert"
          aria-live="polite"
        >
          {message}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [type, setType] = useState(PROJECT_TYPES[0]);
  const [timeline, setTimeline] = useState(TIMELINES[2]);
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const formRef = useRef<HTMLFormElement | null>(null);

  // Submit button magnetic draw setup
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const springX = useSpring(btnX, { stiffness: 120, damping: 15 });
  const springY = useSpring(btnY, { stiffness: 120, damping: 15 });

  const handleBtnMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    btnX.set(x * 0.4);
    btnY.set(y * 0.4);
  };

  const handleBtnMouseLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (sending) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const values: FormValues = {
      name: (data.get("name") as string) ?? "",
      email: (data.get("email") as string) ?? "",
      company: (data.get("company") as string) ?? "",
      budget,
      message: (data.get("message") as string) ?? "",
    };

    const validationErrors = validateForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSending(true);

    try {
      await sendContactEmail({
        name: values.name.trim(),
        email: values.email.trim(),
        company: values.company.trim(),
        category: type,
        budget: values.budget,
        timeline,
        message: values.message.trim(),
      });

      setSubmitted(true);

      toast.success("✓ Inquiry Sent Successfully", {
        description: "I'll get back to you within 24 hours.",
        duration: 6000,
      });
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Unknown error occurred.";
      console.error("[Contact] Email send failed:", error);
      toast.error("Failed to send inquiry.", {
        description: errMsg,
        duration: 8000,
      });
    } finally {
      setSending(false);
    }
  }

  /** Clear a field's error as soon as the user interacts with it. */
  function clearError(field: keyof FormErrors) {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <section id="contact" className="relative mt-10 py-0 lg:mt-24 lg:py-16 scroll-mt-24">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">

          {/* Left Column: Info (5 cols) */}
          <div className="lg:col-span-5 text-left space-y-3 lg:space-y-10">
            <div>
              <p className="text-[9px] lg:text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">get in touch</p>
              <h2 className="mt-1 font-display text-[26px] lg:text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.1] tracking-tighter text-foreground">
                let's build something real.
              </h2>
            </div>
            <p className="text-[13px] lg:text-[15px] leading-snug lg:leading-relaxed text-muted-foreground max-w-md">
              Currently taking on select projects for Q3. Share your timeline and creative brief, and I'll respond within 24 hours.
            </p>

            {/* Practical contact points */}
            <div className="space-y-4 text-[13.5px]">
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="grid size-9 place-items-center rounded-full border border-border bg-card">
                  <Mail className="size-4 text-foreground" />
                </span>
                <a href="mailto:arpit.work007@gmail.com" className="text-foreground hover:text-[#6EE7FF] hover:underline transition-colors">
                  arpit.work007@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="grid size-9 place-items-center rounded-full border border-border bg-card">
                  <MapPin className="size-4 text-foreground" />
                </span>
                Chandigarh, India [ GMT +5:30 ]
              </div>
            </div>

            {/* Social linkages */}
            <div className="space-y-4 pt-4 border-t border-border">
              <span className="block text-[10px] uppercase tracking-widest text-[#8B7CFF] font-mono">
                Connect Directly
              </span>
              <div className="flex flex-wrap gap-3">
                {SOCIALS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -2 }}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-[12.5px] font-medium text-foreground hover:bg-surface hover:border-[#6EE7FF]/30 transition-all duration-300"
                    >
                      <Icon className="size-3.5" />
                      <span>{social.label}</span>
                      <ArrowUpRight className="size-3 text-muted-foreground" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-card border border-border rounded-xl lg:rounded-[2rem] p-4 lg:p-12 shadow-soft">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  ref={formRef}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={onSubmit}
                  className="space-y-4 lg:space-y-8"
                  noValidate
                  aria-label="Contact form"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Line Input Name */}
                    <div className="text-left">
                      <div className="relative group">
                        <label
                          htmlFor="name"
                          className="absolute left-0 top-3 -translate-y-6 text-[11px] font-mono uppercase tracking-wider text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[13px] peer-focus:top-3 peer-focus:-translate-y-6 peer-focus:text-[11px] peer-focus:text-[#6EE7FF] pointer-events-none"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          placeholder="your name"
                          aria-required="true"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                          onChange={() => clearError("name")}
                          className="peer w-full border-b border-border bg-transparent py-3 text-[14px] text-foreground placeholder-transparent outline-none transition-colors focus:border-[#6EE7FF]"
                        />
                        <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] transition-all duration-300 group-focus-within:w-full" />
                      </div>
                      <div id="name-error">
                        <FieldError message={errors.name} />
                      </div>
                    </div>

                    {/* Line Input Email */}
                    <div className="text-left">
                      <div className="relative group">
                        <label
                          htmlFor="email"
                          className="absolute left-0 top-3 -translate-y-6 text-[11px] font-mono uppercase tracking-wider text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[13px] peer-focus:top-3 peer-focus:-translate-y-6 peer-focus:text-[11px] peer-focus:text-[#6EE7FF] pointer-events-none"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="your email"
                          aria-required="true"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                          onChange={() => clearError("email")}
                          className="peer w-full border-b border-border bg-transparent py-3 text-[14px] text-foreground placeholder-transparent outline-none transition-colors focus:border-[#6EE7FF]"
                        />
                        <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] transition-all duration-300 group-focus-within:w-full" />
                      </div>
                      <div id="email-error">
                        <FieldError message={errors.email} />
                      </div>
                    </div>
                  </div>

                  {/* Company / Brand + Budget row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Company / Brand (optional text) */}
                    <div className="text-left">
                      <div className="relative group">
                        <label
                          htmlFor="company"
                          className="absolute left-0 top-3 -translate-y-6 text-[11px] font-mono uppercase tracking-wider text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[13px] peer-focus:top-3 peer-focus:-translate-y-6 peer-focus:text-[11px] peer-focus:text-[#6EE7FF] pointer-events-none"
                        >
                          Company / Brand
                        </label>
                        <input
                          type="text"
                          name="company"
                          id="company"
                          placeholder="Company or Brand Name (Optional)"
                          aria-required="false"
                          className="peer w-full border-b border-border bg-transparent py-3 text-[14px] text-foreground placeholder-transparent outline-none transition-colors focus:border-[#6EE7FF]"
                        />
                        <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] transition-all duration-300 group-focus-within:w-full" />
                      </div>
                    </div>

                    {/* Budget (required select) */}
                    <div className="text-left">
                      <div className="relative group">
                        <label
                          htmlFor="budget"
                          className="block mb-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
                        >
                          Budget
                        </label>
                        <div className="relative">
                          <select
                            id="budget"
                            value={budget}
                            onChange={(e) => {
                              setBudget(e.target.value);
                              clearError("budget");
                            }}
                            aria-required="true"
                            aria-invalid={!!errors.budget}
                            aria-describedby={errors.budget ? "budget-error" : undefined}
                            className="w-full border-b border-border bg-transparent py-3 md:py-3 min-h-[44px] md:min-h-0 pr-8 text-[14px] text-foreground outline-none transition-colors focus:border-[#6EE7FF] appearance-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground"
                          >
                            <option value="" disabled hidden>
                              Select a range
                            </option>
                            {BUDGET_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {/* Custom chevron icon */}
                          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] transition-all duration-300 group-focus-within:w-full" />
                        </div>
                      </div>
                      <div id="budget-error">
                        <FieldError message={errors.budget} />
                      </div>
                    </div>
                  </div>

                  {/* Project Type Chips */}
                  <div className="space-y-3 text-left">
                    <span
                      id="category-label"
                      className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
                    >
                      Project Category
                    </span>
                    <div className="flex flex-wrap gap-2" role="group" aria-labelledby="category-label">
                      {PROJECT_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          aria-pressed={type === t}
                          className={`rounded-full px-4 py-2 min-h-[44px] md:min-h-0 flex items-center text-[12.5px] font-medium transition ${
                            type === t
                              ? "bg-foreground text-background"
                              : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline Chips */}
                  <div className="space-y-3 text-left">
                    <span
                      id="timeline-label"
                      className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
                    >
                      Timeline
                    </span>
                    <div className="flex flex-wrap gap-2" role="group" aria-labelledby="timeline-label">
                      {TIMELINES.map((tl) => (
                        <button
                          key={tl}
                          type="button"
                          onClick={() => setTimeline(tl)}
                          aria-pressed={timeline === tl}
                          className={`rounded-full px-4 py-2 min-h-[44px] md:min-h-0 flex items-center text-[12.5px] font-medium transition ${
                            timeline === tl
                              ? "bg-foreground text-background"
                              : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {tl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Line Input */}
                  <div className="text-left">
                    <div className="relative group">
                      <label
                        htmlFor="message"
                        className="absolute left-0 top-3 -translate-y-6 text-[11px] font-mono uppercase tracking-wider text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[13px] peer-focus:top-3 peer-focus:-translate-y-6 peer-focus:text-[11px] peer-focus:text-[#6EE7FF] pointer-events-none"
                      >
                        Creative Brief / Goals
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        rows={3}
                        placeholder="project details"
                        aria-required="true"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : undefined}
                        onChange={() => clearError("message")}
                        className="peer w-full border-b border-border bg-transparent py-3 text-[14px] text-foreground placeholder-transparent outline-none transition-colors focus:border-[#6EE7FF] resize-none"
                      />
                      <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] transition-all duration-300 group-focus-within:w-full" />
                    </div>
                    <div id="message-error">
                      <FieldError message={errors.message} />
                    </div>
                  </div>

                  {/* Submit Button with spring magnetic hover effect */}
                  <div className="text-left">
                    <motion.button
                      ref={buttonRef}
                      type="submit"
                      disabled={sending}
                      onMouseMove={handleBtnMouseMove}
                      onMouseLeave={handleBtnMouseLeave}
                      style={{ x: springX, y: springY }}
                      aria-disabled={sending}
                      className="btn-premium w-full lg:w-auto justify-center bg-foreground px-8 py-4 text-[13.5px] font-semibold text-background will-change-transform inline-flex items-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                          <span className="relative z-10">Sending...</span>
                        </>
                      ) : (
                        <span className="relative z-10">send creative brief</span>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
                    className="size-16 rounded-full bg-[#6EE7FF] flex items-center justify-center text-[#0A0A0A] mb-6"
                  >
                    <Check className="size-6" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="font-display text-2xl font-semibold text-foreground">
                    Brief received.
                  </h3>
                  <p className="mt-3 text-[14px] text-muted-foreground max-w-sm mb-8">
                    Thank you. I will personally review your details and get back to you within 24 hours.
                  </p>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSubmitted(false);
                      setBudget("");
                      setType(PROJECT_TYPES[0]);
                      setTimeline(TIMELINES[2]);
                      setErrors({});
                    }}
                    className="rounded-full border border-border bg-surface px-6 py-2.5 text-[12.5px] font-medium text-foreground hover:bg-card hover:border-[#6EE7FF]/30 transition-all duration-300"
                  >
                    Send another brief
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
