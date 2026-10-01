"use client";
import { useEffect, useState } from "react";

/** Debounced type-ahead over the server-side asset search (never ships the whole register to the browser). */
export default function AssetPicker({ name = "assetId", label = "Asset" }: { name?: string; label?: string }) {
  const [q, setQ] = useState(""); const [items, setItems] = useState<{ id: string; tag: string; make: string; model: string }[]>([]);
  const [picked, setPicked] = useState<{ id: string; tag: string } | null>(null); const [open, setOpen] = useState(false);
  useEffect(() => {
    if (picked || q.trim().length < 2) { setItems([]); return; }
    const t = setTimeout(() => fetch(`/api/assets?q=${encodeURIComponent(q.trim())}&size=8&sort=tag&dir=asc`).then((r) => r.json()).then((d) => setItems(d.items ?? [])).catch(() => setItems([])), 200);
    return () => clearTimeout(t);
  }, [q, picked]);
  return (
    <div className="relative">
      <label className="label" htmlFor={`${name}-q`}>{label}</label>
      <input id={`${name}-q`} className="input font-mono" autoComplete="off" placeholder="Search by asset ID, model or serial…" value={picked ? picked.tag : q} role="combobox" aria-expanded={open && items.length > 0} aria-controls={`${name}-list`}
        onChange={(e) => { setPicked(null); setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        required={!picked} onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Pick an asset from the list")} onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")} />
      <input type="hidden" name={name} value={picked?.id ?? ""} />
      {open && items.length > 0 && <ul id={`${name}-list`} role="listbox" className="absolute z-20 mt-1 w-full card shadow-xl max-h-64 overflow-auto">{items.map((a) => <li key={a.id} role="option" aria-selected={false}><button type="button" className="w-full text-left px-3 py-1.5 hover:bg-raised" onMouseDown={(e) => { e.preventDefault(); setPicked({ id: a.id, tag: a.tag }); setOpen(false); }}><span className="font-mono text-xs">{a.tag}</span> <span className="text-mute">{a.make} {a.model}</span></button></li>)}</ul>}
    </div>
  );
}
