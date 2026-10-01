import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { assetScope } from "@/lib/services/assets";
import { can } from "@/lib/rbac";

export const GET = handle(async (req) => {
  const s = await requireSession();
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 60);
  if (q.length < 2) return { hits: [] };
  const ci = { contains: q, mode: "insensitive" as const };
  const num = /^(wo-?)?(\d{3,})$/i.exec(q);
  const [assets, wos, vendors, depts, users, recs] = await Promise.all([
    can(s.role, "asset:read") ? db.asset.findMany({ where: assetScope(s, { OR: [{ tag: ci }, { model: ci }, { serial: ci }] }), take: 6, select: { id: true, tag: true, make: true, model: true } }) : [],
    can(s.role, "workorder:read") ? db.workOrder.findMany({ where: { orgId: s.orgId, OR: [{ title: ci }, ...(num ? [{ number: Number(num[2]) }] : [])] }, take: 5, select: { id: true, number: true, title: true } }) : [],
    can(s.role, "vendor:read") ? db.vendor.findMany({ where: { orgId: s.orgId, name: ci }, take: 4 }) : [],
    can(s.role, "department:read") ? db.department.findMany({ where: { orgId: s.orgId, name: ci }, take: 4 }) : [],
    can(s.role, "user:manage") ? db.user.findMany({ where: { orgId: s.orgId, OR: [{ name: ci }, { email: ci }] }, take: 4 }) : [],
    can(s.role, "maintenance:read") ? db.maintenanceRecord.findMany({ where: { orgId: s.orgId, description: ci }, take: 4, orderBy: { performedAt: "desc" }, include: { asset: { select: { id: true, tag: true } } } }) : [],
  ]);
  return { hits: [
    ...assets.map((a) => ({ group: "Assets", label: a.tag, sub: `${a.make} ${a.model}`, href: `/app/assets/${a.id}` })),
    ...wos.map((w) => ({ group: "Work orders", label: `WO-${w.number}`, sub: w.title, href: `/app/work-orders/${w.id}` })),
    ...recs.map((r) => ({ group: "Maintenance", label: r.description.slice(0, 50), sub: r.asset.tag, href: `/app/assets/${r.asset.id}` })),
    ...depts.map((d) => ({ group: "Departments", label: d.name, href: `/app/departments/${d.id}` })),
    ...vendors.map((v) => ({ group: "Vendors", label: v.name, href: `/app/vendors/${v.id}` })),
    ...users.map((u) => ({ group: "Users", label: u.name, sub: u.email, href: `/app/settings` })),
  ] };
});
