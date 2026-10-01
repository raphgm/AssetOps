import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { assetByToken, qrSvg } from "@/lib/services/qr";

export const GET = handle(async (req, ctx: { params: Promise<{ token: string }> }) => {
  const s = await requireSession("asset:read");
  const a = await assetByToken((await ctx.params).token);
  if (!a || a.orgId !== s.orgId) throw new Error("Asset not found.");
  return new Response(await qrSvg(new URL(req.url).origin, a.qrToken), { headers: { "content-type": "image/svg+xml", "cache-control": "private, max-age=3600" } });
});
