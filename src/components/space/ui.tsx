import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { scrollState, pointerState } from "@/lib/scroll-store";

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 });
    lenis.on("scroll", (l: Lenis) => {
      scrollState.progress = l.progress || 0;
      scrollState.velocity = l.velocity;
    });
    let id = 0;
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    const onMove = (e: PointerEvent) => {
      pointerState.x = (e.clientX / innerWidth) * 2 - 1;
      pointerState.y = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener("pointermove", onMove);
    return () => { cancelAnimationFrame(id); lenis.destroy(); removeEventListener("pointermove", onMove); };
  }, []);
  return null;
}

export function SplitHeading({ text, className, as: Tag = "h2" }: { text: string; className?: string; as?: "h1" | "h2" }) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0, filter: "blur(12px)" }}
            whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => { setEnabled(matchMedia("(pointer: fine)").matches); }, []);
  useEffect(() => {
    if (!enabled) return;
    const c = canvas.current!; const g = c.getContext("2d")!;
    const resize = () => { c.width = innerWidth; c.height = innerHeight; };
    resize(); addEventListener("resize", resize);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, id = 0;
    const parts: { x: number; y: number; vx: number; vy: number; life: number; hue: number }[] = [];
    const move = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      for (let i = 0; i < 2; i++) parts.push({ x: mx, y: my, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2, life: 1, hue: [186, 258, 330][Math.floor(Math.random() * 3)] });
      const t = e.target as HTMLElement;
      ring.current?.classList.toggle("scale-[1.8]", !!t.closest("a,button,[data-hover]"));
    };
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      if (dot.current) dot.current.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
      g.clearRect(0, 0, c.width, c.height);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]!; p.x += p.vx; p.y += p.vy; p.life -= 0.025;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        g.fillStyle = `hsla(${p.hue},100%,70%,${p.life})`;
        g.beginPath(); g.arc(p.x, p.y, 1.8 * p.life, 0, 7); g.fill();
      }
      id = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move); loop();
    return () => { cancelAnimationFrame(id); removeEventListener("pointermove", move); removeEventListener("resize", resize); };
  }, [enabled]);
  if (!enabled) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <canvas ref={canvas} className="absolute inset-0" />
      <div ref={ring} className="absolute h-9 w-9 rounded-full border border-cyan shadow-[var(--glow-cyan)] transition-[scale] duration-300" />
      <div ref={dot} className="absolute h-1.5 w-1.5 rounded-full bg-foreground" />
    </div>
  );
}

export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current!; const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`); el.style.setProperty("--my", `${y}px`);
    const rx = ((y / r.height) - 0.5) * -10, ry = ((x / r.width) - 0.5) * 10;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)"; };
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} data-hover
      className={`glass spotlight-card rounded-2xl transition-transform duration-200 ease-out will-change-transform ${className}`}>
      {children}
    </div>
  );
}
