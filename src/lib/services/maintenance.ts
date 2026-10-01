import { z } from "zod";
import { db } from "../db";
import { audit } from "../audit";
import type { Session } from "../auth";
import { actorOf, recomputeAsset } from "./assets";

export const maintenanceInput = z.object({
  assetId: z.string().min(1), categoryId: z.string().min(1),
  description: z.string().trim().min(3).max(2000), resolution: z.string().trim().max(2000).default(""), notes: z.string().trim().max(2000).default(""),
  performedAt: z.coerce.date().default(() => new Date()),
  technicianId: z.string().optional().or(z.literal("")), vendorId: z.string().optional().or(z.literal("")), workOrderId: z.string().optional().or(z.literal("")),
  laborCost: z.coerce.number().int().min(0).max(1e9).default(0), partsCost: z.coerce.number().int().min(0).max(1e9).default(0),
  downtimeHours: z.coerce.number().min(0).max(100000).default(0),
  parts: z.array(z.object({ name: z.string().trim().min(1).max(80), quantity: z.coerce.number().int().min(1).max(1000), unitCost: z.coerce.number().int().min(0) })).default([]),
});
export type MaintenanceInput = z.input<typeof maintenanceInput>;

/**
 * Creates an immutable maintenance record, then refreshes counters, health, risk, audit and notifications.
 * Records are never updated or deleted by any service.
 */
export async function createMaintenanceRecord(s: Session, raw: unknown) {
  const i = maintenanceInput.parse(raw);
  const asset = await db.asset.findFirst({ where: { id: i.assetId, orgId: s.orgId, deletedAt: null } });
  if (!asset) throw new Error("Asset not found.");
  if (!(await db.maintenanceCategory.findFirst({ where: { id: i.categoryId, orgId: s.orgId } }))) throw new Error("Invalid category.");
  if (i.vendorId && !(await db.vendor.findFirst({ where: { id: i.vendorId, orgId: s.orgId } }))) throw new Error("Invalid vendor.");
  const techId = i.technicianId || (s.role === "TECHNICIAN" ? s.userId : null);
  if (techId && !(await db.user.findFirst({ where: { id: techId, orgId: s.orgId } }))) throw new Error("Invalid technician.");
  if (i.workOrderId && !(await db.workOrder.findFirst({ where: { id: i.workOrderId, orgId: s.orgId, assetId: i.assetId } }))) throw new Error("Work order does not belong to this asset.");
  const partsFromList = i.parts.reduce((t, p) => t + p.quantity * p.unitCost, 0);

  return db.$transaction(async (tx) => {
    const rec = await tx.maintenanceRecord.create({ data: {
      orgId: s.orgId, assetId: i.assetId, categoryId: i.categoryId, description: i.description, resolution: i.resolution, notes: i.notes,
      performedAt: i.performedAt, technicianId: techId, vendorId: i.vendorId || null, workOrderId: i.workOrderId || null,
      laborCost: i.laborCost, partsCost: i.partsCost + partsFromList, downtimeHours: i.downtimeHours,
    } });
    for (const p of i.parts) {
      const part = await tx.part.upsert({ where: { orgId_name: { orgId: s.orgId, name: p.name } }, update: {}, create: { orgId: s.orgId, name: p.name, unitCost: p.unitCost } });
      await tx.partUsage.create({ data: { recordId: rec.id, partId: part.id, quantity: p.quantity } });
    }
    const risk = await recomputeAsset(i.assetId, tx);
    await audit(actorOf(s), "maintenance.recorded", "MaintenanceRecord", asset.tag, undefined, { recordId: rec.id, cost: rec.laborCost + rec.partsCost, downtimeHours: rec.downtimeHours, healthScore: risk.health }, tx);
    if (risk.levelChanged && (risk.level === "attention" || risk.level === "critical")) {
      await tx.notification.create({ data: { orgId: s.orgId, kind: "asset_risk_increased", title: `Risk increased: ${asset.tag}`, body: `Risk score is now ${risk.score} (${risk.level}).`, href: `/app/assets/${asset.id}` } });
    }
    return rec;
  });
}
