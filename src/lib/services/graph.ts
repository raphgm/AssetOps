import { db } from "../db";
import type { Session } from "../auth";
import { assetScope } from "./assets";

export type GNode = { id: string; type: "asset" | "network" | "department" | "location" | "vendor" | "event" | "workorder"; label: string; sub?: string; href?: string };
export type GEdge = { id: string; source: string; target: string; label: string };

/** Relationship graph around one asset (default: the network device with the most downstream devices). */
export async function assetGraph(s: Session, assetId?: string) {
  let center = assetId ? await db.asset.findFirst({ where: assetScope(s, { id: assetId }), include: { networkChildren: true } }) : null;
  if (!center) {
    const top = await db.asset.groupBy({ by: ["networkParentId"], where: { orgId: s.orgId, networkParentId: { not: null } }, _count: true, orderBy: { _count: { networkParentId: "desc" } }, take: 1 });
    if (top[0]?.networkParentId) center = await db.asset.findFirst({ where: assetScope(s, { id: top[0].networkParentId }), include: { networkChildren: true } });
  }
  if (!center) return { nodes: [] as GNode[], edges: [] as GEdge[], centerId: null as string | null };
  const kids = await db.asset.findMany({ where: assetScope(s, { networkParentId: center.id }), take: 24, orderBy: { riskScore: "desc" }, include: { department: true, location: true, vendor: true } });
  const parent = center.networkParentId ? await db.asset.findFirst({ where: assetScope(s, { id: center.networkParentId }) }) : null;
  const self = await db.asset.findUniqueOrThrow({ where: { id: center.id }, include: { department: true, location: true, vendor: true } });
  const nodes = new Map<string, GNode>(); const edges: GEdge[] = [];
  const add = (n: GNode) => nodes.set(n.id, n);
  const link = (source: string, target: string, label: string) => { const id = `${source}>${label}>${target}`; if (!edges.find((e) => e.id === id)) edges.push({ id, source, target, label }); };
  const addAsset = (a: typeof self, kind: GNode["type"] = "asset", withVendor = true) => {
    add({ id: a.id, type: kind, label: a.tag, sub: `${a.make} ${a.model}`, href: `/app/assets/${a.id}` });
    add({ id: `d:${a.departmentId}`, type: "department", label: a.department.name, href: `/app/departments/${a.departmentId}` }); link(a.id, `d:${a.departmentId}`, "assigned to");
    add({ id: `l:${a.locationId}`, type: "location", label: a.location.name, href: `/app/locations/${a.locationId}` }); link(a.id, `l:${a.locationId}`, "located at");
    if (withVendor && a.vendor) { add({ id: `v:${a.vendorId}`, type: "vendor", label: a.vendor.name, href: `/app/vendors/${a.vendorId}` }); link(a.id, `v:${a.vendorId}`, "serviced by"); }
  };
  addAsset(self, "network");
  if (parent) { add({ id: parent.id, type: "network", label: parent.tag, sub: `${parent.make} ${parent.model}`, href: `/app/assets/${parent.id}` }); link(self.id, parent.id, "connected to"); }
  kids.forEach((k) => { addAsset(k, "asset", false); link(k.id, self.id, "connected to"); }); // vendor shown for the hub only, to keep the graph legible
  const ids = [self.id, ...kids.map((k) => k.id)];
  const events = await db.maintenanceRecord.groupBy({ by: ["assetId", "categoryId"], where: { orgId: s.orgId, assetId: { in: ids }, performedAt: { gte: new Date(Date.now() - 180 * 864e5) } }, _count: true, having: { assetId: { _count: { gte: 2 } } }, orderBy: { _count: { assetId: "desc" } }, take: 20 });
  const cats = new Map((await db.maintenanceCategory.findMany({ where: { orgId: s.orgId } })).map((c) => [c.id, c.name]));
  events.forEach((e) => { const id = `e:${e.assetId}:${e.categoryId}`; add({ id, type: "event", label: `${cats.get(e.categoryId)} ×${e._count}`, sub: "last 6 months", href: `/app/maintenance?category=${e.categoryId}&asset=` }); link(e.assetId, id, "affected by"); });
  const wos = await db.workOrder.findMany({ where: { orgId: s.orgId, assetId: { in: ids }, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"] } }, take: 10, orderBy: { createdAt: "desc" } });
  wos.forEach((w) => { add({ id: `w:${w.id}`, type: "workorder", label: `WO-${w.number}`, sub: w.status.toLowerCase().replace("_", " "), href: `/app/work-orders/${w.id}` }); link(w.assetId, `w:${w.id}`, "generated"); });
  return { nodes: [...nodes.values()], edges, centerId: self.id };
}
