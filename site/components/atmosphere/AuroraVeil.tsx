"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AuroraVeil — a fixed-position atmospheric veil that ties the dark Hero and
 * Research sections together. Reads scroll progress through the page and
 * intensifies the violet/indigo glow near the boundaries of the dark bands.
 *
 * Implementation: a single full-viewport div with a soft radial gradient,
 * `mix-blend-mode: screen`, and an opacity driven by scroll position. The
 * gradient is centered on the mouse position so it follows the cursor subtly.
 *
 * Reduced motion: still visible (it's static), but no cursor-tracking.
 */
export function AuroraVeil() {
  const [progress, setProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const rafRef = useRef<number>(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let targetProgress = 0;
    let lastY = 0;

    const onScroll = () => {
      lastY = window.scrollY;
      const hero = document.getElementById("main")?.firstElementChild as HTMLElement | null;
      const research = document.getElementById("research") as HTMLElement | null;
      if (!hero || !research) {
        targetProgress = 0;
        return;
      }
      const vh = window.innerHeight;
      // Distance from the viewport center to the dark sections
      const heroCenter = hero.getBoundingClientRect().top + hero.offsetHeight / 2;
      const researchCenter = research.getBoundingClientRect().top + research.offsetHeight / 2;
      // How "close" are we to a dark section (closer = more veil)
      const distFromHero = Math.abs(vh / 2 - heroCenter);
      const distFromResearch = Math.abs(vh / 2 - researchCenter);
      const minDist = Math.min(distFromHero, distFromResearch);
      // Map: 0..(2*vh) -> 1..0
      const p = Math.max(0, Math.min(1, 1 - minDist / (vh * 1.5)));
      targetProgress = p;
    };

    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      setPointer({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const tick = () => {
      // Easing toward target — keeps the veil soft, not jumpy
      setProgress((prev) => prev + (targetProgress - prev) * 0.12);
      rafRef.current = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  if (progress < 0.01) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 5,
        mixBlendMode: "screen",
        opacity: progress * 0.55,
        background: `radial-gradient(ellipse 70% 60% at ${pointer.x}% ${pointer.y}%, rgba(124, 108, 255, 0.18) 0%, transparent 60%)`,
        transition: "opacity 0.4s ease",
      }}
    />
  );
}
