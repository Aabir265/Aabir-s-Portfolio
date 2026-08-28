"use client";

import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Group } from "three";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);

const seed = (s: number) => {
  let x = s;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
};

function Network() {
  const group = useRef<Group>(null);
  const layers = useMemo(() => {
    const rng = seed(42);
    return [
      { count: 4, x: -1.4 },
      { count: 6, x: 0 },
      { count: 4, x: 1.4 },
    ].map((layer) => ({
      ...layer,
      nodes: Array.from({ length: layer.count }, () => ({
        y: (rng() - 0.5) * 1.6,
        z: (rng() - 0.5) * 0.4,
      })),
    }));
  }, []);

  const connections = useMemo(() => {
    const lines: Array<[number, number, number, number, number, number]> = [];
    const rng = seed(7);
    for (let i = 0; i < layers.length - 1; i++) {
      const a = layers[i];
      const b = layers[i + 1];
      for (const na of a.nodes) {
        for (const nb of b.nodes) {
          if (rng() > 0.5) {
            lines.push([a.x, na.y, na.z, b.x, nb.y, nb.z]);
          }
        }
      }
    }
    return lines;
  }, [layers]);

  useEffect(() => {
    let raf = 0;
    let mounted = true;
    const tick = () => {
      if (!mounted || !group.current) return;
      group.current.rotation.y += 0.0015;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <group ref={group} rotation={[0.1, 0, 0]}>
      {layers.map((layer, li) => (
        <group key={li} position={[layer.x, 0, 0]}>
          {layer.nodes.map((node, ni) => (
            <mesh key={ni} position={[0, node.y, node.z]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color="#0f0f0e" />
            </mesh>
          ))}
        </group>
      ))}
      {connections.map((line, ci) => {
        const [x1, y1, z1, x2, y2, z2] = line;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const midZ = (z1 + z2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Vary opacity by absolute z-depth to add a sense of layering
        const depthFactor = 1 - Math.min(1, Math.abs(midZ) * 1.5);
        const opacity = 0.2 + depthFactor * 0.4;
        return (
          <mesh
            key={ci}
            position={[midX, midY, midZ]}
            rotation={[
              Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)),
              0,
              Math.atan2(dx, dz),
            ]}
          >
            <cylinderGeometry args={[0.003, 0.003, length, 6]} />
            <meshBasicMaterial color="#0f0f0e" opacity={opacity} transparent />
          </mesh>
        );
      })}
    </group>
  );
}

function FallbackSVG() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full"
      role="img"
      aria-label="Stylized neural network fragment"
    >
      <g stroke="#0f0f0e" strokeWidth="0.5" fill="none" opacity="0.4">
        <line x1="80" y1="80" x2="200" y2="60" />
        <line x1="80" y1="80" x2="200" y2="140" />
        <line x1="80" y1="80" x2="200" y2="220" />
        <line x1="80" y1="150" x2="200" y2="60" />
        <line x1="80" y1="150" x2="200" y2="140" />
        <line x1="80" y1="150" x2="200" y2="220" />
        <line x1="80" y1="220" x2="200" y2="140" />
        <line x1="80" y1="220" x2="200" y2="220" />
        <line x1="200" y1="60" x2="320" y2="120" />
        <line x1="200" y1="60" x2="320" y2="200" />
        <line x1="200" y1="140" x2="320" y2="120" />
        <line x1="200" y1="140" x2="320" y2="200" />
        <line x1="200" y1="220" x2="320" y2="200" />
      </g>
      <g fill="#0f0f0e">
        <circle cx="80" cy="80" r="4" />
        <circle cx="80" cy="150" r="4" />
        <circle cx="80" cy="220" r="4" />
        <circle cx="200" cy="60" r="4" />
        <circle cx="200" cy="140" r="4" />
        <circle cx="200" cy="220" r="4" />
        <circle cx="320" cy="120" r="4" />
        <circle cx="320" cy="200" r="4" />
      </g>
    </svg>
  );
}

export function HeroNeural() {
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

  if (supported === false) return <FallbackSVG />;
  if (supported === null) {
    return (
      <div
        className="w-full h-full"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-surface-soft) 0%, transparent 70%)",
        }}
      />
    );
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Network />
      </Suspense>
    </Canvas>
  );
}
