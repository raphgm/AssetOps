import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { buildReport } from "@/lib/services/reports";
import { toCsv, csvResponse } from "@/lib/csv";
import { audit } from "@/lib/audit";
import { actorOf } from "@/lib/services/assets";
import * as XLSX from "xlsx";

export const GET = handle(async (req, ctx: { params: Promise<{ kind: string }> }) => {
  const s = await requireSession();
  const kind = (await ctx.params).kind;
  const r = await buildReport(s, kind);
  await audit(actorOf(s), "report.exported", "Report", kind, undefined, { rows: r.rows.length });

  const url = new URL(req.url);
  const isExcel = url.searchParams.get("format") === "excel" || url.searchParams.get("format") === "xlsx";

  if (isExcel) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([r.headers, ...r.rows]);
    XLSX.utils.book_append_sheet(wb, ws, "Compliance Audit");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${kind}-audit-${new Date().toISOString().slice(0, 10)}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return csvResponse(`${kind}-${new Date().toISOString().slice(0, 10)}.csv`, toCsv([r.headers, ...r.rows]));
});
