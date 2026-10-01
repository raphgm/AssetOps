import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { detectAnomalies } from "@/lib/services/analytics";
import { Card, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";
export default async function Onboarding() {
  const s = await requireSession();
  const o = s.orgId;
  const [assets, depts, locs, records, users, anomalies] = await Promise.all([db.asset.count({ where: { orgId: o } }), db.department.count({ where: { orgId: o } }), db.location.count({ where: { orgId: o } }), db.maintenanceRecord.count({ where: { orgId: o } }), db.user.count({ where: { orgId: o } }), detectAnomalies(o)]);
  const steps = [
    { t: "Create organisation", done: true, href: "/app/settings" }, { t: "Import assets", done: assets > 0, href: "/app/import" }, { t: "Add departments", done: depts > 0, href: "/app/import" },
    { t: "Add locations", done: locs > 0, href: "/app/import" }, { t: "Import maintenance history", done: records > 0, href: "/app/import" }, { t: "Invite your team", done: users > 1, href: "/app/settings" }, { t: "View maintenance intelligence", done: records > 0 && assets > 0, href: "/app" },
  ];
  const pct = Math.round((steps.filter((x) => x.done).length / steps.length) * 100);
  return <div className="max-w-2xl"><PageHeader title="Get started" subtitle="Organisation setup" />
    <Card><div className="flex justify-between text-xs mb-1.5"><span>Organisation setup</span><span className="tabular-nums">{pct}%</span></div><div className="h-2 rounded bg-raised" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded bg-accent transition-all" style={{ width: `${pct}%` }} /></div>
      <ol className="mt-4 divide-y divide-line">{steps.map((st, i) => <li key={st.t}><Link href={st.href} className="flex items-center gap-3 py-2.5 hover:text-accent"><span className={`h-5 w-5 rounded-full border grid place-items-center text-[10px] ${st.done ? "bg-accent text-bg border-accent" : "border-line2 text-dim"}`}>{st.done ? "✓" : i + 1}</span>{st.t}</Link></li>)}</ol></Card>
    {records > 0 && <Card className="mt-3"><p className="font-medium">Your maintenance history is now connected.</p><p className="text-mute mt-1">AssetOps analysed {records.toLocaleString()} maintenance records and identified {anomalies.length} pattern{anomalies.length === 1 ? "" : "s"} worth reviewing.</p><Link className="btn btn-accent mt-3" href="/app">Explore findings</Link></Card>}</div>;
}
