import { db } from "@/lib/db";

export interface DepreciationSummary {
  totalCapitalDeployed: number;
  totalNetBookValue: number;
  totalAccumulatedDepreciation: number;
  monthlyDepreciationRunRate: number;
  depreciationMethod: "Straight-Line (10% Residual)";
}

export interface CapExForecastQuarter {
  period: string; // e.g. "Q4 2026", "Q1 2027"
  year: number;
  quarter: number;
  retiringAssetsCount: number;
  projectedCapEx: number;
  assetTypes: { name: string; count: number; cost: number }[];
}

export interface TcoEconomicAsset {
  id: string;
  tag: string;
  model: string;
  type: string;
  location: string;
  acquisitionValue: number;
  replacementCost: number;
  lifetimeCost: number;
  maintenanceCount: number;
  ratio: number; // lifetimeCost / replacementCost
  recommendation: "REPLACE_IMMEDIATELY" | "MONITOR_CLOSELY" | "ECONOMICALLY_VIABLE";
}

export interface FinOpsOverview {
  depreciation: DepreciationSummary;
  capexForecast: CapExForecastQuarter[];
  irrationalRepairs: TcoEconomicAsset[];
  totalIrrationalSpend: number;
  assetCountAnalyzed: number;
}

/** Pure FinOps calculation engine for physical IT hardware capital & maintenance. */
export async function getFinOpsMetrics(orgId: string): Promise<FinOpsOverview> {
  const assets = await db.asset.findMany({
    where: { orgId, deletedAt: null },
    include: { type: true, location: true },
  });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let totalCapitalDeployed = 0;
  let totalNetBookValue = 0;
  let totalAccumulatedDepreciation = 0;
  let annualDepreciationSum = 0;

  const capexBuckets = new Map<string, {
    period: string;
    year: number;
    quarter: number;
    count: number;
    cost: number;
    typeMap: Map<string, { count: number; cost: number }>;
  }>();

  // Initialize quarters for next 2 years
  for (let i = 0; i < 8; i++) {
    const qOffset = Math.floor(currentMonth / 3) + i;
    const y = currentYear + Math.floor(qOffset / 4);
    const q = (qOffset % 4) + 1;
    const key = `${y}-Q${q}`;
    capexBuckets.set(key, {
      period: `Q${q} ${y}`,
      year: y,
      quarter: q,
      count: 0,
      cost: 0,
      typeMap: new Map(),
    });
  }

  const irrationalList: TcoEconomicAsset[] = [];
  let totalIrrationalSpend = 0;

  for (const a of assets) {
    const cost = a.acquisitionValue || a.type.replacementCost || 500_000;
    const replacement = a.type.replacementCost || cost;
    const lifespanYears = Math.max(1, a.type.lifespanYears || 5);
    const residual = Math.round(cost * 0.1); // 10% residual value

    totalCapitalDeployed += cost;

    // Age in months
    const ageMs = Math.max(0, now.getTime() - new Date(a.acquiredAt).getTime());
    const ageMonths = ageMs / (1000 * 60 * 60 * 24 * 30.4375);
    const totalLifespanMonths = lifespanYears * 12;

    const depRatio = Math.min(1, Math.max(0, ageMonths / totalLifespanMonths));
    const accumulated = Math.round((cost - residual) * depRatio);
    const nbv = Math.round(cost - accumulated);

    totalAccumulatedDepreciation += accumulated;
    totalNetBookValue += nbv;
    annualDepreciationSum += (cost - residual) / lifespanYears;

    // TCO: Repair vs Replace threshold
    const repairRatio = replacement > 0 ? a.lifetimeCost / replacement : 0;
    if (repairRatio >= 0.5 && a.status !== "RETIRED") {
      let rec: TcoEconomicAsset["recommendation"] = "ECONOMICALLY_VIABLE";
      if (repairRatio >= 0.7) {
        rec = "REPLACE_IMMEDIATELY";
        totalIrrationalSpend += a.lifetimeCost;
      } else {
        rec = "MONITOR_CLOSELY";
      }

      irrationalList.push({
        id: a.id,
        tag: a.tag,
        model: `${a.make} ${a.model}`,
        type: a.type.name,
        location: a.location.name,
        acquisitionValue: cost,
        replacementCost: replacement,
        lifetimeCost: a.lifetimeCost,
        maintenanceCount: a.maintenanceCount,
        ratio: Math.round(repairRatio * 100),
        recommendation: rec,
      });
    }

    // CapEx Forecasting: End-of-Life date
    if (a.status !== "RETIRED") {
      const eolTime = new Date(a.acquiredAt).getTime() + lifespanYears * 365.25 * 86400 * 1000;
      const eolDate = new Date(eolTime);
      const eolYear = eolDate.getFullYear();
      const eolQuarter = Math.floor(eolDate.getMonth() / 3) + 1;
      const bucketKey = `${eolYear}-Q${eolQuarter}`;

      const bucket = capexBuckets.get(bucketKey);
      if (bucket) {
        bucket.count += 1;
        bucket.cost += replacement;
        const curType = bucket.typeMap.get(a.type.name) ?? { count: 0, cost: 0 };
        curType.count += 1;
        curType.cost += replacement;
        bucket.typeMap.set(a.type.name, curType);
      }
    }
  }

  // Format CapEx forecast list
  const capexForecast: CapExForecastQuarter[] = Array.from(capexBuckets.values()).map((b) => ({
    period: b.period,
    year: b.year,
    quarter: b.quarter,
    retiringAssetsCount: b.count,
    projectedCapEx: b.cost,
    assetTypes: Array.from(b.typeMap.entries()).map(([name, t]) => ({
      name,
      count: t.count,
      cost: t.cost,
    })),
  }));

  irrationalList.sort((a, b) => b.ratio - a.ratio);

  return {
    depreciation: {
      totalCapitalDeployed,
      totalNetBookValue,
      totalAccumulatedDepreciation,
      monthlyDepreciationRunRate: Math.round(annualDepreciationSum / 12),
      depreciationMethod: "Straight-Line (10% Residual)",
    },
    capexForecast,
    irrationalRepairs: irrationalList.slice(0, 50),
    totalIrrationalSpend,
    assetCountAnalyzed: assets.length,
  };
}
