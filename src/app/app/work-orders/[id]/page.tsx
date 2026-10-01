import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { lookups } from "@/lib/lookups";
import { Card, PageHeader, Status } from "@/components/ui";
import { WorkOrderActions, MaintenanceForm } from "@/components/forms";
import { fmtDateTime, naira } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function WorkOrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ resolve?: string }> }) {
  const s = await requireSession("workorder:read");
  const { id } = await params; const sp = await searchParams;
  const w = await db.workOrder.findFirst({ where: { id, orgId: s.orgId, ...(s.role === "DEPARTMENT_USER" ? { asset: { departmentId: s.departmentId ?? "x" } } : {}) }, include: { asset: { include: { department: true, location: true } }, assignee: true, vendor: true, category: true, events: { orderBy: { at: "asc" } }, records: { include: { attachments: true, partUsages: { include: { part: true } } } } } });
  if (!w) notFound();
  const l = await lookups(s.orgId);
  const mine = s.role !== "TECHNICIAN" || w.assigneeId === s.userId;
  const late = w.dueAt < new Date() && ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"].includes(w.status);
  return (
    <div>
      <PageHeader title={<span>WO-{w.number}</span>} subtitle={<span className="flex flex-wrap gap-3 items-center"><span className="text-fg">{w.title}</span><Status value={w.priority} /><Status value={w.status} />{late && <span className="text-bad text-xs">Past SLA</span>}</span>} />
      {mine && <div className="mb-4"><WorkOrderActions id={w.id} status={w.status} canAssign={can(s.role, "workorder:assign")} canUpdate={can(s.role, "workorder:update")} canVerify={can(s.role, "workorder:verify")} techs={l.techs} resolveHref={`/app/work-orders/${w.id}?resolve=1`} /></div>}
      {sp.resolve === "1" && w.status === "IN_PROGRESS" && mine && (
        <div className="mb-4"><h2 className="text-sm font-medium mb-2">Resolve work order</h2><MaintenanceForm resolve fixed={{ id: w.assetId, label: w.asset.tag }} workOrderId={w.id} cats={l.cats} techs={[]} vendors={[]} defaultCategory={w.categoryId ?? undefined} onDoneHref={`/app/work-orders/${w.id}`} /></div>)}
      <div className="grid lg:grid-cols-3 gap-3">
        <Card title="Details" className="lg:col-span-1"><dl className="grid grid-cols-[100px_1fr] gap-y-2 text-[13px]">
          <dt className="text-dim">Asset</dt><dd><Link className="font-mono text-xs hover:text-accent" href={`/app/assets/${w.assetId}`}>{w.asset.tag}</Link><div className="text-mute">{w.asset.make} {w.asset.model}</div></dd>
          <dt className="text-dim">Department</dt><dd>{w.asset.department.name}</dd><dt className="text-dim">Location</dt><dd>{w.asset.location.name}</dd>
          <dt className="text-dim">Assigned</dt><dd>{w.assignee?.name ?? "Unassigned"}</dd><dt className="text-dim">Vendor</dt><dd>{w.vendor?.name ?? "—"}</dd>
          <dt className="text-dim">SLA</dt><dd>{w.slaHours} hours · due {fmtDateTime(w.dueAt)}</dd><dt className="text-dim">Category</dt><dd>{w.category?.name ?? "—"}</dd></dl>
          {w.description && <p className="mt-3 text-mute border-t border-line pt-3 whitespace-pre-wrap">{w.description}</p>}</Card>
        <Card title="Timeline" className="lg:col-span-1"><ol className="relative border-l border-line ml-1.5 space-y-4">{w.events.map((e) => <li key={e.id} className="pl-4 relative"><span className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-accent" aria-hidden /><div className="font-medium">{e.type}</div><div className="text-xs text-dim">{fmtDateTime(e.at)} · {e.actor}</div>{e.note && <div className="text-xs text-mute mt-0.5">{e.note}</div>}</li>)}</ol></Card>
        <Card title="Resolution record" className="lg:col-span-1">{w.records.length === 0 ? <p className="text-mute">No maintenance record yet. Resolving the work order creates one.</p> : w.records.map((r) => <div key={r.id} className="text-[13px] space-y-1"><div>{r.resolution}</div><div className="text-dim text-xs">Labor {naira(r.laborCost, false)} · Parts {naira(r.partsCost, false)} · Downtime {r.downtimeHours}h</div>{r.partUsages.map((p) => <div key={p.id} className="text-xs text-mute">{p.quantity}× {p.part.name}</div>)}{r.attachments.map((a) => <a key={a.id} href={`/api/files/${a.id}`} target="_blank" rel="noreferrer" className="block text-xs text-accent underline">{a.originalName}</a>)}</div>)}</Card>
      </div>
    </div>
  );
}
