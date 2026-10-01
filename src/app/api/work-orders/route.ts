import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { createWorkOrder, createFleetInspection } from "@/lib/services/workorders";
import { assertCan } from "@/lib/rbac";

export const GET = handle(async (req) => {
  const s = await requireSession("workorder:read");
  const sp = new URL(req.url).searchParams;
  const where = { orgId: s.orgId, ...(sp.get("status") ? { status: sp.get("status") as never } : {}), ...(s.role === "TECHNICIAN" ? { assigneeId: s.userId } : {}) };
  return db.workOrder.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, include: { asset: { select: { tag: true } }, assignee: { select: { name: true } } } });
});
export const POST = handle(async (req) => {
  const body = await req.json();
  if (body.fleet) {
    const s = await requireSession("workorder:create");
    assertCan(s.role, "workorder:assign");
    const assets = await db.asset.findMany({ where: { id: { in: (body.assetIds as string[]).slice(0, 200) }, orgId: s.orgId }, select: { id: true } });
    const wos = await createFleetInspection(s, assets.map((a) => a.id), String(body.title), String(body.fleetKey ?? "fleet"), body.categoryId ? String(body.categoryId) : undefined);
    return { created: wos.length };
  }
  const s = await requireSession("issue:report");
  return createWorkOrder(s, body, { asReport: !!body.report });
});
