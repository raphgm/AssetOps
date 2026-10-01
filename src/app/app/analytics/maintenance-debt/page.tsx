import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import * as A from "@/lib/services/analytics";
import { Badge, Card, Forbidden, PageHeader, Stat } from "@/components/ui";
import { HBars } from "@/components/charts";
import { naira } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Debt() {
  const s = await requireSession();
  if (!can(s.role, "analytics:read")) return <Forbidden what="analytics" />;
  const [d, dep, cat, loc, ven] = await Promise.all([A.maintenanceDebt(s.orgId), A.debtBreakdown(s.orgId, "department"), A.debtBreakdown(s.orgId, "category"), A.debtBreakdown(s.orgId, "location"), A.debtBreakdown(s.orgId, "vendor")]);
  const a = d.assumptions;
  return (
    <div><PageHeader title="Maintenance debt" subtitle="Know what you're postponing." actions={<Badge tone="warn">Estimate</Badge>} />
      <Card className="mb-3"><div className="text-[11px] uppercase tracking-wider text-dim">Estimated exposure</div><div className="text-4xl font-semibold tracking-tight tabular-nums mt-1">{naira(d.estimated_exposure)}</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4"><Stat label="Overdue work orders" value={d.overdue_work_orders} sub={naira(d.breakdown.overdue)} href="/app/work-orders?overdue=1" /><Stat label="Recurring failures" value={d.recurring_failures} sub={`${naira(d.breakdown.recurring)} · assets`} href="/app/assets?recurring=1" /><Stat label="Aging assets" value={d.aging_assets} sub={naira(d.breakdown.aging)} /><Stat label="Expired warranties (at risk)" value={d.expired_warranties} sub={naira(d.breakdown.warranty)} href="/app/assets?warranty=expired&risk=attention" /></div></Card>
      <div className="grid lg:grid-cols-2 gap-3 mb-3">{[["department", dep], ["asset category", cat], ["location", loc], ["vendor", ven]].map(([l, rows]) => <Card key={l as string} title={`Overdue work orders by ${l}`}>{(rows as { name: string; overdue: number }[]).length ? <HBars data={rows as { name: string; overdue: number }[]} x="overdue" label={`Overdue by ${l}`} /> : <p className="text-mute">Nothing overdue.</p>}</Card>)}</div>
      <Card title="How this is calculated">
        <p className="text-mute mb-2">These figures are <b>estimates</b> from a deterministic engine, not accounting values. Counts come from live records; the cost weights are assumptions you should tune to your institution.</p>
        <ul className="list-disc ml-5 space-y-1 text-[13px]"><li>Overdue work order: open work order past its SLA due date × {naira(a.overdueWorkOrderCost, false)} each.</li><li>Recurring failure: asset with 3+ records in the same category within 12 months × {naira(a.recurringFailureCost, false)} each.</li><li>Aging asset: acquired longer ago than its type&apos;s expected lifespan; exposure = {a.agingAssetFraction * 100}% of replacement cost.</li><li>Expired warranty: out-of-warranty asset currently rated attention/critical; exposure = {a.expiredWarrantyFraction * 100}% of replacement cost.</li></ul></Card></div>
  );
}
