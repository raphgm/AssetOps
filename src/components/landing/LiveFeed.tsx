"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  ["Maintenance anomaly detected", "17 devices affected in Lagos", "warn"],
  ["Vendor SLA threshold exceeded", "8 work orders pending review", "bad"],
  ["42 assets approaching lifecycle limit", "Automatic replacement flagged", "info"],
  ["Work order verified & signed", "WO-29381 · Battery replaced", "ok"],
];

const TONE: Record<string, string> = {
  warn: "bg-amber-500",
  bad: "bg-rose-500",
  info: "bg-blue-500",
  ok: "bg-emerald-500",
};

export default function LiveFeed() {
  const [n, setN] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setN((x) => (x % ITEMS.length) + 1), 3200);
    return () => clearInterval(t);
  }, []);

  const shown = Array.from({ length: 3 }, (_, i) => ITEMS[(n - 1 + i + ITEMS.length) % ITEMS.length]);

  return (
    <ul aria-label="Live activity" className="space-y-2.5">
      {shown.map(([t, s, tone], i) => (
        <li
          key={t + n}
          className="flex items-start gap-2.5 transition-all duration-300"
        >
          <span
            className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${TONE[tone]} ${
              i === 0 ? "ring-4 ring-emerald-100" : ""
            }`}
            aria-hidden
          />
          <span className="leading-tight">
            <span className="block text-xs font-medium text-slate-800">{t}</span>
            <span className="block text-[11px] text-slate-500">{s}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
