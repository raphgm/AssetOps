import Link from "next/link";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { dimensionMetrics, monthlySeries } from "@/lib/services/analytics";
import { Card, Forbidden, PageHeader, Stat } from "@/components/ui";
import { MiniLine } from "@/components/charts";
import { naira, num } from "@/lib/utils";
import type { MapLocationData } from "@/components/LocationMap";

import LocationMap from "@/components/LocationMap";

export const dynamic = "force-dynamic";

export default async function Loc({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireSession();
  if (!can(s.role, "location:read")) return <Forbidden what="locations" />;
  const { id } = await params;
  const l = await db.location.findFirst({ where: { id, orgId: s.orgId } });
  if (!l) notFound();

  const [all, series] = await Promise.all([
    dimensionMetrics(s.orgId, "location"),
    monthlySeries(s.orgId, { locationId: id }),
  ]);
  const m = all.find((x) => x.id === id) ?? {
    id,
    name: l.name,
    assets: 0,
    atRisk: 0,
    openWorkOrders: 0,
    cost12m: 0,
  };

  const mapData: MapLocationData[] =
    typeof l.lat === "number" && typeof l.lng === "number"
      ? [
          {
            id: l.id,
            name: l.name,
            city: l.city,
            code: l.code,
            lat: l.lat,
            lng: l.lng,
            assets: m.assets,
            atRisk: m.atRisk,
            openWorkOrders: m.openWorkOrders,
            cost12m: m.cost12m,
          },
        ]
      : [];

  return (
    <div>
      <PageHeader
        title={l.name}
        subtitle={`${l.city ? l.city + " • " : ""}Location detail`}
        actions={can(s.role, "location:write") ? <Link href={`/app/locations/${id}/edit`} className="btn">Edit location</Link> : null}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <Stat label="Assets" value={num(m.assets)} href={`/app/assets?location=${id}`} />
        <Stat label="At risk" value={m.atRisk} tone="bad" />
        <Stat label="Open work orders" value={m.openWorkOrders} />
        <Stat label="Maintenance cost (12m)" value={naira(m.cost12m)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <Card title="Events by month">
          <MiniLine data={series} y="events" name="Events" />
        </Card>

        {mapData.length > 0 && (
          <Card title="Geographic placement">
            <LocationMap locations={mapData} selectedId={l.id} heightClass="h-[280px]" />
          </Card>
        )}
      </div>
    </div>
  );
}
