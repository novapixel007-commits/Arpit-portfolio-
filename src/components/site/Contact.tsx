import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Check,
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  ArrowUpRight,
  Loader2,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Compass,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/emailjs";

// ─── TYPES & CONSTANTS ────────────────────────────────────────────────────────
interface FormErrors {
  name?: string;
  email?: string;
  budget?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROJECT_TYPES = [
  { id: "Commercial",      label: "Commercial"       },
  { id: "Brand Film",      label: "Brand Film"       },
  { id: "Product Video",   label: "Product Video"    },
  { id: "Motion Graphics", label: "Motion Graphics"  },
  { id: "Social Media",    label: "Social Media"     },
];

const TIMELINES = ["ASAP", "1 month", "1–3 months", "Flexible"];

const BUDGET_CARDS = [
  { id: "Under ₹10K",  label: "Under ₹10K" },
  { id: "₹10K–25K",    label: "₹10K–25K"   },
  { id: "₹25K–50K",    label: "₹25K–50K"   },
  { id: "₹50K+",       label: "₹50K+"      },
  { id: "Let's Discuss", label: "Let's Discuss" },
];

// ─── FIELD ERROR COMPONENT ───────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-1.5 block text-[11px] font-mono text-red-400 text-left"
          role="alert"
        >
          {message}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ─── FLOATING LABEL INPUT COMPONENT ───────────────────────────────────────────
function FloatingInput({
  id,
  label,
  type = "text",
  required,
  error,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  onChange?: (val: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const isFloating = focused || value.length > 0;

  return (
    <div className="relative w-full text-left">
      <div
        className={`relative rounded-xl border bg-black/30 transition-all duration-300 ${
          error
            ? "border-red-500/50 focus-within:border-red-400 focus-within:shadow-[0_0_12px_rgba(239,68,68,0.15)]"
            : focused
            ? "border-[#6EE7FF]/60 shadow-[0_0_16px_rgba(110,231,255,0.15)]"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <label
          htmlFor={id}
          className={`absolute left-4 pointer-events-none transition-all duration-300 ease-out font-mono uppercase tracking-wider text-[11px] ${
            isFloating
              ? "top-1.5 text-[9px] text-[#6EE7FF] opacity-90"
              : "top-1/2 -translate-y-1/2 text-muted-foreground/60"
          }`}
        >
          {label} {required && <span className="text-[#6EE7FF]">*</span>}
        </label>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={handleTextChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent px-4 pb-2.5 outline-none text-[14px] text-foreground transition-all ${
            isFloating ? "pt-5" : "pt-4 pb-4"
          }`}
          style={{ caretColor: "#6EE7FF" }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 ml-2 text-[11px] font-mono text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── INTERACTIVE CONTACT CARD (LEFT SIDE) ──────────────────────────────────────
interface ContactCardProps {
  title: string;
  subtitle: string;
  valueText: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function InteractiveContactCard({ title, subtitle, valueText, href, icon: Icon, color }: ContactCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseLeaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 100, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (mouseLeaveTimeout.current) {
      clearTimeout(mouseLeaveTimeout.current);
    }
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={cardRef}
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group relative flex items-center justify-between p-6 rounded-2xl border border-white/8 bg-card/40 backdrop-blur-xl transition-all duration-400 hover:border-white/20 hover:shadow-2xl overflow-hidden cursor-pointer"
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          boxShadow: `0 0 32px ${color}10, inset 0 0 20px ${color}06`,
          background: `radial-gradient(circle at 10% 50%, ${color}08 0%, transparent 60%)`,
        }}
      />

      <div className="flex items-center gap-5 z-10">
        {/* Animated Icon Container */}
        <div
          className="size-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
          style={{
            background: `${color}08`,
            borderColor: `${color}20`,
            boxShadow: `0 0 10px ${color}05`,
          }}
        >
          <Icon className="size-5 transition-transform duration-300 group-hover:rotate-6" style={{ color }} />
        </div>

        {/* Text */}
        <div className="text-left">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
            {title}
          </p>
          <p className="font-display text-[15px] font-semibold text-foreground mt-0.5">
            {subtitle}
          </p>
          <p className="text-[12px] text-muted-foreground mt-0.5 font-mono">
            {valueText}
          </p>
        </div>
      </div>

      {/* Interactive Arrow */}
      <div className="z-10 text-muted-foreground/40 group-hover:text-foreground transition-colors duration-300 mr-2">
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </motion.a>
  );
}

// ─── CONTACT SECTION ──────────────────────────────────────────────────────────
export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [type, setType] = useState(PROJECT_TYPES[0].id);
  const [timeline, setTimeline] = useState(TIMELINES[2]);
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form magnetic submit button setup
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const sBtnX = useSpring(btnX, { stiffness: 120, damping: 15 });
  const sBtnY = useSpring(btnY, { stiffness: 120, damping: 15 });

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const clearError = (f: keyof FormErrors) => {
    if (errors[f]) setErrors((p) => ({ ...p, [f]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string) ?? "";
    const email = (fd.get("email") as string) ?? "";
    const company = (fd.get("company") as string) ?? "";
    const message = (fd.get("message") as string) ?? "";

    const errs = validateForm(name, email, budget, message);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSending(true);

    try {
      await sendContactEmail({
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        category: type,
        budget,
        timeline,
        message: message.trim(),
      });
      setSubmitted(true);
      toast.success("✓ Inquiry Sent Successfully", {
        description: "I'll get back to you within 24 hours.",
        duration: 6000,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred.";
      console.error("[Contact] Email send failed:", err);
      toast.error("Failed to send inquiry.", {
        description: msg,
        duration: 8000,
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="relative mt-12 py-8 lg:mt-24 lg:py-16 scroll-mt-24 overflow-hidden">
      
      {/* Subtle background light orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{
            x: [-20, 20, -20],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full opacity-[0.02] pointer-events-none"
          style={{
            background: "radial-gradient(circle, #6EE7FF 0%, transparent 60%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="container-px mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* ════════════════════════════════════════════
              LEFT SIDE: Info & Reach me directly (5 cols)
          ════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6EE7FF] mb-2">
                direct channel
              </p>
              <h2 className="font-display text-[28px] lg:text-[2.2rem] font-bold leading-tight tracking-tighter text-foreground">
                All the ways<br />
                to reach me.
              </h2>
            </div>

            {/* Generous Spacing for Premium Interactive Cards */}
            <div className="space-y-4">
              <InteractiveContactCard
                title="Email"
                subtitle="arpit.work007@gmail.com"
                valueText="Direct Inquiry Channel"
                href="mailto:arpit.work007@gmail.com"
                icon={Mail}
                color="#6EE7FF"
              />

              <InteractiveContactCard
                title="Instagram"
                subtitle="Behind the scenes & latest edits"
                valueText="instagram.com/i.arpitsharma_"
                href="https://www.instagram.com/i.arpitsharma_?igsh=Ynp0MXVrcTNxOXVt"
                icon={Instagram}
                color="#E1306C"
              />

              <InteractiveContactCard
                title="LinkedIn"
                subtitle="Case studies & updates"
                valueText="linkedin.com/in/arpit-sharma"
                href="https://www.linkedin.com/in/arpit-sharma-484457379?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                icon={Linkedin}
                color="#0A66C2"
              />

              <InteractiveContactCard
                title="Location"
                subtitle="Chandigarh, India"
                valueText="GMT +5:30 · Open Map"
                href="https://maps.google.com/?q=Chandigarh,India"
                icon={MapPin}
                color="#8B7CFF"
              />
            </div>
          </div>

          {/* ════════════════════════════════════════════
              RIGHT SIDE: Form & Interactive options (7 cols)
          ════════════════════════════════════════════ */}
          <div className="lg:col-span-7 relative">
            
            {/* Animated subtle radial gradient just behind form */}
            <div
              className="absolute -inset-10 pointer-events-none rounded-[2rem] opacity-[0.03]"
              style={{
                background: "radial-gradient(circle at center, #6EE7FF 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />

            <div
              className="rounded-3xl border border-white/8 bg-card/40 backdrop-blur-xl p-6 lg:p-10 relative overflow-hidden"
              style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)" }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    ref={formRef}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={onSubmit}
                    className="space-y-6 lg:space-y-8"
                    noValidate
                    aria-label="Contact form"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <MessageSquare className="size-4 text-[#6EE7FF]" strokeWidth={1.5} />
                      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        Tell me about your project
                      </p>
                    </div>

                    {/* Floating Label Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FloatingInput
                        id="name"
                        label="Your Name"
                        required
                        error={errors.name}
                        onChange={() => clearError("name")}
                      />
                      <FloatingInput
                        id="email"
                        label="Email Address"
                        type="email"
                        required
                        error={errors.email}
                        onChange={() => clearError("email")}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FloatingInput id="company" label="Company / Brand (Optional)" />
                      
                      {/* Timeline Selector */}
                      <div className="text-left space-y-2">
                        <span className="block text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground">
                          Timeline
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {TIMELINES.map((tl) => {
                            const active = timeline === tl;
                            return (
                              <button
                                key={tl}
                                type="button"
                                onClick={() => setTimeline(tl)}
                                aria-pressed={active}
                                className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all border ${
                                  active
                                    ? "border-[#8B7CFF]/50 bg-[#8B7CFF]/15 text-[#8B7CFF] shadow-[0_0_12px_rgba(139,124,255,0.12)]"
                                    : "border-white/5 bg-black/20 text-muted-foreground hover:text-foreground hover:border-white/12"
                                }`}
                              >
                                {tl}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Project Category Selection Cards */}
                    <div className="text-left space-y-2.5">
                      <span className="block text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground">
                        Project Category
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {PROJECT_TYPES.map((pt) => {
                          const active = type === pt.id;
                          return (
                            <motion.button
                              key={pt.id}
                              type="button"
                              onClick={() => setType(pt.id)}
                              aria-pressed={active}
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative rounded-xl py-3 px-2 text-[11px] font-medium text-center transition-all duration-300 border ${
                                active
                                  ? "border-[#6EE7FF]/50 bg-[#6EE7FF]/10 text-[#6EE7FF] shadow-[0_0_16px_rgba(110,231,255,0.1)]"
                                  : "border-white/5 bg-black/20 text-muted-foreground hover:text-foreground hover:border-white/12"
                              }`}
                            >
                              {pt.label}
                              {active && (
                                <motion.div
                                  layoutId="type-active"
                                  className="absolute inset-0 rounded-xl bg-[#6EE7FF]/5 pointer-events-none"
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* BUDGET: Premium selectable pricing cards (No HTML Dropdown) */}
                    <div className="text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="block text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground">
                          Estimated Budget <span className="text-[#6EE7FF]">*</span>
                        </span>
                        <AnimatePresence>
                          {errors.budget && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-[11px] font-mono text-red-400"
                            >
                              Required
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BUDGET_CARDS.map((opt) => {
                          const active = budget === opt.id;
                          return (
                            <motion.button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setBudget(opt.id);
                                clearError("budget");
                              }}
                              aria-pressed={active}
                              whileHover={{ y: -2, scale: 1.01 }}
                              whileTap={{ scale: 0.97 }}
                              className={`relative rounded-xl p-3 text-[12.5px] font-medium text-center transition-all duration-300 border ${
                                active
                                  ? "border-[#6EE7FF]/60 bg-[#6EE7FF]/12 text-[#6EE7FF] shadow-[0_0_20px_rgba(110,231,255,0.15)]"
                                  : "border-white/8 bg-black/35 text-muted-foreground hover:text-foreground hover:border-white/15"
                              }`}
                              style={{
                                boxShadow: active
                                  ? "0 4px 16px rgba(110,231,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)"
                                  : "0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)",
                              }}
                            >
                              {opt.label}
                              {active && (
                                <motion.div
                                  layoutId="budget-active"
                                  className="absolute inset-0 rounded-xl bg-[#6EE7FF]/5 pointer-events-none"
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Premium Auto-expanding Textarea */}
                    <div className="text-left relative">
                      <div
                        className={`relative rounded-xl border bg-black/30 transition-all duration-300 ${
                          errors.message
                            ? "border-red-500/50 focus-within:border-red-400 focus-within:shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                            : "border-white/10 focus-within:border-[#6EE7FF]/60 focus-within:shadow-[0_0_16px_rgba(110,231,255,0.15)]"
                        }`}
                      >
                        <label
                          htmlFor="message"
                          className="absolute left-4 top-1.5 text-[9px] font-mono uppercase tracking-wider text-[#6EE7FF]"
                        >
                          Project Description <span className="text-[#6EE7FF]">*</span>
                        </label>
                        <textarea
                          ref={textareaRef}
                          name="message"
                          id="message"
                          rows={3}
                          onInput={handleTextareaInput}
                          placeholder="What are you building? What do you want people to feel after watching?"
                          onChange={() => clearError("message")}
                          className="w-full bg-transparent px-4 pb-3 pt-5 outline-none text-[14px] text-foreground placeholder-muted-foreground/35 resize-none transition-all"
                          style={{ minHeight: "88px", caretColor: "#6EE7FF" }}
                        />
                      </div>
                      <FieldError message={errors.message} />
                    </div>

                    {/* Apple Style submit button */}
                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={sending}
                        style={{ x: sBtnX, y: sBtnY }}
                        onMouseMove={(e) => {
                          const r = e.currentTarget.getBoundingClientRect();
                          btnX.set((e.clientX - r.left - r.width / 2) * 0.4);
                          btnY.set((e.clientY - r.top - r.height / 2) * 0.4);
                        }}
                        onMouseLeave={() => {
                          btnX.set(0);
                          btnY.set(0);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative w-full inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] py-4 text-[14px] font-semibold text-background shadow-[0_4px_30px_rgba(110,231,255,0.25)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed will-change-transform"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {sending ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Processing project details...
                            </>
                          ) : (
                            <>
                              Let's Build Something Great
                              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </>
                          )}
                        </span>
                        {/* Shine effect */}
                        <span className="absolute inset-0 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out" />
                      </motion.button>
                    </div>
                  </motion.form>
                ) : (
                  /* ── SUCCESS EXPERIENCE CARD ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                      className="relative size-16 mb-6"
                    >
                      <div className="absolute inset-0 rounded-full bg-[#6EE7FF]/20 animate-ping" />
                      <div className="relative size-16 rounded-full bg-gradient-to-br from-[#6EE7FF] to-[#8B7CFF] flex items-center justify-center shadow-[0_0_32px_rgba(110,231,255,0.3)]">
                        <Check className="size-6 text-[#0A0A0A]" strokeWidth={3} />
                      </div>
                    </motion.div>

                    <h3 className="font-display text-2xl font-semibold text-foreground">
                      ✓ Thanks.
                    </h3>

                    <p className="mt-3 text-[14px] text-muted-foreground max-w-sm leading-relaxed">
                      I'll personally review your project and get back within{" "}
                      <span className="text-[#6EE7FF] font-medium">24 hours</span>.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setBudget("");
                        setType(PROJECT_TYPES[0].id);
                        setTimeline(TIMELINES[2]);
                        setErrors({});
                      }}
                      className="mt-8 rounded-full border border-border bg-surface px-6 py-2.5 text-[12.5px] font-medium text-foreground hover:border-[#6EE7FF]/30 hover:bg-card transition-all duration-300"
                    >
                      Send another brief
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
