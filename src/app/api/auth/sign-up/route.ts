import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { UserError } from "@/lib/rbac";
import { handle, clientIp } from "@/lib/api";
import { rateLimit } from "@/lib/ratelimit";
import { audit } from "@/lib/audit";

export const POST = handle(async (req) => {
  const ip = clientIp(req) ?? "local";
  if (!rateLimit(`signup:${ip}`, 5, 600_000)) throw new UserError("Too many sign-ups from this address. Try again later.");
  const i = z.object({ name: z.string().trim().min(2).max(80), org: z.string().trim().min(2).max(80), email: z.string().email().max(120), password: z.string().min(8, "Password must be at least 8 characters").max(200) }).parse(await req.json());
  if (await db.user.findUnique({ where: { email: i.email.toLowerCase() } })) throw new Error("An account with this email already exists.");
  const base = i.org.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "org";
  const slug = (await db.organization.findUnique({ where: { slug: base } })) ? `${base}-${Math.random().toString(36).slice(2, 6)}` : base;
  const user = await db.$transaction(async (tx) => {
    const org = await tx.organization.create({ data: { name: i.org, slug } });
    await tx.maintenanceCategory.createMany({ data: ["Battery", "Network", "Operating System", "Power Supply", "Printer", "Display", "Keyboard", "Storage", "Overheating", "Firmware"].map((name) => ({ orgId: org.id, name })) });
    await tx.assetType.createMany({ data: [["LAP", "Laptop", 4, 1200000], ["DSK", "Desktop", 5, 650000], ["PRN", "Printer", 5, 520000], ["SRV", "Server", 7, 8200000], ["SWT", "Network Switch", 7, 900000]].map(([code, name, lifespanYears, replacementCost]) => ({ orgId: org.id, code: code as string, name: name as string, lifespanYears: lifespanYears as number, replacementCost: replacementCost as number })) });
    const u = await tx.user.create({ data: { orgId: org.id, email: i.email.toLowerCase(), name: i.name, passwordHash: await hashPassword(i.password), role: "SUPER_ADMIN" } });
    await audit({ id: u.id, name: u.name, orgId: org.id, ip }, "organization.created", "Organization", slug, undefined, { name: i.org }, tx);
    return u;
  });
  await createSession(user.id);
  return { ok: true };
});
