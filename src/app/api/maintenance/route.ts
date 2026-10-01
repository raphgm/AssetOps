import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { createMaintenanceRecord } from "@/lib/services/maintenance";

export const GET = handle(async (req) => {
  const s = await requireSession("maintenance:read");
  const sp = new URL(req.url).searchParams;
  const take = Math.min(100, Number(sp.get("size")) || 50), skip = ((Number(sp.get("page")) || 1) - 1) * take;
  const where = { orgId: s.orgId, ...(sp.get("category") ? { categoryId: sp.get("category")! } : {}), ...(sp.get("asset") ? { assetId: sp.get("asset")! } : {}) };
  const [total, items] = await Promise.all([db.maintenanceRecord.count({ where }), db.maintenanceRecord.findMany({ where, orderBy: { performedAt: "desc" }, skip, take, include: { category: true, asset: { select: { tag: true } } } })]);
  return { total, items };
});
export const POST = handle(async (req) => {
  const s = await requireSession("maintenance:write");
  return createMaintenanceRecord(s, await req.json());
});
