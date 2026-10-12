"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  ["Nanite Swarm auto-repaired optical waveguide", "14 photonic nodes stabilized in Lagos Vault", "emerald"],
  ["Quantum decoherence flux neutralized", "Phase-locked to 99.999% in 4.2ms", "cyan"],
  ["Orbital satellite handover verified", "Relay Alpha (Alt 420km) to Terrestrial Core", "violet"],
  ["Sub-atomic scrap credit recorded", "Ꞙ18.4M recovered from plasma recycling", "amber"],
];

const TONE: Record<string, { dot: string; ring: string; badge: string }> = {
  emerald: { dot: "bg-emerald-500", ring: "ring-emerald-100", badge: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  cyan: { dot: "bg-cyan-500", ring: "ring-cyan-100", badge: "text-cyan-700 bg-cyan-50 border-cyan-200" },
  violet: { dot: "bg-violet-500", ring: "ring-violet-100", badge: "text-violet-700 bg-violet-50 border-violet-200" },
  amber: { dot: "bg-amber-500", ring: "ring-amber-100", badge: "text-amber-700 bg-amber-50 border-amber-200" },
};

export default function LiveFeed() {
  const [n, setN] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setN((x) => (x % ITEMS.length) + 1), 3200);
    return () => clearInterval(t);
  }, []);

  const shown = Array.from({ length: 3 }, (_, i) => ITEMS[(n - 1 + i + ITEMS.length) % ITEMS.length]);

  return (
    <ul aria-label="2080 Live Nanite Telemetry" className="space-y-3 font-mono">
      {shown.map(([t, s, tone], i) => {
        const theme = TONE[tone] || TONE.emerald;
        return (
          <li
            key={t + n}
            className="flex items-start gap-2.5 transition-all duration-300 group"
          >
            <span
              className={`mt-1 h-2 w-2 rounded-full shrink-0 ${theme.dot} ${
                i === 0 ? `ring-4 ${theme.ring} animate-pulse` : ""
              }`}
              aria-hidden
            />
            <span className="leading-tight">
              <span className="block text-xs font-bold text-slate-800 group-hover:text-cyan-600 transition">
                {t}
              </span>
              <span className="block text-[11px] text-slate-500 mt-0.5 font-sans">
                {s}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
