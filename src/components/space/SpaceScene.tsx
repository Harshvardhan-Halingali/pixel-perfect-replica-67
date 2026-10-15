import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, pointerState } from "@/lib/scroll-store";

function Stars({ count, spread, size, depth, color }: { count: number; spread: number; size: number; depth: number; color: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * spread;
      a[i * 3 + 1] = (Math.random() - 0.5) * spread;
      a[i * 3 + 2] = -Math.random() * depth + 20;
    }
    return a;
  }, [count, spread, depth]);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += Math.min(d, 0.05) * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} sizeAttenuation transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Nebula() {
  const ref = useRef<THREE.Points>(null);
  const [positions, colors] = useMemo(() => {
    const n = 2500;
    const p = new Float32Array(n * 3);
    const c = new Float32Array(n * 3);
    const palette = [new THREE.Color("#00F0FF"), new THREE.Color("#8B5CF6"), new THREE.Color("#EC4899")];
    for (let i = 0; i < n; i++) {
      const r = 8 + Math.random() * 30;
      const t = Math.random() * Math.PI * 2;
      p[i * 3] = Math.cos(t) * r;
      p[i * 3 + 1] = (Math.random() - 0.5) * 6 + Math.sin(t * 3) * 2;
      p[i * 3 + 2] = -60 + Math.sin(t) * r * 0.6;
      const col = palette[i % 3]!;
      c.set([col.r, col.g, col.b], i * 3);
    }
    return [p, c];
  }, []);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += Math.min(d, 0.05) * 0.03;
  });
  return (
    <points ref={ref} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.18} vertexColors transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Planet() {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, "#1e1b4b"); grd.addColorStop(0.5, "#5b21b6"); grd.addColorStop(1, "#0e7490");
    g.fillStyle = grd; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(${Math.random() > 0.5 ? "0,240,255" : "236,72,153"},${Math.random() * 0.25})`;
      g.fillRect(0, Math.random() * 256, 512, 2 + Math.random() * 10);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.8) * 0.25;
      group.current.rotation.x = 0.35 + pointerState.y * 0.1;
      group.current.rotation.z = -0.2 + pointerState.x * 0.1;
    }
    if (body.current) body.current.rotation.y = t * 0.15;
  });
  return (
    <group ref={group} position={[0, 0, -6]}>
      <mesh ref={body}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={tex} roughness={0.7} emissive="#3b0764" emissiveIntensity={0.4} />
      </mesh>
      <mesh scale={1.12}>
        <sphereGeometry args={[2, 48, 48]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.08} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[2.8, 4.2, 128]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.35} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[4.3, 4.35, 128]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Asteroids() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const n = 60;
  const data = useMemo(
    () => Array.from({ length: n }, () => ({
      p: new THREE.Vector3((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 18, -15 - Math.random() * 80),
      s: 0.1 + Math.random() * 0.5,
      r: Math.random() * 3,
    })),
    [],
  );
  const m = useMemo(() => new THREE.Object3D(), []);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    data.forEach((a, i) => {
      m.position.copy(a.p);
      m.rotation.set(a.r + t * 0.3, a.r + t * 0.2, 0);
      m.scale.setScalar(a.s);
      m.updateMatrix();
      ref.current!.setMatrixAt(i, m.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#64748b" roughness={0.9} flatShading />
    </instancedMesh>
  );
}

function CameraRig() {
  const intro = useRef(0);
  useFrame((s, raw) => {
    const dt = Math.min(raw, 0.05);
    intro.current = Math.min(1, intro.current + dt * 0.4);
    const e = 1 - Math.pow(1 - intro.current, 3);
    const p = scrollState.progress;
    // Intro zoom: from z=40 to z=6; scroll flies deep to z=-80
    const targetZ = 40 - 34 * e - p * 90;
    const cam = s.camera;
    cam.position.z += (targetZ - cam.position.z) * (1 - Math.exp(-4 * dt));
    cam.position.x += (pointerState.x * 0.8 + Math.sin(p * Math.PI * 2) * 2 - cam.position.x) * (1 - Math.exp(-3 * dt));
    cam.position.y += (-pointerState.y * 0.5 - p * 3 - cam.position.y) * (1 - Math.exp(-3 * dt));
    cam.lookAt(0, -p * 3, cam.position.z - 10);
  });
  return null;
}

export default function SpaceScene() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 40], fov: 60, near: 0.1, far: 300 }} gl={{ antialias: true }}>
        <color attach="background" args={["#030712"]} />
        <fog attach="fog" args={["#030712", 30, 140]} />
        <ambientLight intensity={0.35} />
        <pointLight position={[-8, 4, 4]} intensity={60} color="#00F0FF" />
        <pointLight position={[8, -3, -2]} intensity={50} color="#EC4899" />
        <Stars count={4000} spread={160} size={0.12} depth={200} color="#F8FAFC" />
        <Stars count={800} spread={60} size={0.22} depth={120} color="#00F0FF" />
        <Nebula />
        <Asteroids />
        <Planet />
        <CameraRig />
      </Canvas>
    </div>
  );
}
