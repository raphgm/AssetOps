"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./EntityForms";

export function RunScheduleButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleRun() {
    if (!confirm(`Generate preventative maintenance work orders for "${title}" now?`)) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await api(`/api/preventative/${id}/run`, "POST");
      setMsg(`Dispatched ${res.workOrdersCreated} work orders!`);
      router.refresh();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      {msg && <span className="text-ok text-xs font-medium">{msg}</span>}
      <button
        onClick={handleRun}
        disabled={busy}
        className="btn text-xs hover:border-accent hover:text-accent"
      >
        {busy ? "Dispatching…" : "Dispatch Work Orders"}
      </button>
    </div>
  );
}

export function NewScheduleModal({
  types,
  locations,
}: {
  types: { id: string; name: string }[];
  locations: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [freq, setFreq] = useState(3);
  const [typeId, setTypeId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await api("/api/preventative", "POST", {
        title,
        description: desc,
        frequencyMonths: Number(freq),
        typeId: typeId || null,
        locationId: locationId || null,
      });
      setOpen(false);
      setTitle("");
      setDesc("");
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-primary">
        + Add PM Schedule
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h2 className="text-base font-semibold text-fg">
            New Preventative Maintenance Schedule
          </h2>
          <button onClick={() => setOpen(false)} className="text-dim hover:text-fg">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="label" htmlFor="pm-title">
              Schedule Title *
            </label>
            <input
              id="pm-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quarterly Server Rack Dust Cleaning"
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="pm-desc">
              Procedure / Standard Operating Instructions
            </label>
            <textarea
              id="pm-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Clean air filters, inspect thermal paste, run diagnostic report..."
              className="input h-20"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="label" htmlFor="pm-freq">
                Interval (Months) *
              </label>
              <select
                id="pm-freq"
                value={freq}
                onChange={(e) => setFreq(Number(e.target.value))}
                className="input"
              >
                <option value={1}>Monthly (1 mo)</option>
                <option value={3}>Quarterly (3 mos)</option>
                <option value={6}>Semi-annual (6 mos)</option>
                <option value={12}>Annual (12 mos)</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="pm-type">
                Target Type
              </label>
              <select
                id="pm-type"
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
                className="input"
              >
                <option value="">All Hardware</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="pm-loc">
                Location
              </label>
              <select
                id="pm-loc"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="input"
              >
                <option value="">All Locations</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {err && (
            <div className="text-bad text-xs bg-bad/10 p-2 rounded border border-bad/30">
              {err}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn-ghost"
              disabled={busy}
            >
              Cancel
            </button>
            <button type="submit" disabled={busy} className="btn btn-primary">
              {busy ? "Saving…" : "Create Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
