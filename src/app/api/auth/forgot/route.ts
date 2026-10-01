import { z } from "zod";
import { createHash, randomBytes } from "crypto";
import { db } from "@/lib/db";
import { UserError } from "@/lib/rbac";
import { handle, clientIp } from "@/lib/api";
import { rateLimit } from "@/lib/ratelimit";
import { log } from "@/lib/log";

export const POST = handle(async (req) => {
  if (!rateLimit(`forgot:${clientIp(req) ?? "local"}`, 5, 600_000)) throw new UserError("Too many requests. Try again later.");
  const { email } = z.object({ email: z.string().email() }).parse(await req.json());
  const u = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  let devLink: string | undefined;
  if (u) {
    const token = randomBytes(24).toString("base64url");
    await db.passwordReset.create({ data: { userId: u.id, tokenHash: createHash("sha256").update(token).digest("hex"), expiresAt: new Date(Date.now() + 3600_000) } });
    // No email provider is configured in this build: the link is logged server-side (dev) instead of sent.
    log.info("auth.password_reset_link", { path: `/reset-password/${token}` });
    if (process.env.NODE_ENV !== "production") devLink = `/reset-password/${token}`;
  }
  // Same response whether or not the account exists (no user enumeration).
  return { ok: true, devLink };
});
