import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { runIntelligence } from "@/lib/ai/engine";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { UserError } from "@/lib/rbac";

export const POST = handle(async (req) => {
  const s = await requireSession("ai:use");
  if (!rateLimit(`ai:${s.userId}`, 20, 60_000)) throw new UserError("Too many AI requests. Please wait a moment.");
  const i = z.object({ question: z.string().trim().min(3).max(500), categoryId: z.string().optional(), investigationId: z.string().optional() }).parse(await req.json());
  if (i.categoryId && !(await db.maintenanceCategory.findFirst({ where: { id: i.categoryId, orgId: s.orgId } }))) throw new Error("Invalid category.");
  if (i.investigationId && !(await db.aIInvestigation.findFirst({ where: { id: i.investigationId, orgId: s.orgId } }))) throw new Error("Investigation not found.");
  const r = await runIntelligence(s, i.question, { categoryId: i.categoryId, investigationId: i.investigationId });
  return { id: r.investigation.id, status: r.investigation.status };
});
