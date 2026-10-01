// Deterministic risk + health engine. No AI, no I/O.
export type WarrantyState = "valid" | "expiring" | "expired" | "none";

export interface RiskInput {
  ageYears: number;
  lifespanYears: number;
  eventsLast12m: number;
  recentFailures30d: number;
  downtimeHours12m: number;
  maintenanceCost12m: number;
  acquisitionValue: number;
  repeatFailures: number; // events in the most frequent category (12m), minus 1
  warranty: WarrantyState;
  overdueWorkOrders: number;
}

export interface Factor { key: string; label: string; points: number; max: number; detail: string }
export interface RiskResult {
  health: number;
  score: number; // risk, 0-100, higher = worse
  level: "healthy" | "watch" | "attention" | "critical";
  factors: Factor[];
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

export function levelFor(score: number): RiskResult["level"] {
  if (score >= 80) return "critical";
  if (score >= 60) return "attention";
  if (score >= 40) return "watch";
  return "healthy";
}
export const AT_RISK_MIN_SCORE = 60;

export function computeRisk(i: RiskInput): RiskResult {
  const ratio = i.acquisitionValue > 0 ? i.maintenanceCost12m / i.acquisitionValue : 0;
  const ageRatio = i.lifespanYears > 0 ? i.ageYears / i.lifespanYears : 0;
  const factors: Factor[] = [
    { key: "failureFrequency", label: "Failure frequency", max: 25,
      points: clamp(25 - i.eventsLast12m * 4, 0, 25), detail: `${i.eventsLast12m} maintenance events in 12 months` },
    { key: "downtime", label: "Downtime", max: 20,
      points: clamp(Math.round(20 - i.downtimeHours12m / 4), 0, 20), detail: `${Math.round(i.downtimeHours12m)}h downtime in 12 months` },
    { key: "cost", label: "Maintenance cost", max: 20,
      points: clamp(Math.round(20 - (ratio / 0.4) * 20), 0, 20), detail: `${(ratio * 100).toFixed(1)}% of acquisition value spent in 12 months` },
    { key: "age", label: "Age", max: 15,
      points: clamp(Math.round(15 - Math.max(0, ageRatio - 0.4) * 25), 0, 15), detail: `${i.ageYears.toFixed(1)}y of ${i.lifespanYears}y expected lifespan` },
    { key: "warranty", label: "Warranty", max: 10,
      points: { valid: 10, expiring: 7, expired: 3, none: 3 }[i.warranty], detail: `Warranty ${i.warranty}` },
    { key: "repeat", label: "Repeat issues", max: 10,
      points: clamp(10 - i.repeatFailures * 3, 0, 10), detail: `${i.repeatFailures} repeat occurrence(s) of the same issue category` },
  ];
  const health = factors.reduce((s, f) => s + f.points, 0);
  // Risk is the inverse of health plus urgency adjustments.
  const recentPenalty = Math.min(15, i.recentFailures30d * 5);
  const overduePenalty = Math.min(10, i.overdueWorkOrders * 5);
  const score = clamp(100 - health + recentPenalty + overduePenalty);
  if (recentPenalty) factors.push({ key: "recent", label: "Recent failures (risk +)", points: -recentPenalty, max: 0, detail: `${i.recentFailures30d} failure(s) in last 30 days` });
  if (overduePenalty) factors.push({ key: "overdue", label: "Overdue maintenance (risk +)", points: -overduePenalty, max: 0, detail: `${i.overdueWorkOrders} work order(s) past SLA` });
  return { health, score, level: levelFor(score), factors };
}

export function warrantyState(endsAt: Date | null, now = new Date()): WarrantyState {
  if (!endsAt) return "none";
  const days = (endsAt.getTime() - now.getTime()) / 86400000;
  if (days < 0) return "expired";
  if (days <= 30) return "expiring";
  return "valid";
}
