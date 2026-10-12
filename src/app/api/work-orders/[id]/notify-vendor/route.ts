import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { UserError } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export const POST = handle(async (_req, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("workorder:update");
  const { id } = await params;

  const w = await db.workOrder.findFirst({
    where: { id, orgId: s.orgId },
    include: { vendor: true, asset: { include: { location: true } } },
  });

  if (!w) throw new UserError("Work order not found.");
  if (!w.vendor) throw new UserError("No vendor partner assigned to this work order.");

  const now = new Date();
  const note = `Automated SLA dispatch notice sent to ${w.vendor.name} (${w.vendor.email || "partner desk"}). Asset: ${w.asset.tag} at ${w.asset.location.name}. Guaranteed SLA: ${w.slaHours}h.`;

  // 1. Log WorkOrder timeline event
  await db.workOrderEvent.create({
    data: {
      workOrderId: w.id,
      type: "vendor_notified",
      actor: s.name || "FinOps Automation",
      note,
      at: now,
    },
  });

  // 2. Audit log
  await audit(s, "workorder.vendor_notified", "WorkOrder", `WO-${w.number}`, {
    vendor: w.vendor.name,
    email: w.vendor.email,
    dueAt: w.dueAt,
  });

  // 3. System notification
  await db.notification.create({
    data: {
      orgId: s.orgId,
      kind: "vendor_sla_dispatched",
      title: `SLA Notice Dispatched: WO-${w.number}`,
      body: note,
      href: `/app/work-orders/${w.id}`,
    },
  });

  return { ok: true, vendor: w.vendor.name, email: w.vendor.email, dispatchedAt: now };
});
