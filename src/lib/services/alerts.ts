import { db } from "../db";
import { detectAnomalies } from "./analytics";

/** Idempotent alert generation (deduplicated per kind per day). Safe to call on page loads. */
export async function refreshAlerts(orgId: string) {
  const since = new Date(Date.now() - 20 * 3600e3); const now = new Date();
  const [overdue, expiring, anomalies, existing] = await Promise.all([
    db.workOrder.count({ where: { orgId, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"] }, dueAt: { lt: now } } }),
    db.asset.count({ where: { orgId, deletedAt: null, warrantyEndsAt: { gte: now, lte: new Date(+now + 30 * 864e5) } } }),
    detectAnomalies(orgId),
    db.notification.findMany({ where: { orgId, at: { gte: since } }, select: { kind: true } }),
  ]);
  const have = new Set(existing.map((e) => e.kind));
  const rows = [
    overdue > 0 && !have.has("overdue_workorder") && { kind: "overdue_workorder", title: `${overdue} work orders are past SLA`, href: "/app/work-orders?overdue=1" },
    expiring > 0 && !have.has("warranty_expiring") && { kind: "warranty_expiring", title: `${expiring} warranties expire within 30 days`, href: "/app/assets?warranty=expiring" },
    ...anomalies.map((a) => !have.has("maintenance_anomaly") && { kind: "maintenance_anomaly", title: `Maintenance anomaly: ${a.category}`, body: `${a.recent} events in 30 days vs ${a.baseline}/month baseline`, href: "/app" }),
  ].filter(Boolean) as { kind: string; title: string; body?: string; href: string }[];
  if (rows.length) await db.notification.createMany({ data: rows.slice(0, 3).map((r) => ({ orgId, ...r })) });
}
