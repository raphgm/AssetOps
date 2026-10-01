import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { monthlySeries, vendorMetrics } from "@/lib/services/analytics";
import { Card, Forbidden, PageHeader, Stat } from "@/components/ui";
import { MiniLine } from "@/components/charts";
import { naira, pct } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Vendor({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireSession();
  if (!can(s.role, "vendor:read")) return <Forbidden what="vendors" />;
  const { id } = await params;
  const v = await db.vendor.findFirst({ where: { id, orgId: s.orgId } });
  if (!v) notFound();
  const [all, series, sla] = await Promise.all([vendorMetrics(s.orgId), monthlySeries(s.orgId, { vendorId: id }),
    db.$queryRaw<{ b: Date; total: bigint; ok: bigint }[]>(Prisma.sql`SELECT date_trunc('month', "createdAt") b, count(*) total, count(*) FILTER (WHERE "resolvedAt" IS NOT NULL AND "resolvedAt" <= "dueAt") ok FROM "WorkOrder" WHERE "orgId"=${s.orgId} AND "vendorId"=${id} AND "resolvedAt" IS NOT NULL AND "createdAt" > now() - interval '12 months' GROUP BY 1 ORDER BY 1`)]);
  const m = all.find((x) => x.id === id)!;
  const slaSeries = sla.map((r) => ({ label: r.b.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }), sla: Math.round((Number(r.ok) / Number(r.total)) * 100) }));
  return (
    <div><PageHeader title={v.name} subtitle={`Contract SLA ${v.slaHours} hours`} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-3"><Stat label="Work orders" value={m.workOrders} /><Stat label="SLA compliance" value={pct(m.slaCompliance)} tone={m.slaCompliance < 80 ? "bad" : undefined} /><Stat label="Avg resolution" value={`${m.avgResolutionHours.toFixed(0)}h`} /><Stat label="Repeat repairs" value={m.repeatRepairs} /><Stat label="Total spend (12m)" value={naira(m.spend12m)} /></div>
      <div className="grid lg:grid-cols-2 gap-3"><Card title="SLA compliance by month (%)"><MiniLine data={slaSeries} y="sla" name="SLA %" /></Card><Card title="Events handled by month"><MiniLine data={series} y="events" name="Events" /></Card></div></div>
  );
}
