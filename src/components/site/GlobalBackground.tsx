import { useEffect } from "react";

export function GlobalBackground() {
  useEffect(() => {
    // Force dark mode permanently
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
  }, []);

  const noMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <>
      <style>{`
        @keyframes blob-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 10%) scale(1.1); }
          66% { transform: translate(-5%, 5%) scale(0.9); }
        }
        @keyframes blob-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-8%, -15%) scale(1.05); }
          66% { transform: translate(8%, -5%) scale(1.15); }
        }
        @keyframes blob-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10%, -10%) scale(1.1); }
        }
        @keyframes gb-grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-2%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 2%); }
          60% { transform: translate(2%, 0%); }
          70% { transform: translate(0%, 2%); }
          80% { transform: translate(-2%, -1%); }
          90% { transform: translate(1%, 2%); }
        }
      `}</style>

      {/* ── Outer fixed container ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          zIndex: -50,
          pointerEvents: "none",
          overflow: "hidden",
          background: "#020813", // Very deep midnight blue base instead of pure black
        }}
      >
        {/* The Gaussian Glass Mesh Container */}
        <div style={{
          position: "absolute",
          inset: "-20%", // Bleed outside edges so blur doesn't cut off
          width: "140%",
          height: "140%",
          filter: "blur(140px)", // Massive Apple-style gaussian blur
          opacity: 0.85,
        }}>
          {/* Top Left Teal Blob */}
          <div style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "50%",
            height: "50%",
            background: "rgba(0, 180, 160, 0.7)", // Vibrant Teal
            borderRadius: "50%",
            animation: noMotion ? "none" : "blob-float-1 25s ease-in-out infinite alternate",
          }} />

          {/* Bottom Right Deep Blue Blob */}
          <div style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "60%",
            height: "60%",
            background: "rgba(10, 80, 240, 0.6)", // Deep Electric Blue
            borderRadius: "50%",
            animation: noMotion ? "none" : "blob-float-2 30s ease-in-out infinite alternate",
          }} />

          {/* Center Soft Cyan/Blue Blob */}
          <div style={{
            position: "absolute",
            top: "40%",
            left: "30%",
            width: "50%",
            height: "40%",
            background: "rgba(0, 120, 200, 0.5)", // Cyan-Blue
            borderRadius: "50%",
            animation: noMotion ? "none" : "blob-float-3 20s ease-in-out infinite alternate",
          }} />
        </div>

        {/* Ambient Dark Overlay to ensure text readability & add "glass" depth */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom right, rgba(2, 8, 19, 0.3), rgba(2, 8, 19, 0.7))",
        }} />

        {/* Film Grain for premium glass texture (keeps the gradients looking ultra-smooth without banding) */}
        <div
          style={{
            position: "absolute",
            top: "-50%", left: "-50%",
            width: "200%", height: "200%",
            opacity: 0.05,
            mixBlendMode: "overlay",
            backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
            backgroundSize: "200px 200px",
            animation: noMotion ? "none" : "gb-grain 8s steps(10) infinite",
            willChange: "transform",
          }}
        />
      </div>
    </>
  );
}
