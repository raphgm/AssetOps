import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { getFinOpsMetrics } from "@/lib/engines/finops";
import { Card, Forbidden, PageHeader, Stat, Source, Badge } from "@/components/ui";
import { naira, num } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FinOpsPage() {
  const s = await requireSession();
  if (!can(s.role, "analytics:read")) return <Forbidden what="financial operations" />;

  const data = await getFinOpsMetrics(s.orgId);
  const { depreciation, capexForecast, irrationalRepairs, totalIrrationalSpend } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hardware FinOps"
        subtitle="Capital expenditure forecasting, straight-line depreciation, and repair-vs-replace unit economics."
        actions={
          <a href="/api/finops?format=csv" className="btn btn-primary" download>
            Export FinOps Audit (CSV)
          </a>
        }
      />

      {/* Top Level Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat
          label="Total Capital Deployed"
          value={naira(depreciation.totalCapitalDeployed)}
          sub="Original acquisition cost"
        />
        <Stat
          label="Net Book Value (NBV)"
          value={naira(depreciation.totalNetBookValue)}
          tone="ok"
          sub="Current balance sheet value"
        />
        <Stat
          label="Accumulated Depreciation"
          value={naira(depreciation.totalAccumulatedDepreciation)}
          sub="10% residual straight-line"
        />
        <Stat
          label="Monthly Depreciation"
          value={naira(depreciation.monthlyDepreciationRunRate)}
          sub="Monthly P&L write-down"
        />
        <Stat
          label="Irrational Repair Spend"
          value={naira(totalIrrationalSpend)}
          tone={totalIrrationalSpend > 0 ? "bad" : "ok"}
          sub="Spent >70% of replacement cost"
        />
      </div>

      {/* CapEx Budget Replacement Forecaster */}
      <Card
        title="CapEx Replacement Forecast (Next 8 Quarters)"
        right={<Source kind="estimate" />}
      >
        <p className="text-xs text-dim mb-4">
          Deterministic projection of capital required to replace hardware reaching end-of-life (EOL) based on equipment lifespan and replacement costs.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {capexForecast.map((q) => (
            <div
              key={q.period}
              className={`p-3 rounded-lg border text-center transition ${
                q.projectedCapEx > 0
                  ? "bg-surface border-line hover:border-line2"
                  : "bg-surface/30 border-line/40 opacity-60"
              }`}
            >
              <div className="text-[11px] font-mono font-medium text-accent">
                {q.period}
              </div>
              <div className="text-sm font-semibold text-fg mt-1 tabular-nums">
                {naira(q.projectedCapEx)}
              </div>
              <div className="text-[10px] text-dim mt-0.5">
                {q.retiringAssetsCount} asset{q.retiringAssetsCount === 1 ? "" : "s"}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* TCO Economic Scorecard: Repair vs. Replace */}
      <Card
        pad={false}
        title="TCO Economic Scorecard: Repair vs. Replace Thresholds"
        right={<Source kind="calculated" />}
      >
        <div className="p-4 border-b border-line text-xs text-dim">
          Assets where cumulative repair costs exceed 50% of brand-new replacement value. Devices above 70% represent negative ROI and should be decommissioned immediately.
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">Repair vs Replace audit</caption>
            <thead>
              <tr>
                <th className="th">Asset Tag</th>
                <th className="th">Hardware Model</th>
                <th className="th">Location</th>
                <th className="th">Repairs</th>
                <th className="th">Lifetime Spend</th>
                <th className="th">Replacement Cost</th>
                <th className="th">TCO Ratio</th>
                <th className="th">FinOps Action</th>
              </tr>
            </thead>
            <tbody>
              {irrationalRepairs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="td text-center text-mute py-8">
                    All active assets are operating within healthy economic repair thresholds.
                  </td>
                </tr>
              ) : (
                irrationalRepairs.map((r) => (
                  <tr key={r.id} className="hover:bg-raised/50">
                    <td className="td font-mono">
                      <Link href={`/app/assets/${r.id}`} className="hover:text-accent font-medium">
                        {r.tag}
                      </Link>
                    </td>
                    <td className="td">
                      <div className="font-medium text-fg">{r.model}</div>
                      <div className="text-[11px] text-dim">{r.type}</div>
                    </td>
                    <td className="td text-mute">{r.location}</td>
                    <td className="td tabular-nums">{r.maintenanceCount}</td>
                    <td className="td tabular-nums font-medium text-fg">
                      {naira(r.lifetimeCost)}
                    </td>
                    <td className="td tabular-nums text-mute">
                      {naira(r.replacementCost)}
                    </td>
                    <td className="td tabular-nums">
                      <span
                        className={`font-semibold ${
                          r.ratio >= 70 ? "text-bad" : "text-warn"
                        }`}
                      >
                        {r.ratio}%
                      </span>
                    </td>
                    <td className="td">
                      {r.recommendation === "REPLACE_IMMEDIATELY" ? (
                        <Badge tone="bad">Replace immediately</Badge>
                      ) : (
                        <Badge tone="warn">Watch list</Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
