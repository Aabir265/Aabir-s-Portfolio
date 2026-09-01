"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import { useSpring } from "motion/react";
import { motionValue } from "motion/react";
import * as THREE from "three";
import type { Group, Points as PointsType } from "three";
import { site } from "@/lib/site";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);

// ---------------------------------------------------------------------------
// Research paper positions on the loss surface
// ---------------------------------------------------------------------------
const researchData = site.research.map((r) => {
  const positions: Record<string, [number, number]> = {
    "gst-du": [-1.5, -0.7],
    "gst-iit-roorkee": [0.5, 0.8],
    "martingale-iit-madras": [1.3, -0.5],
  };
  const pos = positions[r.id] ?? [0, 0];
  return { ...r, worldX: pos[0], worldY: pos[1] };
});

// Loss surface function
function lossSurface(x: number, y: number) {
  return 0.45 * Math.sin(1.2 * x) * Math.cos(1.2 * y);
}

// ---------------------------------------------------------------------------
// Particle field for immersive depth around the manifold
// ---------------------------------------------------------------------------
function buildParticleField(count: number) {
  const rng = (() => {
    let x = 99;
    return () => {
      x = (x * 9301 + 49297) % 233280;
      return x / 233280;
    };
  })();
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 1.2 + rng() * 5.5;
    const theta = rng() * Math.PI * 2;
    const phi = (rng() - 0.5) * Math.PI * 0.7;
    positions[i * 3] = r * Math.cos(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta) - 1.5;
    phases[i] = rng() * Math.PI * 2;
  }
  return { positions, phases, count };
}

function ParticleField({
  cursorX,
  reducedMotion,
  count,
}: {
  cursorX: { get: () => number };
  reducedMotion: boolean;
  count: number;
}) {
  const pointsRef = useRef<PointsType>(null);
  const { positions, phases } = useMemo(
    () => buildParticleField(count),
    [count]
  );

  useFrame((state) => {
    if (!pointsRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    const geom = pointsRef.current.geometry as THREE.BufferGeometry;
    const arr = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += Math.sin(t * 0.12 + phases[i]) * 0.001;
      arr[i * 3 + 1] += Math.cos(t * 0.15 + phases[i] * 1.4) * 0.0008;
      arr[i * 3 + 2] += Math.sin(t * 0.1 + phases[i] * 0.9) * 0.001;
    }
    geom.attributes.position.needsUpdate = true;
    // Gentle cursor parallax
    const cx = cursorX.get();
    pointsRef.current.rotation.y = -cx * 0.06;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#5a78ff"
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Safe motionValue ref — creates stable refs across renders
// ---------------------------------------------------------------------------
function useMotionRef(initial = 0) {
  const mv = useRef(motionValue(initial));
  return mv.current;
}

// ---------------------------------------------------------------------------
// Wireframe surface mesh with atmospheric lighting
// ---------------------------------------------------------------------------
function Surface({
  groupRef,
  scrollProgress,
  cursorX,
  cursorY,
  reducedMotion,
  sceneOpacity,
}: {
  groupRef: React.MutableRefObject<Group | null>;
  scrollProgress: { get: () => number };
  cursorX: { get: () => number };
  cursorY: { get: () => number };
  reducedMotion: boolean;
  sceneOpacity: React.MutableRefObject<number>;
}) {
  const geometry = useMemo(() => {
    const segments = 40;
    const size = 4;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    const positions = geom.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      positions.setZ(i, lossSurface(x, y));
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (reducedMotion) {
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.x = -0.3;
      return;
    }
    const t = state.clock.elapsedTime;
    const sp = scrollProgress.get();
    const cx = cursorX.get();
    const cy = cursorY.get();
    groupRef.current.rotation.y = sp * Math.PI * 0.8 + t * 0.03 + cx * 0.12;
    groupRef.current.rotation.x = -0.3 + cy * 0.08;
    // Fade scene in/out based on scroll
    sceneOpacity.current = THREE.MathUtils.lerp(sceneOpacity.current, 1, 0.05);
  });

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color="#8080cc"
        wireframe
        transparent
        opacity={0.22}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Research dot: sphere + halo ring on the surface.
// ---------------------------------------------------------------------------
interface ResearchDotProps {
  worldX: number;
  worldY: number;
  baseColor: string;
  activeColor: string;
  label: string;
  venue: string;
  dateLabel: string;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
  reducedMotion: boolean;
}

function ResearchDot({
  worldX,
  worldY,
  baseColor,
  activeColor,
  label,
  venue,
  dateLabel,
  isHovered,
  isSelected,
  onHover,
  onSelect,
  reducedMotion,
}: ResearchDotProps) {
  const worldZ = lossSurface(worldX, worldY) + 0.08;
  const dotColor = isSelected ? activeColor : baseColor;
  const floatSpeed = 0.5 + Math.abs(worldX) * 0.3;
  const floatAmp = 0.04;

  // Spring for dot scale
  const scale = useSpring(isHovered || isSelected ? 1.6 : 1, {
    stiffness: 220,
    damping: 20,
  });
  useEffect(() => {
    scale.set(isHovered || isSelected ? 1.6 : 1);
  }, [isHovered, isSelected, scale]);

  // Halo ring
  const haloRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!haloRef.current) return;
    haloRef.current.visible = isHovered;
    haloRef.current.scale.setScalar(isHovered ? 1 : 0);
  }, [isHovered]);

  useFrame(() => {
    if (!haloRef.current) return;
    haloRef.current.scale.lerp(
      new THREE.Vector3(isHovered ? 1 : 0, isHovered ? 1 : 0, isHovered ? 1 : 0),
      0.18
    );
    if (!outerGlowRef.current) return;
    const mat = outerGlowRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = isHovered ? 0.22 : 0.07;
  });

  return (
    <Float
      speed={reducedMotion ? 0 : floatSpeed}
      rotationIntensity={0}
      floatIntensity={reducedMotion ? 0 : floatAmp}
      floatingRange={[-0.03, 0.03]}
    >
      <group
        position={[worldX, worldY, worldZ]}
        onPointerEnter={() => onHover(label)}
        onPointerLeave={() => onHover(null)}
        onClick={() => onSelect(isSelected ? null : label)}
      >
        {/* Halo ring */}
        <mesh ref={haloRef} visible={false}>
          <ringGeometry args={[0.09, 0.14, 32]} />
          <meshBasicMaterial
            color={dotColor}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Outer glow */}
        <mesh ref={outerGlowRef}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color={dotColor} transparent opacity={0.07} />
        </mesh>

        {/* Main dot */}
        <mesh>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={dotColor} />
        </mesh>

        {/* Invisible hit target */}
        <mesh visible={false}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshBasicMaterial />
        </mesh>
      </group>
    </Float>
  );
}

