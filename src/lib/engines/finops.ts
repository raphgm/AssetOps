import { db } from "@/lib/db";

export interface DepreciationSummary {
  totalCapitalDeployed: number;
  totalLifetimeOpEx: number;
  trueEstateTco: number;
  totalNetBookValue: number;
  totalAccumulatedDepreciation: number;
  monthlyDepreciationRunRate: number;
  maintenanceToCapExRatio: number; // %
  totalMaintenanceDebt: number; // CapEx required to replace assets past EOL
  depreciationMethod: "Straight-Line (10% Residual)";
}

export interface DepartmentShowback {
  id: string;
  name: string;
  assetCount: number;
  capex: number;
  lifetimeOpex: number;
  trueTco: number;
  netBookValue: number;
  maintenanceDebt: number;
  shareOfSpendPct: number;
}

export interface LocationShowback {
  id: string;
  name: string;
  type: string;
  city: string;
  address?: string | null;
  assetCount: number;
  capex: number;
  lifetimeOpex: number;
  atRiskCount: number;
}

export interface CapExForecastQuarter {
  period: string; // e.g. "Q4 2026", "Q1 2027"
  year: number;
  quarter: number;
  retiringAssetsCount: number;
  projectedCapEx: number;
  assetTypes: { name: string; count: number; cost: number }[];
}

export interface EconomicCrossoverAsset {
  id: string;
  tag: string;
  model: string;
  type: string;
  location: string;
  department: string;
  ageYears: number;
  acquisitionValue: number;
  replacementCost: number;
  lifetimeCost: number;
  maintenanceCount: number;
  ratio: number; // lifetimeCost / replacementCost
  annualSavingsIfReplaced: number;
  recommendation: "REPLACE_IMMEDIATELY" | "MONITOR_CLOSELY" | "ECONOMICALLY_VIABLE";
}

export interface ZombieAsset {
  id: string;
  tag: string;
  model: string;
  type: string;
  location: string;
  department: string;
  ageYears: number;
  residualValue: number;
  status: string;
  reason: string;
}

export interface VendorSlaClawback {
  vendorId: string;
  vendorName: string;
  contractValue: number;
  totalWorkOrders: number;
  breachedWorkOrders: number;
  totalBreachHours: number;
  complianceRate: number; // %
  calculatedRebate: number; // ₦ penalty credit due to enterprise
}

export interface FocusRecord {
  ResourceId: string;
  ResourceName: string;
  ResourceType: string;
  ProviderName: string; // Hardware Vendor
  ServiceCategory: string; // Hardware / Compute / Network / Power
  SubAccountName: string; // Department
  Region: string; // Location / City
  ChargeCategory: "Purchase (CapEx)" | "Maintenance (OpEx)" | "Depreciation (Write-Down)";
  BilledCost: number;
  EffectiveCost: number;
  Currency: "NGN";
  ChargePeriodStart: string;
}

export interface FinOpsOverview {
  depreciation: DepreciationSummary;
  departmentShowback: DepartmentShowback[];
  locationShowback: LocationShowback[];
  capexForecast: CapExForecastQuarter[];
  irrationalRepairs: EconomicCrossoverAsset[];
  zombieAssets: ZombieAsset[];
  vendorClawbacks: VendorSlaClawback[];
  totalIrrationalSpend: number;
  totalPotentialAnnualSavings: number;
  assetCountAnalyzed: number;
  focusSample: FocusRecord[];
}

