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
  Tv2,
  Film,
  Package,
  Sparkles,
  Share2,
  ArrowRight,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/emailjs";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ease = [0.16, 1, 0.3, 1] as const;

const CONTACT_CARDS = [
  {
    id: "instagram",
    label: "Instagram",
    sub: "Behind the scenes, latest edits",
    handle: "instagram.com/i.arpitsharma_",
    href: "https://www.instagram.com/i.arpitsharma_?igsh=Ynp0MXVrcTNxOXVt",
    Icon: Instagram,
    color: "#E1306C",
    glowRgb: "225,48,108",
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    sub: "Case studies & professional updates",
    handle: "linkedin.com/in/arpit-sharma",
    href: "https://www.linkedin.com/in/arpit-sharma-484457379?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    Icon: Linkedin,
    color: "#0A66C2",
    glowRgb: "10,102,194",
    external: true,
  },
  {
    id: "email",
    label: "Email",
    sub: "arpit.work007@gmail.com",
    handle: "Click to open mail client",
    href: "mailto:arpit.work007@gmail.com",
    Icon: Mail,
    color: "#6EE7FF",
    glowRgb: "110,231,255",
    external: false,
  },
  {
    id: "location",
    label: "Location",
    sub: "Chandigarh, India",
    handle: "GMT +5:30 · Open in Maps",
    href: "https://maps.google.com/?q=Chandigarh,India",
    Icon: MapPin,
    color: "#8B7CFF",
    glowRgb: "139,124,255",
    external: true,
  },
] as const;

const PROJECT_TYPES = [
  { id: "Commercial",      Icon: Tv2,      label: "Commercial"      },
  { id: "Brand Film",      Icon: Film,     label: "Brand Film"      },
  { id: "Product Video",   Icon: Package,  label: "Product Video"   },
  { id: "Motion Graphics", Icon: Sparkles, label: "Motion Graphics" },
  { id: "Social Media",    Icon: Share2,   label: "Social Media"    },
] as const;

const TIMELINES = ["ASAP", "1 month", "1–3 months", "Flexible"] as const;

const BUDGET_CARDS = [
  { id: "Under ₹10K",     label: "Under ₹10K"   },
  { id: "₹10K–₹25K",     label: "₹10K – ₹25K"  },
  { id: "₹25K–₹50K",     label: "₹25K – ₹50K"  },
  { id: "₹50K–₹1L",      label: "₹50K – ₹1L"   },
  { id: "₹1L+",           label: "₹1L+"          },
  { id: "Let's Discuss",  label: "Let's Discuss" },
] as const;

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface FormErrors {
  name?: string;
  email?: string;
  budget?: string;
  message?: string;
}

// ─── VALIDATION ───────────────────────────────────────────────────────────────
function validate(name: string, email: string, budget: string, message: string): FormErrors {
  const e: FormErrors = {};
  if (!name.trim())   e.name    = "Your name is required.";
  if (!email.trim())  e.email   = "Email address is required.";
  else if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
  if (!budget)        e.budget  = "Please select a budget range.";
  if (!message.trim()) e.message = "Tell me about your project.";
  else if (message.trim().length < 20) e.message = "Please add at least 20 characters.";
  return e;
}

// ─── FIELD ERROR ──────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.span
          key={msg}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16 }}
          role="alert"
          aria-live="polite"
          className="mt-1.5 block text-[11px] font-mono text-red-400/90"
        >
          {msg}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ─── PREMIUM FLOATING-LABEL INPUT ─────────────────────────────────────────────
