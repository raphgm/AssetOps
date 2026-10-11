import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { UserError } from "@/lib/rbac";

const UpdateSchema = z.object({
  name: z.string().trim().min(2, "Department name must be at least 2 characters"),
});

export const GET = handle(async (_req, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("department:read");
  const { id } = await params;
  const dept = await db.department.findFirst({
    where: { id, orgId: s.orgId },
    include: { _count: { select: { assets: true, users: true } } },
  });
  if (!dept) throw new UserError("Department not found.");
  return dept;
});

export const PATCH = handle(async (req, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("department:write");
  const { id } = await params;
  const body = UpdateSchema.parse(await req.json());

  const existing = await db.department.findFirst({
    where: { id, orgId: s.orgId },
  });
  if (!existing) throw new UserError("Department not found.");

  if (body.name !== existing.name) {
    const dup = await db.department.findFirst({
      where: { orgId: s.orgId, name: body.name, NOT: { id } },
    });
    if (dup) throw new UserError(`A department named "${body.name}" already exists.`);
  }

  const updated = await db.department.update({
    where: { id },
    data: { name: body.name },
  });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "department.updated",
    "Department",
    id,
    existing,
    updated
  );

  return updated;
});

export const DELETE = handle(async (_req, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("department:write");
  const { id } = await params;

  const existing = await db.department.findFirst({
    where: { id, orgId: s.orgId },
    include: { _count: { select: { assets: true, users: true } } },
  });
  if (!existing) throw new UserError("Department not found.");

  if (existing._count.assets > 0) {
    throw new UserError(
      `Cannot delete department: ${existing._count.assets} asset(s) are currently assigned to it. Please reassign them first.`
    );
  }

  if (existing._count.users > 0) {
    throw new UserError(
      `Cannot delete department: ${existing._count.users} user(s) belong to this department. Please update user profiles first.`
    );
  }

  await db.department.delete({ where: { id } });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "department.deleted",
    "Department",
    id,
    existing,
    undefined
  );

  return { success: true };
});
