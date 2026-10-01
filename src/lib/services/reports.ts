import { db } from "../db";
import type { Session } from "./../auth";
import * as A from "./analytics";
import { assetScope } from "./assets";
import { can, type Permission } from "../rbac";

export const REPORTS: Record<string, { title: string; perm: Permission }> = {
  "asset-register": { title: "Asset Register", perm: "report:read" }, maintenance: { title: "Maintenance Report", perm: "report:read" },
  department: { title: "Department Report", perm: "report:read" }, vendor: { title: "Vendor Performance", perm: "report:read" },
  cost: { title: "Maintenance Cost", perm: "report:read" }, risk: { title: "Risk Report", perm: "report:read" },
  lifecycle: { title: "Lifecycle Report", perm: "report:read" }, audit: { title: "Audit Report", perm: "audit:read" },
};
type Cell = string | number | null;
export async function buildReport(s: Session, kind: string): Promise<{ title: string; headers: string[]; rows: Cell[][] }> {
  const def = REPORTS[kind]; if (!def) throw new Error("Report not found.");
  if (!can(s.role, def.perm)) throw new Error("Report not found.");
  const d = (x: Date | null) => (x ? x.toISOString().slice(0, 10) : "");
  switch (kind) {
    case "asset-register": { const r = await db.asset.findMany({ where: assetScope(s), orderBy: { tag: "asc" }, take: 20000, include: { department: true, location: true, type: true } }); return { title: def.title, headers: ["Asset ID", "Serial", "Device", "Type", "Department", "Location", "Status", "Health", "Acquired", "Warranty ends"], rows: r.map((a) => [a.tag, a.serial, `${a.make} ${a.model}`, a.type.name, a.department.name, a.location.name, a.status, a.healthScore, d(a.acquiredAt), d(a.warrantyEndsAt)]) }; }
    case "maintenance": { const r = await db.maintenanceRecord.findMany({ where: { orgId: s.orgId, performedAt: { gte: new Date(Date.now() - 365 * 864e5) } }, orderBy: { performedAt: "desc" }, take: 20000, include: { asset: { select: { tag: true } }, category: true, vendor: true, technician: { select: { name: true } } } }); return { title: def.title + " (last 12 months)", headers: ["Date", "Asset", "Category", "Description", "Technician", "Vendor", "Labor ₦", "Parts ₦", "Downtime h"], rows: r.map((x) => [d(x.performedAt), x.asset.tag, x.category.name, x.description, x.technician?.name ?? "", x.vendor?.name ?? "", x.laborCost, x.partsCost, x.downtimeHours]) }; }
    case "department": { const r = await A.dimensionMetrics(s.orgId, "department"); return { title: def.title, headers: ["Department", "Assets", "Events (12m)", "Open WOs", "At risk", "Cost 12m ₦", "Repeat rate %"], rows: r.map((x) => [x.name, x.assets, x.events12m, x.openWorkOrders, x.atRisk, x.cost12m, Math.round(x.repeatRate * 10) / 10]) }; }
    case "vendor": { const r = await A.vendorMetrics(s.orgId); return { title: def.title, headers: ["Vendor", "Work orders", "SLA compliance %", "Avg resolution h", "Repeat repairs", "Spend 12m ₦"], rows: r.map((x) => [x.name, x.workOrders, Math.round(x.slaCompliance * 10) / 10, Math.round(x.avgResolutionHours), x.repeatRepairs, x.spend12m]) }; }
    case "cost": { const r = await A.failurePatterns(s.orgId, 365); return { title: def.title + " by category (12 months)", headers: ["Category", "Events", "Cost ₦"], rows: r.map((x) => [x.name, x.count, x.cost]) }; }
    case "risk": { const r = await db.asset.findMany({ where: assetScope(s, { riskLevel: { in: ["attention", "critical"] } }), orderBy: { riskScore: "desc" }, take: 5000, include: { department: true, location: true } }); return { title: def.title, headers: ["Asset ID", "Device", "Department", "Location", "Risk score", "Level", "Health", "Events", "Lifetime cost ₦"], rows: r.map((a) => [a.tag, `${a.make} ${a.model}`, a.department.name, a.location.name, a.riskScore, a.riskLevel, a.healthScore, a.maintenanceCount, a.lifetimeCost]) }; }
    case "lifecycle": { const r = await db.asset.findMany({ where: assetScope(s, { status: { not: "RETIRED" } }), include: { type: true }, take: 20000 }); const now = Date.now(); const rows = r.map((a) => { const age = (now - a.acquiredAt.getTime()) / (365.25 * 864e5); return [a.tag, a.type.name, Math.round(age * 10) / 10, a.type.lifespanYears, age >= a.type.lifespanYears ? "Past lifespan" : "Within lifespan", a.type.replacementCost] as Cell[]; }).filter((x) => x[4] === "Past lifespan"); return { title: def.title + " (assets past expected lifespan)", headers: ["Asset ID", "Type", "Age (y)", "Lifespan (y)", "Status", "Replacement cost ₦ (estimate)"], rows }; }
    default: { const r = await db.auditLog.findMany({ where: { orgId: s.orgId }, orderBy: { at: "desc" }, take: 5000 }); return { title: def.title + " (latest 5,000)", headers: ["Time", "Actor", "Action", "Entity", "ID"], rows: r.map((x) => [x.at.toISOString(), x.actorName, x.action, x.entity, x.entityId]) }; }
  }
}
