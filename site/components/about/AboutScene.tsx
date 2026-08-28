"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy-load the heavy Spline bundle — only on the client, only when About renders
const SplineScene = dynamic(
  () => import("@/components/ui/splite").then((m) => m.SplineScene),
  { ssr: false }
);

const SPLINE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

// ---------------------------------------------------------------------------
// WebGL support detection
// ---------------------------------------------------------------------------
function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

// ---------------------------------------------------------------------------
// Reduced-motion detection
// ---------------------------------------------------------------------------
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// ---------------------------------------------------------------------------
// Static SVG poster — used when WebGL / mobile / reduced-motion
// ---------------------------------------------------------------------------
function StaticPoster() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--color-deep)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width="300"
        height="300"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="pg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c6cff" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#5a78ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4b5cff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ph" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a09bff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a09bff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#ph)" />
        <circle cx="100" cy="100" r="55" fill="url(#pg)" />
        <circle cx="100" cy="100" r="32" fill="none" stroke="#a09bff" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="100" y1="30" x2="100" y2="45" stroke="#a09bff" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="100" y1="155" x2="100" y2="170" stroke="#a09bff" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="30" y1="100" x2="45" y2="100" stroke="#a09bff" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="155" y1="100" x2="170" y2="100" stroke="#a09bff" strokeWidth="1" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component - Fullscreen 3D scene
// ---------------------------------------------------------------------------
export function AboutScene({ className = "" }: { className?: string }) {
  const webgl = useWebGLSupport();
  const reduced = useReducedMotion();

  const showFallback = webgl === false || webgl === null || reduced;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "var(--color-deep)",
        overflow: "hidden",
      }}
    >
      {showFallback ? (
        <StaticPoster />
      ) : (
        <div style={{ width: "100%", height: "100%" }} aria-hidden="true">
          <SplineScene
            scene={SPLINE_URL}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
