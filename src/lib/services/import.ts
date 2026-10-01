import Papa from "papaparse";
import * as XLSX from "xlsx";
import { db } from "../db";
import { audit } from "../audit";
import type { Session } from "../auth";
import { actorOf, newQrToken, recomputeAsset } from "./assets";
import { UserError } from "../rbac";

export type Kind = "assets" | "maintenance";
export interface RowError { row: number; field: string; code: string; message: string }
const ALIASES: Record<Kind, Record<string, string[]>> = {
  assets: { tag: ["tag", "asset id", "asset_id", "assetid", "asset tag"], serial: ["serial", "serial number", "serial_no", "sn"], make: ["make", "manufacturer", "brand"], model: ["model", "device"], type: ["type", "asset type", "category"], department: ["department", "dept"], location: ["location", "site", "branch"], vendor: ["vendor", "supplier"], acquired: ["acquired", "purchase date", "date acquired", "acquisition date", "purchased"], value: ["value", "cost", "acquisition value", "price"], warranty: ["warranty", "warranty ends", "warranty end", "warranty expiry"] },
  maintenance: { tag: ["tag", "asset id", "asset_id", "assetid"], category: ["category", "issue category", "issue"], description: ["description", "issue description", "details"], date: ["date", "performed at", "maintenance date"], labor: ["labor", "labor cost", "labour"], parts: ["parts", "parts cost"], downtime: ["downtime", "downtime hours"], resolution: ["resolution", "fix"] },
};
const REQUIRED: Record<Kind, string[]> = { assets: ["tag", "make", "model", "type", "department", "location", "acquired"], maintenance: ["tag", "category", "description", "date"] };
const MAX_BYTES = 10 * 1024 * 1024, MAX_ROWS = 50_000;

export function parseFile(name: string, buf: Buffer): Record<string, unknown>[] {
  if (buf.length > MAX_BYTES) throw new UserError("File is larger than 10 MB.");
  const ext = name.toLowerCase().split(".").pop();
  let rows: Record<string, unknown>[];
  if (ext === "csv") { const r = Papa.parse<Record<string, unknown>>(buf.toString("utf8").replace(/^﻿/, ""), { header: true, skipEmptyLines: true }); rows = r.data; }
  else if (ext === "xlsx" || ext === "xls") { const wb = XLSX.read(buf, { type: "buffer", cellDates: true }); rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "", raw: true }); }
  else if (ext === "json") { const j = JSON.parse(buf.toString("utf8")); rows = Array.isArray(j) ? j : j.rows ?? []; }
  else throw new UserError("Unsupported file type. Use CSV, XLSX or JSON.");
  if (rows.length > MAX_ROWS) throw new UserError(`Too many rows (max ${MAX_ROWS.toLocaleString()}).`);
  return rows;
}

export function detectColumns(kind: Kind, rows: Record<string, unknown>[]) {
  const cols = Object.keys(rows[0] ?? {}); const map: Record<string, string | null> = {};
  for (const [field, aliases] of Object.entries(ALIASES[kind])) map[field] = cols.find((c) => aliases.includes(c.trim().toLowerCase())) ?? null;
  return { columns: cols, mapping: map, missingRequired: REQUIRED[kind].filter((f) => !map[f]) };
}

const s = (v: unknown) => (v == null ? "" : String(v).trim());
function date(v: unknown): Date | null {
  if (v instanceof Date) return isNaN(+v) ? null : v;
  const t = s(v); if (!t) return null;
  const m = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/); // dd/mm/yyyy (Nigerian convention)
  const d = m ? new Date(Date.UTC(+m[3], +m[2] - 1, +m[1])) : new Date(t);
  return isNaN(+d) || d.getUTCFullYear() < 1990 || d.getTime() > Date.now() + 366 * 864e5 ? null : d;
}

export interface Analysis { total: number; valid: number; errors: RowError[]; counts: Record<string, number>; missingRequired: string[]; mapping: Record<string, string | null>; preview: Record<string, unknown>[]; columns: string[] }
interface ValidAsset { tag: string; serial: string | null; make: string; model: string; type: string; department: string; location: string; vendor: string; acquired: Date; value: number; warranty: Date | null }
interface ValidRecord { tag: string; category: string; description: string; resolution: string; date: Date; labor: number; parts: number; downtime: number }

