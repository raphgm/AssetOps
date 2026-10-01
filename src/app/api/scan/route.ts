import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { assetScope } from "@/lib/services/assets";

// Resolve a scanned value (scan URL, token or asset tag) to a QR token the caller is allowed to see.
export const GET = handle(async (req) => {
  const s = await requireSession("asset:read");
  let code = (new URL(req.url).searchParams.get("code") ?? "").trim();
  const m = code.match(/\/scan\/([\w-]+)/); if (m) code = m[1];
  const a = await db.asset.findFirst({ where: assetScope(s, { OR: [{ qrToken: code }, { tag: code.toUpperCase() }] }), select: { qrToken: true } });
  if (!a) throw new Error("Asset not found.");
  return { token: a.qrToken };
});
