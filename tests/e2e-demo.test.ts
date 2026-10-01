/**
 * End-to-end demo scenario at the service layer:
 * anomaly → investigation (evidence + AI) → fleet inspection → technician scans, works, resolves
 * with part/cost → verify → close → history, metrics and audit all update. No manual DB edits.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { makeWorld, addRecords, daysAgo, type World } from "./world";
import * as A from "@/lib/services/analytics";
import { runIntelligence } from "@/lib/ai/engine";
import { setAIProvider } from "@/lib/ai/provider";
import { createFleetInspection, transitionWorkOrder } from "@/lib/services/workorders";
import { assetByToken } from "@/lib/services/qr";

let W: World; const mgr = () => W.sessions.ICT_MANAGER; const tech = () => W.sessions.TECHNICIAN;
beforeAll(async () => {
  W = await makeWorld("E2E", { assets: 6 });
  for (const a of W.assets) { await addRecords(W, a.id, 6, "Printer", 25); await db.maintenanceRecord.createMany({ data: [60, 85].map((d) => ({ orgId: W.orgId, assetId: a.id, categoryId: W.catIds.Printer, description: "older", performedAt: daysAgo(d), vendorId: W.vendorId })) }); }
});
afterAll(() => setAIProvider(null));

describe("demo scenario", () => {
  it("runs the whole story end to end", async () => {
    // 1-2. Dashboard detects the anomaly from real records
    const before = await A.overview(W.orgId);
    expect(before.anomalies).toHaveLength(1); const an = before.anomalies[0];
    expect(an).toMatchObject({ category: "Printer", recent: 36, departments: 2, locations: 1 });
    const spendBefore = before.spend12m, wosBefore = before.openWorkOrders;

    // 3-5. Investigation retrieves evidence; AI (stubbed provider) explains using only cited evidence
    setAIProvider({ name: "stub", available: () => true, completeJSON: async ({ user }) => {
      const ev = JSON.parse(user.split("<evidence>")[1].split("</evidence>")[0]) as { id: string; tool: string }[];
      const id = ev.find((e) => e.tool === "get_similar_incidents")!.id;
      return JSON.stringify({ summary: "Printer failures are concentrated on one vendor and model.", facts: [{ text: "36 printer incidents in 30 days", refs: [id] }], patterns: ["Single vendor"], possible_explanations: ["Possible common defect (unconfirmed)"], recommendations: ["Create a fleet inspection"], confidence: "medium", evidence: [id], actions: [{ type: "create_fleet_inspection", label: "Create fleet inspection" }] });
    } });
    const inv = await runIntelligence(mgr(), "Why did printer maintenance increase?", { categoryId: an.categoryId });
    expect(inv.outcome.status).toBe("ok"); expect(inv.evidence.map((e) => e.tool)).toContain("get_similar_incidents");

    // 6-8. Open the affected asset, create (fleet) work orders and assign a technician
    const wos = await createFleetInspection(mgr(), an.assetIds, "Fleet inspection: printer failures", "fleet-printer");
    expect(wos).toHaveLength(6);
    const wo = wos[0]; const asset = W.assets.find((a) => a.id === wo.assetId)!;
    await transitionWorkOrder(mgr(), wo.id, { to: "ASSIGNED", assigneeId: tech().userId });

    // 9. Technician scans the QR, starts work
    expect((await assetByToken(asset.qrToken))?.id).toBe(asset.id);
    await transitionWorkOrder(tech(), wo.id, { to: "IN_PROGRESS" });

    // 10-12. Add part, cost, evidence; resolve (creates immutable record)
    const countBefore = (await db.asset.findUniqueOrThrow({ where: { id: asset.id } })).maintenanceCount;
    const res = await transitionWorkOrder(tech(), wo.id, { to: "RESOLVED", resolution: { categoryId: W.catIds.Printer, resolution: "Replaced paper-feed roller", laborCost: 15000, downtimeHours: 2, parts: [{ name: "Feed roller kit", quantity: 1, unitCost: 22000 }] } });
    const att = await db.attachment.create({ data: { orgId: W.orgId, recordId: res.recordId!, filename: "abc.jpg", originalName: "roller.jpg", mime: "image/jpeg", size: 1234 } });
    expect(att.recordId).toBe(res.recordId);

    // 13-15. Manager verifies and closes
    await transitionWorkOrder(mgr(), wo.id, { to: "VERIFIED" }); await transitionWorkOrder(mgr(), wo.id, { to: "CLOSED" });

    // 16-18. Asset history, dashboard metrics, audit trail all reflect it
    const after = await db.asset.findUniqueOrThrow({ where: { id: asset.id } });
    expect(after.maintenanceCount).toBe(countBefore + 1);
    const hist = await db.maintenanceRecord.findFirstOrThrow({ where: { assetId: asset.id }, orderBy: { createdAt: "desc" }, include: { partUsages: { include: { part: true } } } });
    expect(hist.resolution).toBe("Replaced paper-feed roller"); expect(hist.partUsages[0].part.name).toBe("Feed roller kit"); expect(hist.laborCost + hist.partsCost).toBe(37000);
    const dash = await A.overview(W.orgId);
    expect(dash.spend12m).toBe(spendBefore + 37000); expect(dash.openWorkOrders).toBe(wosBefore + 5);
    const actions = (await db.auditLog.findMany({ where: { orgId: W.orgId } })).map((l) => l.action);
    expect(actions).toEqual(expect.arrayContaining(["ai.investigation", "workorder.created", "workorder.assigned", "workorder.in_progress", "workorder.resolved", "workorder.verified", "workorder.closed", "maintenance.recorded"]));
  });
});
