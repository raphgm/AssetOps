import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Card, Forbidden, PageHeader, Source, Badge } from "@/components/ui";
import { RunScheduleButton, NewScheduleModal } from "@/components/PreventativeClient";

export const dynamic = "force-dynamic";

export default async function PreventativeMaintenancePage() {
  const s = await requireSession();
  if (!can(s.role, "maintenance:read")) return <Forbidden what="preventative maintenance" />;

  const [schedules, types, locations] = await Promise.all([
    db.preventativeSchedule.findMany({
      where: { orgId: s.orgId },
      include: { type: true, location: true },
      orderBy: { nextDueAt: "asc" },
    }),
    db.assetType.findMany({ where: { orgId: s.orgId }, select: { id: true, name: true } }),
    db.location.findMany({ where: { orgId: s.orgId }, select: { id: true, name: true } }),
  ]);

  const now = new Date();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Preventative Maintenance (PM)"
        subtitle="Automate scheduled hardware inspections, UPS battery checks, and routine servicing before failures occur."
        actions={
          can(s.role, "maintenance:write") ? (
            <NewScheduleModal types={types} locations={locations} />
          ) : null
        }
      />

      <Card pad={false} right={<Source kind="record" />}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">Preventative maintenance schedules</caption>
            <thead>
              <tr>
                <th className="th">Schedule</th>
                <th className="th">Target Scope</th>
                <th className="th">Frequency</th>
                <th className="th">Last Serviced</th>
                <th className="th">Next Due</th>
                <th className="th">Status</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="td text-center text-mute py-8">
                    No preventative schedules created yet. Click "+ Add PM Schedule" to set up recurring maintenance routines.
                  </td>
                </tr>
              ) : (
                schedules.map((sc) => {
                  const isOverdue = new Date(sc.nextDueAt) < now;
                  const daysLeft = Math.ceil(
                    (new Date(sc.nextDueAt).getTime() - now.getTime()) / (1000 * 86400)
                  );

                  return (
                    <tr key={sc.id} className="hover:bg-raised/50">
                      <td className="td">
                        <div className="font-medium text-fg">{sc.title}</div>
                        {sc.description && (
                          <div className="text-[11px] text-dim line-clamp-1">
                            {sc.description}
                          </div>
                        )}
                      </td>
                      <td className="td text-xs">
                        {sc.type?.name ? (
                          <Badge tone="accent">{sc.type.name}</Badge>
                        ) : (
                          <span className="text-dim">All types</span>
                        )}
                        {" • "}
                        {sc.location?.name ? (
                          <span className="text-fg">{sc.location.name}</span>
                        ) : (
                          <span className="text-dim">All sites</span>
                        )}
                      </td>
                      <td className="td text-mute tabular-nums">
                        Every {sc.frequencyMonths} month{sc.frequencyMonths === 1 ? "" : "s"}
                      </td>
                      <td className="td text-mute text-xs">
                        {sc.lastRunAt
                          ? new Date(sc.lastRunAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Never"}
                      </td>
                      <td className="td text-xs font-medium">
                        {new Date(sc.nextDueAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="td">
                        {isOverdue ? (
                          <Badge tone="bad">Overdue ({Math.abs(daysLeft)}d)</Badge>
                        ) : daysLeft <= 14 ? (
                          <Badge tone="warn">Due in {daysLeft}d</Badge>
                        ) : (
                          <Badge tone="ok">Scheduled</Badge>
                        )}
                      </td>
                      <td className="td">
                        {can(s.role, "workorder:create") ? (
                          <RunScheduleButton id={sc.id} title={sc.title} />
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
