"use client";

import { useRef, useState, useEffect } from "react";

/**
 * MagneticLink — an anchor element that is slightly attracted toward the
 * cursor when hovering. When the cursor moves within the "field" of the
 * link, the link element translates toward the cursor with a spring-like
 * easing. On mouse leave, it springs back to origin.
 */
export function MagneticLink({
  href,
  children,
  className = "",
  isActive = false,
  "aria-current": ariaCurrent,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  "aria-current"?: "location" | undefined;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [enabled, setEnabled] = useState(true);
  // Current interpolated values
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    if (!linkRef.current || !enabled) return;
    const rect = linkRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // Magnetic pull: stronger toward center, falloff with distance
    const dist = Math.sqrt(dx * dx + dy * dy);
    const strength = Math.max(0, 1 - dist / 120); // 120px magnetic field
    setTx(dx * strength * 0.25);
    setTy(dy * strength * 0.25);
  };

  const handleLeave = () => {
    // Spring back: animate from current position to 0
    const startX = currentRef.current.x;
    const startY = currentRef.current.y;
    const startTime = performance.now();
    const duration = 400;
    const spring = (t: number) =>
      1 - Math.pow(1 - t, 3); // ease-out cubic

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = spring(progress);
      currentRef.current = {
        x: startX * (1 - eased),
        y: startY * (1 - eased),
      };
      setTx(currentRef.current.x);
      setTy(currentRef.current.y);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  };

  return (
    <a
      ref={linkRef}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      aria-current={ariaCurrent}
      style={{
        display: "inline-block",
        transform: enabled ? `translate(${tx}px, ${ty}px)` : "none",
        transition: enabled && tx === 0 && ty === 0
          ? "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
          : "none",
        willChange: "transform",
        fontSize: "11px",
      }}
    >
      {children}
    </a>
  );
}
