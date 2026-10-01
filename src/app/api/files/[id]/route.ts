import { readFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { UPLOAD_DIR } from "@/lib/uploads";

// Authorised download: attachments are never served statically.
export const GET = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const s = await requireSession("maintenance:read");
  const a = await db.attachment.findFirst({ where: { id: (await ctx.params).id, orgId: s.orgId } });
  if (!a) throw new Error("File not found.");
  const buf = await readFile(path.join(UPLOAD_DIR, a.orgId, a.filename));
  return new Response(new Uint8Array(buf), { headers: { "content-type": a.mime, "content-disposition": `inline; filename="${a.originalName}"`, "x-content-type-options": "nosniff", "content-security-policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'", "cache-control": "private, max-age=600" } });
});
