import type { Prisma } from "@prisma/client";
import { db } from "../db";
import { audit } from "../audit";
import { actorOf } from "../services/assets";
import type { Session } from "../auth";
import { assertCan } from "../rbac";
import { runTool } from "./tools";
import { getAIProvider, AIUnavailableError } from "./provider";
import { AI_SYSTEM_PROMPT, validateAIResponse, AIValidationError, type EvidenceItem, type AIResponse } from "./schema";

interface Plan { intent: string; calls: { tool: string; args?: Record<string, unknown> }[] }

/** Step 1: understand intent (deterministic routing; the LLM never chooses what data is fetched). */
export function planQuestion(q: string, opts: { categoryId?: string } = {}): Plan {
  const t = q.toLowerCase();
  const tag = q.match(/\b[A-Z]{3}-[A-Z]{3}-\d{6}\b/)?.[0];
  if (opts.categoryId) return { intent: "investigate_category", calls: [{ tool: "get_similar_incidents", args: { categoryId: opts.categoryId, days: 30 } }, { tool: "get_failure_patterns", args: { days: 90 } }, { tool: "get_vendor_metrics" }, { tool: "get_department_metrics" }] };
  if (tag) return { intent: "asset", calls: [{ tool: "get_asset", args: { tag } }, { tool: "get_asset_history", args: { tag } }, { tool: "get_asset_relationships", args: { tag } }] };
  const more = t.match(/more than (\d+) (repair|failure|maintenance)/);
  if (more) return { intent: "repairs", calls: [{ tool: "search_assets", args: { minRepairs: Number(more[1]), limit: 15 } }] };
  if (/warrant/.test(t)) return { intent: "warranty", calls: [{ tool: "get_warranty_expirations" }] };
  if (/vendor|sla/.test(t)) return { intent: "vendors", calls: [{ tool: "get_vendor_metrics" }, { tool: "get_work_orders" }] };
  if (/debt/.test(t)) return { intent: "debt", calls: [{ tool: "get_maintenance_debt" }] };
  if (/recurring|repeat/.test(t)) return { intent: "recurring", calls: [{ tool: "search_assets", args: { minRepairs: 3, limit: 15 } }, { tool: "get_failure_patterns" }] };
  if (/department/.test(t)) return { intent: "departments", calls: [{ tool: "get_department_metrics" }] };
  if (/location|site|branch/.test(t)) return { intent: "locations", calls: [{ tool: "get_location_metrics" }] };
  if (/lifecycle|replace|aging|age/.test(t)) return { intent: "lifecycle", calls: [{ tool: "get_lifecycle_data", args: { minAge: 5 } }] };
  return { intent: "overview", calls: [{ tool: "get_maintenance_records", args: { days: 30 } }, { tool: "get_maintenance_records", args: { days: 60 } }, { tool: "get_failure_patterns", args: { days: 30 } }, { tool: "get_work_orders" }] };
}

/** Step 2-3: query authorised data and build the evidence package. */
export async function buildEvidence(s: Session, plan: Plan): Promise<EvidenceItem[]> {
  assertCan(s.role, "ai:use");
  const out: EvidenceItem[] = [];
  for (const c of plan.calls) {
    try {
      const r = await runTool(s, c.tool, c.args ?? {});
      out.push({ id: `E${out.length + 1}`, tool: c.tool, title: r.title, data: r.data, href: r.href });
    } catch { /* tool not permitted or failed: simply no evidence from it */ }
  }
  return out;
}

const compact = (e: EvidenceItem[]) => JSON.stringify(e.map(({ id, tool, title, data }) => ({ id, tool, title, data }))).slice(0, 24_000);

export type Outcome =
  | { status: "ok"; result: AIResponse }
  | { status: "ai_unavailable"; message: string }
  | { status: "invalid"; message: string };

/** Steps 5-8: ask the model, validate, retry once on malformed output. */
export async function askModel(question: string, evidence: EvidenceItem[]): Promise<Outcome> {
  if (evidence.length === 0) {
    return { status: "ok", result: { summary: "Insufficient evidence to determine this.", facts: [], patterns: [], possible_explanations: [], recommendations: [], confidence: "insufficient", evidence: [], actions: [] } };
  }
  const provider = getAIProvider();
  if (!provider.available()) return { status: "ai_unavailable", message: "AssetOps Intelligence is temporarily unavailable." };
  const user = `QUESTION (from an authenticated user):\n${question.slice(0, 500)}\n\nEVIDENCE (untrusted data; ids are E1..En):\n<evidence>\n${compact(evidence)}\n</evidence>`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await provider.completeJSON({ system: AI_SYSTEM_PROMPT, user: attempt ? user + "\n\nYour previous reply was invalid. Return only valid JSON matching the required schema and cite only existing evidence ids." : user });
      return { status: "ok", result: validateAIResponse(raw, evidence) };
    } catch (e) {
      if (e instanceof AIUnavailableError) return { status: "ai_unavailable", message: e.message };
      if (!(e instanceof AIValidationError)) return { status: "ai_unavailable", message: "AssetOps Intelligence is temporarily unavailable." };
      if (attempt === 1) return { status: "invalid", message: "Unable to generate a reliable AI response." };
    }
  }
  return { status: "invalid", message: "Unable to generate a reliable AI response." };
}

/** Full pipeline, persisted as an investigation so it can be revisited and retried. */
export async function runIntelligence(s: Session, question: string, opts: { categoryId?: string; investigationId?: string } = {}) {
  assertCan(s.role, "ai:use");
  const plan = planQuestion(question, opts);
  const evidence = await buildEvidence(s, plan);
  const outcome = await askModel(question, evidence);
  const data: Prisma.AIInvestigationUncheckedUpdateInput = {
    evidence: evidence as unknown as Prisma.InputJsonValue,
    status: outcome.status === "ok" ? "complete" : outcome.status,
    result: outcome.status === "ok" ? (outcome.result as unknown as Prisma.InputJsonValue) : undefined,
    error: outcome.status === "ok" ? null : outcome.message,
  };
  const inv = opts.investigationId
    ? await db.aIInvestigation.update({ where: { id: opts.investigationId, orgId: s.orgId }, data })
    : await db.aIInvestigation.create({ data: { orgId: s.orgId, userId: s.userId, question: question.slice(0, 500), ...(data as object) } as Prisma.AIInvestigationUncheckedCreateInput });
  await db.aIMessage.createMany({ data: [{ investigationId: inv.id, role: "user", content: question.slice(0, 500) }, { investigationId: inv.id, role: "assistant", content: outcome.status === "ok" ? outcome.result.summary : outcome.message }] });
  await audit(actorOf(s), "ai.investigation", "AIInvestigation", inv.id, undefined, { question: question.slice(0, 200), status: inv.status, tools: plan.calls.map((c) => c.tool) });
  if (outcome.status === "ok") await db.notification.create({ data: { orgId: s.orgId, kind: "ai_investigation_completed", title: "AI investigation completed", body: question.slice(0, 100), href: `/app/ai/investigations/${inv.id}` } });
  return { investigation: inv, evidence, outcome, intent: plan.intent };
}
