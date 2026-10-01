// Deterministic maintenance-debt engine. All figures are ESTIMATES derived from the stated assumptions.
export const DEBT_ASSUMPTIONS = {
  overdueWorkOrderCost: 45_000,   // ₦ per overdue work order (deferred labour + escalation)
  recurringFailureCost: 120_000,  // ₦ per asset with unresolved recurring failures
  agingAssetFraction: 0.03,       // share of replacement cost carried as exposure per aging asset
  expiredWarrantyFraction: 0.02,  // share of replacement cost exposed per expired-warranty at-risk asset
};

export interface DebtInput {
  overdueWorkOrders: number;
  recurringFailureAssets: number;
  agingAssets: { replacementCost: number }[];
  expiredWarrantyAssets: { replacementCost: number }[];
}
export interface DebtResult {
  estimated_exposure: number;
  overdue_work_orders: number;
  recurring_failures: number;
  aging_assets: number;
  expired_warranties: number;
  breakdown: { overdue: number; recurring: number; aging: number; warranty: number };
  assumptions: typeof DEBT_ASSUMPTIONS;
  label: "estimate";
}

export function computeDebt(i: DebtInput): DebtResult {
  const a = DEBT_ASSUMPTIONS;
  const overdue = i.overdueWorkOrders * a.overdueWorkOrderCost;
  const recurring = i.recurringFailureAssets * a.recurringFailureCost;
  const aging = Math.round(i.agingAssets.reduce((s, x) => s + x.replacementCost * a.agingAssetFraction, 0));
  const warranty = Math.round(i.expiredWarrantyAssets.reduce((s, x) => s + x.replacementCost * a.expiredWarrantyFraction, 0));
  return {
    estimated_exposure: overdue + recurring + aging + warranty,
    overdue_work_orders: i.overdueWorkOrders,
    recurring_failures: i.recurringFailureAssets,
    aging_assets: i.agingAssets.length,
    expired_warranties: i.expiredWarrantyAssets.length,
    breakdown: { overdue, recurring, aging, warranty },
    assumptions: a,
    label: "estimate",
  };
}
