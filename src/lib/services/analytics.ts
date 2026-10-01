import { Prisma } from "@prisma/client";
import { db } from "../db";
import { computeDebt } from "../engines/debt";
import { simulateReplacement } from "../engines/simulate";

const n = (v: unknown) => Number(v ?? 0);
const q = <T = Record<string, unknown>>(s: Prisma.Sql) => db.$queryRaw<T[]>(s);
const AT_RISK = Prisma.sql`("riskLevel" IN ('attention','critical'))`;
const OPEN_WO = Prisma.sql`w."status" IN ('OPEN','ASSIGNED','IN_PROGRESS','AWAITING_PARTS')`;

export async function overview(orgId: string) {
  const [byStatus, spend12, spend30, wo, sla, repeat, downtime, events, recurring, warrExp, pastSla] = await Promise.all([
    db.asset.groupBy({ by: ["status"], where: { orgId, deletedAt: null }, _count: true }),
    q<{ s: bigint }>(Prisma.sql`SELECT COALESCE(SUM("laborCost"+"partsCost"),0) s FROM "MaintenanceRecord" WHERE "orgId"=${orgId} AND "performedAt" > now() - interval '12 months'`),
    q<{ s: bigint }>(Prisma.sql`SELECT COALESCE(SUM("laborCost"+"partsCost"),0) s FROM "MaintenanceRecord" WHERE "orgId"=${orgId} AND "performedAt" > now() - interval '30 days'`),
    db.workOrder.count({ where: { orgId, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"] } } }),
    q<{ total: bigint; ok: bigint; avg_h: number | null }>(Prisma.sql`SELECT count(*) total, count(*) FILTER (WHERE "resolvedAt" <= "dueAt") ok, avg(EXTRACT(EPOCH FROM ("resolvedAt"-"createdAt"))/3600) avg_h FROM "WorkOrder" WHERE "orgId"=${orgId} AND "resolvedAt" IS NOT NULL AND "resolvedAt" > now() - interval '90 days'`),
    q<{ rep: bigint; tot: bigint }>(Prisma.sql`WITH g AS (SELECT "assetId","categoryId",count(*) c FROM "MaintenanceRecord" WHERE "orgId"=${orgId} AND "performedAt" > now() - interval '12 months' GROUP BY 1,2) SELECT count(DISTINCT "assetId") FILTER (WHERE c>=2) rep, count(DISTINCT "assetId") tot FROM g`),
    q<{ s: number }>(Prisma.sql`SELECT COALESCE(SUM("downtimeHours"),0) s FROM "MaintenanceRecord" WHERE "orgId"=${orgId} AND "performedAt" > now() - interval '12 months'`),
    db.maintenanceRecord.count({ where: { orgId } }),
    recurringFailures(orgId),
    db.asset.count({ where: { orgId, deletedAt: null, warrantyEndsAt: { gte: new Date(), lte: new Date(Date.now() + 30 * 864e5) } } }),
    db.workOrder.count({ where: { orgId, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"] }, dueAt: { lt: new Date() } } }),
  ]);
  const c = (s: string) => byStatus.find((b) => b.status === s)?._count ?? 0;
  const total = byStatus.reduce((a, b) => a + b._count, 0);
  const debt = await maintenanceDebt(orgId);
  return {
    totalAssets: total, operational: c("OPERATIONAL"), underMaintenance: c("UNDER_MAINTENANCE"), atRisk: c("AT_RISK"),
    spend12m: n(spend12[0].s), spend30d: n(spend30[0].s), openWorkOrders: wo, maintenanceEvents: events,
    slaCompliance: n(sla[0].total) ? (n(sla[0].ok) / n(sla[0].total)) * 100 : 100,
    avgResolutionHours: sla[0].avg_h ?? 0,
    repeatFailureRate: n(repeat[0].tot) ? (n(repeat[0].rep) / n(repeat[0].tot)) * 100 : 0,
    downtimeHours12m: n(downtime[0].s), debt: debt.estimated_exposure,
    attention: { recurringAssets: recurring.assets, repeatRepairCost: recurring.cost, warrantiesExpiring30d: warrExp, workOrdersPastSla: pastSla },
    anomalies: await detectAnomalies(orgId),
  };
}

/** Assets with 3+ records in the same category within 12 months. */
export async function recurringFailures(orgId: string) {
  const r = await q<{ assets: bigint; cost: bigint }>(Prisma.sql`WITH g AS (SELECT "assetId","categoryId",count(*) c, SUM("laborCost"+"partsCost") cost FROM "MaintenanceRecord" WHERE "orgId"=${orgId} AND "performedAt" > now() - interval '12 months' GROUP BY 1,2 HAVING count(*)>=3) SELECT count(DISTINCT "assetId") assets, COALESCE(SUM(cost),0) cost FROM g`);
  return { assets: n(r[0].assets), cost: n(r[0].cost) };
}

export type Range = "7D" | "30D" | "90D" | "12M";
export async function trend(orgId: string, range: Range) {
  const cfg = { "7D": ["day", "7 days"], "30D": ["day", "30 days"], "90D": ["week", "90 days"], "12M": ["month", "12 months"] }[range] ?? ["day", "30 days"];
  const unit = Prisma.raw(`'${cfg[0]}'`); const span = Prisma.raw(`'${cfg[1]}'`);
  const [req, res, cost] = await Promise.all([
    q<{ b: Date; c: bigint }>(Prisma.sql`SELECT date_trunc(${unit}, "createdAt") b, count(*) c FROM "WorkOrder" WHERE "orgId"=${orgId} AND "createdAt" > now() - interval ${span} GROUP BY 1`),
    q<{ b: Date; c: bigint }>(Prisma.sql`SELECT date_trunc(${unit}, "resolvedAt") b, count(*) c FROM "WorkOrder" WHERE "orgId"=${orgId} AND "resolvedAt" > now() - interval ${span} GROUP BY 1`),
    q<{ b: Date; c: bigint }>(Prisma.sql`SELECT date_trunc(${unit}, "performedAt") b, SUM("laborCost"+"partsCost") c FROM "MaintenanceRecord" WHERE "orgId"=${orgId} AND "performedAt" > now() - interval ${span} GROUP BY 1`),
  ]);
  const map = new Map<string, { label: string; requests: number; resolved: number; cost: number }>();
  const key = (d: Date) => d.toISOString().slice(0, 10);
  const label = (d: Date) => cfg[0] === "month" ? d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }) : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  const put = (rows: { b: Date; c: bigint }[], f: "requests" | "resolved" | "cost") => rows.forEach((r) => {
    const k = key(r.b); const e = map.get(k) ?? { label: label(r.b), requests: 0, resolved: 0, cost: 0 }; e[f] = n(r.c); map.set(k, e);
  });
  put(req, "requests"); put(res, "resolved"); put(cost, "cost");
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
}

export async function failurePatterns(orgId: string, days = 90) {
  const r = await q<{ id: string; name: string; c: bigint; cost: bigint }>(Prisma.sql`SELECT c.id, c.name, count(*) c, SUM(r."laborCost"+r."partsCost") cost FROM "MaintenanceRecord" r JOIN "MaintenanceCategory" c ON c.id=r."categoryId" WHERE r."orgId"=${orgId} AND r."performedAt" > now() - make_interval(days => ${days}::int) GROUP BY 1,2 ORDER BY 3 DESC`);
  return r.map((x) => ({ id: x.id, name: x.name, count: n(x.c), cost: n(x.cost) }));
}

export type Dim = "department" | "location";
const DIM_COL: Record<Dim, string> = { department: "departmentId", location: "locationId" };
const DIM_TBL: Record<Dim, string> = { department: "Department", location: "Location" };

export async function dimensionMetrics(orgId: string, dim: Dim) {
  const col = Prisma.raw(`"${DIM_COL[dim]}"`); const tbl = Prisma.raw(`"${DIM_TBL[dim]}"`);
  const [names, assets, open, cost, rep] = await Promise.all([
    q<{ id: string; name: string }>(Prisma.sql`SELECT id, name FROM ${tbl} WHERE "orgId"=${orgId}`),
    q<{ k: string; assets: bigint; risk: bigint }>(Prisma.sql`SELECT ${col} k, count(*) assets, count(*) FILTER (WHERE ${AT_RISK}) risk FROM "Asset" WHERE "orgId"=${orgId} AND "deletedAt" IS NULL GROUP BY 1`),
    q<{ k: string; c: bigint }>(Prisma.sql`SELECT a.${col} k, count(*) c FROM "WorkOrder" w JOIN "Asset" a ON a.id=w."assetId" WHERE w."orgId"=${orgId} AND ${OPEN_WO} GROUP BY 1`),
    q<{ k: string; events: bigint; cost: bigint; down: number }>(Prisma.sql`SELECT a.${col} k, count(*) events, SUM(r."laborCost"+r."partsCost") cost, SUM(r."downtimeHours") down FROM "MaintenanceRecord" r JOIN "Asset" a ON a.id=r."assetId" WHERE r."orgId"=${orgId} AND r."performedAt" > now() - interval '12 months' GROUP BY 1`),
    q<{ k: string; rep: bigint; tot: bigint }>(Prisma.sql`WITH g AS (SELECT a.${col} k, r."assetId", r."categoryId", count(*) c FROM "MaintenanceRecord" r JOIN "Asset" a ON a.id=r."assetId" WHERE r."orgId"=${orgId} AND r."performedAt" > now() - interval '12 months' GROUP BY 1,2,3) SELECT k, count(DISTINCT "assetId") FILTER (WHERE c>=2) rep, count(DISTINCT "assetId") tot FROM g GROUP BY 1`),
  ]);
  const by = <T extends { k: string }>(a: T[]) => new Map(a.map((x) => [x.k, x]));
  const A = by(assets), O = by(open), C = by(cost), R = by(rep);
  return names.map((x) => ({
    id: x.id, name: x.name, assets: n(A.get(x.id)?.assets), atRisk: n(A.get(x.id)?.risk), openWorkOrders: n(O.get(x.id)?.c),
    events12m: n(C.get(x.id)?.events), cost12m: n(C.get(x.id)?.cost), downtime12m: n(C.get(x.id)?.down),
    repeatRate: n(R.get(x.id)?.tot) ? (n(R.get(x.id)?.rep) / n(R.get(x.id)?.tot)) * 100 : 0,
  })).sort((a, b) => b.cost12m - a.cost12m);
}

export async function vendorMetrics(orgId: string) {
  const [vs, wo, spend, repeat] = await Promise.all([
    db.vendor.findMany({ where: { orgId } }),
    q<{ k: string; total: bigint; ok: bigint; avg_h: number | null; open: bigint; late: bigint }>(Prisma.sql`SELECT "vendorId" k, count(*) total, count(*) FILTER (WHERE "resolvedAt" IS NOT NULL AND "resolvedAt" <= "dueAt") ok, avg(EXTRACT(EPOCH FROM ("resolvedAt"-"createdAt"))/3600) avg_h, count(*) FILTER (WHERE status IN ('OPEN','ASSIGNED','IN_PROGRESS','AWAITING_PARTS')) open, count(*) FILTER (WHERE (status IN ('OPEN','ASSIGNED','IN_PROGRESS','AWAITING_PARTS') AND "dueAt" < now()) OR ("resolvedAt" IS NOT NULL AND "resolvedAt" > "dueAt")) late FROM "WorkOrder" WHERE "orgId"=${orgId} AND "vendorId" IS NOT NULL AND "createdAt" > now() - interval '12 months' GROUP BY 1`),
    q<{ k: string; s: bigint }>(Prisma.sql`SELECT "vendorId" k, SUM("laborCost"+"partsCost") s FROM "MaintenanceRecord" WHERE "orgId"=${orgId} AND "vendorId" IS NOT NULL AND "performedAt" > now() - interval '12 months' GROUP BY 1`),
    q<{ k: string; c: bigint }>(Prisma.sql`WITH g AS (SELECT "vendorId" k,"assetId","categoryId",count(*) c FROM "MaintenanceRecord" WHERE "orgId"=${orgId} AND "vendorId" IS NOT NULL AND "performedAt" > now() - interval '12 months' GROUP BY 1,2,3 HAVING count(*)>=2) SELECT k, sum(c-1) c FROM g GROUP BY 1`),
  ]);
  const W = new Map(wo.map((x) => [x.k, x])), S = new Map(spend.map((x) => [x.k, x])), R = new Map(repeat.map((x) => [x.k, x]));
  return vs.map((v) => {
    const w = W.get(v.id);
    const closedCount = w ? n(w.total) - n(w.open) : 0;
    return {
      id: v.id, name: v.name, slaHours: v.slaHours, workOrders: n(w?.total), open: n(w?.open),
      slaCompliance: closedCount > 0 ? (n(w?.ok) / closedCount) * 100 : 100,
      lateOrders: n(w?.late), avgResolutionHours: w?.avg_h ?? 0, repeatRepairs: n(R.get(v.id)?.c), spend12m: n(S.get(v.id)?.s),
    };
  }).sort((a, b) => b.workOrders - a.workOrders);
}

export async function monthlySeries(orgId: string, where: { vendorId?: string; departmentId?: string; locationId?: string }) {
  const cond = where.vendorId ? Prisma.sql`AND r."vendorId"=${where.vendorId}` : where.departmentId ? Prisma.sql`AND a."departmentId"=${where.departmentId}` : where.locationId ? Prisma.sql`AND a."locationId"=${where.locationId}` : Prisma.empty;
  const r = await q<{ b: Date; c: bigint; cost: bigint }>(Prisma.sql`SELECT date_trunc('month', r."performedAt") b, count(*) c, SUM(r."laborCost"+r."partsCost") cost FROM "MaintenanceRecord" r JOIN "Asset" a ON a.id=r."assetId" WHERE r."orgId"=${orgId} AND r."performedAt" > now() - interval '12 months' ${cond} GROUP BY 1 ORDER BY 1`);
  return r.map((x) => ({ label: x.b.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }), events: n(x.c), cost: n(x.cost) }));
}

/** Debt inputs come straight from the database; the maths lives in the pure engine. */
export async function maintenanceDebt(orgId: string) {
  const [overdue, rec, aging, exp] = await Promise.all([
    db.workOrder.count({ where: { orgId, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"] }, dueAt: { lt: new Date() } } }),
    recurringFailures(orgId),
    q<{ rc: number }>(Prisma.sql`SELECT t."replacementCost" rc FROM "Asset" a JOIN "AssetType" t ON t.id=a."typeId" WHERE a."orgId"=${orgId} AND a."deletedAt" IS NULL AND a.status <> 'RETIRED' AND a."acquiredAt" < now() - make_interval(years => t."lifespanYears")`),
    q<{ rc: number }>(Prisma.sql`SELECT t."replacementCost" rc FROM "Asset" a JOIN "AssetType" t ON t.id=a."typeId" WHERE a."orgId"=${orgId} AND a."deletedAt" IS NULL AND a.status <> 'RETIRED' AND a."warrantyEndsAt" < now() AND a."riskLevel" IN ('attention','critical')`),
  ]);
  return computeDebt({ overdueWorkOrders: overdue, recurringFailureAssets: rec.assets, agingAssets: aging.map((x) => ({ replacementCost: n(x.rc) })), expiredWarrantyAssets: exp.map((x) => ({ replacementCost: n(x.rc) })) });
}

export async function debtBreakdown(orgId: string, dim: "department" | "category" | "location" | "vendor") {
  const sel = {
    department: Prisma.sql`SELECT d.name k, count(*) c FROM "WorkOrder" w JOIN "Asset" a ON a.id=w."assetId" JOIN "Department" d ON d.id=a."departmentId"`,
    location: Prisma.sql`SELECT d.name k, count(*) c FROM "WorkOrder" w JOIN "Asset" a ON a.id=w."assetId" JOIN "Location" d ON d.id=a."locationId"`,
    vendor: Prisma.sql`SELECT d.name k, count(*) c FROM "WorkOrder" w JOIN "Vendor" d ON d.id=w."vendorId"`,
    category: Prisma.sql`SELECT d.name k, count(*) c FROM "WorkOrder" w JOIN "MaintenanceCategory" d ON d.id=w."categoryId"`,
  }[dim];
  const r = await q<{ k: string; c: bigint }>(Prisma.sql`${sel} WHERE w."orgId"=${orgId} AND w.status IN ('OPEN','ASSIGNED','IN_PROGRESS','AWAITING_PARTS') AND w."dueAt" < now() GROUP BY 1 ORDER BY 2 DESC LIMIT 12`);
  return r.map((x) => ({ name: x.k, overdue: n(x.c) }));
}

export interface Anomaly { category: string; categoryId: string; recent: number; baseline: number; ratio: number; departments: number; locations: number; models: string[]; vendors: string[]; assetIds: string[] }
/** Last 30 days vs the average 30-day window over the prior 90 days. Deterministic. */
export async function detectAnomalies(orgId: string): Promise<Anomaly[]> {
  const rows = await q<{ id: string; name: string; recent: bigint; prior: bigint }>(Prisma.sql`SELECT c.id, c.name, count(*) FILTER (WHERE r."performedAt" > now() - interval '30 days') recent, count(*) FILTER (WHERE r."performedAt" <= now() - interval '30 days' AND r."performedAt" > now() - interval '120 days') prior FROM "MaintenanceRecord" r JOIN "MaintenanceCategory" c ON c.id=r."categoryId" WHERE r."orgId"=${orgId} AND r."performedAt" > now() - interval '120 days' GROUP BY 1,2`);
  const out: Anomaly[] = [];
  for (const r of rows) {
    const baseline = n(r.prior) / 3; const recent = n(r.recent);
    if (recent >= 15 && recent >= baseline * 1.8 + 5) {
      const d = await q<{ depts: bigint; locs: bigint; models: string[]; vendors: string[]; ids: string[] }>(Prisma.sql`SELECT count(DISTINCT a."departmentId") depts, count(DISTINCT a."locationId") locs, array_agg(DISTINCT a.model) models, (SELECT array_agg(name) FROM (SELECT v2.name FROM "MaintenanceRecord" r2 JOIN "Vendor" v2 ON v2.id=r2."vendorId" WHERE r2."orgId"=${orgId} AND r2."categoryId"=${r.id} AND r2."performedAt" > now() - interval '30 days' GROUP BY v2.name ORDER BY count(*) DESC LIMIT 3) t) vendors, (array_agg(DISTINCT a.id))[1:200] ids FROM "MaintenanceRecord" r JOIN "Asset" a ON a.id=r."assetId" LEFT JOIN "Vendor" v ON v.id=r."vendorId" WHERE r."orgId"=${orgId} AND r."categoryId"=${r.id} AND r."performedAt" > now() - interval '30 days'`);
      out.push({ category: r.name, categoryId: r.id, recent, baseline: Math.round(baseline * 10) / 10, ratio: baseline ? recent / baseline : recent, departments: n(d[0].depts), locations: n(d[0].locs), models: d[0].models ?? [], vendors: d[0].vendors ?? [], assetIds: d[0].ids ?? [] });
    }
  }
  return out.sort((a, b) => b.ratio - a.ratio);
}

export async function warrantyExposure(orgId: string) {
  const [exp30, expired, atRiskExpired] = await Promise.all([
    db.asset.count({ where: { orgId, deletedAt: null, warrantyEndsAt: { gte: new Date(), lte: new Date(Date.now() + 30 * 864e5) } } }),
    db.asset.count({ where: { orgId, deletedAt: null, warrantyEndsAt: { lt: new Date() } } }),
    db.asset.count({ where: { orgId, deletedAt: null, warrantyEndsAt: { lt: new Date() }, riskLevel: { in: ["attention", "critical"] } } }),
  ]);
  return { expiring30d: exp30, expired, atRiskExpired };
}

export async function lifecycleData(orgId: string) {
  const r = await q<{ id: string; rc: number; age: number; maint: bigint }>(Prisma.sql`SELECT a.id, t."replacementCost" rc, EXTRACT(EPOCH FROM (now()-a."acquiredAt"))/31557600 age, COALESCE((SELECT SUM("laborCost"+"partsCost") FROM "MaintenanceRecord" r WHERE r."assetId"=a.id AND r."performedAt" > now() - interval '12 months'),0) maint FROM "Asset" a JOIN "AssetType" t ON t.id=a."typeId" WHERE a."orgId"=${orgId} AND a."deletedAt" IS NULL AND a.status <> 'RETIRED'`);
  return r.map((x) => ({ replacementCost: n(x.rc), ageYears: Number(x.age), annualMaintenance: n(x.maint) }));
}
export async function lifecycleScenario(orgId: string, minAge: number) {
  const assets = await lifecycleData(orgId);
  const current = { assets: assets.length, annualMaintenance: assets.reduce((s, a) => s + a.annualMaintenance, 0) };
  return { current, scenario: simulateReplacement(assets, minAge) };
}
