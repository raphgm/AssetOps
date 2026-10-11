import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { UserError } from "@/lib/rbac";

export const POST = handle(async (_req, { params }: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("workorder:create");
  const { id } = await params;

  const sched = await db.preventativeSchedule.findFirst({
    where: { id, orgId: s.orgId },
  });
  if (!sched) throw new UserError("Schedule not found.");

  const where: any = {
    orgId: s.orgId,
    status: { in: ["OPERATIONAL", "AT_RISK"] },
    deletedAt: null,
  };
  if (sched.typeId) where.typeId = sched.typeId;
  if (sched.locationId) where.locationId = sched.locationId;

  const targetAssets = await db.asset.findMany({
    where,
    take: 50, // batch limit per preventative run
  });

  if (targetAssets.length === 0) {
    throw new UserError("No active operational assets match this preventative criteria.");
  }

  // Get next work order number
  const lastWo = await db.workOrder.findFirst({
    where: { orgId: s.orgId },
    orderBy: { number: "desc" },
    select: { number: true },
  });
  let nextNumber = (lastWo?.number ?? 20000) + 1;

  const now = new Date();
  const dueAt = new Date(now.getTime() + 7 * 86400 * 1000); // 7-day window

  const createdWos = await db.$transaction(
    targetAssets.map((asset) => {
      const num = nextNumber++;
      return db.workOrder.create({
        data: {
          orgId: s.orgId,
          number: num,
          title: `[PM] ${sched.title} - ${asset.tag}`,
          description: `Scheduled preventative maintenance: ${sched.description || sched.title}`,
          status: "OPEN",
          priority: "MEDIUM",
          assetId: asset.id,
          reporterId: s.userId,
          slaHours: 120,
          dueAt,
          fleetKey: `pm-${sched.id}-${now.getTime()}`,
        },
      });
    })
  );

  // Advance next due date
  const nextDue = new Date();
  nextDue.setMonth(nextDue.getMonth() + sched.frequencyMonths);

  await db.preventativeSchedule.update({
    where: { id },
    data: {
      lastRunAt: now,
      nextDueAt: nextDue,
    },
  });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "preventative.dispatched",
    "PreventativeSchedule",
    sched.id,
    undefined,
    { workOrdersCreated: createdWos.length, nextDueAt: nextDue }
  );

  return {
    success: true,
    workOrdersCreated: createdWos.length,
    nextDueAt: nextDue,
  };
});
