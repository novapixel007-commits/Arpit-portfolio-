import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";
import {
  Check,
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  ArrowUpRight,
  Loader2,
  Clock,
  Globe,
  Clapperboard,
  Calendar,
  Tv2,
  Film,
  Package,
  Sparkles,
  Share2,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { useRef } from "react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/emailjs";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROJECT_TYPES = [
  { id: "Commercial",      icon: Tv2,         label: "Commercial"       },
  { id: "Brand Film",      icon: Film,        label: "Brand Film"       },
  { id: "Product Video",   icon: Package,     label: "Product Video"    },
  { id: "Motion Graphics", icon: Sparkles,    label: "Motion Graphics"  },
  { id: "Social Media",    icon: Share2,      label: "Social Media"     },
];

const TIMELINES = ["ASAP", "1 month", "1–3 months", "Flexible"];

const BUDGET_OPTIONS = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000+",
  "Let's Discuss",
];

const INFO_ITEMS = [
  { icon: Clock,       label: "Response within 24 Hours", color: "#6EE7FF" },
  { icon: Globe,       label: "Working Worldwide",         color: "#8B7CFF" },
  { icon: MapPin,      label: "India — GMT +5:30",         color: "#6EE7FF" },
  { icon: Clapperboard,label: "Available for Freelance",   color: "#8B7CFF" },
];

const WHY_ME = [
  "Direct Communication",
  "Fast Turnaround",
  "Cinematic Quality",
  "Founder-first Workflow",
];

const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/i.arpitsharma_?igsh=Ynp0MXVrcTNxOXVt",
    Icon: Instagram,
    desc: "Behind the scenes, editing breakdowns and latest work.",
    color: "#E1306C",
    gradient: "from-[#E1306C]/10 to-[#833AB4]/10",
    border: "hover:border-[#E1306C]/30",
    glow: "hover:shadow-[0_0_30px_rgba(225,48,108,0.12)]",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/arpit-sharma-484457379?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    Icon: Linkedin,
    desc: "Professional updates, case studies and industry insights.",
    color: "#0A66C2",
    gradient: "from-[#0A66C2]/10 to-[#0A66C2]/5",
    border: "hover:border-[#0A66C2]/30",
    glow: "hover:shadow-[0_0_30px_rgba(10,102,194,0.12)]",
  },
];

// ─── VALIDATION ───────────────────────────────────────────────────────────────
interface FormErrors {
  name?: string;
  email?: string;
  budget?: string;
  message?: string;
}

function validateForm(
  name: string,
  email: string,
  budget: string,
  message: string
): FormErrors {
  const e: FormErrors = {};
  if (!name.trim()) e.name = "Name is required.";
  if (!email.trim()) e.email = "Email is required.";
  else if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
  if (!budget) e.budget = "Please select a budget range.";
  if (!message.trim()) e.message = "Tell me about your project.";
  else if (message.trim().length < 20) e.message = "Please add at least 20 characters.";
  return e;
}

// ─── FIELD ERROR ──────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.span
          key={message}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
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

