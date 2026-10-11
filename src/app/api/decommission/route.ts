import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { UserError } from "@/lib/rbac";

const CreateCertSchema = z.object({
  assetId: z.string().min(1, "Asset is required"),
  wipeMethod: z.string().min(2, "Wipe method is required"),
  disposalVendor: z.string().optional().nullable(),
  salvageValue: z.coerce.number().default(0),
  notes: z.string().default(""),
});

export const GET = handle(async () => {
  const s = await requireSession("asset:read");
  const certs = await db.decommissionCertificate.findMany({
    where: { orgId: s.orgId },
    include: { asset: { include: { type: true, location: true } } },
    orderBy: { certifiedAt: "desc" },
  });
  return certs;
});

export const POST = handle(async (req) => {
  const s = await requireSession("asset:write");
  const body = CreateCertSchema.parse(await req.json());

  const asset = await db.asset.findFirst({
    where: { id: body.assetId, orgId: s.orgId },
  });
  if (!asset) throw new UserError("Asset not found.");

  const certNumber = `CERT-DC-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const cert = await db.$transaction(async (tx) => {
    // Retire the asset
    await tx.asset.update({
      where: { id: asset.id },
      data: {
        status: "RETIRED",
        salvageValue: body.salvageValue,
      },
    });

    // Record status history
    await tx.assetStatusHistory.create({
      data: {
        assetId: asset.id,
        from: asset.status,
        to: "RETIRED",
      },
    });

    // Create certificate
    return tx.decommissionCertificate.create({
      data: {
        orgId: s.orgId,
        assetId: asset.id,
        certificateNumber: certNumber,
        wipeMethod: body.wipeMethod,
        verifiedBy: s.name,
        disposalVendor: body.disposalVendor || null,
        salvageValue: body.salvageValue,
        notes: body.notes,
      },
    });
  });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "asset.decommissioned",
    "Asset",
    asset.id,
    { status: asset.status },
    { status: "RETIRED", certificateNumber: certNumber, salvageValue: body.salvageValue }
  );

  return cert;
});
