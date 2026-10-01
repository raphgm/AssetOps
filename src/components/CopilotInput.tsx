"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

const SUGGESTED = ["What changed this week?", "Which assets have recurring failures?", "Which departments have the highest maintenance costs?", "Why did maintenance spending increase?", "Which warranties expire soon?", "Which vendors are missing SLA?", "Show assets with more than 3 repairs.", "What is our maintenance debt?"];

export default function CopilotInput() {
  const r = useRouter(); const [q, setQ] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function ask(question: string) {
    if (question.trim().length < 3) return; setBusy(true); setErr("");
    try { const res = await fetch("/api/ai/query", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question }) }); const d = await res.json(); if (!res.ok) throw new Error(d.error); r.push(`/app/ai/investigations/${d.id}`); }
    catch (e) { setErr((e as Error).message); setBusy(false); }
  }
  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      <div className="mx-auto h-10 w-10 rounded-full border border-accent/40 grid place-items-center mb-4"><Sparkles className="h-5 w-5 text-accent" aria-hidden /></div>
      <h1 className="text-2xl font-semibold tracking-tight">AssetOps Intelligence</h1>
      <p className="text-mute mt-1 mb-6">What would you like to understand?</p>
      <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="flex gap-2"><input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Question" maxLength={500} placeholder="Ask about your maintenance data…" className="input h-11 text-sm" /><button className="btn btn-accent h-11 px-5" disabled={busy}>{busy ? "Gathering evidence…" : "Ask"}</button></form>
      {err && <p role="alert" className="text-bad text-xs mt-2">{err}</p>}
      <div className="flex flex-wrap justify-center gap-2 mt-5">{SUGGESTED.map((s) => <button key={s} disabled={busy} onClick={() => ask(s)} className="btn text-xs h-auto py-1.5 text-mute hover:text-fg">{s}</button>)}</div>
      <p className="text-xs text-dim mt-6">Answers are built only from records your role can access. Every claim links to its evidence; nothing changes without your confirmation.</p>
    </div>
  );
}
