import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { trend, type Range } from "@/lib/services/analytics";
export const GET = handle(async (req) => {
  const s = await requireSession("analytics:read");
  const r = new URL(req.url).searchParams.get("range") as Range;
  return trend(s.orgId, ["7D", "30D", "90D", "12M"].includes(r) ? r : "30D");
});
