import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
export const POST = handle(async () => { const s = await requireSession(); await db.notification.updateMany({ where: { orgId: s.orgId, readAt: null }, data: { readAt: new Date() } }); return { ok: true }; });
