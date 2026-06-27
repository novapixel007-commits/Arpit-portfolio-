import { Link } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 16));

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 md:pt-6"
    >
      <nav
        className={`container-px flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 md:px-3 md:py-2 ${
          scrolled
            ? "glass-strong shadow-soft"
            : "border border-transparent bg-transparent"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 pl-1 md:pl-3">
          <span className="inline-block size-2 rounded-full bg-foreground" />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Vision
            <span className="text-muted-foreground">.studio</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[13.5px] text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-primary-foreground transition hover:opacity-90 md:inline-flex"
        >
          Book a call
        </a>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="grid size-9 place-items-center rounded-full hairline bg-surface md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-4 right-4 top-20 glass-strong rounded-3xl p-3 shadow-float md:hidden"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-[15px] text-foreground hover:bg-surface-2"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-2xl bg-foreground px-4 py-3 text-center text-[15px] font-medium text-primary-foreground"
          >
            Book a call
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
