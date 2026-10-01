import Link from "next/link";
import { ScanLine, AlertCircle, Wrench } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { EmptyState, Forbidden, Status } from "@/components/ui";
import TechQuick from "@/components/TechQuick";
import { fmtDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Technician() {
  const s = await requireSession();
  if (!can(s.role, "workorder:update")) return <Forbidden what="technician mode" />;
  const where = { orgId: s.orgId, assigneeId: s.userId };
  const [jobs, done] = await Promise.all([
    db.workOrder.findMany({ where: { ...where, status: { in: ["ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"] } }, orderBy: [{ priority: "desc" }, { dueAt: "asc" }], include: { asset: { select: { tag: true, make: true, model: true } } } }),
    db.workOrder.count({ where: { ...where, status: { in: ["RESOLVED", "VERIFIED", "CLOSED"] }, resolvedAt: { gte: new Date(Date.now() - 30 * 864e5) } } }),
  ]);
  const high = jobs.filter((j) => j.priority === "HIGH" || j.priority === "CRITICAL").length;
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-semibold tracking-tight">My work</h1>
      <p className="text-mute mb-4">{s.name}</p>
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        {[[high, "High priority"], [jobs.filter((j) => j.status === "IN_PROGRESS").length, "In progress"], [done, "Completed (30d)"]].map(([n, l]) => <div key={l as string} className="card py-3"><div className="text-2xl font-semibold tabular-nums">{n}</div><div className="text-[10px] uppercase tracking-wider text-dim">{l}</div></div>)}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-5">
        <Link href="/app/scan" className="btn btn-accent h-12"><ScanLine className="h-4 w-4" />Scan asset</Link>
        <Link href="/app/work-orders/new?report=1" className="btn h-12"><AlertCircle className="h-4 w-4" />Report issue</Link>
        <Link href="/app/maintenance/new" className="btn h-12 col-span-2"><Wrench className="h-4 w-4" />Add maintenance</Link>
      </div>
      {jobs.length === 0 ? <div className="card"><EmptyState title="Nothing assigned" body="New assignments appear here. Scan an asset to report an issue or add maintenance." /></div> :
        <ul className="space-y-2">{jobs.map((j) => { const late = j.dueAt < new Date(); return (
          <li key={j.id} className="card p-3">
            <Link href={`/app/work-orders/${j.id}`} className="block"><div className="flex justify-between text-xs text-dim"><span>WO-{j.number}</span><Status value={j.priority} /></div>
              <div className="mt-0.5 font-medium">{j.title}</div><div className="text-xs text-mute"><span className="font-mono">{j.asset.tag}</span> · {j.asset.make} {j.asset.model}</div>
              <div className={`text-xs mt-1 ${late ? "text-bad" : "text-dim"}`}>{late ? "Past SLA · " : "Due "}{fmtDateTime(j.dueAt)} · <Status value={j.status} /></div></Link>
            <div className="mt-3"><TechQuick id={j.id} status={j.status} /></div>
          </li>); })}</ul>}
    </div>
  );
}
