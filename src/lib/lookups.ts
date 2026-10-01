import { db } from "./db";
/** Option lists for forms, always tenant-scoped. */
export async function lookups(orgId: string) {
  const [cats, techs, vendors, depts, locs, types] = await Promise.all([
    db.maintenanceCategory.findMany({ where: { orgId }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.user.findMany({ where: { orgId, role: "TECHNICIAN", active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.vendor.findMany({ where: { orgId }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.department.findMany({ where: { orgId }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.location.findMany({ where: { orgId }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.assetType.findMany({ where: { orgId }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return { cats, techs, vendors, depts, locs, types };
}
