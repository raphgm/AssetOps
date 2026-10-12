import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { UserError } from "@/lib/rbac";

const UpdateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  city: z.string().trim().min(2, "City must be at least 2 characters").optional(),
  code: z.string().trim().optional(),
  address: z.string().trim().optional().nullable(),
  type: z.enum(["OFFICE", "PROJECT", "BRANCH", "DATA_CENTER", "WAREHOUSE"]).optional(),
  contactPerson: z.string().trim().optional().nullable(),
  contactPhone: z.string().trim().optional().nullable(),
  lat: z.coerce.number().min(-90).max(90).optional().nullable(),
  lng: z.coerce.number().min(-180).max(180).optional().nullable(),
});

export const GET = handle(async (_req, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("location:read");
  const { id } = await params;
  const loc = await db.location.findFirst({
    where: { id, orgId: s.orgId },
    include: { _count: { select: { assets: true } } },
  });
  if (!loc) throw new UserError("Location not found.");
  return loc;
});

export const PATCH = handle(async (req, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("location:write");
  const { id } = await params;
  const body = UpdateSchema.parse(await req.json());

  const existing = await db.location.findFirst({
    where: { id, orgId: s.orgId },
  });
  if (!existing) throw new UserError("Location not found.");

  if (body.name && body.name !== existing.name) {
    const dup = await db.location.findFirst({
      where: { orgId: s.orgId, name: body.name, NOT: { id } },
    });
    if (dup) throw new UserError(`A location named "${body.name}" already exists.`);
  }

  const updated = await db.location.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      city: body.city ?? existing.city,
      code: body.code ? body.code.toUpperCase() : existing.code,
      address: body.address !== undefined ? body.address : existing.address,
      type: body.type !== undefined ? body.type : existing.type,
      contactPerson: body.contactPerson !== undefined ? body.contactPerson : existing.contactPerson,
      contactPhone: body.contactPhone !== undefined ? body.contactPhone : existing.contactPhone,
      lat: body.lat !== undefined ? body.lat : existing.lat,
      lng: body.lng !== undefined ? body.lng : existing.lng,
    },
  });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "location.updated",
    "Location",
    id,
    existing,
    updated
  );

  return updated;
});

export const DELETE = handle(async (_req, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("location:write");
  const { id } = await params;

  const existing = await db.location.findFirst({
    where: { id, orgId: s.orgId },
    include: { _count: { select: { assets: true } } },
  });
  if (!existing) throw new UserError("Location not found.");

  if (existing._count.assets > 0) {
    throw new UserError(
      `Cannot delete location: ${existing._count.assets} asset(s) are currently assigned to it. Please reassign or retire them first.`
    );
  }

  await db.location.delete({ where: { id } });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "location.deleted",
    "Location",
    id,
    existing,
    undefined
  );

  return { success: true };
});
