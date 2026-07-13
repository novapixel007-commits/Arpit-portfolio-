/**
 * Navbar.tsx
 *
 * Rendered in __root.tsx — directly inside QueryClientProvider,
 * as a sibling of <Outlet />. It is NOT inside any page wrapper,
 * clip-path container, or will-change:transform element.
 *
 * position: fixed is anchored to the REAL viewport here.
 */

import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Work",    href: "#work"    },
  { label: "Process", href: "#process" },
  { label: "About",   href: "#about"   },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#work");
  const headerRef = useRef<HTMLElement>(null);

  // ── Scroll-driven visual transitions (NEVER affect position) ──
  const navOpacity    = useTransform(scrollY, [0, 150], [0.70, 0.92]);
  const blurAmount    = useTransform(scrollY, [0, 150], [20, 36]);
  const shadowOpacity = useTransform(scrollY, [0, 150], [0.06, 0.18]);
  
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navHeightDesktop = useTransform(scrollY, [0, 120], [72, 60]);
  const navHeightMobile = useTransform(scrollY, [0, 120], [64, 52]);
  const navHeight = isDesktop ? navHeightDesktop : navHeightMobile;

  const backdropFilterStyle = useMotionTemplate`blur(${blurAmount}px) saturate(160%)`;

  useMotionValueEvent(scrollY, "change", () => {});

  // On repeat visits: reveal navbar immediately (no intro sequence)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("portfolio_intro_seen") === "true";
    if (seen && headerRef.current) {
      headerRef.current.style.opacity = "1";
    }
  }, []);

  // ── Active section tracker ──
  useEffect(() => {
    const handleScroll = () => {
      for (const { href } of NAV) {
        const el = document.querySelector(href);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom > 0) {
            setActiveSection(href);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    /**
     * WHY THIS WORKS NOW:
     * This header is rendered directly inside QueryClientProvider → body.
     * No parent has transform / will-change:transform / clip-path / filter.
     * Therefore position:fixed is anchored to the real viewport.
     *
     * The `intro-navbar` class is retained so IntroLoader GSAP can
     * animate it from { y:-32, opacity:0 } → { y:0, opacity:1 }
     * on first visits. On repeat visits the useEffect above sets
     * opacity:1 immediately.
     */
    <header
      id="site-navbar"
      ref={headerRef}
      className="intro-navbar"
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
        // Start hidden — GSAP reveals on first visit, useEffect reveals on repeat
        opacity: 0,
      }}
    >
      {/* ── Floating Glass Pill ── */}
      <motion.nav
        style={{
          height: navHeight,
          width: "min(90vw, 860px)",
          pointerEvents: "auto",
          position: "relative",
          borderRadius: "9999px",
          overflow: "visible",
        }}
      >
        {/* Ambient shadow beneath pill */}
        <motion.div
          className="absolute -inset-6 rounded-full pointer-events-none"
          style={{
            opacity: shadowOpacity,
            position: "absolute",
            top: "-24px", left: "-24px", right: "-24px", bottom: "-24px",
            borderRadius: "9999px",
            background:
              "radial-gradient(ellipse at 50% 80%, rgba(0,0,0,0.5) 0%, transparent 70%)",
            filter: "blur(12px)",
            pointerEvents: "none",
          }}
        />

        {/* Glass base fill */}
        <motion.div
          style={{ opacity: navOpacity }}
          className="absolute inset-0 rounded-full overflow-hidden"
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "color-mix(in oklab, var(--color-card) 68%, transparent)",
            }}
          />
        </motion.div>

        {/* Backdrop blur */}
        <motion.div
          style={{
            backdropFilter: backdropFilterStyle,
            WebkitBackdropFilter: backdropFilterStyle,
            position: "absolute",
            inset: 0,
            borderRadius: "9999px",
          }}
        />

        {/* Top sheen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "9999px",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.12), transparent 40%)",
            pointerEvents: "none",
          }}
        />

        {/* Hairline border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.10)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          className="px-4 lg:px-[20px]"
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#73E8FF" }} />
            <span className="text-[12.5px] lg:text-[13.5px]" style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--color-foreground)" }}>
              arpit sharma
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <div key={item.href} className="relative group">
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "9999px",
                        background: "rgba(255,255,255,0.08)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  />
                  <a
                    href={item.href}
                    onClick={() => setActiveSection(item.href)}
                    style={{
                      position: "relative",
                      zIndex: 10,
                      display: "block",
                      borderRadius: "9999px",
                      padding: "8px 16px",
                      fontSize: "12.5px",
                      fontWeight: 500,
                      transition: "color 0.2s",
                      color: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        style={{
                          position: "absolute",
                          bottom: "6px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "3px",
                          height: "3px",
                          borderRadius: "50%",
                          background: "#73E8FF",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                  </a>
                </div>
              );
            })}
          </div>

          {/* Book a Call — desktop */}
          <div className="hidden md:flex items-center" style={{ flexShrink: 0 }}>
            <a
              href="#contact"
              style={{
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                padding: "8px 20px",
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              }}
            >
              book a call
            </a>
          </div>

          {/* Hamburger — mobile */}
          <div className="flex items-center md:hidden">
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="size-8 lg:size-9"
              style={{
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {open
                ? <X    size={14} color="rgba(255,255,255,0.8)" />
                : <Menu size={14} color="rgba(255,255,255,0.8)" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: "8px",
            width: "min(90vw, 320px)",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.10)",
            padding: "12px",
            background: "color-mix(in oklab, var(--color-card) 92%, transparent)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            pointerEvents: "auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  color: activeSection === item.href ? "white" : "rgba(255,255,255,0.5)",
                  background: activeSection === item.href ? "rgba(255,255,255,0.08)" : "transparent",
                }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                marginTop: "4px",
                borderRadius: "12px",
                padding: "12px 16px",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                color: "rgba(255,255,255,0.9)",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                transition: "all 0.25s",
              }}
            >
              book a call
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
