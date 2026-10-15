import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SplitHeading, TiltCard } from "./ui";

export function Nav() {
  const [sound, setSound] = useState(false);
  const ctx = useRef<{ ac: AudioContext; gain: GainNode } | null>(null);
  const toggle = () => {
    if (!ctx.current) {
      const ac = new AudioContext(); const gain = ac.createGain(); gain.gain.value = 0;
      [55, 82.5, 110.3].forEach((f) => { const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = f; o.connect(gain); o.start(); });
      gain.connect(ac.destination); ctx.current = { ac, gain };
    }
    const { ac, gain } = ctx.current; ac.resume();
    gain.gain.linearRampToValueAtTime(sound ? 0 : 0.05, ac.currentTime + 1);
    setSound(!sound);
  };
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="glass flex w-full max-w-3xl items-center justify-between rounded-full py-2 pl-5 pr-2">
        <a href="#top" className="group flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
          <span className="h-3 w-3 rounded-full bg-cyan shadow-[var(--glow-cyan)] transition-all group-hover:scale-150" />
          <span className="transition-[text-shadow] group-hover:[text-shadow:0_0_18px_var(--cyan)]">VOIDLINE</span>
        </a>
        <div className="hidden gap-7 text-sm text-muted-foreground md:flex">
          {["Mission", "Systems", "Orbit", "Launch"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="transition-colors hover:text-cyan">{l}</a>
          ))}
        </div>
        <button onClick={toggle} aria-label="Toggle ambient sound" className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <span className="flex h-4 items-end gap-[3px]">
            {[0, 1, 2, 3].map((i) => (
              <motion.span key={i} className="w-[2px] rounded bg-cyan"
                animate={{ height: sound ? ["30%", "100%", "50%", "80%", "30%"] : "25%" }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </span>
        </button>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <motion.p initial={{ opacity: 0, letterSpacing: "1em" }} animate={{ opacity: 1, letterSpacing: "0.4em" }} transition={{ duration: 2, delay: 0.6 }}
        className="mb-6 font-mono text-xs uppercase text-cyan">Transmission · 2026 · Sector 7G</motion.p>
      <SplitHeading as="h1" text="EXPLORE THE UNKNOWN"
        className="font-display text-[clamp(3rem,11vw,10rem)] font-extrabold leading-[0.85] tracking-tighter" />
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1 }}
        className="mt-8 max-w-md text-muted-foreground">
        A cinematic journey past the edge of the known cosmos. Scroll to engage the drive.
      </motion.p>
      <motion.a href="#mission" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8 }}
        className="cta-aura mt-10 rounded-full px-8 py-4 font-display font-bold tracking-wide transition-transform hover:scale-105">
        Begin Descent →
      </motion.a>
      <div className="absolute bottom-8 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Scroll
        <motion.span className="h-10 w-px bg-gradient-to-b from-cyan to-transparent" animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} style={{ originY: 0 }} />
      </div>
    </section>
  );
}

export function Mission() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const slow = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const mid = useTransform(scrollYProgress, [0, 1], [240, -240]);
  return (
    <section id="mission" ref={ref} className="relative mx-auto flex min-h-[100svh] max-w-6xl items-center px-6 py-32">
      <motion.div style={{ y: slow }} className="glow-orb left-[-10%] top-1/4 h-80 w-80 bg-cosmic" />
      <motion.div style={{ y: mid }} className="glow-orb right-[-5%] bottom-10 h-64 w-64 bg-magenta" />
      <div className="relative">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-magenta">01 / Mission</p>
        <SplitHeading text="Beyond the last light, a new frontier waits." className="max-w-4xl font-display text-[clamp(2.2rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight" />
        <motion.p style={{ y: useTransform(scrollYProgress, [0, 1], [60, -60]) }} className="mt-10 max-w-lg text-lg text-muted-foreground">
          We chart dark matter currents, map rogue worlds, and send light-sails where no signal has returned. Every scroll pushes you deeper.
        </motion.p>
      </div>
    </section>
  );
}

const features = [
  { k: "01", t: "Quantum Drive", d: "Fold-space propulsion bending 4.2 light-years into a single heartbeat.", c: "text-cyan" },
  { k: "02", t: "Nebula Mapping", d: "Spectral scanners render gas clouds in 11 dimensions in real time.", c: "text-cosmic" },
  { k: "03", t: "Deep Signal", d: "Gravitational-wave comms that whisper across galactic arms.", c: "text-magenta" },
  { k: "04", t: "Orbital Habitats", d: "Self-healing rings sustaining life at the edge of the void.", c: "text-cyan" },
  { k: "05", t: "Star Forge", d: "Harvest stellar plasma to fabricate alloys stronger than neutron crust.", c: "text-cosmic" },
  { k: "06", t: "Void Sentinel", d: "Autonomous probes guarding every jump corridor, always awake.", c: "text-magenta" },
];

