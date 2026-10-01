import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { overview } from "@/lib/services/analytics";
export const GET = handle(async () => overview((await requireSession("analytics:read")).orgId));
