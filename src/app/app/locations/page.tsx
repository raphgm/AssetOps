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
        address: l.address,
        type: l.type,
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
        title="Locations & Project Sites"
        subtitle="Configured offices, client project sites, data centers, and facilities."
        actions={can(s.role, "location:write") ? <Link href="/app/locations/new" className="btn btn-primary">+ Add location / site</Link> : null}
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
                  <th className="th">Facility / Project Site</th>
                  <th className="th">Assets</th>
                  <th className="th">At risk</th>
                  <th className="th">Open WOs</th>
                  <th className="th">Cost (12m)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const l = L.get(r.id);
                  return (
                    <tr key={r.id} className="hover:bg-raised/50">
                      <td className="td">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link className="hover:text-accent font-medium text-fg" href={`/app/locations/${r.id}`}>
                            {r.name}
                          </Link>
                          {l?.code && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-raised border border-line text-dim">
                              {l.code}
                            </span>
                          )}
                          {l?.type && (
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border uppercase ${
                              l.type === "PROJECT"
                                ? "bg-warn/15 text-warn border-warn/30"
                                : l.type === "DATA_CENTER"
                                ? "bg-accent/15 text-accent border-accent/30"
                                : "bg-surface border-line text-dim"
                            }`}>
                              {l.type === "PROJECT" ? "Project Site" : l.type.replace("_", " ")}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-dim flex items-center gap-1 mt-0.5">
                          {l?.address ? (
                            <>
                              <span className="text-[11px] shrink-0">📍</span>
                              <span className="truncate max-w-[260px] text-fg/80">{l.address}</span>
                              <span className="text-dim/60">• {l.city}</span>
                            </>
                          ) : (
                            <span>{l?.city ?? "Nigeria"}</span>
                          )}
                        </div>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
