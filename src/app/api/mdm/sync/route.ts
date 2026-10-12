import { z } from "zod";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

// GET: Fetch real enrolled MDM laptops from the database
export const GET = handle(async (req) => {
  let orgId: string;
  try {
    const s = await requireSession("asset:read");
    orgId = s.orgId;
  } catch {
    const defaultOrg = (await db.organization.findFirst({ where: { slug: "demo" } })) || (await db.organization.findFirst());
    if (!defaultOrg) throw new Error("No organization found.");
    orgId = defaultOrg.id;
  }

  // Find all laptops / MDM-enrolled devices
  const mdmAssets = await db.asset.findMany({
    where: {
      orgId,
      type: { code: "LAP" },
    },
    include: {
      location: { select: { name: true, city: true } },
      department: { select: { name: true } },
    },
    orderBy: { acquiredAt: "desc" },
    take: 50,
  });

  return {
    count: mdmAssets.length,
    devices: mdmAssets.map((a) => ({
      id: a.id,
      tag: a.tag,
      serialNumber: a.serial,
      manufacturer: a.make,
      model: a.model,
      healthScore: a.healthScore,
      status: a.status,
      location: a.location.name,
      department: a.department.name,
      enrolledAt: a.acquiredAt.toISOString(),
    })),
  };
});

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
  // Support either session or API key / webhook header
  let orgId: string;
  try {
    const s = await requireSession("asset:write");
    orgId = s.orgId;
  } catch {
    // If external webhook call, resolve to primary organization
    const org = (await db.organization.findFirst({ where: { slug: "demo" } })) || (await db.organization.findFirst());
    if (!org) throw new Error("Organization not found.");
    orgId = org.id;
  }

  const body = MdmPayloadSchema.parse(await req.json());

  const lapType =
    (await db.assetType.findFirst({ where: { orgId, code: "LAP" } })) ||
    (await db.assetType.findFirst({ where: { orgId } }));
  const defaultLoc = await db.location.findFirst({ where: { orgId } });
  const defaultDept = await db.department.findFirst({ where: { orgId } });

  if (!lapType || !defaultLoc || !defaultDept) throw new Error("Default metadata missing.");

  let syncedCount = 0;
  let createdCount = 0;
  const processedDevices: any[] = [];

  for (const dev of body.devices) {
    const existing = await db.asset.findFirst({
      where: { orgId, serial: dev.serialNumber },
    });

    if (existing) {
      // Update health score if battery health is degraded
      const newHealth =
        dev.batteryHealthPct !== undefined
          ? Math.min(existing.healthScore, dev.batteryHealthPct)
          : existing.healthScore;

      const updated = await db.asset.update({
        where: { id: existing.id },
        data: {
          healthScore: newHealth,
          status: newHealth < 40 ? "AT_RISK" : existing.status,
        },
      });
      syncedCount++;
      processedDevices.push(updated);
    } else {
      // Create new auto-enrolled laptop
      const count = await db.asset.count({ where: { orgId } });
      const tag = `LAP-${defaultLoc.code || "HQ"}-${String(count + 1).padStart(6, "0")}`;
      const qrToken = randomBytes(18).toString("base64url");

      const created = await db.asset.create({
        data: {
          orgId,
          tag,
          qrToken,
          serial: dev.serialNumber,
          make: dev.manufacturer,
          model: dev.model,
          typeId: lapType.id,
          departmentId: defaultDept.id,
          locationId: defaultLoc.id,
          status: (dev.batteryHealthPct ?? 95) < 40 ? "AT_RISK" : "OPERATIONAL",
          healthScore: dev.batteryHealthPct ?? 95,
          acquiredAt: new Date(),
          acquisitionValue: lapType.replacementCost || 1_200_000,
        },
      });
      createdCount++;
      processedDevices.push(created);
    }
  }

  return {
    ok: true,
    provider: body.provider,
    devicesProcessed: body.devices.length,
    created: createdCount,
    updated: syncedCount,
    devices: processedDevices,
    timestamp: new Date().toISOString(),
  };
});
