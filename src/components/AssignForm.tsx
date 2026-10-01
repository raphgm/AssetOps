"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./forms";
export function AssignForm({ assetId }: { assetId: string }) {
  const r = useRouter(); const [v, setV] = useState(""); const [err, setErr] = useState("");
  async function go(e: React.FormEvent) { e.preventDefault(); setErr(""); try { await api(`/api/assets/${assetId}`, "PATCH", { assignee: v }); setV(""); r.refresh(); } catch (x) { setErr((x as Error).message); } }
  return <form onSubmit={go} className="flex gap-2 items-start"><div className="flex-1"><label className="label" htmlFor="assignee">Assign to person or team</label><input id="assignee" value={v} onChange={(e) => setV(e.target.value)} className="input" placeholder="e.g. Chidi Okonkwo (Finance)" minLength={2} required />{err && <span role="alert" className="text-bad text-xs">{err}</span>}</div><button className="btn btn-primary mt-[19px]">Assign</button></form>;
}
