import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { vendorMetrics } from "@/lib/services/analytics";
export const GET = handle(async () => vendorMetrics((await requireSession("vendor:read")).orgId));