/** Pure FinOps calculation engine for physical IT hardware capital, TCO & SLA enforcement. */
export async function getFinOpsMetrics(orgId: string): Promise<FinOpsOverview> {
  const [assets, depts, locs, vendors, workOrders] = await Promise.all([
    db.asset.findMany({
      where: { orgId, deletedAt: null },
      include: { type: true, location: true, department: true, vendor: true },
    }),
    db.department.findMany({ where: { orgId } }),
    db.location.findMany({ where: { orgId } }),
    db.vendor.findMany({
      where: { orgId },
      include: { contracts: true },
    }),
    db.workOrder.findMany({
      where: { orgId },
      include: { vendor: true },
    }),
  ]);

  const now = new Date();
  const nowMs = now.getTime();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let totalCapitalDeployed = 0;
  let totalNetBookValue = 0;
  let totalAccumulatedDepreciation = 0;
  let annualDepreciationSum = 0;
  let totalLifetimeOpEx = 0;
  let totalMaintenanceDebt = 0;

  // Department metrics map
  const deptStats = new Map<string, {
    capex: number;
    opex: number;
    nbv: number;
    debt: number;
    count: number;
  }>();

  // Location metrics map
  const locStats = new Map<string, {
    capex: number;
    opex: number;
    atRisk: number;
    count: number;
  }>();

  // CapEx quarterly buckets for next 8 quarters
  const capexBuckets = new Map<string, {
    period: string;
    year: number;
    quarter: number;
    count: number;
    cost: number;
    typeMap: Map<string, { count: number; cost: number }>;
  }>();

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

  const irrationalList: EconomicCrossoverAsset[] = [];
  const zombieList: ZombieAsset[] = [];
  let totalIrrationalSpend = 0;
  let totalPotentialAnnualSavings = 0;
  const focusSample: FocusRecord[] = [];

  for (const a of assets) {
    const cost = a.acquisitionValue || a.type.replacementCost || 500_000;
    const replacement = a.type.replacementCost || cost;
    const lifespanYears = Math.max(1, a.type.lifespanYears || 5);
    const residual = Math.round(cost * 0.1); // 10% residual scrap value
    const lifetimeOpex = a.lifetimeCost || 0;

    totalCapitalDeployed += cost;
    totalLifetimeOpEx += lifetimeOpex;

    // Age in months and years
    const ageMs = Math.max(0, nowMs - new Date(a.acquiredAt).getTime());
    const ageYears = ageMs / (365.25 * 864e5);
    const ageMonths = ageMs / (1000 * 60 * 60 * 24 * 30.4375);
    const totalLifespanMonths = lifespanYears * 12;

    const depRatio = Math.min(1, Math.max(0, ageMonths / totalLifespanMonths));
    const accumulated = Math.round((cost - residual) * depRatio);
    const nbv = Math.round(cost - accumulated);

    totalAccumulatedDepreciation += accumulated;
    totalNetBookValue += nbv;
    annualDepreciationSum += (cost - residual) / lifespanYears;

    // Maintenance debt: asset past its lifespan
    const isPastLifespan = ageYears >= lifespanYears;
    const assetDebt = isPastLifespan ? replacement : 0;
    if (isPastLifespan && a.status !== "RETIRED") {
      totalMaintenanceDebt += replacement;
    }

    // Accumulate Department showback
    const dStat = deptStats.get(a.departmentId) ?? { capex: 0, opex: 0, nbv: 0, debt: 0, count: 0 };
    dStat.capex += cost;
    dStat.opex += lifetimeOpex;
    dStat.nbv += nbv;
    dStat.debt += assetDebt;
    dStat.count += 1;
    deptStats.set(a.departmentId, dStat);

    // Accumulate Location showback
    const lStat = locStats.get(a.locationId) ?? { capex: 0, opex: 0, atRisk: 0, count: 0 };
    lStat.capex += cost;
    lStat.opex += lifetimeOpex;
    lStat.count += 1;
    if (a.healthScore < 50 || isPastLifespan) {
      lStat.atRisk += 1;
    }
    locStats.set(a.locationId, lStat);

    // TCO: Economic Crossover (Repair vs. Replace Threshold)
    const repairRatio = replacement > 0 ? lifetimeOpex / replacement : 0;
    const annualProjectedMaint = ageYears > 0 ? lifetimeOpex / ageYears : lifetimeOpex;
    const annualizedReplacement = replacement / lifespanYears;
    const potentialAnnualSavings = Math.max(0, Math.round(annualProjectedMaint - annualizedReplacement));

    if (repairRatio >= 0.5 && a.status !== "RETIRED") {
      let rec: EconomicCrossoverAsset["recommendation"] = "ECONOMICALLY_VIABLE";
      if (repairRatio >= 0.7) {
        rec = "REPLACE_IMMEDIATELY";
        totalIrrationalSpend += lifetimeOpex;
        totalPotentialAnnualSavings += potentialAnnualSavings;
      } else {
        rec = "MONITOR_CLOSELY";
      }

      irrationalList.push({
        id: a.id,
        tag: a.tag,
        model: `${a.make} ${a.model}`,
        type: a.type.name,
        location: a.location.name,
        department: a.department.name,
        ageYears: parseFloat(ageYears.toFixed(1)),
        acquisitionValue: cost,
        replacementCost: replacement,
        lifetimeCost: lifetimeOpex,
        maintenanceCount: a.maintenanceCount,
        ratio: Math.round(repairRatio * 100),
        annualSavingsIfReplaced: potentialAnnualSavings,
        recommendation: rec,
      });
    }

    // Zombie / Ghost asset detection
    if (a.status !== "RETIRED") {
      if (a.maintenanceCount === 0 && ageYears >= lifespanYears) {
        zombieList.push({
          id: a.id,
          tag: a.tag,
          model: `${a.make} ${a.model}`,
          type: a.type.name,
          location: a.location.name,
          department: a.department.name,
          ageYears: parseFloat(ageYears.toFixed(1)),
          residualValue: nbv,
          status: a.status,
          reason: "Past useful lifespan with zero maintenance telemetry",
        });
      }
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

    // Build FOCUS spec sample
    if (focusSample.length < 15) {
      focusSample.push({
        ResourceId: a.tag,
        ResourceName: `${a.make} ${a.model}`,
        ResourceType: a.type.name,
        ProviderName: a.vendor?.name ?? "OEM Hardware",
        ServiceCategory: a.type.code === "SRV" || a.type.code === "DSK" || a.type.code === "LAP" ? "Compute" : a.type.code === "SWT" || a.type.code === "RTR" ? "Network" : "Infrastructure",
        SubAccountName: a.department.name,
        Region: a.location.city,
        ChargeCategory: "Maintenance (OpEx)",
        BilledCost: lifetimeOpex,
        EffectiveCost: lifetimeOpex,
        Currency: "NGN",
        ChargePeriodStart: a.acquiredAt.toISOString().slice(0, 10),
      });
    }
  }

  // Calculate Vendor SLA Clawback / Penalties
  const vendorMap = new Map<string, {
    name: string;
    contractVal: number;
    totalWos: number;
    breachedWos: number;
    breachHours: number;
  }>();

  for (const v of vendors) {
    const totalContractVal = v.contracts.reduce((sum, c) => sum + c.value, 0);
    vendorMap.set(v.id, {
      name: v.name,
      contractVal: totalContractVal || 5_000_000,
      totalWos: 0,
      breachedWos: 0,
      breachHours: 0,
    });
  }

  for (const wo of workOrders) {
    if (!wo.vendorId) continue;
    const vEntry = vendorMap.get(wo.vendorId);
    if (!vEntry) continue;

    vEntry.totalWos += 1;
    const dueTime = wo.dueAt.getTime();
    const finishTime = wo.resolvedAt ? wo.resolvedAt.getTime() : (["OPEN", "IN_PROGRESS", "ASSIGNED"].includes(wo.status) ? nowMs : dueTime);

    if (finishTime > dueTime) {
      vEntry.breachedWos += 1;
      const overMs = finishTime - dueTime;
      vEntry.breachHours += Math.round(overMs / (3600 * 1000));
    }
  }

  const vendorClawbacks: VendorSlaClawback[] = Array.from(vendorMap.entries())
    .filter(([, data]) => data.totalWos > 0)
    .map(([vId, data]) => {
      const compliance = data.totalWos > 0 ? Math.round(((data.totalWos - data.breachedWos) / data.totalWos) * 100) : 100;
      // Formula: Contract rebate = ₦45,000 baseline penalty per breach + ₦2,500 per overdue hour
      const rebate = data.breachedWos * 45_000 + data.breachHours * 2_500;
      return {
        vendorId: vId,
        vendorName: data.name,
        contractValue: data.contractVal,
        totalWorkOrders: data.totalWos,
        breachedWorkOrders: data.breachedWos,
        totalBreachHours: data.breachHours,
        complianceRate: compliance,
        calculatedRebate: rebate,
      };
    })
    .sort((a, b) => b.calculatedRebate - a.calculatedRebate);

  // Department Showback List
  const trueEstateTco = totalCapitalDeployed + totalLifetimeOpEx;
  const departmentShowback: DepartmentShowback[] = depts
    .map((d) => {
      const stat = deptStats.get(d.id) ?? { capex: 0, opex: 0, nbv: 0, debt: 0, count: 0 };
      const deptTco = stat.capex + stat.opex;
      const share = trueEstateTco > 0 ? Math.round((deptTco / trueEstateTco) * 100) : 0;
      return {
        id: d.id,
        name: d.name,
        assetCount: stat.count,
        capex: stat.capex,
        lifetimeOpex: stat.opex,
        trueTco: deptTco,
        netBookValue: stat.nbv,
        maintenanceDebt: stat.debt,
        shareOfSpendPct: share,
      };
    })
    .filter((d) => d.assetCount > 0)
    .sort((a, b) => b.trueTco - a.trueTco);

  // Location Showback List
  const locationShowback: LocationShowback[] = locs
    .map((l) => {
      const stat = locStats.get(l.id) ?? { capex: 0, opex: 0, atRisk: 0, count: 0 };
      return {
        id: l.id,
        name: l.name,
        type: l.type,
        city: l.city,
        address: l.address,
        assetCount: stat.count,
        capex: stat.capex,
        lifetimeOpex: stat.opex,
        atRiskCount: stat.atRisk,
      };
    })
    .filter((l) => l.assetCount > 0)
    .sort((a, b) => b.lifetimeOpex - a.lifetimeOpex);

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
      totalLifetimeOpEx,
      trueEstateTco,
      totalNetBookValue,
      totalAccumulatedDepreciation,
      monthlyDepreciationRunRate: Math.round(annualDepreciationSum / 12),
      maintenanceToCapExRatio: totalCapitalDeployed > 0 ? parseFloat(((totalLifetimeOpEx / totalCapitalDeployed) * 100).toFixed(1)) : 0,
      totalMaintenanceDebt,
      depreciationMethod: "Straight-Line (10% Residual)",
    },
    departmentShowback,
    locationShowback,
    capexForecast,
    irrationalRepairs: irrationalList.slice(0, 50),
    zombieAssets: zombieList.slice(0, 30),
    vendorClawbacks,
    totalIrrationalSpend,
    totalPotentialAnnualSavings,
    assetCountAnalyzed: assets.length,
    focusSample,
  };
}
