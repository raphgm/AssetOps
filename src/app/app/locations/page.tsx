import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { dimensionMetrics } from "@/lib/services/analytics";
import { Card, Forbidden, PageHeader, Source } from "@/components/ui";
import { naira, num } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Locations() {
  const s = await requireSession();
  if (!can(s.role, "location:read")) return <Forbidden what="locations" />;
  const [rows, locs] = await Promise.all([dimensionMetrics(s.orgId, "location"), db.location.findMany({ where: { orgId: s.orgId } })]);
  const L = new Map(locs.map((l) => [l.id, l]));
  // Simple equirectangular projection of Nigeria's bounding box: no tile provider or API key needed.
  const proj = (lat: number, lng: number) => ({ x: ((lng - 2.6) / (14.7 - 2.6)) * 100, y: ((14 - lat) / (14 - 4.2)) * 100 });
  const max = Math.max(1, ...rows.map((r) => r.assets));
  return (
    <div><PageHeader title="Locations" subtitle="Where assets live and where maintenance load is highest." />
      <div className="grid lg:grid-cols-5 gap-3">
        <Card title="Estate map" right={<Source kind="calculated" />} className="lg:col-span-2"><div className="relative aspect-[1/0.85] rounded bg-bg border border-line overflow-hidden" role="img" aria-label="Map of locations sized by asset count">
          {rows.map((r) => { const l = L.get(r.id); if (!l?.lat || !l.lng) return null; const p = proj(l.lat, l.lng); const size = 10 + (r.assets / max) * 26; return <Link key={r.id} href={`/app/locations/${r.id}`} title={`${r.name}: ${r.assets} assets, ${r.atRisk} at risk`} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 border border-accent hover:bg-accent/50 grid place-items-center text-[9px]" style={{ left: `${p.x}%`, top: `${p.y}%`, width: size, height: size }}><span className="sr-only">{r.name}</span></Link>; })}
        </div><p className="text-xs text-dim mt-2">Bubble size = number of assets.</p></Card>
        <Card pad={false} className="lg:col-span-3"><div className="overflow-x-auto"><table className="w-full"><caption className="sr-only">Locations</caption><thead><tr><th className="th">Location</th><th className="th">Assets</th><th className="th">At risk</th><th className="th">Open WOs</th><th className="th">Cost (12m)</th></tr></thead><tbody>{rows.map((r) => <tr key={r.id} className="hover:bg-raised/50"><td className="td"><Link className="hover:text-accent" href={`/app/locations/${r.id}`}>{r.name}</Link></td><td className="td tabular-nums">{num(r.assets)}</td><td className="td tabular-nums">{r.atRisk}</td><td className="td tabular-nums">{r.openWorkOrders}</td><td className="td tabular-nums">{naira(r.cost12m)}</td></tr>)}</tbody></table></div></Card>
      </div></div>
  );
}
