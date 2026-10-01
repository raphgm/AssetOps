import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import * as A from "@/lib/services/analytics";
import { Card, Forbidden, PageHeader, Source, Stat } from "@/components/ui";
import { HBars, MiniLine } from "@/components/charts";
import { naira, num, pct } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Analytics() {
  const s = await requireSession();
  if (!can(s.role, "analytics:read")) return <Forbidden what="analytics" />;
  const [o, fail, vendors, depts, series, w, life] = await Promise.all([A.overview(s.orgId), A.failurePatterns(s.orgId, 365), A.vendorMetrics(s.orgId), A.dimensionMetrics(s.orgId, "department"), A.monthlySeries(s.orgId, {}), A.warrantyExposure(s.orgId), A.lifecycleScenario(s.orgId, 5)]);
  const worstVendors = vendors.filter((v) => v.workOrders >= 20).sort((a, b) => a.slaCompliance - b.slaCompliance).slice(0, 6);
  return (
    <div><PageHeader title="Analytics" subtitle="Every figure is calculated from maintenance records. Estimates are labelled." actions={<Link className="btn" href="/app/analytics/maintenance-debt">Maintenance debt</Link>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <Stat label="SLA compliance (90d)" value={pct(o.slaCompliance)} /><Stat label="Avg resolution" value={`${o.avgResolutionHours.toFixed(0)}h`} /><Stat label="Repeat failure rate" value={pct(o.repeatFailureRate)} sub="assets with ≥2 same-category events (12m)" />
        <Stat label="Downtime (12m)" value={`${num(Math.round(o.downtimeHours12m))}h`} /><Stat label="Maintenance cost (12m)" value={naira(o.spend12m)} /><Stat label="Open work orders" value={o.openWorkOrders} href="/app/work-orders" />
        <Stat label="Maintenance debt" value={naira(o.debt)} sub="estimate" href="/app/analytics/maintenance-debt" /><Stat label="Warranty exposure" value={`${w.atRiskExpired}`} sub={`at-risk assets out of warranty · ${w.expiring30d} expiring ≤30d`} href="/app/assets?warranty=expired&risk=attention" />
      </div>
      <div className="grid lg:grid-cols-2 gap-3">
        <Card title="Asset reliability · failures by category (12m)" right={<Source kind="record" />}><HBars data={fail.slice(0, 8)} x="count" label="Failures by category" /></Card>
        <Card title="Maintenance cost by month" right={<Source kind="record" />}><MiniLine data={series} y="cost" name="Cost (₦)" /></Card>
        <Card title="Vendor performance · lowest SLA compliance" pad={false} right={<Source kind="calculated" />}><table className="w-full"><thead><tr><th className="th">Vendor</th><th className="th">WOs</th><th className="th">SLA</th><th className="th">Late</th></tr></thead><tbody>{worstVendors.map((v) => <tr key={v.id}><td className="td"><Link className="hover:text-accent" href={`/app/vendors/${v.id}`}>{v.name}</Link></td><td className="td tabular-nums">{v.workOrders}</td><td className="td tabular-nums">{pct(v.slaCompliance)}</td><td className="td tabular-nums">{v.lateOrders}</td></tr>)}</tbody></table></Card>
        <Card title="Department performance · repeat failure rate" right={<Source kind="calculated" />}><HBars data={[...depts].sort((a, b) => b.repeatRate - a.repeatRate).slice(0, 8).map((d) => ({ name: d.name, rate: Math.round(d.repeatRate) }))} x="rate" label="Repeat failure rate by department" /></Card>
        <Card title="Lifecycle · assets past 5 years" right={<Source kind="estimate" />}><div className="text-2xl font-semibold">{num(life.scenario.assets)} assets</div><p className="text-mute">Replacement cost {naira(life.scenario.replacementCost)} · current annual maintenance {naira(life.scenario.currentAnnualMaintenance)}.</p><Link className="btn mt-3" href="/app/analytics/lifecycle">Open lifecycle simulator</Link></Card>
        <Card title="Warranty exposure" right={<Source kind="record" />}><ul className="space-y-1"><li><b>{w.expiring30d}</b> warranties expire within 30 days</li><li><b>{num(w.expired)}</b> assets are out of warranty</li><li><b>{w.atRiskExpired}</b> of those are at risk</li></ul><Link className="btn mt-3" href="/app/assets?warranty=expiring">View expiring</Link></Card>
      </div></div>
  );
}
