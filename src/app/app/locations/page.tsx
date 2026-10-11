import Link from "next/link";

import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { dimensionMetrics } from "@/lib/services/analytics";
import { Card, Forbidden, PageHeader, Source } from "@/components/ui";
import { naira, num } from "@/lib/utils";
import type { MapLocationData } from "@/components/LocationMap";

import LocationMap from "@/components/LocationMap";

export const dynamic = "force-dynamic";

export default async function Locations() {
  const s = await requireSession();
  if (!can(s.role, "location:read")) return <Forbidden what="locations" />;

  const [rows, locs] = await Promise.all([
    dimensionMetrics(s.orgId, "location"),
    db.location.findMany({ where: { orgId: s.orgId } }),
  ]);

  const L = new Map(locs.map((l) => [l.id, l]));

  const mapData: MapLocationData[] = [];
  for (const r of rows) {
    const l = L.get(r.id);
    if (l && typeof l.lat === "number" && typeof l.lng === "number") {
      mapData.push({
        id: r.id,
        name: r.name,
        city: l.city,
        code: l.code,
        lat: l.lat,
        lng: l.lng,
        assets: r.assets,
        atRisk: r.atRisk,
        openWorkOrders: r.openWorkOrders,
        cost12m: r.cost12m,
      });
    }
  }

  return (
    <div>
      <PageHeader
        title="Locations"
        subtitle="Where assets live and where maintenance load is highest."
      />

      <div className="grid lg:grid-cols-5 gap-3">
        <Card title="Estate map" right={<Source kind="calculated" />} className="lg:col-span-2">
          <LocationMap locations={mapData} heightClass="h-[440px]" />
          <div className="flex items-center justify-between text-xs text-dim mt-2.5">
            <span>Bubble size = asset count</span>
            <span className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" /> Normal
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-bad" /> At risk
              </span>
            </span>
          </div>
        </Card>

        <Card pad={false} className="lg:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full">
              <caption className="sr-only">Locations</caption>
              <thead>
                <tr>
                  <th className="th">Location</th>
                  <th className="th">Assets</th>
                  <th className="th">At risk</th>
                  <th className="th">Open WOs</th>
                  <th className="th">Cost (12m)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-raised/50">
                    <td className="td">
                      <Link className="hover:text-accent font-medium" href={`/app/locations/${r.id}`}>
                        {r.name}
                      </Link>
                    </td>
                    <td className="td tabular-nums">{num(r.assets)}</td>
                    <td className="td tabular-nums">
                      <span className={r.atRisk > 0 ? "text-bad font-medium" : ""}>
                        {r.atRisk}
                      </span>
                    </td>
                    <td className="td tabular-nums">{r.openWorkOrders}</td>
                    <td className="td tabular-nums">{naira(r.cost12m)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
