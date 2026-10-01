import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { buildReport } from "@/lib/services/reports";
import { toCsv, csvResponse } from "@/lib/csv";
import { audit } from "@/lib/audit";
import { actorOf } from "@/lib/services/assets";

export const GET = handle(async (_req, ctx: { params: Promise<{ kind: string }> }) => {
  const s = await requireSession();
  const kind = (await ctx.params).kind;
  const r = await buildReport(s, kind);
  await audit(actorOf(s), "report.exported", "Report", kind, undefined, { rows: r.rows.length });
  return csvResponse(`${kind}-${new Date().toISOString().slice(0, 10)}.csv`, toCsv([r.headers, ...r.rows]));
});
