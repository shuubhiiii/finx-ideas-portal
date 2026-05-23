"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? "backdrop-blur-xl bg-white/70 border-b border-silver-200" : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-[15px] font-bold text-ink">FinX Ideas</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">by FinXSystems</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-muted">
          <a href="#features" className="hover:text-ink transition">Features</a>
          <a href="#collab" className="hover:text-ink transition">Collaboration</a>
          <a href="#community" className="hover:text-ink transition">Community</a>
          <Link href="/login" className="hover:text-ink transition">Sign in</Link>
        </nav>
        <Link href="/request-access" className="btn-primary group">
          <Sparkles className="h-4 w-4" />
          Request Access
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>
    </header>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div
      className="relative grid place-items-center rounded-xl bg-gradient-to-br from-royal-600 to-royal-800 text-white shadow-[0_8px_24px_-10px_rgba(67,56,202,.6)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none">
        <path d="M4 18V6h10M4 12h7" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="17" cy="17" r="3" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  );
}
