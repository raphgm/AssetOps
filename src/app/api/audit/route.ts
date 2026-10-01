import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { toCsv, csvResponse } from "@/lib/csv";

export const GET = handle(async (req) => {
  const s = await requireSession("audit:read");
  const sp = new URL(req.url).searchParams;
  const where: Prisma.AuditLogWhereInput = { orgId: s.orgId, ...(sp.get("action") ? { action: { contains: sp.get("action")! } } : {}), ...(sp.get("actor") ? { actorName: { contains: sp.get("actor")!, mode: "insensitive" } } : {}), ...(sp.get("entity") ? { entityId: { contains: sp.get("entity")!, mode: "insensitive" } } : {}) };
  if (sp.get("format") === "csv") { const r = await db.auditLog.findMany({ where, orderBy: { at: "desc" }, take: 20000 }); return csvResponse("audit-log.csv", toCsv([["Time", "Actor", "Action", "Entity", "ID", "IP"], ...r.map((x) => [x.at.toISOString(), x.actorName, x.action, x.entity, x.entityId, x.ip])])); }
  const take = Math.min(100, Number(sp.get("size")) || 50);
  const [total, items] = await Promise.all([db.auditLog.count({ where }), db.auditLog.findMany({ where, orderBy: { at: "desc" }, take, skip: ((Number(sp.get("page")) || 1) - 1) * take })]);
  return { total, items };
});
// Deliberately no PATCH/PUT/DELETE: the audit log is append-only.
