"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, Badge } from "./ui";

type Analysis = { total: number; valid: number; errors: { row: number; field: string; code: string; message: string }[]; errorTotal: number; counts: Record<string, number>; missingRequired: string[]; mapping: Record<string, string | null>; preview: Record<string, unknown>[]; columns: string[] };
const STEPS = ["Upload", "Detect columns", "Preview", "Validate", "Confirm", "Summary"];
const CODE_LABEL: Record<string, string> = { missing_id: "Missing asset IDs", missing_serial: "Missing serial numbers", duplicate: "Duplicate assets", invalid_date: "Invalid dates", invalid_id: "Invalid asset IDs", missing_field: "Missing required values", unknown_asset: "Unknown assets" };

export default function ImportWizard() {
  const [kind, setKind] = useState<"assets" | "maintenance">("assets");
  const [file, setFile] = useState<File | null>(null); const [a, setA] = useState<Analysis | null>(null);
  const [done, setDone] = useState<{ jobId: string; imported: number; total: number; counts: Record<string, number>; errorTotal: number } | null>(null);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const step = done ? 5 : a ? (a.missingRequired.length ? 1 : 4) : file ? 0 : 0;

  async function send(confirm: boolean) {
    if (!file) return; setBusy(true); setErr("");
    const fd = new FormData(); fd.append("file", file); fd.append("kind", kind); if (confirm) fd.append("confirm", "1");
    try { const res = await fetch("/api/import", { method: "POST", body: fd }); const d = await res.json(); if (!res.ok) throw new Error(d.error); confirm ? setDone(d) : setA(d); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }
  const reset = () => { setFile(null); setA(null); setDone(null); setErr(""); };
  const importable = a ? a.valid : 0;
  return (
    <div className="max-w-4xl space-y-3">
      <ol className="flex flex-wrap gap-x-4 gap-y-1 text-xs" aria-label="Import steps">{STEPS.map((s, i) => <li key={s} aria-current={i === step} className={i <= step ? "text-fg" : "text-dim"}><span className="tabular-nums mr-1">{i + 1}.</span>{s}</li>)}</ol>
      {!done && (
        <Card title="Upload">
          <div className="grid sm:grid-cols-[180px_1fr_auto] gap-3 items-end">
            <div><label className="label" htmlFor="kind">Import type</label><select id="kind" className="input" value={kind} onChange={(e) => { setKind(e.target.value as "assets" | "maintenance"); setA(null); }}><option value="assets">Assets</option><option value="maintenance">Maintenance history</option></select></div>
            <div><label className="label" htmlFor="file">CSV, XLSX or JSON (max 10 MB)</label><input id="file" type="file" accept=".csv,.xlsx,.xls,.json" className="input h-auto py-1.5" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setA(null); }} /></div>
            <button className="btn btn-primary" disabled={!file || busy} onClick={() => send(false)}>{busy && !a ? "Analysing…" : "Analyse file"}</button>
          </div>
          {kind === "assets" && <p className="text-xs text-dim mt-2">Need a template? <a className="underline" href="/sample-assets.csv" download>Download a sample CSV</a> (includes deliberate duplicates and errors).</p>}
          {err && <p role="alert" className="text-bad text-xs mt-2">{err}</p>}
        </Card>)}
      {a && !done && (<>
        <Card title="Detected columns">
          <div className="flex flex-wrap gap-2">{Object.entries(a.mapping).map(([f, c]) => <span key={f} className="text-xs border border-line2 rounded px-2 py-1">{f} <span className="text-dim">→</span> {c ?? <span className="text-warn">not found</span>}</span>)}</div>
          {a.missingRequired.length > 0 && <p role="alert" className="text-bad mt-3">Required column(s) not found: {a.missingRequired.join(", ")}. Rename your columns and upload again.</p>}
        </Card>
        {a.missingRequired.length === 0 && <>
          <Card title="Validation result">
            <div className="text-2xl font-semibold">{a.total.toLocaleString()} rows detected</div>
            <ul className="mt-2 space-y-0.5"><li className="text-ok">{a.valid.toLocaleString()} valid</li>{Object.entries(a.counts).map(([c, n]) => <li key={c} className={c === "missing_serial" ? "text-warn" : "text-bad"}>{n.toLocaleString()} {(CODE_LABEL[c] ?? c).toLowerCase()}</li>)}</ul>
            <p className="text-xs text-dim mt-2">Rows with errors are never silently dropped: every error is listed below and saved with the import. Missing serial numbers are warnings; those rows are still imported.</p>
          </Card>
          {a.errors.length > 0 && <Card title={`Errors (${a.errorTotal.toLocaleString()}${a.errorTotal > a.errors.length ? `, showing first ${a.errors.length}` : ""})`} pad={false}><div className="max-h-72 overflow-auto"><table className="w-full"><thead><tr><th className="th">Row</th><th className="th">Field</th><th className="th">Issue</th></tr></thead><tbody>{a.errors.map((e, i) => <tr key={i}><td className="td tabular-nums">{e.row}</td><td className="td">{e.field}</td><td className="td">{e.message}</td></tr>)}</tbody></table></div></Card>}
          <Card title="Preview (first rows)" pad={false}><div className="overflow-x-auto"><table className="w-full"><thead><tr>{a.columns.map((c) => <th key={c} className="th">{c}</th>)}</tr></thead><tbody>{a.preview.map((r, i) => <tr key={i}>{a.columns.map((c) => <td key={c} className="td max-w-[12rem] truncate">{String(r[c] ?? "")}</td>)}</tr>)}</tbody></table></div></Card>
          <div className="flex items-center gap-3"><button className="btn btn-accent h-10" disabled={busy || importable === 0} onClick={() => send(true)}>{busy ? "Importing…" : `Import ${importable.toLocaleString()} valid rows`}</button><button className="btn" onClick={reset}>Cancel</button></div>
        </>}
      </>)}
      {done && <Card title="Import complete"><div className="text-2xl font-semibold">{done.imported.toLocaleString()} of {done.total.toLocaleString()} rows imported</div>
        {done.errorTotal > 0 && <p className="text-mute mt-1">{done.errorTotal.toLocaleString()} issue(s) were recorded. <a className="underline text-accent" href={`/api/import/${done.jobId}/errors`}>Download error report (CSV)</a></p>}
        <div className="flex gap-2 mt-4"><Link className="btn btn-primary" href={kind === "assets" ? "/app/assets" : "/app/maintenance"}>View {kind === "assets" ? "assets" : "records"}</Link><Link className="btn" href="/app/data-quality">Data quality</Link><button className="btn" onClick={reset}>Import another file</button></div></Card>}
      <p className="text-xs text-dim"><Badge tone="mute">tip</Badge> Dates may be dd/mm/yyyy or ISO. Unknown departments, locations, vendors and types are created automatically.</p>
    </div>
  );
}