export async function analyze(orgId: string, kind: Kind, rows: Record<string, unknown>[]) {
  const det = detectColumns(kind, rows);
  const base = { total: rows.length, errors: [] as RowError[], counts: {} as Record<string, number>, missingRequired: det.missingRequired, mapping: det.mapping, preview: rows.slice(0, 8), columns: det.columns };
  if (det.missingRequired.length || rows.length === 0) return { analysis: { ...base, valid: 0 } as Analysis, valid: [] as (ValidAsset | ValidRecord)[], rowOf: [] as number[] };
  const g = (r: Record<string, unknown>, f: string) => (det.mapping[f] ? r[det.mapping[f]!] : "");
  const err = (row: number, field: string, code: string, message: string) => { base.errors.push({ row, field, code, message }); base.counts[code] = (base.counts[code] ?? 0) + 1; };
  const valid: (ValidAsset | ValidRecord)[] = []; const rowOf: number[] = [];

  if (kind === "assets") {
    const existing = await db.asset.findMany({ where: { orgId }, select: { tag: true, serial: true } });
    const tags = new Set(existing.map((a) => a.tag)), serials = new Set(existing.map((a) => a.serial).filter(Boolean) as string[]);
    rows.forEach((r, i) => {
      const row = i + 2; let ok = true;
      const tag = s(g(r, "tag")).toUpperCase(), serial = s(g(r, "serial"));
      if (!tag) { err(row, "tag", "missing_id", "Missing asset ID"); ok = false; }
      else if (!/^[A-Z0-9-]{3,40}$/.test(tag)) { err(row, "tag", "invalid_id", `Invalid asset ID "${tag.slice(0, 40)}"`); ok = false; }
      else if (tags.has(tag)) { err(row, "tag", "duplicate", `Duplicate asset ${tag}`); ok = false; }
      if (ok && serial && serials.has(serial)) { err(row, "serial", "duplicate", `Serial ${serial} already used`); ok = false; }
      const acquired = date(g(r, "acquired")); if (!acquired) { err(row, "acquired", "invalid_date", "Invalid or future acquisition date"); ok = false; }
      for (const f of ["make", "model", "type", "department", "location"]) if (!s(g(r, f))) { err(row, f, "missing_field", `Missing ${f}`); ok = false; }
      if (!serial) err(row, "serial", "missing_serial", "Missing serial number (row still imported)");
      const w = s(g(r, "warranty")) ? date(g(r, "warranty")) : null;
      if (ok) { tags.add(tag); if (serial) serials.add(serial); valid.push({ tag, serial: serial || null, make: s(g(r, "make")), model: s(g(r, "model")), type: s(g(r, "type")), department: s(g(r, "department")), location: s(g(r, "location")), vendor: s(g(r, "vendor")), acquired: acquired!, value: Math.max(0, Math.round(Number(s(g(r, "value")).replace(/[^\d.]/g, "")) || 0)), warranty: w }); rowOf.push(row); }
    });
  } else {
    const assets = await db.asset.findMany({ where: { orgId }, select: { tag: true, acquiredAt: true } }); const A = new Map(assets.map((a) => [a.tag, a.acquiredAt]));
    rows.forEach((r, i) => {
      const row = i + 2; let ok = true; const tag = s(g(r, "tag")).toUpperCase();
      if (!tag) { err(row, "tag", "missing_id", "Missing asset ID"); ok = false; } else if (!A.has(tag)) { err(row, "tag", "unknown_asset", `Asset ${tag} not found`); ok = false; }
      const d = date(g(r, "date")); if (!d) { err(row, "date", "invalid_date", "Invalid or future maintenance date"); ok = false; } else if (A.has(tag) && d < A.get(tag)!) { err(row, "date", "invalid_date", "Maintenance date is before asset acquisition"); ok = false; }
      if (!s(g(r, "category"))) { err(row, "category", "missing_field", "Missing category"); ok = false; }
      if (s(g(r, "description")).length < 3) { err(row, "description", "missing_field", "Missing description"); ok = false; }
      if (ok) { valid.push({ tag, category: s(g(r, "category")), description: s(g(r, "description")).slice(0, 2000), resolution: s(g(r, "resolution")).slice(0, 2000), date: d!, labor: Math.round(Number(s(g(r, "labor")).replace(/[^\d.]/g, "")) || 0), parts: Math.round(Number(s(g(r, "parts")).replace(/[^\d.]/g, "")) || 0), downtime: Number(s(g(r, "downtime"))) || 0 }); rowOf.push(row); }
    });
  }
  return { analysis: { ...base, valid: valid.length } as Analysis, valid, rowOf };
}

