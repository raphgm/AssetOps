import { z } from "zod";
import { createHash } from "crypto";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { handle } from "@/lib/api";
import { audit } from "@/lib/audit";

export const POST = handle(async (req) => {
  const { token, password } = z.object({ token: z.string().min(10), password: z.string().min(8, "Password must be at least 8 characters").max(200) }).parse(await req.json());
  const r = await db.passwordReset.findUnique({ where: { tokenHash: createHash("sha256").update(token).digest("hex") }, include: { user: true } });
  if (!r || r.usedAt || r.expiresAt < new Date()) throw new Error("This reset link is invalid or has expired.");
  await db.$transaction([
    db.user.update({ where: { id: r.userId }, data: { passwordHash: await hashPassword(password) } }),
    db.passwordReset.update({ where: { id: r.id }, data: { usedAt: new Date() } }),
  ]);
  await audit({ id: r.userId, name: r.user.name, orgId: r.user.orgId }, "auth.password_reset", "User", r.user.email);
  return { ok: true };
});
