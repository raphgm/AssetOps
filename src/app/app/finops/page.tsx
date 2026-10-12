import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { getFinOpsMetrics } from "@/lib/engines/finops";
import { Card, Forbidden, PageHeader, Stat, Source, Badge } from "@/components/ui";
import { naira, num } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FINOPS_TABS = [
  { id: "inform", label: "1. INFORM (TCO & Showback)" },
  { id: "optimize", label: "2. OPTIMIZE (Repair vs. Replace)" },
  { id: "operate", label: "3. OPERATE (SLA Clawbacks & FOCUS™)" },
] as const;

export default async function FinOpsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const s = await requireSession();
  if (!can(s.role, "analytics:read")) return <Forbidden what="financial operations" />;

  const { tab = "inform" } = await searchParams;
  const data = await getFinOpsMetrics(s.orgId);
  const {
    depreciation,
    departmentShowback,
    locationShowback,
    capexForecast,
    irrationalRepairs,
    zombieAssets,
    vendorClawbacks,
    totalIrrationalSpend,
    totalPotentialAnnualSavings,
    focusSample,
  } = data;

  const totalVendorRebates = vendorClawbacks.reduce((sum, v) => sum + v.calculatedRebate, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hardware FinOps Hub"
        subtitle="Operational unit economics, lifetime TCO showback, and contractual SLA penalty recovery."
        actions={
          <div className="flex items-center gap-2">
            <a
              href="/api/reports/focus"
              className="btn btn-ghost text-xs"
              title="Linux Foundation FOCUS v1.0 format"
            >
              Export FOCUS™ Spec
            </a>
            <a href="/api/finops?format=csv" className="btn btn-primary text-xs" download>
              Export FinOps Audit (CSV)
            </a>
          </div>
        }
      />

      {/* Top Level FinOps Triad KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat
          label="True Estate TCO"
          value={naira(depreciation.trueEstateTco)}
          sub={`CapEx (${naira(depreciation.totalCapitalDeployed)}) + OpEx`}
        />
        <Stat
          label="Net Book Value (NBV)"
          value={naira(depreciation.totalNetBookValue)}
          tone="ok"
          sub="Current balance sheet value"
        />
        <Stat
          label="Maintenance Debt"
          value={naira(depreciation.totalMaintenanceDebt)}
          tone="warn"
          sub="CapEx for assets past lifespan"
        />
        <Stat
          label="SLA Penalty Clawback"
          value={naira(totalVendorRebates)}
          tone="ok"
          sub="Rebates due from vendor breaches"
        />
        <Stat
          label="Actionable Savings"
          value={naira(totalPotentialAnnualSavings)}
          tone={totalPotentialAnnualSavings > 0 ? "bad" : "ok"}
          sub="Annual recovery if replaced today"
        />
      </div>

      {/* FinOps Foundation Phase Tabs */}
      <div role="tablist" className="flex gap-2 border-b border-line pb-px overflow-x-auto">
        {FINOPS_TABS.map((t) => (
          <Link
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            href={`/app/finops?tab=${t.id}`}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
              tab === t.id
                ? "border-accent text-fg bg-surface"
                : "border-transparent text-dim hover:text-fg hover:bg-surface/50"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. INFORM (VISIBILITY & SHOWBACK) */}
      {/* ========================================================================= */}
      {tab === "inform" && (
        <div className="space-y-6">
          {/* Department Showback Matrix */}
          <Card
            pad={false}
            title="Departmental Hardware Showback Matrix"
            right={<Source kind="calculated" />}
          >
            <div className="p-4 border-b border-line text-xs text-dim">
              Empowering department leaders with direct accountability for the capital and ongoing maintenance costs incurred by their equipment.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <caption className="sr-only">Department Showback Table</caption>
                <thead>
                  <tr>
                    <th className="th">Department</th>
                    <th className="th">Assets</th>
                    <th className="th">CapEx Deployed</th>
                    <th className="th">Lifetime OpEx</th>
                    <th className="th">True TCO</th>
                    <th className="th">Net Book Value</th>
                    <th className="th">Maintenance Debt</th>
                    <th className="th">Spend Share</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentShowback.map((d) => (
                    <tr key={d.id} className="hover:bg-raised/50">
                      <td className="td font-medium text-fg">{d.name}</td>
                      <td className="td tabular-nums">{num(d.assetCount)}</td>
                      <td className="td tabular-nums text-mute">{naira(d.capex)}</td>
                      <td className="td tabular-nums text-fg">{naira(d.lifetimeOpex)}</td>
                      <td className="td tabular-nums font-semibold text-fg">{naira(d.trueTco)}</td>
                      <td className="td tabular-nums text-ok font-mono text-xs">{naira(d.netBookValue)}</td>
                      <td className="td tabular-nums text-warn font-mono text-xs">{naira(d.maintenanceDebt)}</td>
                      <td className="td tabular-nums font-bold text-accent">{d.shareOfSpendPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Location Showback: Offices vs Project Sites */}
          <Card
            pad={false}
            title="Geospatial Facility & Project Site Cost Allocation"
            right={<Source kind="calculated" />}
          >
            <div className="p-4 border-b border-line text-xs text-dim">
              Cross-site allocation across Corporate Headquarters, Regional Branches, and remote Client Project Sites.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <caption className="sr-only">Location Cost Allocation</caption>
                <thead>
                  <tr>
                    <th className="th">Facility / Project Site</th>
                    <th className="th">Category</th>
                    <th className="th">Location</th>
                    <th className="th">Assets</th>
                    <th className="th">CapEx Invested</th>
                    <th className="th">Lifetime OpEx</th>
                    <th className="th">At Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {locationShowback.map((loc) => (
                    <tr key={loc.id} className="hover:bg-raised/50">
                      <td className="td font-medium">
                        <Link href={`/app/locations/${loc.id}`} className="hover:text-accent">
                          {loc.name}
                        </Link>
                      </td>
                      <td className="td">
                        {loc.type ? (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                              loc.type === "PROJECT"
                                ? "bg-warn/15 text-warn border-warn/30"
                                : loc.type === "DATA_CENTER"
                                ? "bg-accent/15 text-accent border-accent/30"
                                : "bg-surface border-line text-dim"
                            }`}
                          >
                            {loc.type === "PROJECT" ? "Project Site" : loc.type.replace("_", " ")}
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase bg-surface border-line text-dim">
                            Office
                          </span>
                        )}
                      </td>
                      <td className="td text-dim text-xs">{loc.address ?? loc.city}</td>
                      <td className="td tabular-nums">{num(loc.assetCount)}</td>
                      <td className="td tabular-nums text-mute">{naira(loc.capex)}</td>
                      <td className="td tabular-nums font-medium text-fg">{naira(loc.lifetimeOpex)}</td>
                      <td className="td tabular-nums">
                        {loc.atRiskCount > 0 ? (
                          <span className="text-bad font-semibold">{loc.atRiskCount}</span>
                        ) : (
                          <span className="text-ok">0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. OPTIMIZE (ECONOMIC CROSSOVER & REPAIR VS REPLACE) */}
      {/* ========================================================================= */}
      {tab === "optimize" && (
        <div className="space-y-6">
          {/* TCO Economic Scorecard: Repair vs. Replace Thresholds */}
          <Card
            pad={false}
            title="The Economic Crossover Queue (Money Pit Detector)"
            right={<Source kind="calculated" />}
          >
            <div className="p-4 border-b border-line text-xs text-dim">
              Assets where cumulative repair costs exceed 50% of brand-new replacement value. Devices above 70% represent negative ROI and should be decommissioned immediately.
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <caption className="sr-only">Economic Crossover table</caption>
                <thead>
                  <tr>
                    <th className="th">Asset Tag</th>
                    <th className="th">Hardware Model</th>
                    <th className="th">Site / Department</th>
                    <th className="th">Repairs</th>
                    <th className="th">Lifetime Spend</th>
                    <th className="th">Replacement Cost</th>
                    <th className="th">TCO Ratio</th>
                    <th className="th">Annual Savings if Replaced</th>
                    <th className="th">FinOps Action</th>
                  </tr>
                </thead>
                <tbody>
                  {irrationalRepairs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="td text-center text-mute py-8">
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
                          <div className="text-[11px] text-dim">{r.type} • {r.ageYears} yrs</div>
                        </td>
                        <td className="td text-mute text-xs">
                          {r.location} • {r.department}
                        </td>
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
                        <td className="td tabular-nums text-ok font-bold">
                          {r.annualSavingsIfReplaced > 0 ? `+${naira(r.annualSavingsIfReplaced)}/yr` : "—"}
                        </td>
                        <td className="td">
                          {r.recommendation === "REPLACE_IMMEDIATELY" ? (
                            <Badge tone="bad">Decommission / Replace</Badge>
                          ) : (
                            <Badge tone="warn">Watchlist</Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

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

          {/* Zombie Hardware Reclamation */}
          {zombieAssets.length > 0 && (
            <Card
              pad={false}
              title="Zombie & Ghost Hardware Reclamation"
              right={<Source kind="calculated" />}
            >
              <div className="p-4 border-b border-line text-xs text-dim">
                Physical devices operating past their useful lifespan with zero maintenance telemetry. Review for disposal or salvage reclamation.
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <caption className="sr-only">Zombie hardware</caption>
                  <thead>
                    <tr>
                      <th className="th">Asset Tag</th>
                      <th className="th">Device Model</th>
                      <th className="th">Site</th>
                      <th className="th">Age</th>
                      <th className="th">Residual Book Value</th>
                      <th className="th">Reason</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zombieAssets.map((z) => (
                      <tr key={z.id} className="hover:bg-raised/50">
                        <td className="td font-mono">
                          <Link href={`/app/assets/${z.id}`} className="hover:text-accent font-medium">
                            {z.tag}
                          </Link>
                        </td>
                        <td className="td font-medium text-fg">{z.model}</td>
                        <td className="td text-dim text-xs">{z.location}</td>
                        <td className="td tabular-nums">{z.ageYears}y</td>
                        <td className="td tabular-nums font-mono text-ok">{naira(z.residualValue)}</td>
                        <td className="td text-dim text-xs">{z.reason}</td>
                        <td className="td">
                          <Link href={`/app/decommission`} className="btn btn-ghost text-xs py-1 px-2">
                            Reclaim / Decommission
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. OPERATE (SLA CLAWBACK & FOCUS SPEC) */}
      {/* ========================================================================= */}
      {tab === "operate" && (
        <div className="space-y-6">
          {/* Vendor SLA Clawback & Penalty Recovery */}
          <Card
            pad={false}
            title="Contractual Vendor SLA Breach & Rebate Recovery Ledger"
            right={<Source kind="calculated" />}
          >
            <div className="p-4 border-b border-line text-xs text-dim">
              Algorithmic audit of maintenance response times. Generates contract penalty credits due to your enterprise when vendors fail guaranteed repair SLAs.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <caption className="sr-only">Vendor SLA Clawbacks</caption>
                <thead>
                  <tr>
                    <th className="th">Vendor Partner</th>
                    <th className="th">Total Work Orders</th>
                    <th className="th">Breached WOs</th>
                    <th className="th">Overdue Time</th>
                    <th className="th">SLA Compliance</th>
                    <th className="th">Calculated Rebate Credit Due</th>
                    <th className="th">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorClawbacks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="td text-center text-mute py-8">
                        No vendor SLA breaches recorded. All partners compliant.
                      </td>
                    </tr>
                  ) : (
                    vendorClawbacks.map((v) => (
                      <tr key={v.vendorId} className="hover:bg-raised/50">
                        <td className="td font-medium">
                          <Link href={`/app/vendors/${v.vendorId}`} className="hover:text-accent text-fg">
                            {v.vendorName}
                          </Link>
                        </td>
                        <td className="td tabular-nums">{v.totalWorkOrders}</td>
                        <td className="td tabular-nums">
                          {v.breachedWorkOrders > 0 ? (
                            <span className="text-bad font-semibold">{v.breachedWorkOrders}</span>
                          ) : (
                            <span className="text-ok">0</span>
                          )}
                        </td>
                        <td className="td tabular-nums text-dim font-mono text-xs">{v.totalBreachHours}h overdue</td>
                        <td className="td tabular-nums">
                          <span
                            className={`font-semibold ${
                              v.complianceRate < 70
                                ? "text-bad"
                                : v.complianceRate < 85
                                ? "text-warn"
                                : "text-ok"
                            }`}
                          >
                            {v.complianceRate}%
                          </span>
                        </td>
                        <td className="td tabular-nums font-bold text-ok text-sm">
                          {naira(v.calculatedRebate)}
                        </td>
                        <td className="td">
                          <a
                            href={`mailto:support@vendor.com?subject=SLA%20Penalty%20Rebate%20Notice&body=Notice%20of%20SLA%20breaches%20for%20${encodeURIComponent(v.vendorName)}.`}
                            className="btn btn-ghost text-xs py-1 px-2 text-accent"
                          >
                            Issue Clawback Notice
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Linux Foundation FOCUS™ Spec Ingestion Preview */}
          <Card
            pad={false}
            title="Linux Foundation FOCUS™ v1.0 Standard Dataset"
            right={
              <a href="/api/reports/focus" className="btn btn-ghost text-xs py-1 px-2.5">
                Download FOCUS™ CSV
              </a>
            }
          >
            <div className="p-4 border-b border-line text-xs text-dim">
              Native FinOps Open Cost and Usage Specification (FOCUS™ v1.0). Ingest directly into Datadog, Vantage, Apptio, or enterprise data lakes for unified cloud + hardware FinOps reporting.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <caption className="sr-only">FOCUS Specification Sample</caption>
                <thead>
                  <tr>
                    <th className="th">ResourceId</th>
                    <th className="th">ResourceName</th>
                    <th className="th">ServiceCategory</th>
                    <th className="th">SubAccountName</th>
                    <th className="th">Region</th>
                    <th className="th">ChargeCategory</th>
                    <th className="th">BilledCost</th>
                  </tr>
                </thead>
                <tbody>
                  {focusSample.slice(0, 8).map((f, i) => (
                    <tr key={i} className="hover:bg-raised/50">
                      <td className="td text-accent font-semibold">{f.ResourceId}</td>
                      <td className="td text-fg">{f.ResourceName}</td>
                      <td className="td text-dim">{f.ServiceCategory}</td>
                      <td className="td text-mute">{f.SubAccountName}</td>
                      <td className="td text-dim">{f.Region}</td>
                      <td className="td text-ok">{f.ChargeCategory}</td>
                      <td className="td font-bold tabular-nums text-fg">{naira(f.BilledCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
