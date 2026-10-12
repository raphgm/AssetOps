import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { randomBytes } from "crypto";
import {
  getLocalInterfaces,
  getSystemArpTable,
  scanRealHost,
  DiscoveredHost,
} from "@/lib/networkScanner";

export const dynamic = "force-dynamic";

// Enterprise baseline profiles for simulated enterprise branches (HQ Data Center, Abuja CBD)
const ENTERPRISE_PROFILES: DiscoveredHost[] = [
  { ip: "10.0.1.1", hostname: "core-sw-01.local", mac: "00:1a:a1:4d:2e:8f", vendor: "Cisco Systems", model: "Catalyst 2960X", typeCode: "SWT", ports: [22, 161, 443], responseLatencyMs: 1.2, lastSeen: new Date().toISOString(), isRealHost: false },
  { ip: "10.0.1.2", hostname: "dist-sw-02.local", mac: "00:1a:a1:9b:11:3c", vendor: "Cisco Systems", model: "Catalyst 2960X", typeCode: "SWT", ports: [22, 161], responseLatencyMs: 1.8, lastSeen: new Date().toISOString(), isRealHost: false },
  { ip: "10.0.1.15", hostname: "edge-router-01.local", mac: "48:8f:5a:12:7e:90", vendor: "MikroTik", model: "CCR1036-8G-2S+", typeCode: "RTR", ports: [22, 80, 8291], responseLatencyMs: 2.4, lastSeen: new Date().toISOString(), isRealHost: false },
  { ip: "10.0.1.20", hostname: "ups-snmp-datacenter.local", mac: "00:c0:b7:6e:55:1a", vendor: "APC / Schneider", model: "Smart-UPS 1500", typeCode: "UPS", ports: [161, 80], responseLatencyMs: 3.1, lastSeen: new Date().toISOString(), isRealHost: false },
  { ip: "10.0.1.45", hostname: "srv-db-primary.local", mac: "f8:bc:12:44:89:d1", vendor: "Dell Technologies", model: "PowerEdge R750", typeCode: "SRV", ports: [22, 443, 3306], responseLatencyMs: 0.9, lastSeen: new Date().toISOString(), isRealHost: false },
  { ip: "10.0.1.46", hostname: "srv-app-worker.local", mac: "f8:bc:12:55:72:0e", vendor: "Dell Technologies", model: "PowerEdge R750", typeCode: "SRV", ports: [22, 443], responseLatencyMs: 1.1, lastSeen: new Date().toISOString(), isRealHost: false },
  { ip: "10.0.1.80", hostname: "ap-office-fl1.local", mac: "74:83:c2:a8:14:6b", vendor: "Ubiquiti", model: "UniFi U6-Pro", typeCode: "APT", ports: [22, 8080], responseLatencyMs: 4.2, lastSeen: new Date().toISOString(), isRealHost: false },
  { ip: "10.0.1.110", hostname: "prn-finance-color.local", mac: "3c:d9:2b:17:88:e4", vendor: "HP Inc", model: "LaserJet Pro M404dn", typeCode: "PRN", ports: [80, 515, 9100], responseLatencyMs: 6.8, lastSeen: new Date().toISOString(), isRealHost: false },
];

export const GET = handle(async (req) => {
  const s = await requireSession("asset:read");
  const url = new URL(req.url);

  // 1. Detect Real Network Interfaces
  const interfaces = getLocalInterfaces();
  const defaultSubnet = interfaces[0]?.subnet || "192.168.1.0/24";
  const targetSubnet = url.searchParams.get("subnet") || defaultSubnet;

  // 2. Query Existing Enrolled Assets in Database
  const existingAssets = await db.asset.findMany({
    where: { orgId: s.orgId },
    select: { serial: true, tag: true },
  });
  const enrolledSerials = new Set(existingAssets.map((a) => a.serial?.toLowerCase()));

  // 3. Scan Real Hardware via ARP and Sockets
  let discoveredHosts: DiscoveredHost[] = [];

  const isLocalScan =
    targetSubnet.includes("192.168.") ||
    targetSubnet.includes("127.0.0.1") ||
    targetSubnet.includes("localhost") ||
    interfaces.some((i) => i.subnet === targetSubnet);

  if (isLocalScan) {
    // Perform real ARP table scan
    const arpEntries = getSystemArpTable();

    // Probe real discovered ARP hosts
    const realProbes = await Promise.all(
      arpEntries.map(async (entry) => {
        return await scanRealHost(entry.ip, entry.mac);
      })
    );

    // Also probe localhost if on local dev machine
    if (interfaces[0]?.ip) {
      const localHostProbe = await scanRealHost(interfaces[0].ip, "00:00:5e:00:53:01");
      realProbes.unshift(localHostProbe);
    }

    discoveredHosts = realProbes;
  }

  // If scanning enterprise subnet or if real hosts is empty, include enterprise branch hosts
  if (discoveredHosts.length === 0 || targetSubnet.startsWith("10.0.")) {
    discoveredHosts = [...discoveredHosts, ...ENTERPRISE_PROFILES];
  }

  // Cross-reference with DB
  const results = discoveredHosts.map((h) => {
    const isEnrolled = enrolledSerials.has(h.mac.toLowerCase());
    return {
      ...h,
      subnet: targetSubnet,
      status: isEnrolled ? "ENROLLED" : "DISCOVERED",
    };
  });

  return {
    interfaces,
    targetSubnet,
    count: results.length,
    devices: results,
    scanTimestamp: new Date().toISOString(),
  };
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
  const vendor = await db.vendor.findFirst({
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
