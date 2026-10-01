import { z } from "zod";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { hashPassword, requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { audit } from "@/lib/audit";
import { actorOf } from "@/lib/services/assets";
import { UserError } from "@/lib/rbac";

export const POST = handle(async (req) => {
  const s = await requireSession("user:manage");
  const i = z.object({ name: z.string().trim().min(2).max(80), email: z.string().email(), role: z.enum(["SUPER_ADMIN", "ICT_DIRECTOR", "ICT_MANAGER", "TECHNICIAN", "DEPARTMENT_USER", "AUDITOR"]), departmentId: z.string().optional().or(z.literal("")) }).parse(await req.json());
  if (await db.user.findUnique({ where: { email: i.email.toLowerCase() } })) throw new UserError("A user with this email already exists.");
  if (i.departmentId && !(await db.department.findFirst({ where: { id: i.departmentId, orgId: s.orgId } }))) throw new UserError("Invalid department.");
  const temp = randomBytes(9).toString("base64url");
  const u = await db.user.create({ data: { orgId: s.orgId, name: i.name, email: i.email.toLowerCase(), role: i.role, departmentId: i.departmentId || null, passwordHash: await hashPassword(temp) } });
  await audit(actorOf(s), "user.created", "User", u.email, undefined, { role: u.role });
  return { id: u.id, tempPassword: temp }; // shown once; user should reset it
});
