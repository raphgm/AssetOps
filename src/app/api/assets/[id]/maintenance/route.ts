import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { assetScope } from "@/lib/services/assets";

export const GET = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("maintenance:read");
  const a = await db.asset.findFirst({ where: assetScope(s, { id: (await ctx.params).id }), select: { id: true } });
  if (!a) throw new Error("Asset not found.");
  return db.maintenanceRecord.findMany({ where: { assetId: a.id, orgId: s.orgId }, orderBy: { performedAt: "desc" }, take: 200, include: { category: true, vendor: true, technician: { select: { name: true } } } });
});
