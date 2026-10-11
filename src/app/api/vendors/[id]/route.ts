import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { UserError } from "@/lib/rbac";

const UpdateSchema = z.object({
  name: z.string().trim().min(2, "Vendor name must be at least 2 characters").optional(),
  slaHours: z.coerce.number().min(1, "SLA must be at least 1 hour").optional(),
  email: z.string().trim().email("Invalid email address").optional().nullable().or(z.literal("")),
});

export const GET = handle(async (_req, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("vendor:read");
  const { id } = await params;
  const vendor = await db.vendor.findFirst({
    where: { id, orgId: s.orgId },
    include: {
      contracts: true,
      _count: { select: { assets: true, workOrders: true, records: true } },
    },
  });
  if (!vendor) throw new UserError("Vendor not found.");
  return vendor;
});

export const PATCH = handle(async (req, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("vendor:write");
  const { id } = await params;
  const body = UpdateSchema.parse(await req.json());

  const existing = await db.vendor.findFirst({
    where: { id, orgId: s.orgId },
  });
  if (!existing) throw new UserError("Vendor not found.");

  if (body.name && body.name !== existing.name) {
    const dup = await db.vendor.findFirst({
      where: { orgId: s.orgId, name: body.name, NOT: { id } },
    });
    if (dup) throw new UserError(`A vendor named "${body.name}" already exists.`);
  }

  const updated = await db.vendor.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      slaHours: body.slaHours ?? existing.slaHours,
      email: body.email !== undefined ? (body.email || null) : existing.email,
    },
  });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "vendor.updated",
    "Vendor",
    id,
    existing,
    updated
  );

  return updated;
});

export const DELETE = handle(async (_req, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("vendor:write");
  const { id } = await params;

  const existing = await db.vendor.findFirst({
    where: { id, orgId: s.orgId },
    include: {
      _count: { select: { assets: true, workOrders: true } },
    },
  });
  if (!existing) throw new UserError("Vendor not found.");

  if (existing._count.assets > 0) {
    throw new UserError(
      `Cannot delete vendor: ${existing._count.assets} asset(s) are associated with this vendor.`
    );
  }

  if (existing._count.workOrders > 0) {
    throw new UserError(
      `Cannot delete vendor: ${existing._count.workOrders} work order(s) are assigned to this vendor.`
    );
  }

  await db.vendor.delete({ where: { id } });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "vendor.deleted",
    "Vendor",
    id,
    existing,
    undefined
  );

  return { success: true };
});
