"use client";
import { useEffect, useState } from "react";
const ITEMS = [["Maintenance anomaly detected", "17 devices affected", "warn"], ["Vendor SLA threshold exceeded", "8 work orders", "bad"], ["42 assets approaching lifecycle threshold", "Review replacement plan", "info"], ["Work order verified", "WO-29381 · Battery failure", "ok"]];
const TONE: Record<string, string> = { warn: "bg-warn", bad: "bg-bad", info: "bg-info", ok: "bg-ok" };
export default function LiveFeed() {
  const [n, setN] = useState(3);
  useEffect(() => { const t = setInterval(() => setN((x) => (x % ITEMS.length) + 1), 3200); return () => clearInterval(t); }, []);
  const shown = Array.from({ length: 3 }, (_, i) => ITEMS[(n - 1 + i + ITEMS.length) % ITEMS.length]);
  return <ul aria-label="Live activity (sample)" className="space-y-2">{shown.map(([t, s, tone], i) => <li key={t + n} className="flex gap-2.5 animate-rise" style={{ animationDelay: `${i * 60}ms` }}><span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${TONE[tone]} ${i === 0 ? "animate-dot" : ""}`} aria-hidden /><span><span className="block text-[12.5px]">{t}</span><span className="block text-[11px] text-dim">{s}</span></span></li>)}</ul>;
}
