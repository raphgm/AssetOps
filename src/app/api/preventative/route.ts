import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { UserError } from "@/lib/rbac";

const CreateScheduleSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().default(""),
  frequencyMonths: z.coerce.number().min(1).max(24).default(3),
  typeId: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
});

export const GET = handle(async () => {
  const s = await requireSession("maintenance:read");
  const schedules = await db.preventativeSchedule.findMany({
    where: { orgId: s.orgId },
    include: { type: true, location: true },
    orderBy: { nextDueAt: "asc" },
  });
  return schedules;
});

export const POST = handle(async (req) => {
  const s = await requireSession("maintenance:write");
  const body = CreateScheduleSchema.parse(await req.json());

  const nextDue = new Date();
  nextDue.setMonth(nextDue.getMonth() + body.frequencyMonths);

  const sched = await db.preventativeSchedule.create({
    data: {
      orgId: s.orgId,
      title: body.title,
      description: body.description,
      frequencyMonths: body.frequencyMonths,
      typeId: body.typeId || null,
      locationId: body.locationId || null,
      nextDueAt: nextDue,
    },
  });

  await audit(
    { id: s.userId, name: s.name, orgId: s.orgId },
    "preventative.created",
    "PreventativeSchedule",
    sched.id,
    undefined,
    { title: sched.title, frequencyMonths: sched.frequencyMonths }
  );

  return sched;
});
