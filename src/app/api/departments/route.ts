import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { dimensionMetrics } from "@/lib/services/analytics";
export const GET = handle(async () => dimensionMetrics((await requireSession("department:read")).orgId, "department"));
