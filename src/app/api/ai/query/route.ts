import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { runIntelligence } from "@/lib/ai/engine";
import { rateLimit } from "@/lib/ratelimit";
import { UserError } from "@/lib/rbac";

export const POST = handle(async (req) => {
  const s = await requireSession("ai:use");
  if (!rateLimit(`ai:${s.userId}`, 20, 60_000)) throw new UserError("Too many AI requests. Please wait a moment.");
  const { question } = z.object({ question: z.string().trim().min(3).max(500) }).parse(await req.json());
  const r = await runIntelligence(s, question);
  return { id: r.investigation.id, status: r.investigation.status, intent: r.intent, result: r.outcome.status === "ok" ? r.outcome.result : null, message: r.outcome.status === "ok" ? null : r.outcome.message, evidence: r.evidence };
});