function FloatInput({
  id, label, type = "text", required, error, onChange,
}: {
  id: string; label: string; type?: string;
  required?: boolean; error?: string; onChange?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const [hasVal, setHasVal]   = useState(false);
  const lifted = focused || hasVal;

  return (
    <div className="relative group">
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-0 transition-all duration-300 ${
          lifted
            ? "top-0 text-[10.5px] font-mono uppercase tracking-wider " + (focused ? "text-[#6EE7FF]" : "text-muted-foreground/70")
            : "top-[14px] text-[13.5px] text-muted-foreground/60"
        }`}
      >
        {label}{required && <span className="text-[#6EE7FF]/80 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={type === "email" ? "email" : "off"}
        aria-required={required}
        aria-invalid={!!error}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasVal(!!e.target.value); }}
        onChange={(e) => { setHasVal(!!e.target.value); onChange?.(); }}
        className="peer w-full border-b border-border bg-transparent pt-5 pb-2 text-[14px] text-foreground outline-none transition-colors caret-[#6EE7FF]"
        style={{ borderColor: focused ? "#6EE7FF" : undefined }}
      />
      {/* Glow underline */}
      <div
        className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] transition-all duration-400"
        style={{ width: focused ? "100%" : "0%" }}
      />
      <FieldError msg={error} />
    </div>
  );
}

// ─── AUTO-EXPANDING TEXTAREA ──────────────────────────────────────────────────
function FloatTextarea({
  error, onChange,
}: { error?: string; onChange?: () => void }) {
  const [focused, setFocused] = useState(false);
  const [hasVal, setHasVal]   = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const lifted = focused || hasVal;

  const grow = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  return (
    <div className="relative group">
      <label
        htmlFor="message"
        className={`pointer-events-none absolute left-0 transition-all duration-300 ${
          lifted
            ? "top-0 text-[10.5px] font-mono uppercase tracking-wider " + (focused ? "text-[#6EE7FF]" : "text-muted-foreground/70")
            : "top-[14px] text-[13.5px] text-muted-foreground/60"
        }`}
      >
        Project Description<span className="text-[#6EE7FF]/80 ml-0.5">*</span>
      </label>
      <textarea
        ref={ref}
        id="message"
        name="message"
        rows={3}
        aria-required
        aria-invalid={!!error}
        aria-describedby={error ? "msg-error" : undefined}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasVal(!!e.target.value); }}
        onChange={(e) => { setHasVal(!!e.target.value); grow(); onChange?.(); }}
        className="w-full border-b border-border bg-transparent pt-5 pb-2 text-[14px] text-foreground outline-none resize-none overflow-hidden transition-colors caret-[#6EE7FF] min-h-[80px]"
        style={{ borderColor: focused ? "#6EE7FF" : undefined }}
        placeholder={!lifted ? "Tell me about your idea…\nWhat are you building? What should people feel after watching?" : ""}
      />
      <div
        className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF] transition-all duration-400"
        style={{ width: focused ? "100%" : "0%" }}
      />
      <div id="msg-error"><FieldError msg={error} /></div>
    </div>
  );
}

// ─── CONTACT CARD (left side) ─────────────────────────────────────────────────
function ContactCard({
  card, delay,
}: { card: (typeof CONTACT_CARDS)[number]; delay: number }) {
  const { Icon, color, glowRgb, label, sub, handle, href, external } = card;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 140, damping: 18 });
  const sy = useSpring(my, { stiffness: 140, damping: 18 });

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay, ease }}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left - r.width / 2) * 0.18);
        my.set((e.clientY - r.top - r.height / 2) * 0.18);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className="group relative flex items-center gap-5 w-full rounded-2xl border border-white/8 bg-card/55 backdrop-blur-xl p-5 overflow-hidden cursor-pointer will-change-transform"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "box-shadow 0.35s ease",
      }}
      aria-label={`${label} — ${sub}`}
    >
      {/* Hover glow layer */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px rgba(${glowRgb},0.28), 0 0 32px rgba(${glowRgb},0.10)`,
        }}
      />

      {/* Ambient radial */}
      <div
        className="absolute -top-6 -left-6 size-24 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, rgba(${glowRgb},0.18) 0%, transparent 70%)`, filter: "blur(24px)" }}
      />

      {/* Icon */}
      <motion.div
        className="relative size-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `rgba(${glowRgb},0.10)`, border: `1px solid rgba(${glowRgb},0.22)` }}
        whileHover={{ rotate: [0, -8, 8, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="size-5" style={{ color }} strokeWidth={1.7} />
      </motion.div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-display text-[14px] font-semibold text-foreground leading-none mb-1">
          {label}
        </p>
        <p className="text-[12px] text-muted-foreground leading-snug">{sub}</p>
        <p
          className="text-[11px] font-mono mt-1 transition-colors duration-300"
          style={{ color: `rgba(${glowRgb},0.55)` }}
        >
          {handle}
        </p>
      </div>

      {/* Arrow */}
      <motion.div
        className="flex-shrink-0"
        animate={{ x: [0, 0] }}
        whileHover={{ x: 3, y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ArrowUpRight
          className="size-4 transition-colors duration-300"
          style={{ color: `rgba(${glowRgb},0.5)` }}
        />
      </motion.div>
    </motion.a>
  );
}

// ─── RIPPLE BUTTON ────────────────────────────────────────────────────────────
function RippleButton({
  sending,
  btnX, btnY, sBtnX, sBtnY,
}: {
  sending: boolean;
  btnX: ReturnType<typeof useMotionValue>;
  btnY: ReturnType<typeof useMotionValue>;
  sBtnX: ReturnType<typeof useSpring>;
  sBtnY: ReturnType<typeof useSpring>;
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const id = Date.now();
    setRipples((p) => [...p, { id, x, y }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 700);
  };

  return (
    <motion.button
      type="submit"
      disabled={sending}
      style={{ x: sBtnX, y: sBtnY }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        btnX.set((e.clientX - r.left - r.width / 2) * 0.38);
        btnY.set((e.clientY - r.top - r.height / 2) * 0.38);
      }}
      onMouseLeave={() => { btnX.set(0); btnY.set(0); }}
      onClick={addRipple}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.96 }}
      aria-disabled={sending}
      className="group relative w-full overflow-hidden rounded-full py-4 text-[14.5px] font-semibold text-background will-change-transform disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        background: "linear-gradient(135deg, #fff 0%, #d8f5ff 50%, #c4baff 100%)",
        boxShadow: "0 0 0 0 rgba(110,231,255,0)",
        transition: "box-shadow 0.35s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(110,231,255,0.35), 0 8px 32px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 0 rgba(110,231,255,0)";
      }}
    >
      {/* Ripples */}
      {ripples.map((rpl) => (
        <span
          key={rpl.id}
          className="pointer-events-none absolute rounded-full bg-white/30 animate-ping"
          style={{ left: rpl.x - 20, top: rpl.y - 20, width: 40, height: 40 }}
        />
      ))}

      {/* Shine sweep */}
      <span className="absolute inset-0 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out" />

      <span className="relative z-10 flex items-center justify-center gap-3 text-[#0A0A14]">
        {sending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Let's Build Something Great
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="size-4" />
            </motion.span>
          </>
        )}
      </span>
    </motion.button>
  );
}

