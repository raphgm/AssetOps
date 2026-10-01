export interface SimAsset { replacementCost: number; ageYears: number; annualMaintenance: number }
export function simulateReplacement(assets: SimAsset[], minAge: number, residualMaintenanceFactor = 0.15) {
  const target = assets.filter((a) => a.ageYears >= minAge);
  const replacementCost = target.reduce((s, a) => s + a.replacementCost, 0);
  const currentMaint = target.reduce((s, a) => s + a.annualMaintenance, 0);
  const projectedMaint = Math.round(currentMaint * residualMaintenanceFactor);
  return {
    assets: target.length, replacementCost, currentAnnualMaintenance: currentMaint,
    projectedAnnualMaintenance: projectedMaint, annualSavings: currentMaint - projectedMaint,
    paybackYears: currentMaint - projectedMaint > 0 ? replacementCost / (currentMaint - projectedMaint) : null,
    assumptions: [
      `New equipment incurs ${Math.round(residualMaintenanceFactor * 100)}% of current annual maintenance cost (estimate).`,
      "Replacement cost uses the per-type standard cost configured for the organisation.",
      "Annual maintenance is the trailing 12-month recorded cost of the selected assets.",
    ],
  };
}
