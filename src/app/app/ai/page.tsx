import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Forbidden, Status } from "@/components/ui";
import CopilotInput from "@/components/CopilotInput";
import { fmtDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function AI() {
  const s = await requireSession();
  if (!can(s.role, "ai:use")) return <Forbidden what="AI Copilot" />;
  const recent = await db.aIInvestigation.findMany({ where: { orgId: s.orgId, userId: s.userId }, orderBy: { createdAt: "desc" }, take: 6 });
  return (
    <div><CopilotInput />
      {recent.length > 0 && <div className="max-w-2xl mx-auto"><h2 className="text-[11px] uppercase tracking-widest text-dim mb-2">Recent investigations</h2><ul className="card divide-y divide-line">{recent.map((i) => <li key={i.id}><Link href={`/app/ai/investigations/${i.id}`} className="flex justify-between gap-3 px-4 py-2.5 hover:bg-raised/50"><span className="truncate">{i.question}</span><span className="text-dim text-xs shrink-0 flex gap-3"><Status value={i.status === "complete" ? "RESOLVED" : "OPEN"} label={i.status.replace("_", " ")} />{fmtDateTime(i.createdAt)}</span></Link></li>)}</ul></div>}
    </div>
  );
}
