export function repairVsReplace(a: { acquisitionValue: number; lifetimeCost: number; incidents: number; downtimeHours: number; ageYears: number; lifespanYears: number }) {
  const ratio = a.acquisitionValue > 0 ? a.lifetimeCost / a.acquisitionValue : 0;
  const reasons: string[] = [];
  if (ratio >= 0.35) reasons.push(`Lifetime maintenance is ${(ratio * 100).toFixed(1)}% of acquisition value (threshold 35%)`);
  if (a.incidents >= 10) reasons.push(`${a.incidents} recorded incidents (threshold 10)`);
  if (a.downtimeHours >= 100) reasons.push(`${Math.round(a.downtimeHours)}h cumulative downtime (threshold 100h)`);
  if (a.ageYears >= a.lifespanYears) reasons.push(`Age ${a.ageYears.toFixed(1)}y has reached the ${a.lifespanYears}y expected lifespan`);
  return { ratio, review: reasons.length >= 2 || ratio >= 0.35, reasons };
}
