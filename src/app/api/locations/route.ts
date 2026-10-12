import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { dimensionMetrics } from "@/lib/services/analytics";
import { audit } from "@/lib/audit";
import { UserError } from "@/lib/rbac";

const CreateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  city: z.string().trim().min(2, "City must be at least 2 characters"),
  code: z.string().trim().optional(),
  address: z.string().trim().optional().nullable(),
  type: z.enum(["OFFICE", "PROJECT", "BRANCH", "DATA_CENTER", "WAREHOUSE"]).default("OFFICE"),
  contactPerson: z.string().trim().optional().nullable(),
  contactPhone: z.string().trim().optional().nullable(),
  lat: z.coerce.number().min(-90).max(90).optional().nullable(),
  lng: z.coerce.number().min(-180).max(180).optional().nullable(),
});

export const GET = handle(async (req) => {
  const s = await requireSession("location:read");
  const url = new URL(req.url);
  if (url.searchParams.get("list") === "1") {
    return db.location.findMany({
      where: { orgId: s.orgId },
      orderBy: { name: "asc" },
    });
  }
  return dimensionMetrics(s.orgId, "location");
});

export const POST = handle(async (req) => {
  const s = await requireSession("location:write");
  const body = CreateSchema.parse(await req.json());

  const existing = await db.location.findFirst({
    where: { orgId: s.orgId, name: body.name },
  });
  if (existing) {
    throw new UserError(`A location named "${body.name}" already exists.`);
  }

  // Generate a 3-character uppercase code if not provided
  const code = (body.code && body.code.length >= 2 ? body.code : body.name.slice(0, 3)).toUpperCase();

  const loc = await db.location.create({
    data: {
      orgId: s.orgId,
      name: body.name,
      city: body.city,
      code,
      address: body.address || null,
      type: body.type,
      contactPerson: body.contactPerson || null,
      contactPhone: body.contactPhone || null,
      lat: body.lat ?? null,
      lng: body.lng ?? null,
    },
  });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "location.created",
    "Location",
    loc.id,
    undefined,
    {
      name: loc.name,
      city: loc.city,
      code: loc.code,
      address: loc.address,
      type: loc.type,
      lat: loc.lat,
      lng: loc.lng,
    }
  );

  return loc;
});
