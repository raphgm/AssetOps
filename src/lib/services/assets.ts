import { Prisma, type AssetStatus } from "@prisma/client";
import { randomBytes } from "crypto";
import { z } from "zod";
import { db } from "../db";
import { audit, type Actor } from "../audit";
import { computeRisk, warrantyState, AT_RISK_MIN_SCORE, type RiskResult } from "../engines/risk";
import type { Session } from "../auth";

export const newQrToken = () => randomBytes(18).toString("base64url");

export const assetInput = z.object({
  tag: z.string().trim().min(3).max(40).regex(/^[A-Z0-9-]+$/, "Use uppercase letters, digits and dashes"),
  serial: z.string().trim().max(80).optional().or(z.literal("")),
  make: z.string().trim().min(1).max(60), model: z.string().trim().min(1).max(80),
  typeId: z.string().min(1), departmentId: z.string().min(1), locationId: z.string().min(1),
  vendorId: z.string().optional().or(z.literal("")),
  acquiredAt: z.coerce.date(), acquisitionValue: z.coerce.number().int().min(0).default(0),
  warrantyEndsAt: z.coerce.date().optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
});

/** Row-level scope: department users only see their own department's assets. */
export function assetScope(s: Session, extra: Prisma.AssetWhereInput = {}): Prisma.AssetWhereInput {
  const where: Prisma.AssetWhereInput = { orgId: s.orgId, deletedAt: null, ...extra };
  return s.role === "DEPARTMENT_USER" ? { ...where, departmentId: s.departmentId ?? "__none__" } : where;
}

export async function createAsset(s: Session, raw: unknown) {
  const i = assetInput.parse(raw);
  // Tenant check: referenced entities must belong to the caller's organisation.
  const [t, d, l] = await Promise.all([
    db.assetType.findFirst({ where: { id: i.typeId, orgId: s.orgId } }),
    db.department.findFirst({ where: { id: i.departmentId, orgId: s.orgId } }),
    db.location.findFirst({ where: { id: i.locationId, orgId: s.orgId } }),
  ]);
  if (!t || !d || !l) throw new Error("Invalid type, department or location.");
  if (i.vendorId && !(await db.vendor.findFirst({ where: { id: i.vendorId, orgId: s.orgId } }))) throw new Error("Invalid vendor.");
  const dup = await db.asset.findFirst({ where: { orgId: s.orgId, tag: i.tag } });
  if (dup) throw new Error(`Asset tag ${i.tag} already exists.`);
  const asset = await db.asset.create({ data: { orgId: s.orgId, tag: i.tag, qrToken: newQrToken(), serial: i.serial || null, make: i.make, model: i.model, typeId: i.typeId, departmentId: i.departmentId, locationId: i.locationId, vendorId: i.vendorId || null, acquiredAt: i.acquiredAt, acquisitionValue: i.acquisitionValue, warrantyEndsAt: i.warrantyEndsAt as Date | undefined } });
  await audit(actorOf(s), "asset.created", "Asset", asset.tag, undefined, { tag: asset.tag, model: asset.model });
  return asset;
}

export async function assignAsset(s: Session, assetId: string, assignee: string) {
  const asset = await db.asset.findFirst({ where: { id: assetId, orgId: s.orgId } });
  if (!asset) throw new Error("Asset not found.");
  const current = await db.assetAssignment.findFirst({ where: { assetId, toDate: null } });
  await db.$transaction(async (tx) => {
    if (current) await tx.assetAssignment.update({ where: { id: current.id }, data: { toDate: new Date() } });
    await tx.assetAssignment.create({ data: { assetId, assignee } });
    await audit(actorOf(s), "asset.assignment_changed", "Asset", asset.tag, { assignee: current?.assignee ?? null }, { assignee }, tx);
  });
}

