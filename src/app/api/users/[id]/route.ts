import { z } from "zod";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { audit } from "@/lib/audit";
import { actorOf } from "@/lib/services/assets";
import { UserError } from "@/lib/rbac";

export const PATCH = handle(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("user:manage");
  const id = (await ctx.params).id;
  const b = z.object({ role: z.enum(["SUPER_ADMIN", "ICT_DIRECTOR", "ICT_MANAGER", "TECHNICIAN", "DEPARTMENT_USER", "AUDITOR"]).optional(), active: z.boolean().optional() }).parse(await req.json());
  const u = await db.user.findFirst({ where: { id, orgId: s.orgId } });
  if (!u) throw new Error("User not found.");
  if (u.id === s.userId) throw new UserError("You cannot change your own role or status.");
  await db.user.update({ where: { id }, data: b });
  await audit(actorOf(s), "user.updated", "User", u.email, { role: u.role, active: u.active }, b);
  return { ok: true };
});
