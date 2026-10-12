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

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case "PROJECT":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "DATA_CENTER":
        return "bg-cyan-100 text-cyan-900 border-cyan-300";
      case "WAREHOUSE":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "BRANCH":
        return "bg-blue-100 text-blue-900 border-blue-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <PageHeader
        title="Locations & Project Sites"
        subtitle="Configured corporate offices, client project sites, data centers, and regional logistics facilities."
        actions={
          can(s.role, "location:write") ? (
            <Link href="/app/locations/new" className="btn btn-primary">
              + Add location / site
            </Link>
          ) : null
        }
      />

      <div className="grid lg:grid-cols-5 gap-4">
        <Card title="Estate map" right={<Source kind="calculated" />} className="lg:col-span-2">
          <LocationMap locations={mapData} heightClass="h-[440px]" />
          <div className="flex items-center justify-between text-xs text-slate-600 mt-3 font-mono font-medium">
            <span>Bubble size = asset count</span>
            <span className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Normal
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold text-rose-800">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> At risk
              </span>
            </span>
          </div>
        </Card>

        <Card pad={false} className="lg:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <caption className="sr-only">Locations</caption>
              <thead className="bg-slate-100 border-b-2 border-slate-200 text-slate-700 font-mono text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4 text-left">Facility / Project Site</th>
                  <th className="py-3 px-4 text-left">Assets</th>
                  <th className="py-3 px-4 text-left">At risk</th>
                  <th className="py-3 px-4 text-left">Open WOs</th>
                  <th className="py-3 px-4 text-left">Cost (12m)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {rows.map((r) => {
                  const l = L.get(r.id);
                  const typeLabel = l?.type === "PROJECT" ? "Project Site" : (l?.type || "Office").replace("_", " ");

                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            className="text-slate-950 font-bold text-sm hover:text-cyan-700 transition"
                            href={`/app/locations/${r.id}`}
                          >
                            {r.name}
                          </Link>
                          {l?.code && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-800 font-bold">
                              {l.code}
                            </span>
                          )}
                          <span
                            className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${getTypeBadge(
                              l?.type
                            )}`}
                          >
                            {typeLabel}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-sans">
                          {l?.address ? (
                            <>
                              <span className="text-xs shrink-0">📍</span>
                              <span className="truncate max-w-[280px] text-slate-800 font-medium">
                                {l.address}
                              </span>
                              <span className="text-slate-500 font-semibold">• {l.city}</span>
                            </>
                          ) : (
                            <span className="text-slate-700 font-medium">{l?.city ?? "Nigeria"}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 tabular-nums font-mono font-bold text-slate-900 text-xs">
                        {num(r.assets)}
                      </td>
                      <td className="py-3 px-4 tabular-nums font-mono font-bold text-xs">
                        <span className={r.atRisk > 0 ? "text-rose-700 font-black px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200" : "text-slate-700"}>
                          {r.atRisk}
                        </span>
                      </td>
                      <td className="py-3 px-4 tabular-nums font-mono font-semibold text-slate-900 text-xs">
                        {r.openWorkOrders}
                      </td>
                      <td className="py-3 px-4 tabular-nums font-mono font-bold text-slate-900 text-xs">
                        {naira(r.cost12m)}
                      </td>
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
