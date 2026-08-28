"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

/**
 * TiltVisual — wraps a visual element with cursor-driven perspective tilt.
 * On hover, the visual rotates subtly based on cursor position (X and Y).
 * Includes a small parallax layer (the "fig. caption" can be a child).
 *
 * Respects prefers-reduced-motion: when set, no tilt is applied.
 */
export function TiltVisual({
  children,
  maxTilt = 6,
  className = "",
  style,
}: {
  children: ReactNode;
  maxTilt?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rx: 0, ry: 0, tz: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
    const onChange = () => setEnabled(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current || !enabled) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    // Center the rotation around the cursor
    const ry = (x - 0.5) * 2 * maxTilt; // -maxTilt..maxTilt
    const rx = (0.5 - y) * 2 * maxTilt;
    setTransform({ rx, ry, tz: 0 });
  };

  const handleLeave = () => {
    setTransform({ rx: 0, ry: 0, tz: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{
        ...style,
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          transform: enabled
            ? `rotateX(${transform.rx}deg) rotateY(${transform.ry}deg) translateZ(${transform.tz}px)`
            : "none",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}
