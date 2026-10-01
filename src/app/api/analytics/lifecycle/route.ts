import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { lifecycleScenario } from "@/lib/services/analytics";
export const GET = handle(async (req) => lifecycleScenario((await requireSession("analytics:read")).orgId, Math.max(1, Math.min(15, Number(new URL(req.url).searchParams.get("age")) || 5))));
