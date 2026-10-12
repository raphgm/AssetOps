"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  ["Nanite Swarm auto-repaired waveguide", "14 nodes re-soldered in Lagos Vault", "ok"],
  ["Quantum decoherence flux stabilized", "Phase locked to 99.999% in 4.2ms", "cyan"],
  ["Orbital satellite handover verified", "Relay-Alpha to Abuja Terrestrial Array", "indigo"],
  ["Sub-atomic salvage threshold reached", "Molecular credit: Ꞙ18.4M logged", "amber"],
];

const TONE: Record<string, { dot: string; glow: string; text: string }> = {
  ok: { dot: "bg-emerald-400", glow: "ring-emerald-500/40", text: "text-emerald-400" },
  cyan: { dot: "bg-cyan-400", glow: "ring-cyan-500/40", text: "text-cyan-400" },
  indigo: { dot: "bg-indigo-400", glow: "ring-indigo-500/40", text: "text-indigo-400" },
  amber: { dot: "bg-amber-400", glow: "ring-amber-500/40", text: "text-amber-400" },
};

export default function LiveFeed() {
  const [n, setN] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setN((x) => (x % ITEMS.length) + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const shown = Array.from({ length: 3 }, (_, i) => ITEMS[(n - 1 + i + ITEMS.length) % ITEMS.length]);

  return (
    <ul aria-label="2080 Live telemetry stream" className="space-y-3 font-mono">
      {shown.map(([t, s, tone], i) => {
        const theme = TONE[tone] || TONE.ok;
        return (
          <li
            key={t + n}
            className="flex items-start gap-2.5 transition-all duration-300 group"
          >
            <span
              className={`mt-1 h-2 w-2 rounded-full shrink-0 ${theme.dot} ${
                i === 0 ? `ring-4 ${theme.glow} animate-pulse` : ""
              }`}
              aria-hidden
            />
            <span className="leading-tight">
              <span className="block text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition">
                {t}
              </span>
              <span className="block text-[10.5px] text-slate-400 mt-0.5">
                {s}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
