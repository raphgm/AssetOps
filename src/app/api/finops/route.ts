import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { getFinOpsMetrics } from "@/lib/engines/finops";
import { toCsv, csvResponse } from "@/lib/csv";

export const GET = handle(async (req) => {
  const s = await requireSession("analytics:read");
  const url = new URL(req.url);
  const data = await getFinOpsMetrics(s.orgId);

  if (url.searchParams.get("format") === "csv") {
    const rows = [
      ["Tag", "Model", "Type", "Location", "Acquisition (NGN)", "Replacement (NGN)", "Lifetime Maintenance (NGN)", "Repair-to-Replace Ratio (%)", "FinOps Recommendation"],
      ...data.irrationalRepairs.map((r) => [
        r.tag,
        r.model,
        r.type,
        r.location,
        r.acquisitionValue,
        r.replacementCost,
        r.lifetimeCost,
        r.ratio,
        r.recommendation,
      ]),
    ];
    return csvResponse("hardware-finops-report.csv", toCsv(rows));
  }

  return data;
});
