import { z } from "zod";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { assetScope, updateAsset, assignAsset } from "@/lib/services/assets";

export const GET = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("asset:read");
  const a = await db.asset.findFirst({ where: assetScope(s, { id: (await ctx.params).id }), include: { department: true, location: true, type: true, vendor: true } });
  if (!a) throw new Error("Asset not found.");
  return a;
});
export const PATCH = handle(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("asset:write");
  const id = (await ctx.params).id;
  const b = z.object({ status: z.enum(["OPERATIONAL", "UNDER_MAINTENANCE", "AT_RISK", "RETIRED"]).optional(), departmentId: z.string().optional(), locationId: z.string().optional(), assignee: z.string().trim().min(2).max(80).optional() }).parse(await req.json());
  if (b.assignee) await assignAsset(s, id, b.assignee);
  const { assignee: _a, ...patch } = b; void _a;
  if (Object.keys(patch).length) await updateAsset(s, id, patch);
  return { ok: true };
});
