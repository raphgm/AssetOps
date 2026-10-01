import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { monthlySeries } from "@/lib/services/analytics";
export const GET = handle(async () => monthlySeries((await requireSession("analytics:read")).orgId, {}));
