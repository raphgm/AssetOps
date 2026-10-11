import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { dimensionMetrics } from "@/lib/services/analytics";
import { audit } from "@/lib/audit";
import { UserError } from "@/lib/rbac";

const CreateSchema = z.object({
  name: z.string().trim().min(2, "Department name must be at least 2 characters"),
});

export const GET = handle(async (req) => {
  const s = await requireSession("department:read");
  const url = new URL(req.url);
  if (url.searchParams.get("list") === "1") {
    return db.department.findMany({
      where: { orgId: s.orgId },
      orderBy: { name: "asc" },
    });
  }
  return dimensionMetrics(s.orgId, "department");
});

export const POST = handle(async (req) => {
  const s = await requireSession("department:write");
  const body = CreateSchema.parse(await req.json());

  const existing = await db.department.findFirst({
    where: { orgId: s.orgId, name: body.name },
  });
  if (existing) {
    throw new UserError(`A department named "${body.name}" already exists.`);
  }

  const dept = await db.department.create({
    data: {
      orgId: s.orgId,
      name: body.name,
    },
  });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "department.created",
    "Department",
    dept.id,
    undefined,
    { name: dept.name }
  );

  return dept;
});