// ─── LINE INPUT ───────────────────────────────────────────────────────────────
function LineInput({
  id,
  label,
  type = "text",
  placeholder,
  error,
  required,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  error?: string;
  required?: boolean;
  onChange?: () => void;
}) {
  return (
    <div className="text-left">
      <div className="relative group">
        <label
          htmlFor={id}
          className="absolute left-0 top-3 -translate-y-6 text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[13px] peer-focus:top-3 peer-focus:-translate-y-6 peer-focus:text-[10.5px] peer-focus:text-[#6EE7FF] transition-all"
        >
          {label}
          {required && <span className="text-[#6EE7FF] ml-0.5">*</span>}
        </label>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          aria-required={required}
          aria-invalid={!!error}
          onChange={onChange}
          className="peer w-full border-b border-border bg-transparent py-3 text-[14px] text-foreground placeholder-transparent outline-none transition-colors focus:border-[#6EE7FF]"
        />
        {/* Gradient underline on focus */}
        <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] transition-all duration-400 group-focus-within:w-full" />
      </div>
      <FieldError message={error} />
    </div>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [type, setType] = useState(PROJECT_TYPES[0].id);
  const [timeline, setTimeline] = useState(TIMELINES[2]);
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Magnetic submit button
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const sBtnX = useSpring(btnX, { stiffness: 120, damping: 15 });
  const sBtnY = useSpring(btnY, { stiffness: 120, damping: 15 });

  function clearError(f: keyof FormErrors) {
    if (errors[f]) setErrors((p) => ({ ...p, [f]: undefined }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const fd = new FormData(e.currentTarget);
    const name    = (fd.get("name")    as string) ?? "";
    const email   = (fd.get("email")   as string) ?? "";
    const company = (fd.get("company") as string) ?? "";
    const message = (fd.get("message") as string) ?? "";

    const errs = validateForm(name, email, budget, message);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setSending(true);
    try {
      await sendContactEmail({ name: name.trim(), email: email.trim(), company: company.trim(), category: type, budget, timeline, message: message.trim() });
      setSubmitted(true);
      toast.success("✓ Inquiry Sent Successfully", { description: "I'll get back to you within 24 hours.", duration: 6000 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred.";
      console.error("[Contact] Email send failed:", err);
      toast.error("Failed to send inquiry.", { description: msg, duration: 8000 });
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="relative mt-10 py-0 lg:mt-24 lg:py-16 scroll-mt-24 overflow-hidden">

      {/* ── AMBIENT BACKGROUND ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(110,231,255,0.06) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[65%] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(139,124,255,0.06) 0%, transparent 70%)", filter: "blur(100px)" }}
        />
        {/* Vertical light ray */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[40%]"
          style={{ background: "linear-gradient(to bottom, rgba(110,231,255,0.1), transparent)" }} />
      </div>

      <div className="container-px mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">

          {/* ════════════════════════════════════════════
              LEFT COLUMN — Trust, Info, Social (5 cols)
          ════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-6 lg:space-y-8">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="origin-left h-px w-12 bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF]"
                />
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                  get in touch
                </span>
              </div>

              {/* Hero headline */}
              <h2 className="font-display font-bold leading-[0.95] tracking-tighter text-foreground text-[clamp(2.2rem,5vw,4rem)]">
                Let's Build<br />
                Something<br />
                <span
                  className="animate-gradient bg-gradient-to-r from-[#6EE7FF] via-[#8B7CFF] to-[#6EE7FF] bg-clip-text text-transparent bg-[length:200%_auto]"
                >
                  People Remember.
                </span>
              </h2>

              <p className="mt-5 text-[14px] lg:text-[15px] leading-relaxed text-muted-foreground max-w-sm">
                Whether it's a product launch, brand film or commercial campaign —
                I'll help turn your ideas into videos people actually watch.
              </p>
            </motion.div>

            {/* Info glass card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-2xl border border-white/8 bg-card/60 backdrop-blur-xl p-5 space-y-3"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)" }}
            >
              {INFO_ITEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.12 + i * 0.07, duration: 0.5 }}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-white/[0.03] cursor-default"
                  >
                    <div
                      className="size-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${item.color}12`, border: `1px solid ${item.color}22` }}
                    >
                      <Icon className="size-3.5" style={{ color: item.color }} strokeWidth={1.6} />
                    </div>
                    <span className="text-[13px] text-foreground/80 group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}

              {/* Email row */}
              <div className="border-t border-white/6 pt-3 mt-1">
                <a
                  href="mailto:arpit.work007@gmail.com"
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-white/[0.03]"
                >
                  <div
                    className="size-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: "rgba(110,231,255,0.08)", border: "1px solid rgba(110,231,255,0.16)" }}
                  >
                    <Mail className="size-3.5 text-[#6EE7FF]" strokeWidth={1.6} />
                  </div>
                  <span className="text-[13px] text-foreground/80 group-hover:text-[#6EE7FF] transition-colors">
                    arpit.work007@gmail.com
                  </span>
                </a>
              </div>
            </motion.div>

            {/* Schedule a Call CTA */}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className="group flex items-center gap-4 rounded-2xl border border-[#6EE7FF]/20 bg-gradient-to-r from-[#6EE7FF]/8 to-[#8B7CFF]/6 backdrop-blur-sm p-5 cursor-pointer transition-all duration-400 hover:border-[#6EE7FF]/40 hover:shadow-[0_0_30px_rgba(110,231,255,0.12)]"
            >
              <div className="size-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#6EE7FF]/12 border border-[#6EE7FF]/20 group-hover:bg-[#6EE7FF]/18 transition-all">
                <Calendar className="size-5 text-[#6EE7FF]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="font-display text-[14px] font-semibold text-foreground">
                  Schedule a Call
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Book a 30-minute discovery call
                </p>
              </div>
              <ArrowRight className="size-4 text-[#6EE7FF] transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>

            {/* Social Cards */}
            <div className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Connect Directly
              </p>
              {SOCIALS.map((s, i) => {
                const Icon = s.Icon;
                return (
                  <motion.a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.22 + i * 0.1, duration: 0.6 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className={`group flex items-center gap-4 rounded-2xl border border-white/8 bg-card/60 backdrop-blur-xl p-5 transition-all duration-400 ${s.border} ${s.glow}`}
                    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)" }}
                  >
                    {/* Icon box */}
                    <div
                      className={`size-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${s.gradient} transition-all duration-300 group-hover:scale-105`}
                      style={{ border: `1px solid ${s.color}25` }}
                    >
                      <Icon className="size-5" style={{ color: s.color }} strokeWidth={1.8} />
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[14px] font-semibold text-foreground">
                        {s.label}
                      </p>
                      <p className="text-[11.5px] text-muted-foreground leading-snug mt-0.5">
                        {s.desc}
                      </p>
                    </div>
                    {/* Arrow */}
                    <ArrowUpRight
                      className="size-4 text-muted-foreground/50 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                    />
                  </motion.a>
                );
              })}
            </div>

            {/* Why Clients Choose Me */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Why Clients Choose Me
              </p>
              <div className="flex flex-wrap gap-2">
                {WHY_ME.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-card/50 backdrop-blur-sm px-3 py-1.5 text-[11.5px] text-foreground/70"
                  >
                    <Check className="size-3 text-[#6EE7FF] shrink-0" strokeWidth={2.5} />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ════════════════════════════════════════════
              RIGHT COLUMN — Premium Form (7 cols)
          ════════════════════════════════════════════ */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="rounded-2xl lg:rounded-[2rem] border border-white/8 bg-card/70 backdrop-blur-xl p-5 lg:p-10"
              style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)" }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    ref={formRef}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={onSubmit}
                    className="space-y-5 lg:space-y-7"
                    noValidate
                    aria-label="Contact form"
                  >
                    {/* Form header */}
                    <div className="flex items-center gap-3 mb-1">
                      <MessageSquare className="size-4 text-[#6EE7FF]" strokeWidth={1.5} />
                      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        Start a Project
                      </p>
                    </div>

                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                      <LineInput id="name"  label="Your Name"      placeholder="Jane Smith"          required error={errors.name}  onChange={() => clearError("name")}  />
                      <LineInput id="email" label="Email Address"   type="email" placeholder="jane@brand.com" required error={errors.email} onChange={() => clearError("email")} />
                    </div>

                    {/* Company + Budget row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                      <LineInput id="company" label="Company / Brand" placeholder="Brand or Studio" />
                      {/* Budget select */}
                      <div className="text-left">
                        <div className="relative group">
                          <label htmlFor="budget" className="block mb-1 text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground">
                            Budget<span className="text-[#6EE7FF] ml-0.5">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="budget"
                              value={budget}
                              onChange={(e) => { setBudget(e.target.value); clearError("budget"); }}
                              aria-required="true"
                              aria-invalid={!!errors.budget}
                              className="w-full border-b border-border bg-transparent py-3 pr-7 text-[14px] text-foreground outline-none transition-colors focus:border-[#6EE7FF] appearance-none cursor-pointer [&>option]:bg-card [&>option]:text-foreground"
                            >
                              <option value="" disabled hidden>Select a range</option>
                              {BUDGET_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] transition-all duration-400 group-focus-within:w-full" />
                          </div>
                        </div>
                        <FieldError message={errors.budget} />
                      </div>
                    </div>

                    {/* Project Type — icon cards */}
                    <div className="text-left space-y-3">
                      <span className="block text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground">
                        Project Type
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {PROJECT_TYPES.map((pt) => {
                          const Icon = pt.icon;
                          const active = type === pt.id;
                          return (
                            <motion.button
                              key={pt.id}
                              type="button"
                              onClick={() => setType(pt.id)}
                              aria-pressed={active}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              className={`relative flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-[10.5px] font-medium text-center transition-all duration-300 overflow-hidden border ${
                                active
                                  ? "border-[#6EE7FF]/50 bg-[#6EE7FF]/10 text-[#6EE7FF] shadow-[0_0_16px_rgba(110,231,255,0.12)]"
                                  : "border-white/8 bg-card/40 text-muted-foreground hover:text-foreground hover:border-white/15"
                              }`}
                            >
                              <Icon className={`size-4 ${active ? "text-[#6EE7FF]" : "text-muted-foreground"} transition-colors`} strokeWidth={1.5} />
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

                    {/* Timeline chips */}
                    <div className="text-left space-y-3">
                      <span className="block text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground">
                        Timeline
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {TIMELINES.map((tl) => {
                          const active = timeline === tl;
                          return (
                            <button
                              key={tl}
                              type="button"
                              onClick={() => setTimeline(tl)}
                              aria-pressed={active}
                              className={`rounded-full px-4 py-2 text-[12px] font-medium transition-all duration-250 border ${
                                active
                                  ? "border-[#8B7CFF]/50 bg-[#8B7CFF]/12 text-[#8B7CFF]"
                                  : "border-white/8 bg-card/40 text-muted-foreground hover:text-foreground hover:border-white/15"
                              }`}
                            >
                              {tl}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Message textarea */}
                    <div className="text-left">
                      <div className="relative group">
                        <label htmlFor="message" className="absolute left-0 top-3 -translate-y-6 text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[13px] peer-focus:top-3 peer-focus:-translate-y-6 peer-focus:text-[10.5px] peer-focus:text-[#6EE7FF] transition-all">
                          Project Description<span className="text-[#6EE7FF] ml-0.5">*</span>
                        </label>
                        <textarea
                          name="message"
                          id="message"
                          rows={4}
                          placeholder="Tell me about your idea..."
                          aria-required="true"
                          aria-invalid={!!errors.message}
                          onChange={() => clearError("message")}
                          className="peer w-full border-b border-border bg-transparent py-3 text-[14px] text-foreground placeholder-transparent outline-none transition-colors focus:border-[#6EE7FF] resize-none"
                        />
                        <p className="absolute -top-0.5 left-0 text-[11px] text-muted-foreground/40 opacity-0 peer-placeholder-shown:opacity-100 transition-opacity pointer-events-none leading-snug" style={{ top: "12px" }}>
                          Tell me about your idea... What are you building? What should people feel after watching?
                        </p>
                        <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] transition-all duration-400 group-focus-within:w-full" />
                      </div>
                      <FieldError message={errors.message} />
                    </div>

                    {/* Submit button */}
                    <div className="pt-1">
                      <motion.button
                        type="submit"
                        disabled={sending}
                        style={{ x: sBtnX, y: sBtnY }}
                        onMouseMove={(e) => {
                          const r = e.currentTarget.getBoundingClientRect();
                          btnX.set((e.clientX - r.left - r.width / 2) * 0.4);
                          btnY.set((e.clientY - r.top - r.height / 2) * 0.4);
                        }}
                        onMouseLeave={() => { btnX.set(0); btnY.set(0); }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        aria-disabled={sending}
                        className="group relative w-full lg:w-auto inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground px-10 py-4 text-[14px] font-semibold text-background transition-shadow duration-300 hover:shadow-[0_0_36px_rgba(110,231,255,0.35)] disabled:opacity-60 disabled:cursor-not-allowed will-change-transform"
                      >
                        <span className="relative z-10 flex items-center gap-2.5">
                          {sending ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Start My Project
                              <motion.span
                                className="inline-block"
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <ArrowRight className="size-4" />
                              </motion.span>
                            </>
                          )}
                        </span>
                        {/* Shine sweep */}
                        <span className="absolute inset-0 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out" />
                      </motion.button>

                      <p className="mt-3 text-[11px] text-muted-foreground/50">
                        No commitment. I'll get back within 24 hours.
                      </p>
                    </div>
                  </motion.form>
                ) : (
                  /* ── SUCCESS STATE ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                      className="relative size-20 mb-8"
                    >
                      <div className="absolute inset-0 rounded-full bg-[#6EE7FF]/20 animate-ping" />
                      <div className="relative size-20 rounded-full bg-gradient-to-br from-[#6EE7FF] to-[#8B7CFF] flex items-center justify-center shadow-[0_0_40px_rgba(110,231,255,0.35)]">
                        <Check className="size-8 text-[#0A0A0A]" strokeWidth={2.5} />
                      </div>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.6 }}
                      className="font-display text-2xl lg:text-3xl font-semibold text-foreground"
                    >
                      Thanks.
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.6 }}
                      className="mt-3 text-[14px] text-muted-foreground max-w-xs leading-relaxed"
                    >
                      I'll personally review your project and get back within{" "}
                      <span className="text-[#6EE7FF] font-medium">24 hours</span>.
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      type="button"
                      onClick={() => { setSubmitted(false); setBudget(""); setType(PROJECT_TYPES[0].id); setTimeline(TIMELINES[2]); setErrors({}); }}
                      className="mt-8 rounded-full border border-border bg-surface px-6 py-2.5 text-[12.5px] font-medium text-foreground hover:border-[#6EE7FF]/30 hover:bg-card transition-all duration-300"
                    >
                      Send another brief
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mobile: Why Clients Choose Me */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:hidden mt-6"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Why Clients Choose Me
              </p>
              <div className="flex flex-wrap gap-2">
                {WHY_ME.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-card/50 px-3 py-1.5 text-[11px] text-foreground/70"
                  >
                    <Check className="size-3 text-[#6EE7FF] shrink-0" strokeWidth={2.5} />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
