import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { lookups } from "@/lib/lookups";
import { Card, EmptyState, Forbidden, PageHeader, Pagination, Stat } from "@/components/ui";
import { fmtDate, naira, num } from "@/lib/utils";

export const dynamic = "force-dynamic";
const SIZE = 40;

export default async function Maintenance({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const s = await requireSession();
  if (!can(s.role, "maintenance:read")) return <Forbidden what="maintenance records" />;
  const sp = await searchParams; const page = Math.max(1, Number(sp.page) || 1);
  const where: Prisma.MaintenanceRecordWhereInput = { orgId: s.orgId,
    ...(sp.category ? { categoryId: sp.category } : {}), ...(sp.vendor ? { vendorId: sp.vendor } : {}), ...(sp.technician ? { technicianId: sp.technician } : {}),
    ...(sp.department ? { asset: { departmentId: sp.department } } : {}), ...(sp.asset ? { asset: { tag: { contains: sp.asset, mode: "insensitive" } } } : {}),
    performedAt: { ...(sp.from ? { gte: new Date(sp.from) } : {}), ...(sp.to ? { lte: new Date(sp.to) } : {}), ...(sp.days ? { gte: new Date(Date.now() - Number(sp.days) * 864e5) } : {}) } };
  const [l, total, agg, items] = await Promise.all([
    lookups(s.orgId), db.maintenanceRecord.count({ where }),
    db.maintenanceRecord.aggregate({ where, _sum: { laborCost: true, partsCost: true, downtimeHours: true } }),
    db.maintenanceRecord.findMany({ where, orderBy: { performedAt: "desc" }, skip: (page - 1) * SIZE, take: SIZE, include: { category: true, asset: { select: { id: true, tag: true } }, technician: { select: { name: true } }, vendor: { select: { name: true } } } }),
  ]);
  const qs = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]);
  const sel = (n: string, label: string, o: { id: string; name: string }[]) => <div><label className="label" htmlFor={n}>{label}</label><select id={n} name={n} className="input" defaultValue={sp[n] ?? ""}><option value="">All</option>{o.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>;
  return (
    <div>
      <PageHeader title="Maintenance" subtitle="Immutable record of every intervention." actions={can(s.role, "maintenance:write") && <Link className="btn btn-primary" href="/app/maintenance/new">Record maintenance</Link>} />
      <div className="grid grid-cols-3 gap-3 mb-3"><Stat label="Events" value={num(total)} /><Stat label="Cost" value={naira((agg._sum.laborCost ?? 0) + (agg._sum.partsCost ?? 0))} /><Stat label="Downtime" value={`${num(Math.round(agg._sum.downtimeHours ?? 0))}h`} /></div>
      <form className="card p-3 mb-3 grid gap-2 grid-cols-2 md:grid-cols-4 xl:grid-cols-8" action="/app/maintenance">
        <div><label className="label" htmlFor="asset">Asset ID</label><input id="asset" name="asset" defaultValue={sp.asset} className="input" /></div>
        {sel("category", "Category", l.cats)}{sel("department", "Department", l.depts)}{sel("vendor", "Vendor", l.vendors)}{sel("technician", "Technician", l.techs)}
        <div><label className="label" htmlFor="from">From</label><input id="from" name="from" type="date" defaultValue={sp.from} className="input" /></div>
        <div><label className="label" htmlFor="to">To</label><input id="to" name="to" type="date" defaultValue={sp.to} className="input" /></div>
        <div className="flex items-end gap-2"><button className="btn btn-primary">Apply</button><Link className="btn btn-ghost" href="/app/maintenance">Reset</Link></div>
      </form>
      <Card pad={false}>
        {items.length === 0 ? <EmptyState title="No maintenance records" body="No records match these filters. Once an asset receives an intervention, it appears here." /> : <>
          <div className="overflow-x-auto"><table className="w-full"><caption className="sr-only">Maintenance records</caption><thead><tr><th className="th">Date</th><th className="th">Asset</th><th className="th">Category</th><th className="th">Description</th><th className="th">Technician</th><th className="th">Vendor</th><th className="th">Cost</th><th className="th">Downtime</th><th className="th">Resolution</th></tr></thead>
            <tbody>{items.map((r) => <tr key={r.id} className="hover:bg-raised/50"><td className="td text-mute">{fmtDate(r.performedAt)}</td><td className="td font-mono text-xs"><Link className="hover:text-accent" href={`/app/assets/${r.asset.id}`}>{r.asset.tag}</Link></td><td className="td">{r.category.name}</td><td className="td max-w-xs truncate" title={r.description}>{r.description}</td><td className="td">{r.technician?.name ?? "—"}</td><td className="td text-mute">{r.vendor?.name ?? "—"}</td><td className="td tabular-nums">{naira(r.laborCost + r.partsCost, false)}</td><td className="td tabular-nums">{r.downtimeHours}h</td><td className="td max-w-[14rem] truncate text-mute" title={r.resolution}>{r.resolution || "—"}</td></tr>)}</tbody></table></div>
          <Pagination page={page} pages={Math.max(1, Math.ceil(total / SIZE))} base={`/app/maintenance?${qs}`} />
        </>}
      </Card>
    </div>
  );
}
