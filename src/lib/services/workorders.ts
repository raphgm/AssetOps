import { z } from "zod";
import type { WorkOrderStatus, Priority, Prisma } from "@prisma/client";
import { db } from "../db";
import { audit } from "../audit";
import { can, AuthzError, type Permission } from "../rbac";
import type { Session } from "../auth";
import { actorOf, recomputeAsset } from "./assets";
import { createMaintenanceRecord } from "./maintenance";

export const SLA_BY_PRIORITY: Record<Priority, number> = { CRITICAL: 4, HIGH: 24, MEDIUM: 72, LOW: 120 };

/** Allowed lifecycle transitions and the permission each requires. */
export const TRANSITIONS: Record<WorkOrderStatus, Partial<Record<WorkOrderStatus, Permission>>> = {
  OPEN: { ASSIGNED: "workorder:assign", CANCELLED: "workorder:assign" },
  ASSIGNED: { IN_PROGRESS: "workorder:update", CANCELLED: "workorder:assign" },
  IN_PROGRESS: { AWAITING_PARTS: "workorder:update", RESOLVED: "workorder:update", CANCELLED: "workorder:assign" },
  AWAITING_PARTS: { IN_PROGRESS: "workorder:update", CANCELLED: "workorder:assign" },
  RESOLVED: { VERIFIED: "workorder:verify", IN_PROGRESS: "workorder:update" },
  VERIFIED: { CLOSED: "workorder:verify" },
  CLOSED: {}, CANCELLED: {},
};

export const workOrderInput = z.object({
  title: z.string().trim().min(3).max(160), description: z.string().trim().max(4000).default(""),
  assetId: z.string().min(1), priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  categoryId: z.string().optional().or(z.literal("")), assigneeId: z.string().optional().or(z.literal("")), vendorId: z.string().optional().or(z.literal("")),
  fleetKey: z.string().max(80).optional(),
});

async function addEvent(tx: Prisma.TransactionClient, workOrderId: string, type: string, actor: string, note = "") {
  await tx.workOrderEvent.create({ data: { workOrderId, type, actor, note } });
}

export async function createWorkOrder(s: Session, raw: unknown, opts: { asReport?: boolean } = {}) {
  const i = workOrderInput.parse(raw);
  if (!can(s.role, opts.asReport ? "issue:report" : "workorder:create")) throw new AuthzError();
  const asset = await db.asset.findFirst({ where: { id: i.assetId, orgId: s.orgId, deletedAt: null, ...(s.role === "DEPARTMENT_USER" ? { departmentId: s.departmentId ?? "__none__" } : {}) } });
  if (!asset) throw new Error("Asset not found.");
  if (i.categoryId && !(await db.maintenanceCategory.findFirst({ where: { id: i.categoryId, orgId: s.orgId } }))) throw new Error("Invalid category.");
  if (i.assigneeId && !(await db.user.findFirst({ where: { id: i.assigneeId, orgId: s.orgId, role: "TECHNICIAN" } }))) throw new Error("Assignee must be a technician in your organisation.");
  if (i.vendorId && !(await db.vendor.findFirst({ where: { id: i.vendorId, orgId: s.orgId } }))) throw new Error("Invalid vendor.");
  // Reporters (non-managers) cannot pre-assign or set priority above medium.
  const canManage = can(s.role, "workorder:create");
  const priority = canManage ? i.priority : "MEDIUM";
  const assigneeId = canManage ? i.assigneeId || null : null;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await db.$transaction(async (tx) => {
        const last = await tx.workOrder.aggregate({ where: { orgId: s.orgId }, _max: { number: true } });
        const sla = SLA_BY_PRIORITY[priority];
        const wo = await tx.workOrder.create({ data: {
          orgId: s.orgId, number: (last._max.number ?? 29000) + 1, title: i.title, description: i.description, priority, assetId: i.assetId,
          categoryId: i.categoryId || null, assigneeId, vendorId: (canManage && i.vendorId) || null, reporterId: s.userId, slaHours: sla,
          dueAt: new Date(Date.now() + sla * 3600e3), status: assigneeId ? "ASSIGNED" : "OPEN", fleetKey: i.fleetKey,
        } });
        await addEvent(tx, wo.id, "Created", s.name, i.description.slice(0, 200));
        if (assigneeId) await addEvent(tx, wo.id, "Assigned", s.name);
        await audit(actorOf(s), "workorder.created", "WorkOrder", `WO-${wo.number}`, undefined, { asset: asset.tag, priority, title: wo.title }, tx);
        await tx.notification.create({ data: { orgId: s.orgId, kind: "workorder_created", title: `WO-${wo.number} created`, body: `${wo.title} · ${asset.tag}`, href: `/app/work-orders/${wo.id}` } });
        return wo;
      });
    } catch (e: unknown) {
      if ((e as { code?: string }).code === "P2002" && attempt < 4) continue; // number collision, retry
      throw e;
    }
  }
  throw new Error("Could not allocate work order number.");
}

