import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { handle } from "@/lib/api";
import { getFinOpsMetrics } from "@/lib/engines/finops";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const s = await requireSession();
  if (!can(s.role, "report:read")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const { focusSample } = await getFinOpsMetrics(s.orgId);

  // CSV headers according to FOCUS v1.0 specification
  const headers = [
    "ResourceId",
    "ResourceName",
    "ResourceType",
    "ProviderName",
    "ServiceCategory",
    "SubAccountName",
    "Region",
    "ChargeCategory",
    "BilledCost",
    "EffectiveCost",
    "Currency",
    "ChargePeriodStart",
  ];

  const rows = focusSample.map((r) => [
    `"${r.ResourceId}"`,
    `"${r.ResourceName.replace(/"/g, '""')}"`,
    `"${r.ResourceType}"`,
    `"${r.ProviderName}"`,
    `"${r.ServiceCategory}"`,
    `"${r.SubAccountName}"`,
    `"${r.Region}"`,
    `"${r.ChargeCategory}"`,
    r.BilledCost,
    r.EffectiveCost,
    `"${r.Currency}"`,
    `"${r.ChargePeriodStart}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="assetops-focus-v1.0-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
});
