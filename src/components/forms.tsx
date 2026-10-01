"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AssetPicker from "./AssetPicker";

export async function api(url: string, method: string, body?: unknown) {
  const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(d.error ?? "Request failed");
  return d;
}

type Opt = { id: string; name: string };
const Sel = ({ name, label, opts, required, def, empty }: { name: string; label: string; opts: Opt[]; required?: boolean; def?: string; empty?: string }) => (
  <div><label className="label" htmlFor={name}>{label}</label><select id={name} name={name} required={required} defaultValue={def ?? ""} className="input">{(!required || empty) && <option value="">{empty ?? "—"}</option>}{opts.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
);

export function NewAssetForm({ types, depts, locs, vendors }: { types: Opt[]; depts: Opt[]; locs: Opt[]; vendors: Opt[] }) {
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    try { const a = await api("/api/assets", "POST", Object.fromEntries(new FormData(e.currentTarget))); window.location.assign(`/app/assets/${a.id}`); } catch (x) { setErr((x as Error).message); setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="card p-4 grid gap-3 sm:grid-cols-2 max-w-3xl">
      <div><label className="label" htmlFor="tag">Asset ID</label><input id="tag" name="tag" className="input font-mono" placeholder="ICT-LAG-004822" required pattern="[A-Z0-9\-]+" title="Uppercase letters, digits, dashes" /></div>
      <div><label className="label" htmlFor="serial">Serial number</label><input id="serial" name="serial" className="input" /></div>
      <div><label className="label" htmlFor="make">Make</label><input id="make" name="make" className="input" required /></div>
      <div><label className="label" htmlFor="model">Model</label><input id="model" name="model" className="input" required /></div>
      <Sel name="typeId" label="Type" opts={types} required /><Sel name="departmentId" label="Department" opts={depts} required />
      <Sel name="locationId" label="Location" opts={locs} required /><Sel name="vendorId" label="Vendor" opts={vendors} />
      <div><label className="label" htmlFor="acquiredAt">Acquired</label><input id="acquiredAt" name="acquiredAt" type="date" className="input" required /></div>
      <div><label className="label" htmlFor="acquisitionValue">Acquisition value (₦)</label><input id="acquisitionValue" name="acquisitionValue" type="number" min="0" className="input" defaultValue={0} /></div>
      <div><label className="label" htmlFor="warrantyEndsAt">Warranty ends</label><input id="warrantyEndsAt" name="warrantyEndsAt" type="date" className="input" /></div>
      <div className="sm:col-span-2 flex items-center gap-3">{err && <span role="alert" className="text-bad text-xs">{err}</span>}<button className="btn btn-primary ml-auto" disabled={busy}>{busy ? "Saving…" : "Create asset"}</button></div>
    </form>
  );
}

interface PartRow { name: string; quantity: number; unitCost: number }
/** Maintenance record form. Also used (compact) to resolve a work order from the technician's phone. */
export function MaintenanceForm({ assets, cats, techs, vendors, fixed, workOrderId, defaultCategory, onDoneHref, resolve }: {
  assets?: { id: string; name: string }[]; cats: Opt[]; techs: Opt[]; vendors: Opt[]; fixed?: { id: string; label: string }; workOrderId?: string; defaultCategory?: string; onDoneHref?: string; resolve?: boolean;
}) {
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const [parts, setParts] = useState<PartRow[]>([]); const [files, setFiles] = useState<File[]>([]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      let recordId: string;
      if (resolve && workOrderId) {
        const d = await api(`/api/work-orders/${workOrderId}`, "PATCH", { to: "RESOLVED", resolution: { categoryId: f.categoryId, description: f.description, resolution: f.resolution, laborCost: Number(f.laborCost || 0), downtimeHours: Number(f.downtimeHours || 0), parts, notes: f.notes } });
        recordId = d.recordId;
      } else {
        const d = await api("/api/maintenance", "POST", { ...f, assetId: fixed?.id ?? f.assetId, workOrderId, parts, laborCost: Number(f.laborCost || 0), partsCost: Number(f.partsCost || 0), downtimeHours: Number(f.downtimeHours || 0) });
        recordId = d.id;
      }
      for (const file of files) {
        const fd = new FormData(); fd.append("file", file); fd.append("recordId", recordId);
        const up = await fetch("/api/uploads", { method: "POST", body: fd }); if (!up.ok) throw new Error((await up.json()).error ?? "Upload failed");
      }
      window.location.assign(onDoneHref ?? "/app/maintenance");   // full navigation: always shows fresh server state
    } catch (x) { setErr((x as Error).message); setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="card p-4 grid gap-3 sm:grid-cols-2 max-w-3xl">
      {fixed ? <div className="sm:col-span-2"><div className="label">Asset</div><div className="font-mono">{fixed.label}</div></div> : <div className="sm:col-span-2"><AssetPicker /></div>}
      <Sel name="categoryId" label="Issue category" opts={cats} required def={defaultCategory} />
      {!resolve && <div><label className="label" htmlFor="performedAt">Date</label><input id="performedAt" name="performedAt" type="date" className="input" defaultValue={new Date().toISOString().slice(0, 10)} max={new Date().toISOString().slice(0, 10)} /></div>}
      {!resolve && <Sel name="technicianId" label="Technician" opts={techs} />}{!resolve && <Sel name="vendorId" label="Vendor" opts={vendors} />}
      <div className="sm:col-span-2"><label className="label" htmlFor="description">Issue description</label><textarea id="description" name="description" rows={2} className="input" required minLength={3} /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="resolution">Resolution</label><textarea id="resolution" name="resolution" rows={2} className="input" required={resolve} /></div>
      <div><label className="label" htmlFor="laborCost">Labor cost (₦)</label><input id="laborCost" name="laborCost" type="number" min="0" className="input" defaultValue={0} /></div>
      {!resolve && <div><label className="label" htmlFor="partsCost">Other parts cost (₦)</label><input id="partsCost" name="partsCost" type="number" min="0" className="input" defaultValue={0} /></div>}
      <div><label className="label" htmlFor="downtimeHours">Downtime (hours)</label><input id="downtimeHours" name="downtimeHours" type="number" min="0" step="0.5" className="input" defaultValue={0} /></div>
      <div className="sm:col-span-2">
        <div className="label">Parts used</div>
        {parts.map((p, i) => (
          <div key={i} className="grid grid-cols-[1fr_70px_100px_auto] gap-2 mb-1.5">
            <input aria-label="Part name" className="input" value={p.name} onChange={(e) => setParts(parts.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} placeholder="Part name" />
            <input aria-label="Quantity" className="input" type="number" min="1" value={p.quantity} onChange={(e) => setParts(parts.map((x, j) => (j === i ? { ...x, quantity: Number(e.target.value) } : x)))} />
            <input aria-label="Unit cost" className="input" type="number" min="0" value={p.unitCost} onChange={(e) => setParts(parts.map((x, j) => (j === i ? { ...x, unitCost: Number(e.target.value) } : x)))} placeholder="₦ each" />
            <button type="button" className="btn btn-ghost" onClick={() => setParts(parts.filter((_, j) => j !== i))} aria-label="Remove part">×</button>
          </div>))}
        <button type="button" className="btn h-7" onClick={() => setParts([...parts, { name: "", quantity: 1, unitCost: 0 }])}>+ Add part</button>
      </div>
      <div className="sm:col-span-2"><label className="label" htmlFor="files">Photos / attachments (JPG, PNG, WebP, PDF · max 5 MB)</label><input id="files" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" capture="environment" className="input h-auto py-1.5" onChange={(e) => setFiles([...(e.target.files ?? [])])} /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="notes">Notes</label><textarea id="notes" name="notes" rows={2} className="input" /></div>
      <div className="sm:col-span-2 flex items-center gap-3">{err && <span role="alert" className="text-bad text-xs">{err}</span>}<button className="btn btn-accent ml-auto h-10 px-5" disabled={busy}>{busy ? "Saving…" : resolve ? "Resolve work order" : "Save maintenance record"}</button></div>
      <p className="sm:col-span-2 text-xs text-dim">Saved records are immutable. Corrections are made by adding a new record.</p>
    </form>
  );
}

export function WorkOrderForm({ assets, cats, techs, vendors, fixedAsset, report, fleet }: { assets?: { id: string; name: string }[]; cats: Opt[]; techs: Opt[]; vendors: Opt[]; fixedAsset?: { id: string; label: string }; report?: boolean; fleet?: { assetIds: string[]; key: string; title: string; categoryId?: string } }) {
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      if (fleet) { const d = await api("/api/work-orders", "POST", { fleet: true, assetIds: fleet.assetIds, title: f.title, fleetKey: fleet.key, categoryId: fleet.categoryId }); window.location.assign(`/app/work-orders?fleet=${fleet.key}`); return void d; }
      const d = await api("/api/work-orders", "POST", { ...f, assetId: fixedAsset?.id ?? f.assetId, report }); window.location.assign(`/app/work-orders/${d.id}`);
    } catch (x) { setErr((x as Error).message); setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="card p-4 grid gap-3 sm:grid-cols-2 max-w-3xl">
      {fleet ? <div className="sm:col-span-2 text-mute">This creates <b className="text-fg">{fleet.assetIds.length}</b> HIGH-priority inspection work orders, one per affected asset. Nothing is created until you confirm.</div>
        : fixedAsset ? <div className="sm:col-span-2"><div className="label">Asset</div><div className="font-mono">{fixedAsset.label}</div></div> : <div className="sm:col-span-2"><AssetPicker /></div>}
      <div className="sm:col-span-2"><label className="label" htmlFor="title">Title</label><input id="title" name="title" className="input" required minLength={3} defaultValue={fleet?.title} /></div>
      {!fleet && <>
        <div className="sm:col-span-2"><label className="label" htmlFor="description">Describe the issue</label><textarea id="description" name="description" rows={3} className="input" /></div>
        <Sel name="categoryId" label="Category" opts={cats} />
        {!report && <div><label className="label" htmlFor="priority">Priority</label><select id="priority" name="priority" className="input" defaultValue="MEDIUM">{["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => <option key={p}>{p}</option>)}</select></div>}
        {!report && <Sel name="assigneeId" label="Assign technician" opts={techs} />}{!report && <Sel name="vendorId" label="Vendor" opts={vendors} />}
      </>}
      <div className="sm:col-span-2 flex items-center gap-3">{err && <span role="alert" className="text-bad text-xs">{err}</span>}<button className="btn btn-primary ml-auto" disabled={busy}>{busy ? "Creating…" : fleet ? `Confirm & create ${fleet.assetIds.length} work orders` : report ? "Report issue" : "Create work order"}</button></div>
    </form>
  );
}

export function WorkOrderActions({ id, status, canAssign, canUpdate, canVerify, techs, resolveHref }: { id: string; status: string; canAssign: boolean; canUpdate: boolean; canVerify: boolean; techs: Opt[]; resolveHref: string }) {
  const r = useRouter(); const [err, setErr] = useState(""); const [busy, setBusy] = useState(""); const [tech, setTech] = useState(""); const [expect, setExpect] = useState("");
  // Safety net: if the soft refresh doesn't surface the new status shortly, fall back to a full reload.
  useEffect(() => {
    if (!expect) return;
    if (status === expect) { setExpect(""); return; }
    const t = setTimeout(() => window.location.reload(), 2500);
    return () => clearTimeout(t);
  }, [expect, status]);
  async function go(to: string, extra: object = {}) {
    setBusy(to); setErr("");
    try { await api(`/api/work-orders/${id}`, "PATCH", { to, ...extra }); setExpect(to); r.refresh(); } catch (x) { setErr((x as Error).message); } finally { setBusy(""); }
  }
  const B = ({ to, label, primary }: { to: string; label: string; primary?: boolean }) => <button className={primary ? "btn btn-accent" : "btn"} disabled={!!busy} onClick={() => go(to)}>{busy === to ? "…" : label}</button>;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "OPEN" && canAssign && <><select aria-label="Technician" className="input w-44" value={tech} onChange={(e) => setTech(e.target.value)}><option value="">Choose technician</option>{techs.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select><button className="btn btn-accent" disabled={!tech || !!busy} onClick={() => go("ASSIGNED", { assigneeId: tech })}>Assign</button></>}
      {status === "ASSIGNED" && canUpdate && <B to="IN_PROGRESS" label="Start work" primary />}
      {status === "IN_PROGRESS" && canUpdate && <><a className="btn btn-accent" href={resolveHref}>Resolve…</a><B to="AWAITING_PARTS" label="Awaiting parts" /></>}
      {status === "AWAITING_PARTS" && canUpdate && <B to="IN_PROGRESS" label="Resume work" primary />}
      {status === "RESOLVED" && canVerify && <B to="VERIFIED" label="Verify resolution" primary />}
      {status === "RESOLVED" && canUpdate && <B to="IN_PROGRESS" label="Reopen" />}
      {status === "VERIFIED" && canVerify && <B to="CLOSED" label="Close" primary />}
      {canAssign && !["CLOSED", "CANCELLED", "RESOLVED", "VERIFIED"].includes(status) && <B to="CANCELLED" label="Cancel" />}
      {err && <span role="alert" className="text-bad text-xs">{err}</span>}
    </div>
  );
}
