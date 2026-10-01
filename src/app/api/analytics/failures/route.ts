import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { failurePatterns } from "@/lib/services/analytics";
export const GET = handle(async (req) => failurePatterns((await requireSession("analytics:read")).orgId, Math.min(730, Number(new URL(req.url).searchParams.get("days")) || 90)));