export async function runImport(sess: Session, kind: Kind, filename: string, rows: Record<string, unknown>[]) {
  const { analysis, valid } = await analyze(sess.orgId, kind, rows);
  if (analysis.missingRequired.length) throw new UserError(`Missing required column(s): ${analysis.missingRequired.join(", ")}`);
  const job = await db.importJob.create({ data: { orgId: sess.orgId, kind, filename: filename.slice(0, 120), total: analysis.total, valid: analysis.valid, status: "importing" } });
  if (analysis.errors.length) await db.importError.createMany({ data: analysis.errors.slice(0, 20000).map((e) => ({ jobId: job.id, ...e })) });
  let imported = 0;
  if (kind === "assets") {
    const v = valid as ValidAsset[];
    const names = async <T extends { id: string; name: string }>(vals: string[], find: () => Promise<T[]>, create: (n: string) => Promise<T>) => { const m = new Map((await find()).map((x) => [x.name.toLowerCase(), x.id])); for (const n of new Set(vals.filter(Boolean))) if (!m.has(n.toLowerCase())) m.set(n.toLowerCase(), (await create(n)).id); return m; };
    const dept = await names(v.map((x) => x.department), () => db.department.findMany({ where: { orgId: sess.orgId } }), (name) => db.department.create({ data: { orgId: sess.orgId, name } }));
    const loc = await names(v.map((x) => x.location), () => db.location.findMany({ where: { orgId: sess.orgId } }), (name) => db.location.create({ data: { orgId: sess.orgId, name, city: name, code: name.slice(0, 3).toUpperCase() } }));
    const ven = await names(v.map((x) => x.vendor), () => db.vendor.findMany({ where: { orgId: sess.orgId } }), (name) => db.vendor.create({ data: { orgId: sess.orgId, name } }));
    const types = new Map((await db.assetType.findMany({ where: { orgId: sess.orgId } })).flatMap((t) => [[t.name.toLowerCase(), t.id], [t.code.toLowerCase(), t.id]]));
    for (const n of new Set(v.map((x) => x.type))) if (!types.has(n.toLowerCase())) types.set(n.toLowerCase(), (await db.assetType.create({ data: { orgId: sess.orgId, name: n, code: n.slice(0, 3).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase() } })).id);
    const res = await db.asset.createMany({ skipDuplicates: true, data: v.map((x) => ({ orgId: sess.orgId, tag: x.tag, qrToken: newQrToken(), serial: x.serial, make: x.make, model: x.model, typeId: types.get(x.type.toLowerCase())!, departmentId: dept.get(x.department.toLowerCase())!, locationId: loc.get(x.location.toLowerCase())!, vendorId: x.vendor ? ven.get(x.vendor.toLowerCase()) : null, acquiredAt: x.acquired, acquisitionValue: x.value, warrantyEndsAt: x.warranty })) });
    imported = res.count;
  } else {
    const v = valid as ValidRecord[];
    const A = new Map((await db.asset.findMany({ where: { orgId: sess.orgId, tag: { in: [...new Set(v.map((x) => x.tag))] } }, select: { id: true, tag: true } })).map((a) => [a.tag, a.id]));
    const C = new Map((await db.maintenanceCategory.findMany({ where: { orgId: sess.orgId } })).map((c) => [c.name.toLowerCase(), c.id]));
    for (const n of new Set(v.map((x) => x.category))) if (!C.has(n.toLowerCase())) C.set(n.toLowerCase(), (await db.maintenanceCategory.create({ data: { orgId: sess.orgId, name: n } })).id);
    const res = await db.maintenanceRecord.createMany({ data: v.map((x) => ({ orgId: sess.orgId, assetId: A.get(x.tag)!, categoryId: C.get(x.category.toLowerCase())!, description: x.description, resolution: x.resolution, performedAt: x.date, laborCost: x.labor, partsCost: x.parts, downtimeHours: x.downtime })) });
    imported = res.count;
    for (const id of [...new Set(v.map((x) => A.get(x.tag)!))].slice(0, 1500)) await recomputeAsset(id);
  }
  await db.importJob.update({ where: { id: job.id }, data: { imported, status: "completed" } });
  await audit(actorOf(sess), "import.completed", "ImportJob", job.id, undefined, { kind, filename, total: analysis.total, imported, errors: analysis.errors.length });
  return { jobId: job.id, imported, analysis };
}
