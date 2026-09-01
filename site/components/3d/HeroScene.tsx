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
import { useSpring } from "motion/react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Points as PointsType } from "three";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);

// ---------------------------------------------------------------------------
// Deterministic seeded RNG (so the network is stable across reloads)
// ---------------------------------------------------------------------------
const seed = (s: number) => {
  let x = s;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
};

// ---------------------------------------------------------------------------
// Topology: 5 layers, sparsely connected (mimics a real forward-passing net
// with dropout-style sparsity). Weights are sampled per edge to support
// connection-strength visualization and pulse-speed variation.
// ---------------------------------------------------------------------------
const LAYERS = [
  { count: 5, x: -1.8, label: "input" },
  { count: 8, x: -0.9, label: "embed" },
  { count: 8, x: 0.0, label: "hidden" },
  { count: 6, x: 0.9, label: "hidden" },
  { count: 3, x: 1.8, label: "output" },
];

interface Node {
  id: string;
  layerIdx: number;
  layerLabel: string;
  index: number;
  pos: [number, number, number];
}

interface Edge {
  from: Node;
  to: Node;
  weight: number; // 0..1
}

function buildTopology() {
  const rng = seed(42);
  const nodes: Node[] = [];
  LAYERS.forEach((layer, li) => {
    for (let i = 0; i < layer.count; i++) {
      const spreadY = 1.2 + (li === 2 ? 0.5 : 0);
      const y = (i / Math.max(1, layer.count - 1) - 0.5) * spreadY * 1.4;
      const z = (rng() - 0.5) * 0.35;
      nodes.push({
        id: `${li}-${i}`,
        layerIdx: li,
        layerLabel: layer.label,
        index: i,
        pos: [layer.x, y, z],
      });
    }
  });

  const edges: Edge[] = [];
  for (let li = 0; li < LAYERS.length - 1; li++) {
    const a = nodes.filter((n) => n.layerIdx === li);
    const b = nodes.filter((n) => n.layerIdx === li + 1);
    for (const na of a) {
      for (const nb of b) {
        if (rng() < 0.62) {
          const r = rng();
          const weight = r < 0.15 ? 0.15 + r * 0.3 : 0.4 + r * 0.55;
          edges.push({ from: na, to: nb, weight });
        }
      }
    }
  }
  return { nodes, edges };
}

// ---------------------------------------------------------------------------
// Particle data field: a cloud of dim points drifting behind the network.
// Adds spatial depth without competing with the foreground.
// ---------------------------------------------------------------------------
function buildParticles(count: number) {
  const rng = seed(7);
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // Distribute in a flattened sphere around the network
    const r = 1.5 + rng() * 4.5;
    const theta = rng() * Math.PI * 2;
    const phi = (rng() - 0.5) * Math.PI;
    positions[i * 3] = r * Math.cos(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * 0.6;
    positions[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta) - 1.5;
    phases[i] = rng() * Math.PI * 2;
  }
  return { positions, phases, count };
}

