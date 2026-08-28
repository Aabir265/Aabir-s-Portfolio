"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useScroll, useTransform, motionValue } from "motion/react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);

// Loss surface: z = 0.5*sin(1.2*x) * cos(1.2*y) + small noise
function lossSurface(x: number, y: number) {
  return 0.45 * Math.sin(1.2 * x) * Math.cos(1.2 * y);
}

// Paper data points on the surface
const dataPoints = [
  { id: "gst-du", x: -1.6, y: -0.8, color: "#f0efec", label: "GST Buoyancy · Univ. of Delhi · ICSSR" },
  { id: "gst-iit-roorkee", x: 0.4, y: 1.0, color: "#f0efec", label: "GST Innovation · IIT Roorkee" },
  { id: "martingale-iit-madras", x: 1.4, y: -0.6, color: "#f0efec", label: "Martingale Hypothesis · IIT Madras" },
];

function WireframeSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<Group>(null);
  const scrollProgress = useMotionValueSafe(0);
  const cursorX = useMotionValueSafe(0);
  const cursorY = useMotionValueSafe(0);

  const geometry = useMemo(() => {
    const segments = 40;
    const size = 4;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    const positions = geom.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = lossSurface(x, y);
      positions.setZ(i, z);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const sp = scrollProgress.get();
    const cx = cursorX.get();
    const cy = cursorY.get();
    groupRef.current.rotation.y = sp * Math.PI * 0.8 + t * 0.04 + cx * 0.08;
    groupRef.current.rotation.x = -0.3 + cy * 0.05;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          color="#0f0f0e"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
      {dataPoints.map((p) => {
        const z = lossSurface(p.x, p.y);
        return (
          <group key={p.id} position={[p.x, p.y, z + 0.08]}>
            <mesh>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color={p.color} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshBasicMaterial color={p.color} transparent opacity={0.15} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Local hook to keep refs honest across server / client
function useMotionValueSafe(initial: number) {
  const mv = useRef(motionValue(initial));
  return mv.current;
}

function FallbackHeatmap() {
  // A 2D SVG heatmap visualization as fallback
  return (
    <svg
      viewBox="0 0 400 240"
      className="w-full h-full"
      role="img"
      aria-label="Loss surface visualization with paper data points"
    >
      <rect width="400" height="240" fill="var(--color-ink-surface)" />
      {Array.from({ length: 30 }).map((_, i) =>
        Array.from({ length: 18 }).map((_, j) => {
          const x = (i / 30) * 4 - 2;
          const y = (j / 18) * 2.4 - 1.2;
          const z = lossSurface(x, y);
          const opacity = 0.1 + Math.abs(z) * 0.5;
          return (
            <rect
              key={`${i}-${j}`}
              x={i * 13.33}
              y={j * 13.33}
              width="13.33"
              height="13.33"
              fill="#f0efec"
              opacity={opacity}
            />
          );
        })
      )}
      {dataPoints.map((p) => {
        const z = lossSurface(p.x, p.y);
        const cx = ((p.x + 2) / 4) * 400;
        const cy = ((p.y + 1.2) / 2.4) * 240;
        return (
          <g key={p.id}>
            <circle cx={cx} cy={cy} r="6" fill="var(--color-ink-canvas)" />
            <circle cx={cx} cy={cy} r="3" fill="#f0efec" />
          </g>
        );
      })}
    </svg>
  );
}

export function ProbabilityManifold() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.8]);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const onMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const cy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      const moveEvent = new CustomEvent("manifold-cursor", {
        detail: { x: cx, y: cy },
      });
      window.dispatchEvent(moveEvent);

      // Hover detection for dots: check proximity in normalized screen space
      // Dots are roughly at these normalized positions on the manifold surface
      const dotPositions = [
        { id: "gst-du", nx: -0.28, ny: -0.15 },
        { id: "gst-iit-roorkee", nx: 0.12, ny: 0.18 },
        { id: "martingale-iit-madras", nx: 0.32, ny: -0.1 },
      ];
      let found: string | null = null;
      for (const d of dotPositions) {
        const dist = Math.sqrt((cx - d.nx) ** 2 + (cy - d.ny) ** 2);
        if (dist < 0.25) {
          found = d.id;
          break;
        }
      }
      setHoveredDot(found);
    };
    const el = containerRef.current;
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const hoveredLabel = dataPoints.find((p) => p.id === hoveredDot)?.label;

  if (supported === false) return <FallbackHeatmap />;
  if (supported === null) return <FallbackHeatmap />;

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ cursor: hoveredDot ? "pointer" : "default" }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ScrollDrivenManifold rotationY={rotationY} />
        </Suspense>
      </Canvas>
      {/* Tooltip overlay */}
      <div
        aria-live="polite"
        className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <div
          className="transition-all duration-200"
          style={{
            opacity: hoveredLabel ? 1 : 0,
            transform: hoveredLabel ? "translateY(0)" : "translateY(4px)",
            backgroundColor: "var(--color-ink-surface)",
            border: "1px solid var(--color-hairline-dark)",
            borderRadius: "var(--radius-md)",
            padding: "0.5rem 0.875rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            letterSpacing: "0.05em",
            color: "var(--color-on-dark-soft)",
            whiteSpace: "nowrap",
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          {hoveredLabel ?? ""}
        </div>
      </div>
    </div>
  );
}

function ScrollDrivenManifold({
  rotationY,
}: {
  rotationY: ReturnType<typeof useTransform<number, number>>;
}) {
  const groupRef = useRef<Group>(null);
  const cursorX = useMotionValueSafe(0);
  const cursorY = useMotionValueSafe(0);

  useEffect(() => {
    const onCursor = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      cursorX.set(detail.x);
      cursorY.set(detail.y);
    };
    window.addEventListener("manifold-cursor", onCursor);
    return () => window.removeEventListener("manifold-cursor", onCursor);
  }, [cursorX, cursorY]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const sp = rotationY.get();
    const cx = cursorX.get();
    const cy = cursorY.get();
    groupRef.current.rotation.y = sp + t * 0.04 + cx * 0.08;
    groupRef.current.rotation.x = -0.3 + cy * 0.05;
  });

  const geometry = useMemo(() => {
    const segments = 40;
    const size = 4;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    const positions = geom.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = lossSurface(x, y);
      positions.setZ(i, z);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#f0efec" wireframe transparent opacity={0.18} />
      </mesh>
      {dataPoints.map((p) => {
        const z = lossSurface(p.x, p.y);
        return (
          <group key={p.id} position={[p.x, p.y, z + 0.08]}>
            <mesh>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color="#0f0f0e" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshBasicMaterial color="#0f0f0e" transparent opacity={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
