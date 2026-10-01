import { Prisma } from "@prisma/client";
import { db } from "../db";
import { AuthzError, assertCan, type Permission } from "../rbac";
import type { Session } from "../auth";
import { assetScope } from "../services/assets";
import * as A from "../services/analytics";
import { warrantyState } from "../engines/risk";

export interface ToolResult { title: string; data: unknown; href?: string }
type Tool = { perm: Permission; run: (s: Session, args: Record<string, unknown>) => Promise<ToolResult> };

/** Untrusted free text from records: truncated and stripped of control chars. The model is told this is data. */
export const clean = (t: string, max = 160) => t.replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, max);
const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const int = (v: unknown, d: number, max = 25) => Math.max(1, Math.min(max, Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : d));

export const TOOLS: Record<string, Tool> = {
  search_assets: { perm: "asset:read", run: async (s, a) => {
    const minRepairs = a.minRepairs ? Number(a.minRepairs) : undefined;
    const where = assetScope(s, {
      ...(a.query ? { OR: [{ tag: { contains: str(a.query), mode: "insensitive" as const } }, { model: { contains: str(a.query), mode: "insensitive" as const } }] } : {}),
      ...(minRepairs ? { maintenanceCount: { gt: minRepairs } } : {}),
      ...(a.riskLevel ? { riskLevel: str(a.riskLevel) } : {}),
    });
    const [rows, total] = await Promise.all([db.asset.findMany({ where, take: int(a.limit, 10), orderBy: { maintenanceCount: "desc" }, select: { id: true, tag: true, make: true, model: true, maintenanceCount: true, healthScore: true, riskLevel: true, department: { select: { name: true } } } }), db.asset.count({ where })]);
    return { title: minRepairs ? `Assets with more than ${minRepairs} repairs` : "Asset search", data: { total, shown: rows.length, assets: rows.map((r) => ({ id: r.id, tag: r.tag, device: `${r.make} ${r.model}`, department: r.department.name, repairs: r.maintenanceCount, health: r.healthScore, risk: r.riskLevel })) }, href: "/app/assets" };
  } },
  get_asset: { perm: "asset:read", run: async (s, a) => {
    const x = await db.asset.findFirst({ where: assetScope(s, { OR: [{ id: str(a.id) }, { tag: str(a.tag) }] }), include: { department: true, location: true, vendor: true, type: true } });
    if (!x) return { title: "Asset", data: { found: false } };
    return { title: `Asset ${x.tag}`, href: `/app/assets/${x.id}`, data: { id: x.id, tag: x.tag, device: `${x.make} ${x.model}`, type: x.type.name, department: x.department.name, location: x.location.name, vendor: x.vendor?.name ?? null, status: x.status, health: x.healthScore, riskScore: x.riskScore, repairs: x.maintenanceCount, downtimeHours: x.downtimeHours, lifetimeCostNGN: x.lifetimeCost, acquisitionValueNGN: x.acquisitionValue, warranty: warrantyState(x.warrantyEndsAt) } };
  } },
  get_asset_history: { perm: "maintenance:read", run: async (s, a) => {
    const x = await db.asset.findFirst({ where: assetScope(s, { OR: [{ id: str(a.id) }, { tag: str(a.tag) }] }) });
    if (!x) return { title: "Asset history", data: { found: false } };
    const recs = await db.maintenanceRecord.findMany({ where: { assetId: x.id, orgId: s.orgId }, orderBy: { performedAt: "desc" }, take: 10, include: { category: true } });
    return { title: `Maintenance history for ${x.tag}`, href: `/app/assets/${x.id}`, data: { tag: x.tag, total: x.maintenanceCount, recent: recs.map((r) => ({ id: r.id, date: r.performedAt.toISOString().slice(0, 10), category: r.category.name, costNGN: r.laborCost + r.partsCost, downtimeHours: r.downtimeHours, note: clean(r.description) })) } };
  } },
  get_maintenance_records: { perm: "maintenance:read", run: async (s, a) => {
    const days = int(a.days, 30, 365);
    const where: Prisma.MaintenanceRecordWhereInput = { orgId: s.orgId, performedAt: { gte: new Date(Date.now() - days * 864e5) }, ...(a.categoryId ? { categoryId: str(a.categoryId) } : {}) };
    const [agg, rows] = await Promise.all([db.maintenanceRecord.aggregate({ where, _count: true, _sum: { laborCost: true, partsCost: true, downtimeHours: true } }), db.maintenanceRecord.findMany({ where, orderBy: { performedAt: "desc" }, take: 8, include: { category: true, asset: { select: { tag: true } } } })]);
    return { title: `Maintenance records, last ${days} days`, href: "/app/maintenance", data: { count: agg._count, costNGN: (agg._sum.laborCost ?? 0) + (agg._sum.partsCost ?? 0), downtimeHours: agg._sum.downtimeHours ?? 0, sample: rows.map((r) => ({ asset: r.asset.tag, category: r.category.name, date: r.performedAt.toISOString().slice(0, 10), note: clean(r.description) })) } };
  } },
  get_work_orders: { perm: "workorder:read", run: async (s) => {
    const [by, late] = await Promise.all([db.workOrder.groupBy({ by: ["status"], where: { orgId: s.orgId }, _count: true }), db.workOrder.count({ where: { orgId: s.orgId, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"] }, dueAt: { lt: new Date() } } })]);
    return { title: "Work orders", href: "/app/work-orders", data: { byStatus: Object.fromEntries(by.map((b) => [b.status, b._count])), pastSla: late } };
  } },
  get_department_metrics: { perm: "department:read", run: async (s) => ({ title: "Department metrics (12 months)", href: "/app/departments", data: (await A.dimensionMetrics(s.orgId, "department")).slice(0, 12).map((d) => ({ name: d.name, assets: d.assets, atRisk: d.atRisk, openWorkOrders: d.openWorkOrders, costNGN: d.cost12m, repeatFailureRatePct: Math.round(d.repeatRate * 10) / 10 })) }) },
  get_vendor_metrics: { perm: "vendor:read", run: async (s) => ({ title: "Vendor metrics (12 months)", href: "/app/vendors", data: (await A.vendorMetrics(s.orgId)).slice(0, 12).map((v) => ({ name: v.name, workOrders: v.workOrders, slaCompliancePct: Math.round(v.slaCompliance * 10) / 10, lateOrders: v.lateOrders, repeatRepairs: v.repeatRepairs, spendNGN: v.spend12m })) }) },
  get_location_metrics: { perm: "location:read", run: async (s) => ({ title: "Location metrics (12 months)", href: "/app/locations", data: (await A.dimensionMetrics(s.orgId, "location")).slice(0, 15).map((d) => ({ name: d.name, assets: d.assets, atRisk: d.atRisk, openWorkOrders: d.openWorkOrders, costNGN: d.cost12m })) }) },
  get_failure_patterns: { perm: "analytics:read", run: async (s, a) => ({ title: `Failure categories, last ${int(a.days, 90, 365)} days`, href: "/app/maintenance", data: (await A.failurePatterns(s.orgId, int(a.days, 90, 365))).slice(0, 10) }) },
  get_warranty_expirations: { perm: "asset:read", run: async (s) => {
    const rows = await db.asset.findMany({ where: assetScope(s, { warrantyEndsAt: { gte: new Date(), lte: new Date(Date.now() + 60 * 864e5) } }), orderBy: { warrantyEndsAt: "asc" }, take: 15, select: { id: true, tag: true, model: true, warrantyEndsAt: true } });
    const w = await A.warrantyExposure(s.orgId);
    return { title: "Warranty expirations", href: "/app/assets?warranty=expiring", data: { ...w, nextExpiring: rows.map((r) => ({ id: r.id, tag: r.tag, model: r.model, endsAt: r.warrantyEndsAt?.toISOString().slice(0, 10) })) } };
  } },
  get_lifecycle_data: { perm: "analytics:read", run: async (s, a) => ({ title: "Lifecycle scenario", href: "/app/analytics/lifecycle", data: await A.lifecycleScenario(s.orgId, Number(a.minAge ?? 5)) }) },
  get_maintenance_debt: { perm: "analytics:read", run: async (s) => ({ title: "Maintenance debt (estimate)", href: "/app/analytics/maintenance-debt", data: await A.maintenanceDebt(s.orgId) }) },
  get_similar_incidents: { perm: "maintenance:read", run: async (s, a) => {
    const cat = await db.maintenanceCategory.findFirst({ where: { id: str(a.categoryId), orgId: s.orgId } });
    if (!cat) return { title: "Similar incidents", data: { found: false } };
    const days = int(a.days, 30, 365);
    const d = await db.$queryRaw<{ models: string[]; vendors: string[]; depts: string[]; locs: string[]; n: bigint; cost: bigint }[]>(Prisma.sql`SELECT array_agg(DISTINCT a.model) models, array_agg(DISTINCT v.name) FILTER (WHERE v.name IS NOT NULL) vendors, array_agg(DISTINCT d.name) depts, array_agg(DISTINCT l.name) locs, count(*) n, COALESCE(SUM(r."laborCost"+r."partsCost"),0) cost FROM "MaintenanceRecord" r JOIN "Asset" a ON a.id=r."assetId" JOIN "Department" d ON d.id=a."departmentId" JOIN "Location" l ON l.id=a."locationId" LEFT JOIN "Vendor" v ON v.id=r."vendorId" WHERE r."orgId"=${s.orgId} AND r."categoryId"=${cat.id} AND r."performedAt" > now() - make_interval(days => ${days}::int)`);
    const vendorShare = await db.$queryRaw<{ name: string; c: bigint }[]>(Prisma.sql`SELECT v.name, count(*) c FROM "MaintenanceRecord" r JOIN "Vendor" v ON v.id=r."vendorId" WHERE r."orgId"=${s.orgId} AND r."categoryId"=${cat.id} AND r."performedAt" > now() - make_interval(days => ${days}::int) GROUP BY 1 ORDER BY 2 DESC LIMIT 5`);
    const samples = await db.maintenanceRecord.findMany({ where: { orgId: s.orgId, categoryId: cat.id, performedAt: { gte: new Date(Date.now() - days * 864e5) } }, orderBy: { performedAt: "desc" }, take: 6, include: { asset: { select: { tag: true, model: true } } } });
    const x = d[0];
    return { title: `${cat.name} incidents, last ${days} days`, href: `/app/maintenance?category=${cat.id}`, data: { category: cat.name, incidents: Number(x.n), costNGN: Number(x.cost), departments: x.depts ?? [], locations: x.locs ?? [], deviceModels: x.models ?? [], vendorShare: vendorShare.map((v) => ({ vendor: v.name, incidents: Number(v.c) })), samples: samples.map((r) => ({ asset: r.asset.tag, model: r.asset.model, date: r.performedAt.toISOString().slice(0, 10), note: clean(r.description) })) } };
  } },
  get_asset_relationships: { perm: "asset:read", run: async (s, a) => {
    const x = await db.asset.findFirst({ where: assetScope(s, { OR: [{ id: str(a.id) }, { tag: str(a.tag) }] }), include: { department: true, location: true, vendor: true, networkParent: true, _count: { select: { networkChildren: true } } } });
    if (!x) return { title: "Asset relationships", data: { found: false } };
    return { title: `Relationships for ${x.tag}`, href: `/app/graph?asset=${x.id}`, data: { tag: x.tag, department: x.department.name, location: x.location.name, vendor: x.vendor?.name ?? null, connectedTo: x.networkParent?.tag ?? null, downstreamDevices: x._count.networkChildren } };
  } },
};

export async function runTool(s: Session, name: string, args: Record<string, unknown> = {}): Promise<ToolResult> {
  const t = TOOLS[name];
  if (!t) throw new Error(`Unknown tool: ${name}`);
  assertCan(s.role, "ai:use");
  try { assertCan(s.role, t.perm); } catch { throw new AuthzError(`Tool ${name} is not permitted for your role.`); }
  return t.run(s, args);
}
