import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { vendorMetrics } from "@/lib/services/analytics";
import { Card, Forbidden, PageHeader, Source, Badge } from "@/components/ui";
import { naira, pct } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Vendors({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const s = await requireSession();
  if (!can(s.role, "vendor:read")) return <Forbidden what="vendors" />;
  const sort = (await searchParams).sort ?? "workOrders";
  const rows = (await vendorMetrics(s.orgId)).sort((a, b) => sort === "sla" ? a.slaCompliance - b.slaCompliance : sort === "spend" ? b.spend12m - a.spend12m : b.workOrders - a.workOrders);
  const th = (k: string, l: string) => <th className="th"><Link href={`/app/vendors?sort=${k}`}>{l}</Link></th>;
  return (
    <div><PageHeader title="Vendors" subtitle="Service performance over the trailing 12 months." />
      <Card pad={false} right={<Source kind="calculated" />}><div className="overflow-x-auto"><table className="w-full"><caption className="sr-only">Vendor performance</caption><thead><tr><th className="th">Vendor</th>{th("workOrders", "Work orders")}{th("sla", "SLA compliance")}<th className="th">Avg resolution</th><th className="th">Repeat repairs</th>{th("spend", "Spend")}<th className="th">Contract SLA</th></tr></thead>
        <tbody>{rows.map((v) => <tr key={v.id} className="hover:bg-raised/50"><td className="td"><Link className="hover:text-accent" href={`/app/vendors/${v.id}`}>{v.name}</Link></td><td className="td tabular-nums">{v.workOrders}</td><td className="td tabular-nums">{v.workOrders ? <>{pct(v.slaCompliance)} {v.slaCompliance < 80 && <Badge tone="bad">below target</Badge>}</> : "—"}</td><td className="td tabular-nums">{v.avgResolutionHours ? `${v.avgResolutionHours.toFixed(0)}h` : "—"}</td><td className="td tabular-nums">{v.repeatRepairs}</td><td className="td tabular-nums">{naira(v.spend12m)}</td><td className="td text-mute">{v.slaHours}h</td></tr>)}</tbody></table></div></Card></div>
  );
}
