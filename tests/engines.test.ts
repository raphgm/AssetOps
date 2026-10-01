import { describe, it, expect } from "vitest";
import { computeRisk, levelFor, warrantyState, type RiskInput } from "@/lib/engines/risk";
import { computeDebt, DEBT_ASSUMPTIONS } from "@/lib/engines/debt";
import { repairVsReplace } from "@/lib/engines/economics";
import { simulateReplacement } from "@/lib/engines/simulate";
import { toCsv } from "@/lib/csv";

const base: RiskInput = { ageYears: 1, lifespanYears: 5, eventsLast12m: 0, recentFailures30d: 0, downtimeHours12m: 0, maintenanceCost12m: 0, acquisitionValue: 1_000_000, repeatFailures: 0, warranty: "valid", overdueWorkOrders: 0 };

describe("RiskEngine", () => {
  it("scores a pristine asset as healthy with full health", () => {
    const r = computeRisk(base);
    expect(r.health).toBe(100); expect(r.score).toBe(0); expect(r.level).toBe("healthy");
  });
  it("is deterministic", () => { expect(computeRisk({ ...base, eventsLast12m: 4 })).toEqual(computeRisk({ ...base, eventsLast12m: 4 })); });
  it("factor maxima sum to 100 and points never exceed max", () => {
    const r = computeRisk({ ...base, eventsLast12m: 2, downtimeHours12m: 30, maintenanceCost12m: 100000, ageYears: 4 });
    expect(r.factors.filter((f) => f.max > 0).reduce((s, f) => s + f.max, 0)).toBe(100);
    r.factors.filter((f) => f.max > 0).forEach((f) => { expect(f.points).toBeGreaterThanOrEqual(0); expect(f.points).toBeLessThanOrEqual(f.max); });
    expect(r.health).toBe(r.factors.filter((f) => f.max > 0).reduce((s, f) => s + f.points, 0));
  });
  it("worsens with failures, downtime, cost, age, expired warranty and overdue work", () => {
    const worst = computeRisk({ ageYears: 9, lifespanYears: 5, eventsLast12m: 8, recentFailures30d: 3, downtimeHours12m: 120, maintenanceCost12m: 600000, acquisitionValue: 1_000_000, repeatFailures: 5, warranty: "expired", overdueWorkOrders: 3 });
    expect(worst.score).toBeGreaterThanOrEqual(80); expect(worst.level).toBe("critical");
    expect(worst.score).toBeLessThanOrEqual(100);
  });
  it("level thresholds", () => { expect([0, 39, 40, 59, 60, 79, 80].map(levelFor)).toEqual(["healthy", "healthy", "watch", "watch", "attention", "attention", "critical"]); });
  it("warranty states", () => {
    const d = (n: number) => new Date(Date.now() + n * 864e5);
    expect([warrantyState(null), warrantyState(d(-1)), warrantyState(d(10)), warrantyState(d(100))]).toEqual(["none", "expired", "expiring", "valid"]);
  });
});

describe("Maintenance debt engine", () => {
  it("sums labelled components and flags itself as an estimate", () => {
    const d = computeDebt({ overdueWorkOrders: 47, recurringFailureAssets: 19, agingAssets: Array(31).fill({ replacementCost: 1_000_000 }), expiredWarrantyAssets: Array(8).fill({ replacementCost: 500_000 }) });
    const a = DEBT_ASSUMPTIONS;
    expect(d.overdue_work_orders).toBe(47); expect(d.recurring_failures).toBe(19); expect(d.aging_assets).toBe(31); expect(d.expired_warranties).toBe(8);
    expect(d.estimated_exposure).toBe(47 * a.overdueWorkOrderCost + 19 * a.recurringFailureCost + Math.round(31e6 * a.agingAssetFraction) + Math.round(4e6 * a.expiredWarrantyFraction));
    expect(d.label).toBe("estimate"); expect(d.assumptions).toBeDefined();
  });
  it("is zero with no inputs", () => { expect(computeDebt({ overdueWorkOrders: 0, recurringFailureAssets: 0, agingAssets: [], expiredWarrantyAssets: [] }).estimated_exposure).toBe(0); });
});

describe("Repair vs replace & lifecycle", () => {
  it("flags SERVER-042-like assets with explicit reasons and never auto-replaces", () => {
    const r = repairVsReplace({ acquisitionValue: 8_200_000, lifetimeCost: 3_100_000, incidents: 18, downtimeHours: 146, ageYears: 5.5, lifespanYears: 7 });
    expect(r.ratio).toBeCloseTo(0.378, 2); expect(r.review).toBe(true); expect(r.reasons.length).toBeGreaterThanOrEqual(3);
  });
  it("does not flag healthy assets", () => { expect(repairVsReplace({ acquisitionValue: 1e6, lifetimeCost: 5e4, incidents: 2, downtimeHours: 4, ageYears: 1, lifespanYears: 5 }).review).toBe(false); });
  it("simulates replacement with stated assumptions", () => {
    const s = simulateReplacement([{ replacementCost: 1e6, ageYears: 6, annualMaintenance: 2e5 }, { replacementCost: 1e6, ageYears: 2, annualMaintenance: 1e5 }], 5);
    expect(s.assets).toBe(1); expect(s.replacementCost).toBe(1e6); expect(s.annualSavings).toBe(170000); expect(s.assumptions.length).toBeGreaterThan(0);
  });
});

describe("CSV export safety", () => {
  it("neutralises spreadsheet formulas and escapes quotes", () => {
    const out = toCsv([["=HYPERLINK(\"x\")", "a,b", "ok"]]);
    expect(out).toContain("'=HYPERLINK"); expect(out).toContain('"a,b"');
  });
});
