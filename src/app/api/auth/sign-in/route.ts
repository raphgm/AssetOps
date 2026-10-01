import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { UserError } from "@/lib/rbac";
import { handle, clientIp } from "@/lib/api";
import { rateLimit } from "@/lib/ratelimit";
import { audit } from "@/lib/audit";
import { log } from "@/lib/log";

export const POST = handle(async (req) => {
  const ip = clientIp(req) ?? "local";
  const { email, password } = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(await req.json());
  if (!rateLimit(`signin:${ip}:${email.toLowerCase()}`, 8, 60_000)) throw new UserError("Too many attempts. Wait a minute and try again.");
  const u = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  const ok = u && u.active && (await verifyPassword(password, u.passwordHash));
  if (!ok) { log.warn("auth.failed", { email: email.toLowerCase(), ip }); throw new UserError("Invalid email or password."); }
  await createSession(u.id);
  await audit({ id: u.id, name: u.name, orgId: u.orgId, ip }, "auth.sign_in", "User", u.email);
  log.info("auth.sign_in", { userId: u.id });
  return { ok: true };
});