export function Systems() {
  return (
    <section id="systems" className="relative mx-auto max-w-6xl px-6 py-32">
      <div className="glow-orb left-1/3 top-1/3 h-96 w-96 bg-cyan opacity-20" />
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-cyan">02 / Systems</p>
      <SplitHeading text="Engineered for the infinite." className="mb-16 font-display text-[clamp(2.2rem,6vw,5rem)] font-bold leading-none tracking-tight" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div key={f.k} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1, duration: 0.7 }}>
            <TiltCard className="h-full p-7">
              <div className={`font-mono text-sm ${f.c}`}>{f.k}</div>
              <h3 className="mt-10 font-display text-2xl font-bold">{f.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const nodes = [
  { name: "Kepler-442b", stat: "1.34 R⊕", label: "Radius", info: "Super-Earth in the habitable zone, 1,206 ly away." },
  { name: "TRAPPIST-1e", stat: "251 K", label: "Equilibrium temp", info: "Rocky world likely holding liquid water oceans." },
  { name: "Proxima b", stat: "4.24 ly", label: "Distance", info: "Our nearest exoplanet neighbor, orbiting a red dwarf." },
  { name: "HD 189733b", stat: "8,700 km/h", label: "Wind speed", info: "Cobalt-blue gas giant raining molten glass sideways." },
  { name: "55 Cancri e", stat: "2,573 K", label: "Surface temp", info: "Lava world possibly coated in a diamond crust." },
  { name: "WASP-12b", stat: "1.1 days", label: "Orbit", info: "Being slowly devoured by its host star." },
];

export function Orbit() {
  const [rot, setRot] = useState(0);
  const [active, setActive] = useState(0);
  const drag = useRef<{ x: number; r: number } | null>(null);
  useEffect(() => {
    let id = 0;
    const tick = () => { if (!drag.current) setRot((r) => r + 0.08); id = requestAnimationFrame(tick); };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  const n = nodes[active];
  return (
    <section id="orbit" className="relative mx-auto max-w-6xl px-6 py-32">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-cosmic">03 / Orbit</p>
      <SplitHeading text="Drag the ring. Touch a world." className="mb-12 font-display text-[clamp(2.2rem,6vw,5rem)] font-bold leading-none tracking-tight" />
      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div
          className="relative mx-auto aspect-square w-full max-w-[520px] touch-none select-none"
          onPointerDown={(e) => { drag.current = { x: e.clientX, r: rot }; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
          onPointerMove={(e) => { if (drag.current) setRot(drag.current.r + (e.clientX - drag.current.x) * 0.5); }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          data-hover
        >
          <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--cyan),var(--cosmic)_45%,var(--void)_80%)] shadow-[0_0_120px_-10px_var(--cosmic)] [animation:pulse-ring_6s_ease-in-out_infinite]" />
          <div className="absolute inset-[12%] rounded-full border border-dashed border-cyan/30 [animation:spin-slow_60s_linear_infinite]" />
          <div className="absolute inset-0 rounded-full border border-border" style={{ transform: `rotate(${rot}deg)` }}>
            {nodes.map((p, i) => {
              const a = (i / nodes.length) * 360;
              return (
                <button key={p.name} onClick={() => setActive(i)} aria-label={p.name}
                  className="absolute left-1/2 top-1/2 -ml-3 -mt-3 h-6 w-6"
                  style={{ transform: `rotate(${a}deg) translateY(calc(-1 * min(260px, 44vw))) rotate(${-a - rot}deg)` }}>
                  <span className={`block h-full w-full rounded-full border-2 transition-all ${i === active ? "scale-150 border-cyan bg-cyan shadow-[var(--glow-cyan)]" : "border-foreground/60 bg-void hover:border-magenta"}`} />
                </button>
              );
            })}
          </div>
        </div>
        <motion.div key={active} initial={{ opacity: 0, x: 30, filter: "blur(8px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-8">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Target acquired</div>
          <h3 className="mt-3 font-display text-4xl font-bold">{n.name}</h3>
          <div className="mt-8 text-aurora font-display text-6xl font-extrabold">{n.stat}</div>
          <div className="mt-1 font-mono text-xs uppercase tracking-widest text-cyan">{n.label}</div>
          <p className="mt-6 text-muted-foreground">{n.info}</p>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const streaks = Array.from({ length: 60 }, (_, i) => i);
  return (
    <footer id="launch" className="relative overflow-hidden bg-gradient-to-b from-transparent via-void/80 to-void px-6 pb-12 pt-40">
      <div className="pointer-events-none absolute inset-0 [perspective:400px]">
        {streaks.map((i) => (
          <span key={i} className="absolute left-1/2 top-1/2 h-px w-24 bg-gradient-to-r from-transparent to-cyan"
            style={{ transform: `rotate(${(i * 137.5) % 360}deg) translateX(${40 + (i % 7) * 30}px)`, opacity: 0.25 + (i % 5) * 0.1 }} />
        ))}
      </div>
      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="relative mb-12 h-48 w-48">
          <div className="absolute inset-0 rounded-full border-2 border-cyan shadow-[0_0_60px_var(--cyan)] [animation:spin-slow_12s_linear_infinite]" style={{ borderStyle: "dotted" }} />
          <div className="absolute inset-4 rounded-full border border-magenta [animation:spin-slow_8s_linear_infinite_reverse]" />
          <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,var(--foreground),var(--cyan)_30%,var(--cosmic)_60%,transparent_75%)] [animation:pulse-ring_3s_ease-in-out_infinite]" />
        </div>
        <SplitHeading text="Ready for the jump?" className="font-display text-[clamp(2.5rem,8vw,7rem)] font-extrabold leading-none tracking-tighter" />
        <a href="#top" className="cta-aura mt-10 rounded-full px-10 py-5 font-display text-lg font-bold transition-transform hover:scale-105">Engage Warp ✦</a>
        <div className="mt-24 flex w-full flex-col items-center justify-between gap-4 border-t border-border pt-8 font-mono text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 VOIDLINE Expeditions</span>
          <span>Signal strength ▮▮▮▮▯ · 4.2 ly</span>
        </div>
      </div>
    </footer>
  );
}