// ---------------------------------------------------------------------------
// Flowing edge: a static line (the connection) with a bright sphere
// pulse that travels from `from` to `to` over time. Each edge has its own
// phase offset so the net always has a few signals in flight. Pulse color
// is a soft violet to evoke "data in flight" against the deep background.
// ---------------------------------------------------------------------------
function FlowingEdge({
  from,
  to,
  weight,
  active,
  offset,
}: {
  from: [number, number, number];
  to: [number, number, number];
  weight: number;
  active: boolean;
  offset: number;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const tRef = useRef(offset);
  const baseOpacity = 0.18 + weight * 0.4;

  const lineOpacity = useSpring(active ? 1 : 0.6, {
    stiffness: 140,
    damping: 26,
  });
  useEffect(() => {
    lineOpacity.set(active ? 1 : 0.6);
  }, [active, lineOpacity]);

  const points = useMemo(
    () => [new THREE.Vector3(...from), new THREE.Vector3(...to)],
    [from, to]
  );

  useFrame((_, delta) => {
    if (!pulseRef.current) return;
    const speed = 0.4 + weight * 0.3;
    tRef.current = (tRef.current + delta * speed) % 1;
    const t = tRef.current;
    pulseRef.current.position.set(
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t,
      from[2] + (to[2] - from[2]) * t
    );
    const scale = 0.04 + weight * 0.05;
    pulseRef.current.scale.setScalar(scale);
    const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.4 + weight * 0.5;
  });

  return (
    <group>
      <Line
        points={points}
        color="#a09bff"
        lineWidth={0.5 + weight * 0.6}
        transparent
        opacity={baseOpacity * (lineOpacity.get() as number)}
        depthWrite={false}
      />
      <mesh ref={pulseRef} position={from}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#c4b8ff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Particle field — points drift with low frequency; closer to camera = brighter.
// ---------------------------------------------------------------------------
function ParticleField({
  cursorRef,
  count,
  reducedMotion,
}: {
  cursorRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  count: number;
  reducedMotion: boolean;
}) {
  const pointsRef = useRef<PointsType>(null);
  const { positions, phases } = useMemo(() => buildParticles(count), [count]);

  useFrame((state) => {
    if (!pointsRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    const geom = pointsRef.current.geometry as THREE.BufferGeometry;
    const arr = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const phase = phases[i];
      // Tiny oscillation per axis — keeps particles in roughly the same region
      arr[i * 3] += Math.sin(t * 0.15 + phase) * 0.0008;
      arr[i * 3 + 1] += Math.cos(t * 0.18 + phase * 1.3) * 0.0006;
      arr[i * 3 + 2] += Math.sin(t * 0.12 + phase * 0.7) * 0.0007;
    }
    geom.attributes.position.needsUpdate = true;
    // Parallax: field gently shifts opposite to cursor for depth
    const cx = cursorRef.current.x;
    const cy = cursorRef.current.y;
    pointsRef.current.rotation.y = -cx * 0.04;
    pointsRef.current.rotation.x = cy * 0.03;
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
        color="#a09bff"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Neuron: a node sphere that reacts to hover (scale up) and to cursor
// proximity (subtle pulse). Uses spring physics for the hover state and
// raw lerp for the proximity pulse (so nearby nodes glow smoothly).
// ---------------------------------------------------------------------------
interface NeuronProps {
  position: [number, number, number];
  node: Node;
  cursorRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
}

function Neuron({ position, node, cursorRef }: NeuronProps) {
  const ref = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const scale = useSpring(hovered ? 1.7 : 1, {
    stiffness: 200,
    damping: 18,
  });
  const haloOpacity = useSpring(hovered ? 0.5 : 0, {
    stiffness: 200,
    damping: 18,
  });
  useEffect(() => {
    scale.set(hovered ? 1.7 : 1);
    haloOpacity.set(hovered ? 0.5 : 0);
  }, [hovered, scale, haloOpacity]);

  useFrame(() => {
    if (!ref.current) return;
    const cx = cursorRef.current.x;
    const cy = cursorRef.current.y;
    const cz = cursorRef.current.z;
    const dx = ref.current.position.x - cx;
    const dy = ref.current.position.y - cy;
    const dz = ref.current.position.z - cz;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const prox = Math.max(0, 1 - dist / 1.2);
    const target = hovered
      ? (scale.get() as number)
      : 1 + prox * 0.4;
    ref.current.scale.lerp(
      new THREE.Vector3(target, target, target),
      0.12
    );
    if (haloRef.current) {
      const haloMat = haloRef.current.material as THREE.MeshBasicMaterial;
      haloMat.opacity = (haloOpacity.get() as number) + prox * 0.18;
      haloRef.current.scale.setScalar(1 + prox * 0.2);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#c4b8ff" />
      </mesh>
      <mesh ref={haloRef} renderOrder={-1}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color="#7c6cff" transparent opacity={0} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Camera rig: spring camera that follows the cursor with parallax. Adds
// a low-amplitude idle drift so the scene "breathes" even when the cursor
// is centered.
// ---------------------------------------------------------------------------
function CameraRig({
  pointer,
  reducedMotion,
}: {
  pointer: { x: number; y: number };
  reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));

  const x = useSpring(reducedMotion ? 0 : pointer.x * 0.5, {
    stiffness: 60,
    damping: 18,
    mass: 0.8,
  });
  const y = useSpring(reducedMotion ? 0 : pointer.y * 0.35, {
    stiffness: 60,
    damping: 18,
    mass: 0.8,
  });
  const z = useSpring(reducedMotion ? 0 : 0.6 - Math.abs(pointer.x) * 0.2, {
    stiffness: 60,
    damping: 18,
    mass: 0.8,
  });
  useEffect(() => {
    if (reducedMotion) {
      x.set(0);
      y.set(0);
      z.set(0);
    } else {
      x.set(pointer.x * 0.5);
      y.set(pointer.y * 0.35);
      z.set(0.6 - Math.abs(pointer.x) * 0.2);
    }
  }, [reducedMotion, pointer.x, pointer.y, x, y, z]);

  useFrame((state) => {
    if (reducedMotion) {
      camera.position.set(0, 0, 3.5);
      camera.lookAt(0, 0, 0);
      return;
    }
    const t = state.clock.elapsedTime;
    const driftX = Math.sin(t * 0.18) * 0.15;
    const driftY = Math.cos(t * 0.22) * 0.08;
    camera.position.set(
      (x.get() as number) + driftX,
      (y.get() as number) + driftY,
      z.get() as number
    );
    camera.lookAt(target.current);
  });
  return null;
}

// ---------------------------------------------------------------------------
// Main scene
// ---------------------------------------------------------------------------
interface SceneProps {
  reducedMotion: boolean;
}

function Scene({ reducedMotion }: SceneProps) {
  const groupRef = useRef<Group>(null);
  const { nodes, edges } = useMemo(() => buildTopology(), []);
  // Particle count: capped for perf, fewer on small screens
  const [particleCount, setParticleCount] = useState(220);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => setParticleCount(window.innerWidth < 768 ? 110 : 220);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const pointerRef = useRef({ x: 0, y: 0, z: 0 });
  const cursorWorldRef = useRef({ x: 0, y: 0, z: 0 });
  const [cursorScreen, setCursorScreen] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: PointerEvent) => {
      const cx = (e.clientX / window.innerWidth) * 2 - 1;
      const cy = -((e.clientY / window.innerHeight) * 2 - 1);
      pointerRef.current.x = cx;
      pointerRef.current.y = cy;
      setCursorScreen({ x: cx, y: cy });
      cursorWorldRef.current.x = cx * 2.4;
      cursorWorldRef.current.y = cy * 1.4;
      cursorWorldRef.current.z = 0;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (reducedMotion) {
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.x = 0.1;
      return;
    }
    const t = state.clock.elapsedTime;
    const targetY = pointerRef.current.x * 0.25 + Math.sin(t * 0.12) * 0.05;
    const targetX =
      0.1 - pointerRef.current.y * 0.18 + Math.cos(t * 0.16) * 0.03;
    groupRef.current.rotation.y +=
      (targetY - groupRef.current.rotation.y) * 0.06;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.06;
  });

  return (
    <>
      <color attach="background" args={["#0a0a14"]} />
      <fog attach="fog" args={["#0a0a14", 4, 11]} />
      <CameraRig pointer={cursorScreen} reducedMotion={reducedMotion} />
      {/* Atmospheric lighting: ambient + two colored point lights for depth */}
      <ambientLight intensity={0.6} color="#5a5675" />
      <pointLight position={[-3, 2, 2.5]} intensity={1.2} color="#7c6cff" distance={9} decay={1.2} />
      <pointLight position={[3, -2, 1.5]} intensity={1.0} color="#5a78ff" distance={9} decay={1.2} />
      <directionalLight position={[0, 1, 3]} intensity={0.4} color="#a09bff" />

      <ParticleField
        cursorRef={cursorWorldRef}
        count={particleCount}
        reducedMotion={reducedMotion}
      />
      <group ref={groupRef}>
        {nodes.map((n) => (
          <Neuron
            key={n.id}
            position={n.pos}
            node={n}
            cursorRef={cursorWorldRef}
          />
        ))}
        {edges.map((e, i) => (
          <FlowingEdge
            key={i}
            from={e.from.pos}
            to={e.to.pos}
            weight={e.weight}
            active={!reducedMotion}
            offset={(i * 0.13) % 1}
          />
        ))}
      </group>
    </>
  );
}

// ---------------------------------------------------------------------------
// Fallback SVG — used when WebGL is unavailable. Mirrors the 5-layer
// shape with a representative set of edges.
// ---------------------------------------------------------------------------
function FallbackSVG() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full"
      role="img"
      aria-label="Stylized 5-layer learning network"
    >
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c6cff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7c6cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="#0a0a14" />
      <g stroke="#a09bff" strokeWidth="0.5" fill="none" opacity="0.4">
        {Array.from({ length: 18 }).map((_, i) => {
          const layerX = (i % 4) * 80 + 60;
          const fromY = 50 + ((i * 23) % 200);
          const toY = 50 + ((i * 37) % 200);
          return (
            <line
              key={i}
              x1={layerX}
              y1={fromY}
              x2={layerX + 80}
              y2={toY}
            />
          );
        })}
      </g>
      {[
        { x: 60, n: 5 },
        { x: 140, n: 8 },
        { x: 220, n: 8 },
        { x: 300, n: 6 },
        { x: 380, n: 3 },
      ].map((l, li) => (
        <g key={li}>
          {Array.from({ length: l.n }).map((_, i) => {
            const cy = 40 + (i * 240) / Math.max(1, l.n - 1);
            return <circle key={i} cx={l.x} cy={cy} r="3.5" fill="#c4b8ff" />;
          })}
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// WebGL support + reduced-motion hooks
// ---------------------------------------------------------------------------
function useWebGLSupport() {
  const [s, setS] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      setS(!!gl);
    } catch {
      setS(false);
    }
  }, []);
  return s;
}

function useReducedMotionSafe() {
  const [m, setM] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setM(mq.matches);
    const onChange = () => setM(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return m;
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
export function HeroScene() {
  const supported = useWebGLSupport();
  const reducedMotion = useReducedMotionSafe();

  if (supported === false) return <FallbackSVG />;
  if (supported === null) {
    return (
      <div
        className="w-full h-full"
        style={{
          background:
            "radial-gradient(ellipse at center, #181a2b 0%, #0a0a14 70%)",
        }}
      />
    );
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.5], fov: 42 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