export interface TransitionInput {
  to: WorkOrderStatus; note?: string; assigneeId?: string;
  resolution?: { categoryId: string; description?: string; resolution: string; laborCost: number; downtimeHours: number; parts: { name: string; quantity: number; unitCost: number }[]; notes?: string };
}

export async function transitionWorkOrder(s: Session, id: string, t: TransitionInput) {
  const wo = await db.workOrder.findFirst({ where: { id, orgId: s.orgId }, include: { asset: true } });
  if (!wo) throw new Error("Work order not found.");
  const needed = TRANSITIONS[wo.status][t.to];
  if (!needed) throw new Error(`Cannot move a ${wo.status.toLowerCase().replace("_", " ")} work order to ${t.to.toLowerCase().replace("_", " ")}.`);
  if (!can(s.role, needed)) throw new AuthzError();
  if (s.role === "TECHNICIAN" && wo.assigneeId !== s.userId) throw new AuthzError("This work order is not assigned to you.");
  if (t.to === "ASSIGNED") {
    if (!t.assigneeId || !(await db.user.findFirst({ where: { id: t.assigneeId, orgId: s.orgId, role: "TECHNICIAN", active: true } }))) throw new Error("Choose a valid technician.");
  }
  if (t.to === "RESOLVED" && !t.resolution) throw new Error("A resolution is required to resolve a work order.");

  const label: Partial<Record<WorkOrderStatus, string>> = { ASSIGNED: "Assigned", IN_PROGRESS: "Started", AWAITING_PARTS: "Awaiting parts", RESOLVED: "Resolved", VERIFIED: "Verified", CLOSED: "Closed", CANCELLED: "Cancelled" };
  const updated = await db.$transaction(async (tx) => {
    const u = await tx.workOrder.update({ where: { id }, data: {
      status: t.to, ...(t.to === "ASSIGNED" ? { assigneeId: t.assigneeId } : {}),
      ...(t.to === "RESOLVED" ? { resolvedAt: new Date() } : {}), ...(t.to === "CLOSED" ? { closedAt: new Date() } : {}),
    } });
    await addEvent(tx, id, label[t.to] ?? t.to, s.name, t.note ?? "");
    await audit(actorOf(s), `workorder.${t.to.toLowerCase()}`, "WorkOrder", `WO-${wo.number}`, { status: wo.status }, { status: t.to, note: t.note }, tx);
    return u;
  });
  if (t.to === "RESOLVED" && t.resolution) {
    const r = t.resolution;
    const rec = await createMaintenanceRecord({ ...s, role: "SUPER_ADMIN" }, {
      assetId: wo.assetId, categoryId: r.categoryId, description: r.description || wo.title, resolution: r.resolution, notes: r.notes ?? "",
      technicianId: wo.assigneeId ?? s.userId, vendorId: wo.vendorId ?? "", workOrderId: wo.id, laborCost: r.laborCost, downtimeHours: r.downtimeHours, parts: r.parts,
    });
    await db.workOrderEvent.create({ data: { workOrderId: id, type: "Parts & cost recorded", actor: s.name, note: "Immutable maintenance record created" } });
    return { workOrder: updated, recordId: rec.id };
  }
  await recomputeAsset(wo.assetId);
  return { workOrder: updated };
}

/** Create one work order per affected asset for a fleet inspection (human-confirmed action). */
export async function createFleetInspection(s: Session, assetIds: string[], title: string, fleetKey: string, categoryId?: string) {
  const out = [];
  for (const assetId of assetIds.slice(0, 200)) out.push(await createWorkOrder(s, { title, assetId, priority: "HIGH", fleetKey, categoryId, description: "Created from an AI investigation after review. Inspect this asset for the shared failure pattern." }));
  return out;
}
