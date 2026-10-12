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
            address: l.address,
            type: l.type,
            lat: l.lat,
            lng: l.lng,
            assets: m.assets,
            atRisk: m.atRisk,
            openWorkOrders: m.openWorkOrders,
            cost12m: m.cost12m,
          },
        ]
      : [];

  const typeLabel = l.type === "PROJECT" ? "Client Project Site" : l.type === "DATA_CENTER" ? "Data Center" : l.type === "WAREHOUSE" ? "Logistics Warehouse" : l.type === "BRANCH" ? "Branch Office" : "Corporate Office";

  return (
    <div>
      <PageHeader
        title={l.name}
        subtitle={`${typeLabel} • ${l.city}`}
        actions={
          <div className="flex items-center gap-2">
            {l.code && (
              <span className="text-xs font-mono px-2 py-1 rounded bg-raised border border-line text-dim">
                CODE: {l.code}
              </span>
            )}
            {can(s.role, "location:write") ? (
              <Link href={`/app/locations/${id}/edit`} className="btn btn-primary">
                Edit configuration
              </Link>
            ) : null}
          </div>
        }
      />

      {/* Facility & Configured Address Banner */}
      <div className="card p-4 mb-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[11px] text-dim uppercase tracking-wider block font-semibold mb-1">
            Facility Type
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${
            l.type === "PROJECT"
              ? "bg-warn/15 text-warn border-warn/30"
              : l.type === "DATA_CENTER"
              ? "bg-accent/15 text-accent border-accent/30"
              : "bg-raised text-fg border-line"
          }`}>
            {typeLabel}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-dim uppercase tracking-wider block font-semibold mb-1">
            Configured Physical Address
          </span>
          <span className="text-fg font-medium">
            {l.address ? `📍 ${l.address}` : `${l.city}, Nigeria (Street unconfigured)`}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-dim uppercase tracking-wider block font-semibold mb-1">
            Site Lead / Contact
          </span>
          <span className="text-fg font-medium">
            {l.contactPerson || "Not assigned"}
          </span>
          {l.contactPhone && (
            <span className="text-dim block text-[11px] mt-0.5">{l.contactPhone}</span>
          )}
        </div>
        <div>
          <span className="text-[11px] text-dim uppercase tracking-wider block font-semibold mb-1">
            GPS Coordinates
          </span>
          <span className="text-fg font-mono">
            {typeof l.lat === "number" && typeof l.lng === "number"
              ? `${l.lat.toFixed(4)}°N, ${l.lng.toFixed(4)}°E`
              : "No pin dropped"}
          </span>
        </div>
      </div>

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
          <Card title="Geographic placement & Estate pin">
            <LocationMap locations={mapData} selectedId={l.id} heightClass="h-[280px]" />
          </Card>
        )}
      </div>
    </div>
  );
}
