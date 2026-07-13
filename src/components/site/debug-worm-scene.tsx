"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { CatmullRomCurve3, Color, TubeGeometry, Vector3 } from "three";
import type * as THREE from "three";
import { useTheme } from "@/lib/theme-context";

const POINT_COUNT = 8;
const SPACING = 0.62;
const GEOMETRY_THROTTLE = 3; // rebuild the tube every 3rd frame — plenty smooth for a slow sine wave, a fraction of the allocation cost

interface WormColors {
  body: string;
  glow: string;
}

function useWormColors(): WormColors {
  const { isDark } = useTheme();
  const [colors, setColors] = useState<WormColors>({ body: "#265148", glow: "#4ec9b0" });

  useEffect(() => {
    // getComputedStyle only exists client-side; isDark flips the .light class,
    // which changes what --accent resolves to, so this re-reads on toggle.
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    if (!raw) return;
    // The body is a darkened, desaturated version of the accent — the bright
    // accent itself is reserved for headline text, so the worm needs its own
    // deeper tone or it visually merges with text sitting near it.
    const body = new Color(raw).offsetHSL(0, -0.15, -0.22);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColors({ body: `#${body.getHexString()}`, glow: raw });
  }, [isDark]);

  return colors;
}

function Worm({ bodyColor, paused }: { bodyColor: string; paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const tube = useRef<THREE.Mesh>(null);
  const eyes = useRef<THREE.Group>(null);
  const points = useRef(
    Array.from({ length: POINT_COUNT }, (_, i) => new Vector3(i * SPACING - ((POINT_COUNT - 1) * SPACING) / 2, 0, 0)),
  );
  const pointer = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const celebrateUntil = useRef(0);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (paused) return;
    const handleMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [paused]);

  useFrame((state) => {
    frame.current++;
    const t = paused ? 0 : state.clock.getElapsedTime();

    if (celebrating && t > celebrateUntil.current) setCelebrating(false);

    if (frame.current % GEOMETRY_THROTTLE === 0 && tube.current) {
      const speed = celebrating ? 3.2 : 1.5;
      const amp = celebrating ? 0.62 : 0.4;
      const pts = points.current;
      for (let i = 0; i < POINT_COUNT; i++) {
        const phase = i * 0.55;
        pts[i].y = Math.sin(t * speed - phase) * amp;
        pts[i].z = Math.cos(t * speed - phase) * amp * 0.55;
      }

      const curve = new CatmullRomCurve3(pts, false, "catmullrom", 0.5);
      const nextGeometry = new TubeGeometry(curve, 16, celebrating ? 0.3 : 0.26, 7, false);
      const prevGeometry = tube.current.geometry;
      tube.current.geometry = nextGeometry;
      prevGeometry.dispose();

      if (eyes.current) {
        const head = pts[POINT_COUNT - 1];
        const neck = pts[POINT_COUNT - 2];
        eyes.current.position.set(head.x + 0.16, head.y + (neck ? (head.y - neck.y) * 0.6 : 0) + 0.08, head.z);
      }
    }

    if (group.current) {
      const targetY = paused ? 0 : pointer.current.x * 0.32;
      const targetX = paused ? 0 : pointer.current.y * -0.16;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.06;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.06;
    }
  });

  const handleClick = () => {
    setCelebrating(true);
    celebrateUntil.current = performance.now() / 1000 + 1.1;
  };

  return (
    <group
      ref={group}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh ref={tube}>
        <bufferGeometry />
        <meshStandardMaterial
          color={bodyColor}
          emissive={bodyColor}
          emissiveIntensity={celebrating ? 0.6 : 0.3}
          roughness={0.45}
          metalness={0.08}
        />
      </mesh>
      <group ref={eyes}>
        <mesh position={[0, 0, 0.22]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        <mesh position={[0, 0, -0.22]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
      </group>
    </group>
  );
}

export function DebugWormScene() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { body, glow } = useWormColors();

  // WebGL/matchMedia only exist client-side; the Canvas below must not render
  // until after mount to avoid an SSR/hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Stop the render loop entirely once the scene scrolls out of view — a
  // WebGL canvas left running while the user reads the rest of the page is
  // pure wasted GPU work.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      {mounted && (
        <Canvas
          dpr={1}
          camera={{ position: [0, 0.5, 5.6], fov: 42 }}
          gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
          frameloop={visible ? "always" : "never"}
          style={{ position: "absolute", inset: 0 }}
        >
          <ambientLight intensity={0.7} />
          <pointLight position={[3, 3, 4]} intensity={26} color={glow} />
          <Worm bodyColor={body} paused={reducedMotion} />
        </Canvas>
      )}
    </div>
  );
}
