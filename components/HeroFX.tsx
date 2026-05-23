"use client";
import { useEffect, useRef } from "react";

/**
 * Hero visual effects:
 *  - parallax translate on the grid + dots as user scrolls
 *  - mouse-following spotlight gradient
 *  - subtle floating orbs
 */
export default function HeroFX() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let mx = 0.5, my = 0.3, sy = 0;

    const onMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    };
    const onScroll = () => { sy = window.scrollY; };

    const tick = () => {
      if (gridRef.current) gridRef.current.style.transform = `translate3d(0, ${sy * 0.08}px, 0)`;
      if (dotsRef.current) dotsRef.current.style.transform = `translate3d(${(mx - 0.5) * -10}px, ${sy * 0.14 + (my - 0.5) * -10}px, 0)`;
      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(420px circle at ${mx * 100}% ${my * 100}%, rgba(99,102,241,0.18), transparent 60%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <div ref={gridRef} className="absolute inset-0 hero-grid" />
      <div ref={dotsRef} className="network-dots absolute inset-0" />
      <div ref={spotRef} className="absolute inset-0" />
      {/* floating pastel orbs */}
      <div className="absolute -top-10 left-[8%]   h-44 w-44 rounded-full bg-mint-200/70    blur-3xl animate-float" />
      <div className="absolute top-24  right-[8%]  h-56 w-56 rounded-full bg-peach-200/70   blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-2 left-[38%] h-48 w-48 rounded-full bg-lavender-200/70 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-10  left-[55%]  h-40 w-40 rounded-full bg-sky-200/60     blur-3xl animate-float" style={{ animationDelay: "2.2s" }} />
      <div className="absolute bottom-10 right-[30%] h-36 w-36 rounded-full bg-blush-200/60  blur-3xl animate-float" style={{ animationDelay: "4s" }} />
    </div>
  );
}
