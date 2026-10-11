import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { vendorMetrics } from "@/lib/services/analytics";
import { audit } from "@/lib/audit";
import { UserError } from "@/lib/rbac";

const CreateSchema = z.object({
  name: z.string().trim().min(2, "Vendor name must be at least 2 characters"),
  slaHours: z.coerce.number().min(1, "SLA must be at least 1 hour").default(24),
  email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
});

export const GET = handle(async (req) => {
  const s = await requireSession("vendor:read");
  const url = new URL(req.url);
  if (url.searchParams.get("list") === "1") {
    return db.vendor.findMany({
      where: { orgId: s.orgId },
      orderBy: { name: "asc" },
    });
  }
  return vendorMetrics(s.orgId);
});

export const POST = handle(async (req) => {
  const s = await requireSession("vendor:write");
  const body = CreateSchema.parse(await req.json());

  const existing = await db.vendor.findFirst({
    where: { orgId: s.orgId, name: body.name },
  });
  if (existing) {
    throw new UserError(`A vendor named "${body.name}" already exists.`);
  }

  const vendor = await db.vendor.create({
    data: {
      orgId: s.orgId,
      name: body.name,
      slaHours: body.slaHours,
      email: body.email || null,
    },
  });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "vendor.created",
    "Vendor",
    vendor.id,
    undefined,
    { name: vendor.name, slaHours: vendor.slaHours, email: vendor.email }
  );

  return vendor;
});
