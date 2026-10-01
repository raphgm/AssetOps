import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { toCsv, csvResponse } from "@/lib/csv";
export const GET = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("asset:import");
  const job = await db.importJob.findFirst({ where: { id: (await ctx.params).id, orgId: s.orgId } });
  if (!job) throw new Error("Import not found.");
  const errs = await db.importError.findMany({ where: { jobId: job.id }, orderBy: { row: "asc" } });
  return csvResponse(`import-errors-${job.id}.csv`, toCsv([["Row", "Field", "Code", "Message"], ...errs.map((e) => [e.row, e.field, e.code, e.message])]));
});
