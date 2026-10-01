"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Job = { id: string; to: string };
const KEY = "assetops_queue";
const read = (): Job[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; } };
const write = (j: Job[]) => { try { localStorage.setItem(KEY, JSON.stringify(j)); } catch {} };

/** One-tap status changes. If the network is down the action is queued locally and replayed when back online. */
export default function TechQuick({ id, status }: { id: string; status: string }) {
  const r = useRouter(); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false); const [expect, setExpect] = useState("");
  useEffect(() => { if (!expect) return; if (status === expect) { setExpect(""); return; } const t = setTimeout(() => window.location.reload(), 2500); return () => clearTimeout(t); }, [expect, status]);
  useEffect(() => {
    async function flush() {
      const q = read(); if (!q.length) return; const rest: Job[] = [];
      for (const j of q) { try { const res = await fetch(`/api/work-orders/${j.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ to: j.to }) }); if (!res.ok && res.status >= 500) rest.push(j); } catch { rest.push(j); } }
      write(rest); if (rest.length < q.length) r.refresh();
    }
    window.addEventListener("online", flush); flush(); return () => window.removeEventListener("online", flush);
  }, [r]);
  async function go(to: string) {
    setBusy(true); setMsg("");
    try {
      const res = await fetch(`/api/work-orders/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ to }) });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      r.refresh(); setExpect(to);
    } catch (e) {
      if (e instanceof TypeError) { write([...read(), { id, to }]); setMsg("Offline — queued. Will sync when you're back online."); }
      else setMsg((e as Error).message);
    } finally { setBusy(false); }
  }
  return (
    <div>
      <div className="flex gap-2">
        {status === "ASSIGNED" && <button className="btn btn-accent flex-1 h-11" disabled={busy} onClick={() => go("IN_PROGRESS")}>Start work</button>}
        {status === "IN_PROGRESS" && <><a className="btn btn-accent flex-1 h-11" href={`/app/work-orders/${id}?resolve=1`}>Complete</a><button className="btn h-11" disabled={busy} onClick={() => go("AWAITING_PARTS")}>Need parts</button></>}
        {status === "AWAITING_PARTS" && <button className="btn btn-accent flex-1 h-11" disabled={busy} onClick={() => go("IN_PROGRESS")}>Resume</button>}
      </div>
      {msg && <p role="status" className="text-xs text-warn mt-1.5">{msg}</p>}
    </div>
  );
}
