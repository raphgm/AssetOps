import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { assetGraph } from "@/lib/services/graph";
export const GET = handle(async (req) => assetGraph(await requireSession("asset:read"), new URL(req.url).searchParams.get("asset") ?? undefined));
