export function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline">
      <div className="container-px mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-foreground" />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Vision<span className="text-muted-foreground">.studio</span>
          </span>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
          <a href="#work" className="hover:text-foreground">Work</a>
          <a href="#services" className="hover:text-foreground">Services</a>
          <a href="#process" className="hover:text-foreground">Process</a>
          <a href="#about" className="hover:text-foreground">About</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
        </nav>

        <div className="flex items-center gap-5 text-[13px] text-muted-foreground">
          <a href="#" className="hover:text-foreground">Instagram</a>
          <a href="#" className="hover:text-foreground">Vimeo</a>
          <a href="#" className="hover:text-foreground">LinkedIn</a>
        </div>
      </div>
      <div className="container-px mx-auto flex max-w-7xl items-center justify-between border-t border-hairline py-6 text-[12px] text-muted-foreground">
        <span>© {new Date().getFullYear()} Vision Studio. All rights reserved.</span>
        <span className="font-mono">v1.0 — Lisbon / Berlin</span>
      </div>
    </footer>
  );
}
