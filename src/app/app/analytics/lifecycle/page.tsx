import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { lifecycleScenario } from "@/lib/services/analytics";
import { Badge, Card, Forbidden, PageHeader } from "@/components/ui";
import { naira, num } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Lifecycle({ searchParams }: { searchParams: Promise<{ age?: string }> }) {
  const s = await requireSession();
  if (!can(s.role, "analytics:read")) return <Forbidden what="analytics" />;
  const age = Math.max(1, Math.min(15, Number((await searchParams).age) || 5));
  const { current, scenario: sc } = await lifecycleScenario(s.orgId, age);
  const rows: [string, string, string, string][] = [
    ["Assets replaced", "0", num(sc.assets), `+${num(sc.assets)}`],
    ["Replacement capital", "₦0", naira(sc.replacementCost), `+${naira(sc.replacementCost)}`],
    ["Annual maintenance (selected assets)", naira(sc.currentAnnualMaintenance), naira(sc.projectedAnnualMaintenance), `−${naira(sc.annualSavings)}`],
    ["Estate annual maintenance", naira(current.annualMaintenance), naira(current.annualMaintenance - sc.annualSavings), `−${naira(sc.annualSavings)}`],
    ["Simple payback", "—", sc.paybackYears ? `${sc.paybackYears.toFixed(1)} years` : "n/a", ""],
  ];
  return (
    <div><PageHeader title="Lifecycle simulator" subtitle="Model a replacement policy before committing budget." actions={<Badge tone="warn">Estimate</Badge>} />
      <form className="card p-4 mb-3 flex flex-wrap items-end gap-3"><div><label className="label" htmlFor="age">Replace all assets older than (years)</label><input id="age" name="age" type="number" min={1} max={15} defaultValue={age} className="input w-40" /></div><button className="btn btn-primary">Simulate</button></form>
      <Card pad={false}><table className="w-full"><caption className="sr-only">Scenario comparison</caption><thead><tr><th className="th">Metric</th><th className="th">Current state</th><th className="th">Scenario</th><th className="th">Difference</th></tr></thead><tbody>{rows.map((r) => <tr key={r[0]}><td className="td">{r[0]}</td><td className="td tabular-nums">{r[1]}</td><td className="td tabular-nums">{r[2]}</td><td className="td tabular-nums">{r[3]}</td></tr>)}</tbody></table></Card>
      <Card title="Assumptions" className="mt-3"><ul className="list-disc ml-5 text-[13px] space-y-1 text-mute">{sc.assumptions.map((a) => <li key={a}>{a}</li>)}<li>This is a planning estimate. It does not account for inflation, disposal value, or non-maintenance benefits.</li></ul></Card></div>
  );
}