// ---------------------------------------------------------------------------
// Camera rig: spring camera that tracks the hovered/selected dot.
// ---------------------------------------------------------------------------
interface CameraRigProps {
  hoveredId: string | null;
  selectedId: string | null;
  scrollProgress: { get: () => number };
  cursorX: { get: () => number };
  reducedMotion: boolean;
}

function ManifoldCameraRig({
  hoveredId,
  selectedId,
  scrollProgress,
  cursorX,
  reducedMotion,
}: CameraRigProps) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const activeWorldPos = useRef(new THREE.Vector3(0, 0, 0));

  const activeData = useMemo(
    () =>
      [...researchData].find(
        (r) => r.title === hoveredId || r.title === selectedId
      ),
    [hoveredId, selectedId]
  );

  useFrame((state) => {
    if (reducedMotion) {
      camera.position.set(0, 0, 4.5);
      camera.lookAt(0, 0, 0);
      return;
    }
    const t = state.clock.elapsedTime;
    const sp = scrollProgress.get();
    const cx = cursorX.get();

    // Target camera position
    if (activeData) {
      activeWorldPos.current.set(
        activeData.worldX * 0.4,
        activeData.worldY * 0.4,
        3.8
      );
    } else {
      activeWorldPos.current.set(
        cx * 0.6 + Math.sin(t * 0.15) * 0.3,
        Math.cos(t * 0.18) * 0.2,
        4.5 - sp * 0.8
      );
    }

    camera.position.lerp(activeWorldPos.current, 0.05);
    camera.lookAt(target.current);
  });

  return null;
}

