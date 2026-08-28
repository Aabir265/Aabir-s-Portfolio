"use client";

import { useEffect, useRef, useState } from "react";

interface LossCurveProps {
  className?: string;
}

// Smooth loss-curve path: starts high, converges exponentially
function buildLossPath(
  width: number,
  height: number,
  padding: number
): string {
  const points: [number, number][] = [];
  const steps = 60;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Exponential decay with noise
    const decay = Math.exp(-t * 4.2);
    const noise = Math.sin(t * 18) * 0.012 * (1 - t * 0.7);
    const loss = 0.82 * decay + 0.04 + noise;
    const x = padding + t * innerW;
    const y = padding + Math.min(1, Math.max(0, loss)) * innerH;
    points.push([x, y]);
  }

  // Build smooth SVG path using cardinal spline approximation
  if (points.length < 2) return "";
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i][0].toFixed(2)} ${points[i][1].toFixed(2)}`;
  }
  return d;
}

// Area fill path (same points, close to bottom)
function buildAreaPath(
  width: number,
  height: number,
  padding: number
): string {
  const points: [number, number][] = [];
  const steps = 60;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const decay = Math.exp(-t * 4.2);
    const noise = Math.sin(t * 18) * 0.012 * (1 - t * 0.7);
    const loss = 0.82 * decay + 0.04 + noise;
    const x = padding + t * innerW;
    const y = padding + Math.min(1, Math.max(0, loss)) * innerH;
    points.push([x, y]);
  }

  const bottom = height - padding;
  let d = `M ${points[0][0].toFixed(2)} ${bottom.toFixed(2)}`;
  d += ` L ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i][0].toFixed(2)} ${points[i][1].toFixed(2)}`;
  }
  d += ` L ${points[points.length - 1][0].toFixed(2)} ${bottom.toFixed(2)} Z`;
  return d;
}

export function LossCurve({ className = "" }: LossCurveProps) {
  const [animated, setAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const svgWidth = 640;
  const svgHeight = 180;
  const padding = 32;

  const linePath = buildLossPath(svgWidth, svgHeight, padding);
  const areaPath = buildAreaPath(svgWidth, svgHeight, padding);

  // Calculate path length for stroke-dashoffset animation
  const [pathLength, setPathLength] = useState(1000);

  useEffect(() => {
    const svg = containerRef.current?.querySelector("path.curve-line");
    if (svg) {
      setPathLength((svg as SVGPathElement).getTotalLength() || 1000);
    }
  }, []);

  // Trigger animation when the SVG scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ maxWidth: "100%", overflow: "hidden" }}
      aria-label="Animated loss curve visualization"
      role="img"
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full"
        style={{ display: "block" }}
      >
        {/* Grid lines */}
        <g opacity="0.35">
          {[0.25, 0.5, 0.75].map((frac) => {
            const y = padding + frac * (svgHeight - padding * 2);
            return (
              <line
                key={frac}
                x1={padding}
                y1={y}
                x2={svgWidth - padding}
                y2={y}
                stroke="var(--color-ink)"
                strokeWidth="0.5"
                strokeDasharray="2 4"
              />
            );
          })}
        </g>

        {/* Axes */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={svgHeight - padding}
          stroke="var(--color-ink)"
          strokeWidth="0.75"
        />
        <line
          x1={padding}
          y1={svgHeight - padding}
          x2={svgWidth - padding}
          y2={svgHeight - padding}
          stroke="var(--color-ink)"
          strokeWidth="0.75"
        />

        {/* Area fill (always visible, fades in) */}
        <path
          d={areaPath}
          fill="var(--color-ink)"
          opacity={animated ? 0.05 : 0}
          style={{
            transition: "opacity 1s ease 0.3s",
          }}
        />

        {/* Loss curve — stroke-dashoffset draw animation */}
        <path
          className="curve-line"
          d={linePath}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={animated ? 0 : pathLength}
          style={{
            transition: animated
              ? "stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s"
              : "stroke-dashoffset 0s",
          }}
        />

        {/* Axis labels */}
        <text
          x={padding}
          y={svgHeight - padding + 14}
          fontFamily="var(--font-mono)"
          fontSize="9"
          fill="var(--color-ink-faint)"
          letterSpacing="0.08em"
        >
          epoch
        </text>
        <text
          x={padding - 8}
          y={padding + 4}
          fontFamily="var(--font-mono)"
          fontSize="9"
          fill="var(--color-ink-faint)"
          letterSpacing="0.08em"
          textAnchor="middle"
          transform={`rotate(-90, ${padding - 8}, ${padding + 4})`}
        >
          loss
        </text>

        {/* End-point annotation */}
        <g opacity={animated ? 1 : 0} style={{ transition: "opacity 0.5s ease 1.6s" }}>
          <circle
            cx={svgWidth - padding}
            cy={padding + 0.04 * (svgHeight - padding * 2)}
            r="3"
            fill="var(--color-ink)"
          />
          <text
            x={svgWidth - padding - 8}
            y={padding - 6}
            fontFamily="var(--font-mono)"
            fontSize="8"
            fill="var(--color-ink-muted)"
            textAnchor="end"
            letterSpacing="0.06em"
          >
            converged
          </text>
        </g>
      </svg>
    </div>
  );
}
