"use client";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Legend, Area, ComposedChart } from "recharts";
import { useEffect, useState } from "react";

const axis = { stroke: "#6b7280", fontSize: 11, tickLine: false, axisLine: false } as const;
const tip = { contentStyle: { background: "#15181d", border: "1px solid #2e333c", borderRadius: 8, fontSize: 12 }, labelStyle: { color: "#9aa1ab" }, cursor: { stroke: "#2e333c" } };

export function TrendChart({ initial }: { initial: { label: string; requests: number; resolved: number; cost: number }[] }) {
  const [range, setRange] = useState<"7D" | "30D" | "90D" | "12M">("30D");
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  useEffect(() => {
    if (range === "30D" && data === initial) return;
    let live = true; setBusy(true); setErr(false);
    fetch(`/api/analytics/trend?range=${range}`).then((r) => r.json()).then((d) => { if (live) { if (d.error) throw new Error(); setData(d); } }).catch(() => live && setErr(true)).finally(() => live && setBusy(false));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1" role="tablist" aria-label="Range">
          {(["7D", "30D", "90D", "12M"] as const).map((r) => (
            <button key={r} role="tab" aria-selected={r === range} onClick={() => setRange(r)} className={`btn h-7 px-2 text-xs ${r === range ? "bg-line2" : "btn-ghost"}`}>{r}</button>
          ))}
        </div>
        {busy && <span className="text-xs text-dim">Updating…</span>}{err && <span className="text-xs text-warn">Couldn&apos;t load range</span>}
      </div>
      <div className="h-64" role="img" aria-label="Maintenance requests, resolved requests and cost over time">
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ left: -10, right: 4 }}>
            <CartesianGrid stroke="#1a1d23" vertical={false} />
            <XAxis dataKey="label" {...axis} minTickGap={24} />
            <YAxis yAxisId="l" {...axis} />
            <YAxis yAxisId="r" orientation="right" {...axis} tickFormatter={(v) => (v >= 1e6 ? `₦${(v / 1e6).toFixed(1)}M` : `₦${Math.round(v / 1e3)}K`)} />
            <Tooltip {...tip} formatter={(v, n) => (n === "Cost" ? `₦${Math.round(Number(v)).toLocaleString()}` : String(v))} />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, color: "#9aa1ab" }} />
            <Area yAxisId="r" dataKey="cost" name="Cost" stroke="#7aa2ff" fill="#7aa2ff" fillOpacity={0.08} strokeWidth={1.2} isAnimationActive />
            <Line yAxisId="l" dataKey="requests" name="Requests" stroke="#5eead4" strokeWidth={2} dot={false} />
            <Line yAxisId="l" dataKey="resolved" name="Resolved" stroke="#e8eaed" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FailureBars({ data }: { data: { id: string; name: string; count: number }[] }) {
  const router = useRouter();
  return (
    <div className="h-64" role="img" aria-label="Failures by category. Click a bar to filter maintenance records.">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 24 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" {...axis} width={130} fontSize={12} />
          <Tooltip {...tip} cursor={{ fill: "#15181d" }} />
          <Bar dataKey="count" radius={[0, 3, 3, 0]} onClick={(d) => router.push(`/app/maintenance?category=${(d as unknown as { id: string }).id}`)} className="cursor-pointer" label={{ position: "right", fill: "#9aa1ab", fontSize: 11 }}>
            {data.map((_, i) => <Cell key={i} fill={i === 0 ? "#5eead4" : "#3b4350"} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MiniLine({ data, y, name }: { data: Record<string, number | string>[]; y: string; name: string }) {
  return (
    <div className="h-48" role="img" aria-label={name}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ left: -10, right: 4 }}>
          <CartesianGrid stroke="#1a1d23" vertical={false} />
          <XAxis dataKey="label" {...axis} /><YAxis {...axis} />
          <Tooltip {...tip} />
          <Line dataKey={y} name={name} stroke="#5eead4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HBars({ data, x, label }: { data: Record<string, number | string>[]; x: string; label: string }) {
  return (
    <div style={{ height: Math.max(140, data.length * 28) }} role="img" aria-label={label}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 16 }}>
          <XAxis type="number" hide /><YAxis type="category" dataKey="name" {...axis} width={140} fontSize={12} />
          <Tooltip {...tip} cursor={{ fill: "#15181d" }} />
          <Bar dataKey={x} fill="#5eead4" radius={[0, 3, 3, 0]} label={{ position: "right", fill: "#9aa1ab", fontSize: 11 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
