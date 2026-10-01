import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { dimensionMetrics } from "@/lib/services/analytics";
import { Card, EmptyState, Forbidden, PageHeader, Source } from "@/components/ui";
import { naira, num, pct } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Departments() {
  const s = await requireSession();
  if (!can(s.role, "department:read")) return <Forbidden what="departments" />;
  const rows = await dimensionMetrics(s.orgId, "department");
  return (
    <div><PageHeader title="Departments" subtitle="Maintenance load and health by department (trailing 12 months)." />
      <Card pad={false} right={<Source kind="calculated" />}>{rows.length === 0 ? <EmptyState title="No departments" body="Add departments to start tracking maintenance by team." /> :
        <div className="overflow-x-auto"><table className="w-full"><caption className="sr-only">Departments</caption><thead><tr><th className="th">Department</th><th className="th">Assets</th><th className="th">Events (12m)</th><th className="th">Open WOs</th><th className="th">At risk</th><th className="th">Cost (12m)</th><th className="th">Repeat rate</th></tr></thead>
          <tbody>{rows.map((d) => <tr key={d.id} className="hover:bg-raised/50"><td className="td"><Link className="hover:text-accent" href={`/app/departments/${d.id}`}>{d.name}</Link></td><td className="td tabular-nums">{num(d.assets)}</td><td className="td tabular-nums">{num(d.events12m)}</td><td className="td tabular-nums">{d.openWorkOrders}</td><td className="td tabular-nums">{d.atRisk}</td><td className="td tabular-nums">{naira(d.cost12m)}</td><td className="td tabular-nums">{pct(d.repeatRate)}</td></tr>)}</tbody></table></div>}</Card></div>
  );
}
