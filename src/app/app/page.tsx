import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import * as A from "@/lib/services/analytics";
import { Card, Stat, PageHeader, Www, Source, Forbidden, EmptyState, Badge } from "@/components/ui";
import { TrendChart, FailureBars } from "@/components/charts";
import InvestigateButton from "@/components/InvestigateButton";
import { naira, num, fmtDateTime, pct } from "@/lib/utils";

export const dynamic = "force-dynamic";
type SP = Promise<{ sort?: string; dir?: string }>;

export default async function Dashboard({ searchParams }: { searchParams: SP }) {
  const s = await requireSession();
  if (!can(s.role, "analytics:read")) {
    if (s.role === "TECHNICIAN") redirect("/app/technician");
    if (s.role === "DEPARTMENT_USER") redirect("/app/assets");
    return <Forbidden what="the dashboard" />;
  }
  const sp = await searchParams;
  const [o, trend, fail, depts, audit, notes] = await Promise.all([
    A.overview(s.orgId), A.trend(s.orgId, "30D"), A.failurePatterns(s.orgId, 90), A.dimensionMetrics(s.orgId, "department"),
    db.auditLog.findMany({ where: { orgId: s.orgId }, orderBy: { at: "desc" }, take: 6 }), db.notification.findMany({ where: { orgId: s.orgId }, orderBy: { at: "desc" }, take: 4 }),
  ]);
  const hour = new Date().getHours(); const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const sortKey = (sp.sort ?? "cost12m") as keyof (typeof depts)[number]; const dir = sp.dir === "asc" ? 1 : -1;
  const sorted = [...depts].sort((a, b) => ((a[sortKey] as number) > (b[sortKey] as number) ? 1 : -1) * dir).slice(0, 12);
  const th = (k: string, label: string) => <th className="th"><Link href={`/app?sort=${k}&dir=${sp.sort === k && sp.dir !== "asc" ? "asc" : "desc"}`} className="hover:text-fg">{label}{sp.sort === k || (!sp.sort && k === "cost12m") ? (dir === -1 ? " ↓" : " ↑") : ""}</Link></th>;
  const an = o.anomalies[0];
  const stream = [...audit.map((a) => ({ at: a.at, text: `${a.action.replace(/[._]/g, " ")} · ${a.entityId}`, who: a.actorName })), ...notes.map((n) => ({ at: n.at, text: n.title, who: "System" }))].sort((a, b) => +b.at - +a.at).slice(0, 8);

  return (
    <div>
      <PageHeader title={`${greet}, ${s.name.split(" ")[0]}`} subtitle="Here's what's happening across your technology estate." />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <Stat label="Total assets" value={num(o.totalAssets)} href="/app/assets" />
        <Stat label="Operational" value={num(o.operational)} sub={pct((o.operational / Math.max(1, o.totalAssets)) * 100) + " of estate"} href="/app/assets?status=OPERATIONAL" />
        <Stat label="Under maintenance" value={num(o.underMaintenance)} href="/app/assets?status=UNDER_MAINTENANCE" />
        <Stat label="At risk" value={num(o.atRisk)} tone="bad" href="/app/assets?status=AT_RISK" />
        <Stat label="Maintenance spend" value={naira(o.spend12m)} sub="trailing 12 months" href="/app/analytics" />
      </div>

      {an && (
        <div className="card border-warn/40 p-4 mb-5 animate-rise" role="alert">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warn mt-0.5 shrink-0" aria-hidden />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 font-medium">Maintenance anomaly detected <Source kind="calculated" /></div>
              <div className="mt-3"><Www
                what={`${an.recent} ${an.category.toLowerCase()} failures in the last 30 days, vs. a ${an.baseline}/month baseline (${an.ratio.toFixed(1)}×).`}
                why={`Spread across ${an.departments} departments and ${an.locations} locations; models: ${an.models.slice(0, 3).join(", ")}.${an.vendors.length ? ` Vendors involved: ${an.vendors.slice(0, 3).join(", ")}.` : ""}`}
                now="Investigate the affected fleet and review the evidence before scheduling inspections." /></div>
              <div className="mt-3 flex gap-2"><InvestigateButton primary question={`Why did ${an.category.toLowerCase()} maintenance increase?`} categoryId={an.categoryId} /><Link className="btn" href={`/app/maintenance?category=${an.categoryId}&days=30`}>View evidence</Link></div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-[11px] uppercase tracking-widest text-dim mb-2">Requires attention</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { n: num(o.attention.recurringAssets), t: "assets with recurring failures", view: "/app/assets?recurring=1", q: "Which assets have recurring failures?" },
          { n: num(o.attention.warrantiesExpiring30d), t: "warranties expire within 30 days", view: "/app/assets?warranty=expiring", q: "Which warranties expire soon?" },
          { n: num(o.attention.workOrdersPastSla), t: "work orders past SLA", view: "/app/work-orders?overdue=1", q: "Which vendors are missing SLA?" },
          { n: naira(o.attention.repeatRepairCost), t: "spent on repeat repairs", view: "/app/maintenance?repeat=1", q: "Which assets have recurring failures?" },
        ].map((c) => (
          <div key={c.t} className="card p-4 animate-rise">
            <div className="text-2xl font-semibold tabular-nums">{c.n}</div><div className="text-mute min-h-10">{c.t}</div>
            <div className="mt-3 flex gap-2"><Link href={c.view} className="btn">View</Link><InvestigateButton question={c.q} /></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-3 mb-3">
        <Card title="Maintenance trend" right={<Source kind="record" />} className="lg:col-span-2"><TrendChart initial={trend} /></Card>
        <Card title="Failure patterns · 90 days" right={<Source kind="record" />}><FailureBars data={fail.slice(0, 6)} /></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        <Card title="Department health" right={<Source kind="calculated" />} pad={false} className="lg:col-span-2">
          <div className="overflow-x-auto"><table className="w-full">
            <caption className="sr-only">Department health, sortable</caption>
            <thead><tr><th className="th">Department</th>{th("assets", "Assets")}{th("openWorkOrders", "Open WOs")}{th("atRisk", "At risk")}{th("cost12m", "Cost (12m)")}{th("repeatRate", "Repeat rate")}</tr></thead>
            <tbody>{sorted.map((d) => <tr key={d.id} className="hover:bg-raised/50"><td className="td"><Link className="hover:text-accent" href={`/app/departments/${d.id}`}>{d.name}</Link></td><td className="td tabular-nums">{num(d.assets)}</td><td className="td tabular-nums">{d.openWorkOrders}</td><td className="td tabular-nums">{d.atRisk}</td><td className="td tabular-nums">{naira(d.cost12m)}</td><td className="td tabular-nums">{pct(d.repeatRate)}</td></tr>)}</tbody>
          </table></div>
        </Card>
        <div className="space-y-3">
          <Card title="AssetOps Intelligence Brief" right={<Source kind="calculated" />}>
            <ul className="space-y-1.5 text-[13px]">
              <li>Maintenance spend over the last 30 days: <b>{naira(o.spend30d)}</b>; trailing 12-month spend: <b>{naira(o.spend12m)}</b>.</li>
              {an ? <li>{an.category} failures are {an.ratio.toFixed(1)}× baseline ({an.recent} in 30 days) across {an.departments} departments{an.vendors[0] ? `, led by ${an.vendors[0]}` : ""}.</li> : <li>No maintenance anomalies detected against the 90-day baseline.</li>}
              <li>{o.attention.workOrdersPastSla} open work orders are past SLA; SLA compliance is {pct(o.slaCompliance)}.</li>
              <li>Estimated maintenance debt: <b>{naira(o.debt)}</b> <Badge tone="warn">estimate</Badge></li>
            </ul>
            <div className="mt-3 flex gap-2">{an ? <InvestigateButton question={`Why did ${an.category.toLowerCase()} maintenance increase?`} categoryId={an.categoryId} /> : <InvestigateButton question="What changed this week?" />}<Link className="btn" href="/app/analytics">View evidence</Link></div>
          </Card>
          <Card title="What changed?">
            {stream.length === 0 ? <EmptyState title="No activity yet" body="Activity appears here as your team works." /> :
              <ol className="space-y-2.5">{stream.map((e, i) => <li key={i} className="flex gap-3"><span className="text-dim tabular-nums text-xs w-20 shrink-0 pt-px">{fmtDateTime(e.at)}</span><span className="min-w-0"><span className="block truncate capitalize">{e.text}</span><span className="text-dim text-xs">{e.who}</span></span></li>)}</ol>}
            <Link href="/app/audit" className="inline-flex items-center gap-1 mt-3 text-xs text-mute hover:text-fg">Full audit log <ArrowRight className="h-3 w-3" /></Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
