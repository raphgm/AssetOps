import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { dimensionMetrics, monthlySeries } from "@/lib/services/analytics";
import { Card, Forbidden, PageHeader, Stat, Status } from "@/components/ui";
import { MiniLine } from "@/components/charts";
import { naira, num, pct } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Dept({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireSession();
  if (!can(s.role, "department:read")) return <Forbidden what="departments" />;
  const { id } = await params;
  const d = await db.department.findFirst({ where: { id, orgId: s.orgId } });
  if (!d) notFound();
  const [all, series, risky] = await Promise.all([dimensionMetrics(s.orgId, "department"), monthlySeries(s.orgId, { departmentId: id }), db.asset.findMany({ where: { orgId: s.orgId, departmentId: id, riskLevel: { in: ["attention", "critical"] } }, orderBy: { riskScore: "desc" }, take: 10, include: { location: true } })]);
  const m = all.find((x) => x.id === id)!;
  return (
    <div><PageHeader title={d.name} subtitle="Department detail" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-3"><Stat label="Assets" value={num(m.assets)} href={`/app/assets?department=${id}`} /><Stat label="Maintenance events (12m)" value={num(m.events12m)} href={`/app/maintenance?department=${id}`} /><Stat label="Open work orders" value={m.openWorkOrders} /><Stat label="At risk" value={m.atRisk} tone="bad" href={`/app/assets?department=${id}&risk=attention`} /><Stat label="Cost (12m)" value={naira(m.cost12m)} sub={`Repeat rate ${pct(m.repeatRate)}`} /></div>
      <div className="grid lg:grid-cols-2 gap-3"><Card title="Maintenance events by month"><MiniLine data={series} y="events" name="Events" /></Card>
        <Card title="Highest-risk assets" pad={false}>{risky.length === 0 ? <p className="p-4 text-mute">No at-risk assets.</p> : <table className="w-full"><tbody>{risky.map((a) => <tr key={a.id}><td className="td font-mono text-xs"><Link className="hover:text-accent" href={`/app/assets/${a.id}`}>{a.tag}</Link></td><td className="td">{a.model}</td><td className="td"><Status value={a.riskLevel} /></td><td className="td tabular-nums">{a.riskScore}</td></tr>)}</tbody></table>}</Card></div>
    </div>
  );
}
