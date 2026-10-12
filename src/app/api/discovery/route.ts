import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

// Preset simulated discovery profiles based on real hardware in enterprise networks
const DISCOVERY_PROFILES = [
  { ip: "10.0.1.1", hostname: "core-sw-01.local", mac: "00:1A:A1:4D:2E:8F", vendor: "Cisco Systems", model: "Catalyst 2960X", typeCode: "SWT", ports: [22, 161, 443] },
  { ip: "10.0.1.2", hostname: "dist-sw-02.local", mac: "00:1A:A1:9B:11:3C", vendor: "Cisco Systems", model: "Catalyst 2960X", typeCode: "SWT", ports: [22, 161] },
  { ip: "10.0.1.15", hostname: "edge-router-01.local", mac: "48:8F:5A:12:7E:90", vendor: "MikroTik", model: "CCR1036-8G-2S+", typeCode: "RTR", ports: [22, 80, 8291] },
  { ip: "10.0.1.20", hostname: "ups-snmp-datacenter.local", mac: "00:C0:B7:6E:55:1A", vendor: "APC / Schneider", model: "Smart-UPS 1500", typeCode: "UPS", ports: [161, 80] },
  { ip: "10.0.1.45", hostname: "srv-db-primary.local", mac: "F8:BC:12:44:89:D1", vendor: "Dell Technologies", model: "PowerEdge R750", typeCode: "SRV", ports: [22, 443, 3306] },
  { ip: "10.0.1.46", hostname: "srv-app-worker.local", mac: "F8:BC:12:55:72:0E", vendor: "Dell Technologies", model: "PowerEdge R750", typeCode: "SRV", ports: [22, 443] },
  { ip: "10.0.1.80", hostname: "ap-office-fl1.local", mac: "74:83:C2:A8:14:6B", vendor: "Ubiquiti", model: "UniFi U6-Pro", typeCode: "APT", ports: [22, 8080] },
  { ip: "10.0.1.81", hostname: "ap-office-fl2.local", mac: "74:83:C2:B3:90:1C", vendor: "Ubiquiti", model: "UniFi U6-Pro", typeCode: "APT", ports: [22, 8080] },
  { ip: "10.0.1.110", hostname: "prn-finance-color.local", mac: "3C:D9:2B:17:88:E4", vendor: "HP Inc", model: "LaserJet Pro M404dn", typeCode: "PRN", ports: [80, 515, 9100] },
  { ip: "10.0.1.112", hostname: "prn-ops-laser.local", mac: "00:26:73:C0:41:F9", vendor: "Ricoh", model: "SP 3710DN", typeCode: "PRN", ports: [80, 631, 9100] },
];

export const GET = handle(async (req) => {
  const s = await requireSession("asset:read");
  const url = new URL(req.url);
  const subnet = url.searchParams.get("subnet") || "10.0.1.0/24";

  // Check which discovered devices are already enrolled in DB by serial / MAC
  const existingAssets = await db.asset.findMany({
    where: { orgId: s.orgId },
    select: { serial: true, tag: true },
  });
  const enrolledSerials = new Set(existingAssets.map((a) => a.serial));

  const results = DISCOVERY_PROFILES.map((p) => {
    const isEnrolled = enrolledSerials.has(p.mac);
    return {
      ...p,
      subnet,
      status: isEnrolled ? "ENROLLED" : "DISCOVERED",
      responseLatencyMs: Math.floor(Math.random() * 8) + 1.2,
      lastSeen: new Date().toISOString(),
    };
  });

  return { subnet, count: results.length, devices: results };
});

const EnrollSchema = z.object({
  ip: z.string(),
  hostname: z.string(),
  mac: z.string(),
  vendor: z.string(),
  model: z.string(),
  typeCode: z.string(),
  locationId: z.string().optional(),
  departmentId: z.string().optional(),
});

export const POST = handle(async (req) => {
  const s = await requireSession("asset:write");
  const body = EnrollSchema.parse(await req.json());

  // Find asset type
  let type = await db.assetType.findFirst({
    where: { orgId: s.orgId, code: body.typeCode },
  });
  if (!type) {
    type = await db.assetType.findFirst({ where: { orgId: s.orgId } });
    if (!type) throw new Error("No asset type found.");
  }

  // Location & department fallbacks
  const loc = body.locationId
    ? await db.location.findFirst({ where: { id: body.locationId, orgId: s.orgId } })
    : await db.location.findFirst({ where: { orgId: s.orgId } });
  const dept = body.departmentId
    ? await db.department.findFirst({ where: { id: body.departmentId, orgId: s.orgId } })
    : await db.department.findFirst({ where: { orgId: s.orgId } });

  if (!loc || !dept) throw new Error("Location or Department missing.");

  // Generate unique tag
  const count = await db.asset.count({ where: { orgId: s.orgId } });
  const tag = `${body.typeCode}-${loc.code || "LOC"}-${String(count + 1).padStart(6, "0")}`;
  const qrToken = randomBytes(18).toString("base64url");

  // Check if vendor exists or create
  let vendor = await db.vendor.findFirst({
    where: { orgId: s.orgId, name: { contains: body.vendor } },
  });

  const asset = await db.asset.create({
    data: {
      orgId: s.orgId,
      tag,
      qrToken,
      serial: body.mac,
      make: body.vendor,
      model: body.model,
      typeId: type.id,
      departmentId: dept.id,
      locationId: loc.id,
      vendorId: vendor?.id || null,
      status: "OPERATIONAL",
      acquiredAt: new Date(),
      acquisitionValue: type.replacementCost || 500_000,
    },
  });

  await audit(s, "asset.enrolled_auto_discovery", "Asset", tag, undefined, {
    ip: body.ip,
    mac: body.mac,
    hostname: body.hostname,
  });

  return { ok: true, asset };
});
