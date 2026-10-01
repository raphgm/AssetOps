import { randomUUID, randomBytes } from "crypto";
import { db } from "@/lib/db";
import type { Session } from "@/lib/auth";
import type { Role } from "@prisma/client";

export interface World {
  orgId: string; sessions: Record<Role, Session>; tech2: Session;
  deptId: string; deptId2: string; locId: string; typeId: string; vendorId: string; catIds: Record<string, string>;
  assets: { id: string; tag: string; qrToken: string }[];
}
const DAY = 864e5;
export const daysAgo = (d: number) => new Date(Date.now() - d * DAY);

export async function makeWorld(label = "A", opts: { assets?: number } = {}): Promise<World> {
  const slug = `t-${label.toLowerCase()}-${randomBytes(4).toString("hex")}`;
  const org = await db.organization.create({ data: { name: `Test Org ${label}`, slug } });
  const dept = await db.department.create({ data: { orgId: org.id, name: "Finance" } });
  const dept2 = await db.department.create({ data: { orgId: org.id, name: "Legal" } });
  const loc = await db.location.create({ data: { orgId: org.id, name: "Lagos HQ", city: "Lagos", code: "LAG" } });
  const type = await db.assetType.create({ data: { orgId: org.id, name: "Printer", code: "PRN", lifespanYears: 5, replacementCost: 500000 } });
  const vendor = await db.vendor.create({ data: { orgId: org.id, name: "Kingsway Technologies", slaHours: 24 } });
  const cats: Record<string, string> = {};
  for (const n of ["Printer", "Battery", "Network"]) cats[n] = (await db.maintenanceCategory.create({ data: { orgId: org.id, name: n } })).id;
  const roles: Role[] = ["SUPER_ADMIN", "ICT_DIRECTOR", "ICT_MANAGER", "TECHNICIAN", "DEPARTMENT_USER", "AUDITOR"];
  const sessions = {} as Record<Role, Session>;
  for (const r of roles) {
    const u = await db.user.create({ data: { orgId: org.id, email: `${r.toLowerCase()}-${slug}@x.test`, name: r, passwordHash: "x", role: r, departmentId: r === "DEPARTMENT_USER" ? dept.id : null } });
    sessions[r] = { userId: u.id, orgId: org.id, role: r, name: u.name, email: u.email, departmentId: u.departmentId };
  }
  const t2 = await db.user.create({ data: { orgId: org.id, email: `tech2-${slug}@x.test`, name: "Other Tech", passwordHash: "x", role: "TECHNICIAN" } });
  const assets: World["assets"] = [];
  for (let i = 0; i < (opts.assets ?? 3); i++) {
    const a = await db.asset.create({ data: { orgId: org.id, tag: `PRN-LAG-${label}${String(i).padStart(5, "0")}`, qrToken: randomUUID().replace(/-/g, ""), serial: `SER-${slug}-${i}`, make: "HP", model: "LaserJet Pro M404dn", typeId: type.id, departmentId: i % 2 ? dept2.id : dept.id, locationId: loc.id, vendorId: vendor.id, acquiredAt: daysAgo(900), acquisitionValue: 500000, warrantyEndsAt: daysAgo(10) } });
    assets.push({ id: a.id, tag: a.tag, qrToken: a.qrToken });
  }
  return { orgId: org.id, sessions, tech2: { userId: t2.id, orgId: org.id, role: "TECHNICIAN", name: t2.name, email: t2.email, departmentId: null }, deptId: dept.id, deptId2: dept2.id, locId: loc.id, typeId: type.id, vendorId: vendor.id, catIds: cats, assets };
}

export async function addRecords(w: World, assetId: string, n: number, cat: string, withinDays: number, over: { cost?: number; downtime?: number; vendorId?: string } = {}) {
  await db.maintenanceRecord.createMany({ data: Array.from({ length: n }, (_, i) => ({ orgId: w.orgId, assetId, categoryId: w.catIds[cat], description: `${cat} fault ${i}`, performedAt: daysAgo(1 + (i * withinDays) / Math.max(1, n)), laborCost: over.cost ?? 10000, partsCost: 0, downtimeHours: over.downtime ?? 2, vendorId: over.vendorId ?? w.vendorId })) });
}
