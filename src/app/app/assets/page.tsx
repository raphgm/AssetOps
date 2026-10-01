import Link from "next/link";
import { Download, Plus, QrCode } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { assetFilters, assetOrder } from "@/lib/services/asset-query";
import { Card, EmptyState, PageHeader, Pagination, Status, Forbidden } from "@/components/ui";
import { fmtDate, num } from "@/lib/utils";

export const dynamic = "force-dynamic";
const SIZE = 50;

export default async function Assets({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const s = await requireSession();
  if (!can(s.role, "asset:read")) return <Forbidden what="assets" />;
  const sp = await searchParams;
  const where = assetFilters(s, sp);
  const page = Math.max(1, Number(sp.page) || 1);
  const [total, items, depts, locs, types, vendors] = await Promise.all([
    db.asset.count({ where }),
    db.asset.findMany({ where, orderBy: assetOrder(sp), skip: (page - 1) * SIZE, take: SIZE, include: { department: true, location: true, type: true } }),
    db.department.findMany({ where: { orgId: s.orgId }, orderBy: { name: "asc" } }), db.location.findMany({ where: { orgId: s.orgId }, orderBy: { name: "asc" } }),
    db.assetType.findMany({ where: { orgId: s.orgId }, orderBy: { name: "asc" } }), db.vendor.findMany({ where: { orgId: s.orgId }, orderBy: { name: "asc" } }),
  ]);
  const qs = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]);
  const base = `/app/assets?${qs}`;
  const sortLink = (k: string) => { const p = new URLSearchParams(qs); p.set("sort", k); p.set("dir", sp.sort === k && sp.dir !== "asc" ? "asc" : "desc"); return `/app/assets?${p}`; };
  const sel = (name: string, label: string, opts: { id: string; name: string }[]) => (
    <div><label className="label" htmlFor={name}>{label}</label><select id={name} name={name} defaultValue={sp[name] ?? ""} className="input"><option value="">All</option>{opts.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
  );
  const pages = Math.max(1, Math.ceil(total / SIZE));
  return (
    <div>
      <PageHeader title="Assets" subtitle={`${num(total)} asset${total === 1 ? "" : "s"} match your filters.`} actions={<>
        <a className="btn" href={`/api/assets?format=csv&${qs}`}><Download className="h-3.5 w-3.5" />Export CSV</a>
        {can(s.role, "asset:import") && <Link className="btn" href="/app/import">Import</Link>}
        {can(s.role, "asset:write") && <Link className="btn btn-primary" href="/app/assets/new"><Plus className="h-3.5 w-3.5" />New asset</Link>}
      </>} />
      <form className="card p-3 mb-3 grid gap-2 grid-cols-2 md:grid-cols-4 xl:grid-cols-8" action="/app/assets">
        <div className="col-span-2"><label className="label" htmlFor="q">Search</label><input id="q" name="q" defaultValue={sp.q} placeholder="Asset ID, model, serial" className="input" /></div>
        <div><label className="label" htmlFor="status">Status</label><select id="status" name="status" defaultValue={sp.status ?? ""} className="input"><option value="">All</option>{["OPERATIONAL", "UNDER_MAINTENANCE", "AT_RISK", "RETIRED"].map((x) => <option key={x} value={x}>{x.replace("_", " ").toLowerCase()}</option>)}</select></div>
        {sel("department", "Department", depts)}{sel("location", "Location", locs)}{sel("type", "Type", types)}{sel("vendor", "Vendor", vendors)}
        <div><label className="label" htmlFor="risk">Risk</label><select id="risk" name="risk" defaultValue={sp.risk ?? ""} className="input"><option value="">All</option>{["healthy", "watch", "attention", "critical"].map((x) => <option key={x}>{x}</option>)}</select></div>
        <div><label className="label" htmlFor="warranty">Warranty</label><select id="warranty" name="warranty" defaultValue={sp.warranty ?? ""} className="input"><option value="">Any</option><option value="valid">Valid</option><option value="expiring">Expiring ≤30d</option><option value="expired">Expired</option></select></div>
        <div><label className="label" htmlFor="age">Older than (yrs)</label><input id="age" name="age" type="number" min="0" defaultValue={sp.age} className="input" /></div>
        <div className="flex items-end gap-2 col-span-2"><button className="btn btn-primary">Apply</button><Link href="/app/assets" className="btn btn-ghost">Reset</Link></div>
      </form>
      <form action="/app/assets/qr" method="get">
        <Card pad={false}>
          {items.length === 0 ? <EmptyState title="No assets match" body="Try removing a filter, or import your asset register." action={<Link className="btn" href="/app/assets">Clear filters</Link>} /> : <>
            <div className="hidden md:block overflow-x-auto"><table className="w-full">
              <caption className="sr-only">Asset register</caption>
              <thead><tr><th className="th w-8"><span className="sr-only">Select</span></th>{[["tag", "Asset ID"], ["model", "Device"]].map(([k, l]) => <th key={k} className="th"><Link href={sortLink(k)}>{l}</Link></th>)}<th className="th">Type</th><th className="th">Department</th><th className="th">Location</th><th className="th"><Link href={sortLink("status")}>Status</Link></th><th className="th"><Link href={sortLink("health")}>Health</Link></th><th className="th"><Link href={sortLink("risk")}>Risk</Link></th><th className="th"><Link href={sortLink("warranty")}>Warranty</Link></th><th className="th"><Link href={sortLink("last")}>Last maint.</Link></th></tr></thead>
              <tbody>{items.map((a) => (
                <tr key={a.id} className="hover:bg-raised/50">
                  <td className="td"><input type="checkbox" name="ids" value={a.id} aria-label={`Select ${a.tag}`} /></td>
                  <td className="td font-mono text-xs"><Link className="hover:text-accent" href={`/app/assets/${a.id}`}>{a.tag}</Link></td>
                  <td className="td">{a.make} {a.model}</td><td className="td text-mute">{a.type.name}</td><td className="td">{a.department.name}</td><td className="td text-mute">{a.location.name}</td>
                  <td className="td"><Status value={a.status} /></td><td className="td tabular-nums">{a.healthScore}</td><td className="td"><Status value={a.riskLevel} /></td>
                  <td className="td text-mute">{fmtDate(a.warrantyEndsAt)}</td><td className="td text-mute">{fmtDate(a.lastMaintenanceAt)}</td>
                </tr>))}</tbody>
            </table></div>
            <ul className="md:hidden divide-y divide-line">{items.map((a) => (
              <li key={a.id}><Link href={`/app/assets/${a.id}`} className="block px-4 py-3"><div className="flex justify-between"><span className="font-mono text-xs">{a.tag}</span><Status value={a.status} /></div><div>{a.make} {a.model}</div><div className="text-mute text-xs">{a.department.name} · {a.location.name} · health {a.healthScore}</div></Link></li>))}</ul>
            <div className="flex items-center justify-between border-t border-line px-3 py-2">
              <div className="flex gap-2 items-center text-xs text-mute">Selected: <button className="btn h-7"><QrCode className="h-3.5 w-3.5" />Print QR labels</button><button className="btn h-7" formAction="/api/assets" name="format" value="csv">Export selected</button></div>
              <Pagination page={page} pages={pages} base={base} />
            </div>
          </>}
        </Card>
      </form>
    </div>
  );
}
