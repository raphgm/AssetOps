import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { assetScope, evaluateAsset } from "@/lib/services/assets";
import { repairVsReplace } from "@/lib/engines/economics";
import { Badge, Card, EmptyState, PageHeader, Source, Stat, Status } from "@/components/ui";
import InvestigateButton from "@/components/InvestigateButton";
import { AssignForm } from "@/components/AssignForm";
import { fmtDate, fmtDateTime, naira, num } from "@/lib/utils";

export const dynamic = "force-dynamic";
const TABS = ["overview", "maintenance", "work-orders", "assignments", "costs", "documents", "activity", "ai"] as const;
const TAB_LABEL: Record<string, string> = { overview: "Overview", maintenance: "Maintenance", "work-orders": "Work orders", assignments: "Assignments", costs: "Costs", documents: "Documents", activity: "Activity", ai: "AI investigation" };

export default async function Passport({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const s = await requireSession("asset:read");
  const { id } = await params; const tab = (await searchParams).tab ?? "overview";
  const a = await db.asset.findFirst({ where: assetScope(s, { id }), include: { department: true, location: true, type: true, vendor: true, networkParent: true, _count: { select: { networkChildren: true } } } });
  if (!a) notFound();
  const { risk } = await evaluateAsset(a.id);
  const ageY = (Date.now() - a.acquiredAt.getTime()) / (365.25 * 864e5);
  const econ = repairVsReplace({ acquisitionValue: a.acquisitionValue, lifetimeCost: a.lifetimeCost, incidents: a.maintenanceCount, downtimeHours: a.downtimeHours, ageYears: ageY, lifespanYears: a.type.lifespanYears });
  const [recs, wos, assigns, auditRows, attachments, invs] = await Promise.all([
    can(s.role, "maintenance:read") ? db.maintenanceRecord.findMany({ where: { assetId: a.id }, orderBy: { performedAt: "desc" }, take: tab === "overview" ? 5 : 100, include: { category: true, vendor: true, technician: { select: { name: true } }, partUsages: { include: { part: true } } } }) : [],
    db.workOrder.findMany({ where: { assetId: a.id }, orderBy: { createdAt: "desc" }, take: 30, include: { assignee: { select: { name: true } } } }),
    tab === "assignments" ? db.assetAssignment.findMany({ where: { assetId: a.id }, orderBy: { fromDate: "desc" } }) : [],
    tab === "activity" ? db.auditLog.findMany({ where: { orgId: s.orgId, entity: { in: ["Asset", "MaintenanceRecord"] }, entityId: a.tag }, orderBy: { at: "desc" }, take: 40 }) : [],
    tab === "documents" ? db.attachment.findMany({ where: { orgId: s.orgId, record: { assetId: a.id } }, orderBy: { createdAt: "desc" } }) : [],
    tab === "ai" ? db.aIInvestigation.findMany({ where: { orgId: s.orgId, question: { contains: a.tag } }, orderBy: { createdAt: "desc" }, take: 10 }) : [],
  ]);
  const byCat = new Map<string, { n: number; cost: number }>();
  if (tab === "costs") (await db.maintenanceRecord.findMany({ where: { assetId: a.id }, include: { category: true } })).forEach((r) => { const e = byCat.get(r.category.name) ?? { n: 0, cost: 0 }; e.n++; e.cost += r.laborCost + r.partsCost; byCat.set(r.category.name, e); });
  const open = wos.filter((w) => ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"].includes(w.status));
  const manage = can(s.role, "workorder:create");

  return (
    <div>
      <PageHeader title={<span className="flex items-center gap-3"><span className="font-mono">{a.tag}</span></span>} subtitle={<span className="flex flex-wrap items-center gap-3"><span className="text-fg">{a.make} {a.model}</span><Status value={a.status} /> <span>{a.department.name} · {a.location.name}</span></span>}
        actions={<>
          <Link className="btn" href={`/app/assets/qr?id=${a.id}`}>Scan QR</Link>
          <Link className="btn" href={`/app/work-orders/new?asset=${a.id}&report=1`}>Report issue</Link>
          {manage && <Link className="btn btn-primary" href={`/app/work-orders/new?asset=${a.id}`}>Create work order</Link>}
          {can(s.role, "ai:use") && <InvestigateButton question={`Investigate ${a.tag}`} />}
        </>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Health" value={<>{a.healthScore}<span className="text-dim text-base"> /100</span></>} sub={<Source kind="calculated" />} />
        <Stat label="Maintenance events" value={num(a.maintenanceCount)} />
        <Stat label="Downtime" value={`${Math.round(a.downtimeHours)}h`} />
        <Stat label="Lifetime cost" value={naira(a.lifetimeCost)} />
      </div>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-line mb-4">
        {TABS.map((t) => <Link key={t} role="tab" aria-selected={tab === t} href={`/app/assets/${a.id}?tab=${t}`} className={`px-3 py-2 text-[13px] whitespace-nowrap border-b-2 -mb-px ${tab === t ? "border-accent text-fg" : "border-transparent text-mute hover:text-fg"}`}>{TAB_LABEL[t]}</Link>)}
      </div>

      {tab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-3">
          <Card title="Why this score?" right={<Source kind="calculated" />} className="lg:col-span-2">
            <div className="flex items-baseline gap-3 mb-3"><span className="text-3xl font-semibold tabular-nums">{risk.health}</span><span className="text-mute">health · risk {risk.score} (<Status value={risk.level} />)</span></div>
            <div className="space-y-2.5">{risk.factors.filter((f) => f.max > 0).map((f) => (
              <div key={f.key}><div className="flex justify-between text-[12.5px]"><span>{f.label}</span><span className="tabular-nums">{f.points}/{f.max}</span></div>
                <div className="h-1.5 rounded bg-raised mt-1" role="progressbar" aria-valuenow={f.points} aria-valuemax={f.max} aria-label={f.label}><div className="h-full rounded bg-accent" style={{ width: `${(f.points / f.max) * 100}%` }} /></div>
                <div className="text-xs text-dim mt-0.5">{f.detail}</div></div>))}
              {risk.factors.filter((f) => f.max === 0).map((f) => <div key={f.key} className="text-xs text-warn">{f.label}: {f.detail} (adds {-f.points} risk)</div>)}
            </div>
            <p className="text-xs text-dim mt-3">Scores are computed by a deterministic rules engine from maintenance records. AI never calculates them.</p>
          </Card>
          <div className="space-y-3">
            <Card title="Details">
              <dl className="grid grid-cols-[110px_1fr] gap-y-1.5 text-[13px]">
                <dt className="text-dim">Serial</dt><dd className="font-mono text-xs">{a.serial ?? <Badge tone="warn">missing</Badge>}</dd>
                <dt className="text-dim">Type</dt><dd>{a.type.name}</dd><dt className="text-dim">Vendor</dt><dd>{a.vendor?.name ?? "—"}</dd>
                <dt className="text-dim">Acquired</dt><dd>{fmtDate(a.acquiredAt)} ({ageY.toFixed(1)}y)</dd><dt className="text-dim">Value</dt><dd>{naira(a.acquisitionValue, false)}</dd>
                <dt className="text-dim">Warranty</dt><dd>{a.warrantyEndsAt ? `${a.warrantyEndsAt < new Date() ? "Expired" : "Until"} ${fmtDate(a.warrantyEndsAt)}` : "None"}</dd>
                <dt className="text-dim">Connected to</dt><dd>{a.networkParent ? <Link className="font-mono text-xs hover:text-accent" href={`/app/assets/${a.networkParent.id}`}>{a.networkParent.tag}</Link> : "—"}{a._count.networkChildren > 0 && ` · ${a._count.networkChildren} downstream`}</dd>
              </dl>
              <Link href={`/app/graph?asset=${a.id}`} className="inline-block mt-3 text-xs text-accent">View relationship graph →</Link>
            </Card>
            <Card title="Repair vs replace" right={<Source kind="calculated" />}>
              <div className="grid grid-cols-2 gap-2 text-[13px]"><div><div className="text-dim text-xs">Acquisition</div>{naira(a.acquisitionValue)}</div><div><div className="text-dim text-xs">Lifetime maint.</div>{naira(a.lifetimeCost)}</div><div><div className="text-dim text-xs">Maintenance ratio</div>{(econ.ratio * 100).toFixed(1)}%</div><div><div className="text-dim text-xs">Incidents</div>{a.maintenanceCount}</div></div>
              {econ.review ? <div className="mt-3"><Badge tone="warn">Review for replacement</Badge><ul className="list-disc ml-4 mt-2 text-xs text-mute">{econ.reasons.map((r) => <li key={r}>{r}</li>)}</ul><p className="text-xs text-dim mt-2">A recommendation for human review. AssetOps never replaces equipment automatically.</p></div> : <p className="text-xs text-mute mt-3">No replacement-review thresholds reached.</p>}
            </Card>
          </div>
          <Card title="Recent maintenance" className="lg:col-span-3" pad={false}><RecordsTable recs={recs} assetId={a.id} canWrite={can(s.role, "maintenance:write")} /></Card>
        </div>
      )}
      {tab === "maintenance" && <Card pad={false} title="Maintenance history" right={can(s.role, "maintenance:write") && <Link className="btn btn-primary h-7" href={`/app/maintenance/new?asset=${a.id}`}>Add record</Link>}><RecordsTable recs={recs} assetId={a.id} canWrite={can(s.role, "maintenance:write")} /></Card>}
      {tab === "work-orders" && <Card pad={false} title={`Work orders · ${open.length} open`}>{wos.length === 0 ? <EmptyState title="No work orders" body="Work orders for this asset will appear here." /> : <table className="w-full"><thead><tr><th className="th">#</th><th className="th">Title</th><th className="th">Status</th><th className="th">Priority</th><th className="th">Assigned</th><th className="th">Created</th></tr></thead><tbody>{wos.map((w) => <tr key={w.id} className="hover:bg-raised/50"><td className="td"><Link className="hover:text-accent" href={`/app/work-orders/${w.id}`}>WO-{w.number}</Link></td><td className="td">{w.title}</td><td className="td"><Status value={w.status} /></td><td className="td"><Status value={w.priority} /></td><td className="td">{w.assignee?.name ?? "—"}</td><td className="td text-mute">{fmtDate(w.createdAt)}</td></tr>)}</tbody></table>}</Card>}
      {tab === "assignments" && <Card title="Assignments">{can(s.role, "asset:write") && <AssignForm assetId={a.id} />}{assigns.length === 0 ? <EmptyState title="Unassigned" body="This asset has not been assigned to a person or team." /> : <ul className="divide-y divide-line mt-3">{assigns.map((x) => <li key={x.id} className="py-2 flex justify-between"><span>{x.assignee}</span><span className="text-mute text-xs">{fmtDate(x.fromDate)} → {x.toDate ? fmtDate(x.toDate) : "current"}</span></li>)}</ul>}</Card>}
      {tab === "costs" && <Card title="Cost by category" right={<Source kind="record" />}>{byCat.size === 0 ? <EmptyState title="No costs recorded" body="Costs appear once maintenance is recorded." /> : <table className="w-full"><thead><tr><th className="th">Category</th><th className="th">Events</th><th className="th">Cost</th></tr></thead><tbody>{[...byCat].sort((x, y) => y[1].cost - x[1].cost).map(([k, v]) => <tr key={k}><td className="td">{k}</td><td className="td">{v.n}</td><td className="td tabular-nums">{naira(v.cost, false)}</td></tr>)}</tbody></table>}</Card>}
      {tab === "documents" && <Card title="Documents & photos">{attachments.length === 0 ? <EmptyState title="No documents" body="Photos and files attached to maintenance records appear here." /> : <ul className="divide-y divide-line">{attachments.map((d) => <li key={d.id} className="py-2 flex justify-between"><a className="hover:text-accent" href={`/api/files/${d.id}`} target="_blank" rel="noreferrer">{d.originalName}</a><span className="text-dim text-xs">{d.mime} · {Math.round(d.size / 1024)} KB · {fmtDate(d.createdAt)}</span></li>)}</ul>}</Card>}
      {tab === "activity" && <Card title="Activity (audit trail)">{auditRows.length === 0 ? <EmptyState title="No activity yet" body="Changes to this asset are logged here." /> : <ul className="divide-y divide-line">{auditRows.map((r) => <li key={r.id} className="py-2 flex justify-between gap-3"><span><span className="capitalize">{r.action.replace(/[._]/g, " ")}</span> <span className="text-dim">by {r.actorName}</span></span><span className="text-dim text-xs">{fmtDateTime(r.at)}</span></li>)}</ul>}</Card>}
      {tab === "ai" && <Card title="AI investigation" right={<Source kind="ai" />}><p className="text-mute mb-3">Retrieves this asset&apos;s history, relationships and metrics, then asks the model to explain only what that evidence supports.</p>{can(s.role, "ai:use") ? <InvestigateButton primary question={`Investigate ${a.tag}`} label="Investigate this asset" /> : <p className="text-dim">Your role cannot use AI investigations.</p>}{invs.length > 0 && <ul className="mt-4 divide-y divide-line">{invs.map((i) => <li key={i.id} className="py-2"><Link className="hover:text-accent" href={`/app/ai/investigations/${i.id}`}>{i.question}</Link> <span className="text-dim text-xs">· {fmtDateTime(i.createdAt)}</span></li>)}</ul>}</Card>}
      {open.length > 0 && tab === "overview" && <p className="mt-3 text-xs text-mute">{open.length} open work order(s): {open.slice(0, 3).map((w) => <Link key={w.id} className="underline mr-2" href={`/app/work-orders/${w.id}`}>WO-{w.number}</Link>)}</p>}
    </div>
  );
}

type Rec = Awaited<ReturnType<typeof db.maintenanceRecord.findMany<{ include: { category: true; vendor: true; technician: { select: { name: true } }; partUsages: { include: { part: true } } } }>>>;
function RecordsTable({ recs, assetId, canWrite }: { recs: Rec; assetId: string; canWrite: boolean }) {
  if (recs.length === 0) return <EmptyState title="No maintenance history yet" body="Once this asset receives its first intervention, the complete event will appear here." action={canWrite ? <Link className="btn btn-primary" href={`/app/maintenance/new?asset=${assetId}`}>Create Maintenance Record</Link> : undefined} />;
  return <div className="overflow-x-auto"><table className="w-full"><caption className="sr-only">Maintenance records</caption><thead><tr><th className="th">Date</th><th className="th">Category</th><th className="th">Description</th><th className="th">Technician</th><th className="th">Vendor</th><th className="th">Cost</th><th className="th">Downtime</th></tr></thead>
    <tbody>{recs.map((r) => <tr key={r.id} className="hover:bg-raised/50"><td className="td text-mute">{fmtDate(r.performedAt)}</td><td className="td">{r.category.name}</td><td className="td max-w-xs truncate" title={r.description}>{r.description}{r.partUsages.length > 0 && <span className="text-dim text-xs"> · {r.partUsages.map((p) => `${p.quantity}× ${p.part.name}`).join(", ")}</span>}</td><td className="td">{r.technician?.name ?? "—"}</td><td className="td text-mute">{r.vendor?.name ?? "—"}</td><td className="td tabular-nums">{naira(r.laborCost + r.partsCost, false)}</td><td className="td tabular-nums">{r.downtimeHours}h</td></tr>)}</tbody></table></div>;
}
