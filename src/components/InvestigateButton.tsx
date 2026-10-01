"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function InvestigateButton({ question, categoryId, label = "Investigate", primary }: { question: string; categoryId?: string; label?: string; primary?: boolean }) {
  const r = useRouter(); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function go() {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/ai/investigate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question, categoryId }) });
      const d = await res.json(); if (!res.ok) throw new Error(d.error);
      r.push(`/app/ai/investigations/${d.id}`);
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); setBusy(false); }
  }
  return <span className="inline-flex flex-col"><button onClick={go} disabled={busy} className={primary ? "btn btn-accent" : "btn"}><Sparkles className="h-3.5 w-3.5" aria-hidden />{busy ? "Gathering evidence…" : label}</button>{err && <span role="alert" className="text-bad text-xs mt-1">{err}</span>}</span>;
}
