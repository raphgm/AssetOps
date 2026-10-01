import type { Prisma } from "@prisma/client";
import type { Session } from "../auth";
import { assetScope } from "./assets";

export type AssetSP = Record<string, string | undefined>;
export const ASSET_SORTS: Record<string, string> = { tag: "tag", model: "model", status: "status", health: "healthScore", risk: "riskScore", warranty: "warrantyEndsAt", last: "lastMaintenanceAt", cost: "lifetimeCost" };

export function assetFilters(s: Session, sp: AssetSP): Prisma.AssetWhereInput {
  const now = new Date();
  const and: Prisma.AssetWhereInput[] = [];
  if (sp.q) { const c = { contains: sp.q.slice(0, 60), mode: "insensitive" as const }; and.push({ OR: [{ tag: c }, { model: c }, { make: c }, { serial: c }] }); }
  if (sp.ids) and.push({ id: { in: sp.ids.split(",").slice(0, 500) } });
  if (sp.status) and.push({ status: sp.status as never });
  if (sp.department) and.push({ departmentId: sp.department });
  if (sp.location) and.push({ locationId: sp.location });
  if (sp.type) and.push({ typeId: sp.type });
  if (sp.vendor) and.push({ vendorId: sp.vendor });
  if (sp.risk) and.push({ riskLevel: sp.risk });
  if (sp.warranty === "expired") and.push({ warrantyEndsAt: { lt: now } });
  if (sp.warranty === "expiring") and.push({ warrantyEndsAt: { gte: now, lte: new Date(now.getTime() + 30 * 864e5) } });
  if (sp.warranty === "valid") and.push({ warrantyEndsAt: { gt: now } });
  if (sp.age && Number(sp.age) > 0) and.push({ acquiredAt: { lt: new Date(now.getTime() - Number(sp.age) * 365.25 * 864e5) } });
  if (sp.noserial) and.push({ OR: [{ serial: null }, { serial: "" }] });
  if (sp.recurring) and.push({ maintenanceCount: { gte: 3 }, riskLevel: { not: "healthy" } });
  return assetScope(s, and.length ? { AND: and } : {});
}
export function assetOrder(sp: AssetSP): Prisma.AssetOrderByWithRelationInput {
  const col = ASSET_SORTS[sp.sort ?? ""] ?? "riskScore";
  return { [col]: sp.dir === "asc" ? "asc" : "desc" } as Prisma.AssetOrderByWithRelationInput;
}
