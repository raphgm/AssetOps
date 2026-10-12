"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  ["Preventative routine scheduled", "14 core switches in Lagos HQ", "emerald"],
  ["FinOps repair threshold flagged", "WO-29381 exceeded 70% Net Book Value", "cyan"],
  ["NIST 800-88 sanitization certified", "Server SRV-DC-00281 retired & audited", "violet"],
  ["Vendor SLA turnaround verified", "3.2h average resolution across 42 orders", "amber"],
];

const TONE: Record<string, { dot: string; ring: string }> = {
  emerald: { dot: "bg-emerald-500", ring: "ring-emerald-100" },
  cyan: { dot: "bg-cyan-500", ring: "ring-cyan-100" },
  violet: { dot: "bg-violet-500", ring: "ring-violet-100" },
  amber: { dot: "bg-amber-500", ring: "ring-amber-100" },
};

export default function LiveFeed() {
  const [n, setN] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setN((x) => (x % ITEMS.length) + 1), 3200);
    return () => clearInterval(t);
  }, []);

  const shown = Array.from({ length: 3 }, (_, i) => ITEMS[(n - 1 + i + ITEMS.length) % ITEMS.length]);

  return (
    <ul aria-label="Live maintenance telemetry" className="space-y-3 font-sans">
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
              <span className="block text-[11px] text-slate-500 mt-0.5">
                {s}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
