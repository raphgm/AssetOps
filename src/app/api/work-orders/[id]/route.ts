import { z } from "zod";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { transitionWorkOrder } from "@/lib/services/workorders";

export const GET = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("workorder:read");
  const w = await db.workOrder.findFirst({ where: { id: (await ctx.params).id, orgId: s.orgId }, include: { asset: true, events: { orderBy: { at: "asc" } }, assignee: { select: { name: true } } } });
  if (!w) throw new Error("Work order not found.");
  return w;
});
const body = z.object({
  to: z.enum(["ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS", "RESOLVED", "VERIFIED", "CLOSED", "CANCELLED"]), note: z.string().max(500).optional(), assigneeId: z.string().optional(),
  resolution: z.object({ categoryId: z.string(), description: z.string().max(2000).optional(), resolution: z.string().trim().min(2).max(2000), laborCost: z.number().int().min(0), downtimeHours: z.number().min(0), notes: z.string().max(2000).optional(),
    parts: z.array(z.object({ name: z.string().trim().min(1).max(80), quantity: z.number().int().min(1), unitCost: z.number().int().min(0) })) }).optional(),
});
export const PATCH = handle(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("workorder:read");
  const r = await transitionWorkOrder(s, (await ctx.params).id, body.parse(await req.json()));
  return { ok: true, status: r.workOrder.status, recordId: "recordId" in r ? r.recordId : undefined };
});