// ---------------------------------------------------------------------------
// Main scene
// ---------------------------------------------------------------------------
function Scene({
  reducedMotion,
  containerRef,
}: {
  reducedMotion: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const groupRef = useRef<Group>(null);
  const sceneOpacity = useRef(0);

  const scrollProgress = useMotionRef(0);
  const cursorX = useMotionRef(0);
  const cursorY = useMotionRef(0);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [particleCount, setParticleCount] = useState(600);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => setParticleCount(window.innerWidth < 768 ? 280 : 600);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = rect.top;
      const end = rect.bottom - vh;
      const progress = end <= 0 ? 1 : Math.max(0, Math.min(1, -start / (end - start)));
      scrollProgress.set(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cursor tracking
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      cursorX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
      cursorY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
    };
    const el = containerRef.current;
    if (el) el.addEventListener("mousemove", onMove);
    return () => {
      if (el) el.removeEventListener("mousemove", onMove);
    };
  }, []);

  const handleHover = (id: string | null) => setHoveredId(id);
  const handleSelect = (id: string | null) => setSelectedId(id);

  const activeDot = [...researchData].find(
    (r) => r.title === hoveredId || r.title === selectedId
  );

  return (
    <>
      <color attach="background" args={["#0a0a14"]} />
      <fog attach="fog" args={["#0a0a14", 5, 13]} />
      <ManifoldCameraRig
        hoveredId={hoveredId}
        selectedId={selectedId}
        scrollProgress={scrollProgress}
        cursorX={cursorX}
        reducedMotion={reducedMotion}
      />
      {/* Atmospheric lighting for the manifold */}
      <ambientLight intensity={0.5} color="#4a4870" />
      <pointLight position={[-3, 3, 2]} intensity={1.4} color="#7c6cff" distance={10} decay={1.2} />
      <pointLight position={[3, -2, 2]} intensity={1.0} color="#5a78ff" distance={9} decay={1.2} />
      <directionalLight position={[0, 1, 3]} intensity={0.5} color="#a09bff" />

      <ParticleField
        cursorX={cursorX}
        reducedMotion={reducedMotion}
        count={particleCount}
      />
      <group ref={groupRef}>
        <Surface
          groupRef={groupRef}
          scrollProgress={scrollProgress}
          cursorX={cursorX}
          cursorY={cursorY}
          reducedMotion={reducedMotion}
          sceneOpacity={sceneOpacity}
        />
        {researchData.map((r) => (
          <ResearchDot
            key={r.id}
            worldX={r.worldX}
            worldY={r.worldY}
            baseColor="#a09bff"
            activeColor="#5a78ff"
            label={r.title}
            venue={r.venue}
            dateLabel={r.dateLabel}
            isHovered={r.title === hoveredId}
            isSelected={r.title === selectedId}
            onHover={handleHover}
            onSelect={handleSelect}
            reducedMotion={reducedMotion}
          />
        ))}
      </group>
      {/* HTML overlay for active dot */}
      {activeDot && (
        <Html
          position={[
            activeDot.worldX,
            activeDot.worldY,
            lossSurface(activeDot.worldX, activeDot.worldY) + 0.5,
          ]}
          center
          distanceFactor={5}
          zIndexRange={[10, 20]}
          style={{ pointerEvents: "none" as const }}
        >
          <div
            style={{
              background: "rgba(17, 18, 31, 0.92)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(8px)",
              borderRadius: "8px",
              padding: "0.625rem 0.875rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              letterSpacing: "0.04em",
              color: "var(--color-on-deep-soft)",
              whiteSpace: "nowrap",
              maxWidth: "280px",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            <div
              style={{
                color: "var(--color-on-deep)",
                marginBottom: "0.25rem",
                fontSize: "0.75rem",
              }}
            >
              {activeDot.title.length > 48
                ? activeDot.title.slice(0, 48) + "…"
                : activeDot.title}
            </div>
            <div>{activeDot.venue.split(",")[0]}</div>
            <div style={{ color: "var(--color-on-deep-faint)", marginTop: "0.125rem" }}>
              {activeDot.dateLabel} · {activeDot.host}
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Fallback heatmap (no WebGL)
// ---------------------------------------------------------------------------
function FallbackHeatmap() {
  return (
    <svg
      viewBox="0 0 400 240"
      className="w-full h-full"
      role="img"
      aria-label="Loss surface visualization with paper data points"
    >
      <defs>
        <radialGradient id="hm-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c6cff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#5a78ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#0a0a14" />
      <rect width="400" height="240" fill="url(#hm-glow)" />
      {Array.from({ length: 30 }).map((_, i) =>
        Array.from({ length: 18 }).map((_, j) => {
          const x = (i / 30) * 4 - 2;
          const y = (j / 18) * 2.4 - 1.2;
          const z = lossSurface(x, y);
          const opacity = 0.12 + Math.abs(z) * 0.5;
          return (
            <rect
              key={`${i}-${j}`}
              x={i * 13.33}
              y={j * 13.33}
              width="13.33"
              height="13.33"
              fill="#8080cc"
              opacity={opacity}
            />
          );
        })
      )}
      {researchData.map((r) => {
        const z = lossSurface(r.worldX, r.worldY);
        const cx = ((r.worldX + 2) / 4) * 400;
        const cy = ((r.worldY + 1.2) / 2.4) * 240;
        return (
          <g key={r.id}>
            <circle cx={cx} cy={cy} r="9" fill="rgba(160,155,255,0.15)" />
            <circle cx={cx} cy={cy} r="5" fill="#a09bff" />
            <circle cx={cx} cy={cy} r="2.5" fill="#5a78ff" />
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// WebGL support hook
// ---------------------------------------------------------------------------
function useWebGLSupport() {
  const [s, setS] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setS(!!gl);
    } catch {
      setS(false);
    }
  }, []);
  return s;
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
export function ManifoldScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const supported = useWebGLSupport();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (supported === false) return <FallbackHeatmap />;
  if (supported === null) return <FallbackHeatmap />;

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene reducedMotion={reducedMotion} containerRef={containerRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
