import { Prisma } from "@prisma/client";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Card, EmptyState, Forbidden, PageHeader, Pagination } from "@/components/ui";
import { fmtDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
const SIZE = 40;
export default async function Audit({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const s = await requireSession();
  if (!can(s.role, "audit:read")) return <Forbidden what="the audit log" />;
  const sp = await searchParams; const page = Math.max(1, Number(sp.page) || 1);
  const where: Prisma.AuditLogWhereInput = { orgId: s.orgId, ...(sp.action ? { action: { contains: sp.action } } : {}), ...(sp.actor ? { actorName: { contains: sp.actor, mode: "insensitive" } } : {}), ...(sp.entity ? { entityId: { contains: sp.entity, mode: "insensitive" } } : {}) };
  const [total, rows] = await Promise.all([db.auditLog.count({ where }), db.auditLog.findMany({ where, orderBy: { at: "desc" }, skip: (page - 1) * SIZE, take: SIZE })]);
  const qs = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]);
  return (
    <div><PageHeader title="Audit log" subtitle="Append-only. Entries cannot be edited or deleted from the application." actions={<a className="btn" href={`/api/audit?format=csv&${qs}`}>Export CSV</a>} />
      <form className="card p-3 mb-3 flex flex-wrap gap-2 items-end" action="/app/audit"><div><label className="label" htmlFor="actor">Actor</label><input id="actor" name="actor" defaultValue={sp.actor} className="input" /></div><div><label className="label" htmlFor="action">Action</label><input id="action" name="action" placeholder="workorder." defaultValue={sp.action} className="input" /></div><div><label className="label" htmlFor="entity">Entity</label><input id="entity" name="entity" placeholder="WO-29381" defaultValue={sp.entity} className="input" /></div><button className="btn btn-primary">Filter</button></form>
      <Card pad={false}>{rows.length === 0 ? <EmptyState title="No audit entries" body="Sensitive actions will be recorded here." /> : <>
        <ul className="divide-y divide-line">{rows.map((r) => <li key={r.id} className="px-4 py-2.5"><details><summary className="cursor-pointer list-none flex flex-wrap items-baseline justify-between gap-x-4"><span><b className="font-medium">{r.actorName}</b> <span className="text-mute capitalize">{r.action.replace(/[._]/g, " ")}</span> <span className="font-mono text-xs">{r.entityId}</span></span><span className="text-dim text-xs">{fmtDateTime(r.at)}{r.ip ? ` · ${r.ip}` : ""}</span></summary>
          {(r.before || r.after) && <div className="grid sm:grid-cols-2 gap-2 mt-2 text-[11px] font-mono"><pre className="bg-bg rounded p-2 overflow-auto"><span className="text-dim">before</span>{"\n"}{JSON.stringify(r.before, null, 2) ?? "—"}</pre><pre className="bg-bg rounded p-2 overflow-auto"><span className="text-dim">after</span>{"\n"}{JSON.stringify(r.after, null, 2) ?? "—"}</pre></div>}</details></li>)}</ul>
        <Pagination page={page} pages={Math.max(1, Math.ceil(total / SIZE))} base={`/app/audit?${qs}`} /></>}</Card></div>
  );
}
