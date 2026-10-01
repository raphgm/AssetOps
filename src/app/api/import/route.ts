import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { analyze, parseFile, runImport, type Kind } from "@/lib/services/import";
import { UserError } from "@/lib/rbac";
import { log } from "@/lib/log";

export const POST = handle(async (req) => {
  const s = await requireSession("asset:import");
  const fd = await req.formData();
  const file = fd.get("file"); const kind = String(fd.get("kind")) as Kind; const confirm = fd.get("confirm") === "1";
  if (!(file instanceof File)) throw new UserError("No file provided.");
  if (!["assets", "maintenance"].includes(kind)) throw new UserError("Invalid import type.");
  let rows;
  try { rows = parseFile(file.name, Buffer.from(await file.arrayBuffer())); } catch (e) { log.warn("import.parse_failed", { error: (e as Error).message }); throw e instanceof UserError ? e : new UserError("Could not read this file. Check that it is a valid CSV, XLSX or JSON file."); }
  if (!confirm) { const { analysis } = await analyze(s.orgId, kind, rows); return { ...analysis, errors: analysis.errors.slice(0, 200), errorTotal: analysis.errors.length }; }
  const r = await runImport(s, kind, file.name, rows);
  return { jobId: r.jobId, imported: r.imported, total: r.analysis.total, counts: r.analysis.counts, errorTotal: r.analysis.errors.length };
});
