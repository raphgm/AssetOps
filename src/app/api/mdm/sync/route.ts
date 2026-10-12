import { z } from "zod";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

const MdmPayloadSchema = z.object({
  provider: z.enum(["intune", "jamf", "google_workspace"]).default("intune"),
  devices: z.array(
    z.object({
      serialNumber: z.string(),
      model: z.string(),
      manufacturer: z.string().default("Dell"),
      osVersion: z.string(),
      batteryHealthPct: z.number().min(0).max(100).optional(),
      userEmail: z.string().email().optional(),
      lastCheckIn: z.string().optional(),
    })
  ),
});

export const POST = handle(async (req) => {
  // In production, verify bearer token or webhook signature header
  const authHeader = req.headers.get("authorization");
  const body = MdmPayloadSchema.parse(await req.json());

  // Find demo or primary org
  const org = await db.organization.findFirst({ where: { slug: "demo" } }) || await db.organization.findFirst();
  if (!org) throw new Error("Organization not found.");

  const lapType = await db.assetType.findFirst({ where: { orgId: org.id, code: "LAP" } }) || await db.assetType.findFirst({ where: { orgId: org.id } });
  const defaultLoc = await db.location.findFirst({ where: { orgId: org.id } });
  const defaultDept = await db.department.findFirst({ where: { orgId: org.id } });

  if (!lapType || !defaultLoc || !defaultDept) throw new Error("Default metadata missing.");

  let syncedCount = 0;
  let createdCount = 0;

  for (const dev of body.devices) {
    const existing = await db.asset.findFirst({
      where: { orgId: org.id, serial: dev.serialNumber },
    });

    if (existing) {
      // Update health score if battery health is degraded
      const newHealth = dev.batteryHealthPct !== undefined ? Math.min(existing.healthScore, dev.batteryHealthPct) : existing.healthScore;
      await db.asset.update({
        where: { id: existing.id },
        data: {
          healthScore: newHealth,
          status: newHealth < 40 ? "AT_RISK" : existing.status,
        },
      });
      syncedCount++;
    } else {
      // Create new auto-enrolled laptop
      const count = await db.asset.count({ where: { orgId: org.id } });
      const tag = `LAP-${defaultLoc.code || "HQ"}-${String(count + 1).padStart(6, "0")}`;
      const qrToken = randomBytes(18).toString("base64url");

      await db.asset.create({
        data: {
          orgId: org.id,
          tag,
          qrToken,
          serial: dev.serialNumber,
          make: dev.manufacturer,
          model: dev.model,
          typeId: lapType.id,
          departmentId: defaultDept.id,
          locationId: defaultLoc.id,
          status: "OPERATIONAL",
          healthScore: dev.batteryHealthPct ?? 95,
          acquiredAt: new Date(),
          acquisitionValue: lapType.replacementCost || 1_200_000,
        },
      });
      createdCount++;
    }
  }

  return {
    ok: true,
    provider: body.provider,
    devicesProcessed: body.devices.length,
    created: createdCount,
    updated: syncedCount,
    timestamp: new Date().toISOString(),
  };
});
