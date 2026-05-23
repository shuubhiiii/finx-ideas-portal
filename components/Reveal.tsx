"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type Variant = "up" | "fade" | "scale" | "left" | "right";

export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: Variant;
  className?: string;
  as?: any;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const base = "transition-all duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] will-change-transform";
  const hidden: Record<Variant, string> = {
    up: "opacity-0 translate-y-6",
    fade: "opacity-0",
    scale: "opacity-0 scale-[0.97]",
    left: "opacity-0 -translate-x-6",
    right: "opacity-0 translate-x-6",
  };
  const shown = "opacity-100 translate-x-0 translate-y-0 scale-100";

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={clsx(base, visible ? shown : hidden[variant], className)}
    >
      {children}
    </Tag>
  );
}