// ─── MAIN CONTACT SECTION ─────────────────────────────────────────────────────
export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);
  const [type,      setType]      = useState<string>(PROJECT_TYPES[0].id);
  const [timeline,  setTimeline]  = useState<string>(TIMELINES[2]);
  const [budget,    setBudget]    = useState("");
  const [errors,    setErrors]    = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const btnX  = useMotionValue(0);
  const btnY  = useMotionValue(0);
  const sBtnX = useSpring(btnX, { stiffness: 120, damping: 15 });
  const sBtnY = useSpring(btnY, { stiffness: 120, damping: 15 });

  function clearErr(f: keyof FormErrors) {
    if (errors[f]) setErrors((p) => ({ ...p, [f]: undefined }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const fd   = new FormData(e.currentTarget);
    const name    = (fd.get("name")    as string) ?? "";
    const email   = (fd.get("email")   as string) ?? "";
    const company = (fd.get("company") as string) ?? "";
    const message = (fd.get("message") as string) ?? "";
    const errs = validate(name, email, budget, message);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSending(true);
    try {
      await sendContactEmail({ name: name.trim(), email: email.trim(), company: company.trim(), category: type, budget, timeline, message: message.trim() });
      setSubmitted(true);
      toast.success("✓ Inquiry Sent", { description: "I'll personally review and reply within 24 hours.", duration: 6000 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error.";
      console.error("[Contact]", err);
      toast.error("Couldn't send inquiry.", { description: msg, duration: 8000 });
    } finally {
      setSending(false);
    }
  }

  function resetForm() {
    setSubmitted(false);
    setBudget("");
    setType(PROJECT_TYPES[0].id);
    setTimeline(TIMELINES[2]);
    setErrors({});
    formRef.current?.reset();
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative mt-10 py-0 lg:mt-24 lg:py-16 scroll-mt-24 overflow-hidden"
    >
      {/* ── AMBIENT BACKGROUND ──────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          animate={{ x: [0, 28, 0], y: [0, -18, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[15%] -left-[8%] w-[55%] h-[65%] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(110,231,255,0.055) 0%, transparent 70%)", filter: "blur(90px)" }}
        />
        <motion.div
          animate={{ x: [0, -22, 0], y: [0, 16, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 7 }}
          className="absolute -bottom-[15%] -right-[8%] w-[58%] h-[70%] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(139,124,255,0.055) 0%, transparent 70%)", filter: "blur(110px)" }}
        />
        {/* Form radial */}
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-0 -translate-y-1/2 w-[40%] h-[60%]"
          style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(110,231,255,0.04) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="container-px mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* ═══════════════════════════════════
              LEFT — 4 Contact Cards
          ═══════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col gap-3 lg:gap-4">

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease }}
              className="mb-2 lg:mb-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75, ease }}
                  className="origin-left h-px w-10 bg-gradient-to-r from-[#6EE7FF] to-[#8B7CFF]"
                />
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                  get in touch
                </span>
              </div>

              <h2
                id="contact-heading"
                className="font-display font-bold leading-[0.94] tracking-tighter text-foreground text-[clamp(2rem,4.8vw,3.8rem)]"
              >
                Let's Build<br />
                Something<br />
                <span className="animate-gradient bg-gradient-to-r from-[#6EE7FF] via-[#8B7CFF] to-[#6EE7FF] bg-clip-text text-transparent bg-[length:220%_auto]">
                  People Remember.
                </span>
              </h2>
            </motion.div>

            {/* 4 premium contact cards */}
            {CONTACT_CARDS.map((card, i) => (
              <ContactCard key={card.id} card={card} delay={0.08 + i * 0.08} />
            ))}
          </div>

          {/* ═══════════════════════════════════
              RIGHT — Premium Form
          ═══════════════════════════════════ */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.06, ease }}
              className="rounded-2xl lg:rounded-[2rem] border border-white/8 bg-card/65 backdrop-blur-xl p-5 lg:p-10"
              style={{ boxShadow: "0 28px 70px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05)" }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    ref={formRef}
                    exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                    onSubmit={onSubmit}
                    className="space-y-6 lg:space-y-8"
                    noValidate
                    aria-label="Project inquiry form"
                  >
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <FloatInput id="name"  label="Your Name"     required error={errors.name}  onChange={() => clearErr("name")}  />
                      <FloatInput id="email" label="Email Address"  type="email" required error={errors.email} onChange={() => clearErr("email")} />
                    </div>

                    {/* Company */}
                    <FloatInput id="company" label="Company / Brand (optional)" />

                    {/* Project Type */}
                    <fieldset className="text-left space-y-3">
                      <legend className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground/70">
                        Project Type
                      </legend>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {PROJECT_TYPES.map((pt) => {
                          const active = type === pt.id;
                          const Ico = pt.Icon;
                          return (
                            <motion.button
                              key={pt.id}
                              type="button"
                              onClick={() => setType(pt.id)}
                              aria-pressed={active}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.96 }}
                              className={`relative flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-[10.5px] font-medium text-center border transition-all duration-300 overflow-hidden ${
                                active
                                  ? "border-[#6EE7FF]/45 bg-[#6EE7FF]/10 text-[#6EE7FF] shadow-[0_0_18px_rgba(110,231,255,0.12)]"
                                  : "border-white/7 bg-white/[0.025] text-muted-foreground hover:border-white/14 hover:text-foreground/80"
                              }`}
                            >
                              <Ico
                                className={`size-4 transition-colors ${active ? "text-[#6EE7FF]" : "text-muted-foreground"}`}
                                strokeWidth={1.5}
                              />
                              {pt.label}
                              {active && (
                                <motion.div
                                  layoutId="pt-bg"
                                  className="absolute inset-0 rounded-xl bg-[#6EE7FF]/6 pointer-events-none"
                                  transition={{ duration: 0.25, ease }}
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* Budget — Apple Pay-style glass cards */}
                    <fieldset className="text-left space-y-3" aria-describedby={errors.budget ? "budget-err" : undefined}>
                      <legend className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground/70">
                        Budget<span className="text-[#6EE7FF]/80 ml-0.5">*</span>
                      </legend>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BUDGET_CARDS.map((bc) => {
                          const active = budget === bc.id;
                          return (
                            <motion.button
                              key={bc.id}
                              type="button"
                              onClick={() => { setBudget(bc.id); clearErr("budget"); }}
                              aria-pressed={active}
                              whileHover={{ y: -2, scale: 1.01 }}
                              whileTap={{ scale: 0.97 }}
                              className={`relative flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-[12.5px] font-medium text-left border transition-all duration-280 overflow-hidden ${
                                active
                                  ? "border-[#6EE7FF]/50 bg-[#6EE7FF]/10 text-[#6EE7FF] shadow-[0_0_20px_rgba(110,231,255,0.14)]"
                                  : "border-white/7 bg-white/[0.025] text-muted-foreground hover:border-white/14 hover:text-foreground/80"
                              }`}
                            >
                              {/* Radio dot */}
                              <span className="flex items-center gap-2.5">
                                <span
                                  className={`size-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-250 ${
                                    active ? "border-[#6EE7FF]" : "border-muted-foreground/30"
                                  }`}
                                >
                                  {active && (
                                    <motion.span
                                      layoutId="budget-dot"
                                      className="size-1.5 rounded-full bg-[#6EE7FF]"
                                      transition={{ duration: 0.2, ease }}
                                    />
                                  )}
                                </span>
                                {bc.label}
                              </span>
                              {active && (
                                <motion.div
                                  layoutId="budget-bg"
                                  className="absolute inset-0 rounded-xl bg-[#6EE7FF]/6 pointer-events-none"
                                  transition={{ duration: 0.22, ease }}
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                      <div id="budget-err"><FieldError msg={errors.budget} /></div>
                    </fieldset>

                    {/* Timeline */}
                    <fieldset className="text-left space-y-3">
                      <legend className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground/70">
                        Timeline
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {TIMELINES.map((tl) => {
                          const active = timeline === tl;
                          return (
                            <motion.button
                              key={tl}
                              type="button"
                              onClick={() => setTimeline(tl)}
                              aria-pressed={active}
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.96 }}
                              className={`rounded-full px-4 py-2 text-[12px] font-medium border transition-all duration-250 ${
                                active
                                  ? "border-[#8B7CFF]/50 bg-[#8B7CFF]/12 text-[#8B7CFF]"
                                  : "border-white/7 bg-white/[0.025] text-muted-foreground hover:border-white/14 hover:text-foreground/80"
                              }`}
                            >
                              {tl}
                            </motion.button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* Message */}
                    <FloatTextarea error={errors.message} onChange={() => clearErr("message")} />

                    {/* CTA */}
                    <div className="pt-1 space-y-3">
                      <RippleButton
                        sending={sending}
                        btnX={btnX} btnY={btnY}
                        sBtnX={sBtnX} sBtnY={sBtnY}
                      />
                      <p className="text-center text-[11px] text-muted-foreground/45">
                        No commitment required · Response within 24 hours
                      </p>
                    </div>
                  </motion.form>
                ) : (
                  /* ── SUCCESS STATE ─────────────────────────────────── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.65, ease }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    {/* Animated check ring */}
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.08 }}
                      className="relative size-24 mb-8"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-[#6EE7FF]/25"
                      />
                      <div className="relative size-24 rounded-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #6EE7FF 0%, #8B7CFF 100%)", boxShadow: "0 0 48px rgba(110,231,255,0.4)" }}>
                        <Check className="size-10 text-[#0A0A14]" strokeWidth={2.8} />
                      </div>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22, duration: 0.55, ease }}
                      className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
                    >
                      Thanks.
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32, duration: 0.55, ease }}
                      className="mt-3 text-[14.5px] text-muted-foreground max-w-[280px] leading-relaxed"
                    >
                      I'll personally review your project and get back within{" "}
                      <span className="text-[#6EE7FF] font-medium">24 hours</span>.
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.48 }}
                      type="button"
                      onClick={resetForm}
                      className="mt-10 rounded-full border border-white/10 bg-white/[0.03] px-6 py-2.5 text-[12.5px] font-medium text-foreground/70 hover:border-[#6EE7FF]/30 hover:text-foreground transition-all duration-300"
                    >
                      Send another brief
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