export async function updateAsset(s: Session, id: string, patch: { status?: AssetStatus; departmentId?: string; locationId?: string }) {
  const asset = await db.asset.findFirst({ where: { id, orgId: s.orgId } });
  if (!asset) throw new Error("Asset not found.");
  if (patch.departmentId && !(await db.department.findFirst({ where: { id: patch.departmentId, orgId: s.orgId } }))) throw new Error("Invalid department.");
  if (patch.locationId && !(await db.location.findFirst({ where: { id: patch.locationId, orgId: s.orgId } }))) throw new Error("Invalid location.");
  const updated = await db.$transaction(async (tx) => {
    const u = await tx.asset.update({ where: { id }, data: patch });
    if (patch.status && patch.status !== asset.status) await tx.assetStatusHistory.create({ data: { assetId: id, from: asset.status, to: patch.status } });
    await audit(actorOf(s), "asset.updated", "Asset", asset.tag, { status: asset.status, departmentId: asset.departmentId, locationId: asset.locationId }, patch, tx);
    return u;
  });
  return updated;
}

export const actorOf = (s: Session): Actor => ({ id: s.userId, name: s.name, orgId: s.orgId });

type Tx = Prisma.TransactionClient | typeof db;

/** Evaluate an asset's current risk from source records (pure read). */
export async function evaluateAsset(assetId: string, tx: Tx = db) {
  const a = await tx.asset.findUniqueOrThrow({ where: { id: assetId }, include: { type: true } });
  const now = new Date();
  const y1 = new Date(now.getTime() - 365 * 864e5), d30 = new Date(now.getTime() - 30 * 864e5);
  const [all, recs12, openWos] = await Promise.all([
    tx.maintenanceRecord.aggregate({ where: { assetId }, _count: true, _sum: { laborCost: true, partsCost: true, downtimeHours: true }, _max: { performedAt: true } }),
    tx.maintenanceRecord.findMany({ where: { assetId, performedAt: { gte: y1 } }, select: { categoryId: true, performedAt: true, laborCost: true, partsCost: true, downtimeHours: true } }),
    tx.workOrder.findMany({ where: { assetId, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"] } }, select: { status: true, dueAt: true } }),
  ]);
  const catCounts = new Map<string, number>();
  recs12.forEach((r) => catCounts.set(r.categoryId, (catCounts.get(r.categoryId) ?? 0) + 1));
  const topRepeat = Math.max(0, ...catCounts.values()) - 1;
  const risk = computeRisk({
    ageYears: (now.getTime() - a.acquiredAt.getTime()) / (365.25 * 864e5), lifespanYears: a.type.lifespanYears,
    eventsLast12m: recs12.length, recentFailures30d: recs12.filter((r) => r.performedAt >= d30).length,
    downtimeHours12m: recs12.reduce((s, r) => s + r.downtimeHours, 0),
    maintenanceCost12m: recs12.reduce((s, r) => s + r.laborCost + r.partsCost, 0), acquisitionValue: a.acquisitionValue,
    repeatFailures: Math.max(0, topRepeat), warranty: warrantyState(a.warrantyEndsAt, now),
    overdueWorkOrders: openWos.filter((w) => w.dueAt < now).length,
  });
  return { asset: a, all, openWos, risk };
}

/** Recompute denormalised counters, health, risk and status from source records. */
export async function recomputeAsset(assetId: string, tx: Tx = db): Promise<RiskResult & { levelChanged: boolean }> {
  const { asset: a, all, openWos, risk } = await evaluateAsset(assetId, tx);
  let status: AssetStatus = a.status;
  if (a.status !== "RETIRED") {
    const active = openWos.some((w) => w.status === "IN_PROGRESS" || w.status === "AWAITING_PARTS");
    status = active ? "UNDER_MAINTENANCE" : risk.score >= AT_RISK_MIN_SCORE ? "AT_RISK" : "OPERATIONAL";
  }
  await tx.asset.update({ where: { id: assetId }, data: {
    maintenanceCount: all._count, downtimeHours: all._sum.downtimeHours ?? 0, lifetimeCost: (all._sum.laborCost ?? 0) + (all._sum.partsCost ?? 0),
    lastMaintenanceAt: all._max.performedAt, healthScore: risk.health, riskScore: risk.score, riskLevel: risk.level, status,
  } });
  if (status !== a.status) await tx.assetStatusHistory.create({ data: { assetId, from: a.status, to: status } });
  const levelChanged = risk.level !== a.riskLevel;
  if (levelChanged) await tx.riskScore.create({ data: { assetId, score: risk.score, level: risk.level, factors: risk.factors as unknown as Prisma.InputJsonValue } });
  return { ...risk, levelChanged };
}
