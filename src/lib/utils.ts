import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...i: ClassValue[]) => twMerge(clsx(i));
export function naira(n: number, compact = true) {
  if (!compact) return "₦" + Math.round(n).toLocaleString("en-NG");
  const a = Math.abs(n);
  if (a >= 1e9) return `₦${(n / 1e9).toFixed(1)}B`;
  if (a >= 1e6) return `₦${(n / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `₦${Math.round(n / 1e3)}K`;
  return `₦${Math.round(n)}`;
}
export const num = (n: number) => n.toLocaleString("en-NG");
export const fmtDate = (d: Date | string | null | undefined) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
export const fmtDateTime = (d: Date | string) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
export const pct = (n: number, d = 1) => `${n.toFixed(d)}%`;
export const STATUS_LABEL: Record<string, string> = { OPERATIONAL: "Operational", UNDER_MAINTENANCE: "Under maintenance", AT_RISK: "At risk", RETIRED: "Retired", OPEN: "Open", ASSIGNED: "Assigned", IN_PROGRESS: "In progress", AWAITING_PARTS: "Awaiting parts", RESOLVED: "Resolved", VERIFIED: "Verified", CLOSED: "Closed", CANCELLED: "Cancelled" };
