import { describe, it, expect, beforeAll } from "vitest";
import { db } from "@/lib/db";
import { makeWorld, addRecords, daysAgo, type World } from "./world";
import { createAsset, assignAsset, assetScope, recomputeAsset, updateAsset } from "@/lib/services/assets";
import { createMaintenanceRecord } from "@/lib/services/maintenance";
import { createWorkOrder, transitionWorkOrder } from "@/lib/services/workorders";
import { assetByToken, qrSvg, scanPath } from "@/lib/services/qr";
import * as A from "@/lib/services/analytics";
import { analyze, parseFile } from "@/lib/services/import";
import { buildReport } from "@/lib/services/reports";
import { audit } from "@/lib/audit";

let A_: World, B_: World;
beforeAll(async () => { A_ = await makeWorld("A", { assets: 4 }); B_ = await makeWorld("B", { assets: 2 }); });

describe("asset creation & assignment", () => {
  it("creates an asset with a secure QR token and audit entry", async () => {
    const s = A_.sessions.ICT_MANAGER;
    const a = await createAsset(s, { tag: "ICT-LAG-009001", make: "Dell", model: "Latitude 7440", typeId: A_.typeId, departmentId: A_.deptId, locationId: A_.locId, acquiredAt: "2024-05-01", acquisitionValue: 1200000 });
    expect(a.qrToken.length).toBeGreaterThanOrEqual(20); expect(a.qrToken).not.toContain(a.id);
    expect(await db.auditLog.count({ where: { orgId: A_.orgId, action: "asset.created", entityId: "ICT-LAG-009001" } })).toBe(1);
  });
  it("rejects duplicate tags and invalid input", async () => {
    const s = A_.sessions.ICT_MANAGER; const ok = { make: "x", model: "y", typeId: A_.typeId, departmentId: A_.deptId, locationId: A_.locId, acquiredAt: "2024-05-01" };
    await expect(createAsset(s, { ...ok, tag: "ICT-LAG-009001" })).rejects.toThrow(/already exists/);
    await expect(createAsset(s, { ...ok, tag: "bad tag!" })).rejects.toThrow();
  });
  it("refuses to attach another organisation's department/location (tenant isolation)", async () => {
    await expect(createAsset(A_.sessions.ICT_MANAGER, { tag: "ICT-LAG-009002", make: "x", model: "y", typeId: A_.typeId, departmentId: B_.deptId, locationId: A_.locId, acquiredAt: "2024-05-01" })).rejects.toThrow(/Invalid/);
  });
  it("tracks assignment history and audits the change", async () => {
    const s = A_.sessions.ICT_MANAGER; const id = A_.assets[0].id;
    await assignAsset(s, id, "Chidi Okonkwo"); await assignAsset(s, id, "Ngozi Adekunle");
    const rows = await db.assetAssignment.findMany({ where: { assetId: id }, orderBy: { fromDate: "asc" } });
    expect(rows).toHaveLength(2); expect(rows[0].toDate).not.toBeNull(); expect(rows[1].toDate).toBeNull();
    const log = await db.auditLog.findFirst({ where: { orgId: A_.orgId, action: "asset.assignment_changed", entityId: A_.assets[0].tag }, orderBy: { at: "desc" } });
    expect(log?.before).toEqual({ assignee: "Chidi Okonkwo" }); expect(log?.after).toEqual({ assignee: "Ngozi Adekunle" });
  });
  it("records status history when status changes", async () => {
    await updateAsset(A_.sessions.ICT_MANAGER, A_.assets[1].id, { status: "RETIRED" });
    expect(await db.assetStatusHistory.count({ where: { assetId: A_.assets[1].id, to: "RETIRED" } })).toBe(1);
  });
});

describe("maintenance records", () => {
  it("creates a record, updates counters/health/risk/analytics and audits it", async () => {
    const s = A_.sessions.TECHNICIAN; const asset = A_.assets[2];
    const before = await db.asset.findUniqueOrThrow({ where: { id: asset.id } });
    const rec = await createMaintenanceRecord(s, { assetId: asset.id, categoryId: A_.catIds.Printer, description: "Paper-feed roller worn", resolution: "Replaced roller", laborCost: 15000, downtimeHours: 6, parts: [{ name: "Feed roller", quantity: 2, unitCost: 8000 }] });
    expect(rec.partsCost).toBe(16000);
    const after = await db.asset.findUniqueOrThrow({ where: { id: asset.id } });
    expect(after.maintenanceCount).toBe(before.maintenanceCount + 1); expect(after.lifetimeCost).toBe(31000); expect(after.downtimeHours).toBe(6);
    expect(after.healthScore).toBeLessThan(before.healthScore); expect(after.lastMaintenanceAt).not.toBeNull();
    expect(await db.partUsage.count({ where: { recordId: rec.id } })).toBe(1);
    expect(await db.auditLog.count({ where: { orgId: A_.orgId, action: "maintenance.recorded", entityId: asset.tag } })).toBe(1);
    expect(rec.technicianId).toBe(s.userId);
  });
  it("is append-only: the service layer exposes no update/delete path", async () => {
    const mod = await import("@/lib/services/maintenance");
    expect(Object.keys(mod).filter((k) => /update|delete|remove|edit/i.test(k))).toEqual([]);
  });
  it("rejects cross-tenant assets, categories and negative costs", async () => {
    const s = A_.sessions.ICT_MANAGER;
    await expect(createMaintenanceRecord(s, { assetId: B_.assets[0].id, categoryId: A_.catIds.Printer, description: "x y z" })).rejects.toThrow(/not found/i);
    await expect(createMaintenanceRecord(s, { assetId: A_.assets[0].id, categoryId: B_.catIds.Printer, description: "x y z" })).rejects.toThrow(/Invalid category/);
    await expect(createMaintenanceRecord(s, { assetId: A_.assets[0].id, categoryId: A_.catIds.Printer, description: "x y z", laborCost: -5 })).rejects.toThrow();
  });
  it("raises a notification when risk crosses into attention", async () => {
    const w = await makeWorld("N", { assets: 1 }); const a = w.assets[0];
    await addRecords(w, a.id, 5, "Printer", 25, { cost: 90000, downtime: 40 });
    await createMaintenanceRecord(w.sessions.ICT_MANAGER, { assetId: a.id, categoryId: w.catIds.Printer, description: "Another failure", laborCost: 90000, downtimeHours: 40 });
    const asset = await db.asset.findUniqueOrThrow({ where: { id: a.id } });
    expect(asset.riskScore).toBeGreaterThanOrEqual(60); expect(asset.status).toBe("AT_RISK");
    expect(await db.notification.count({ where: { orgId: w.orgId, kind: "asset_risk_increased" } })).toBe(1);
  });
});

describe("work order lifecycle", () => {
  it("runs create → assign → start → resolve → verify → close with timestamped events, record and audit", async () => {
    const mgr = A_.sessions.ICT_MANAGER, tech = A_.sessions.TECHNICIAN, asset = A_.assets[3];
    const wo = await createWorkOrder(mgr, { title: "Battery failure", assetId: asset.id, priority: "HIGH", categoryId: A_.catIds.Battery });
    expect(wo.status).toBe("OPEN"); expect(wo.slaHours).toBe(24); expect(wo.number).toBeGreaterThan(29000);
    await transitionWorkOrder(mgr, wo.id, { to: "ASSIGNED", assigneeId: tech.userId });
    await transitionWorkOrder(tech, wo.id, { to: "IN_PROGRESS" });
    const r = await transitionWorkOrder(tech, wo.id, { to: "RESOLVED", resolution: { categoryId: A_.catIds.Battery, resolution: "Replaced battery", laborCost: 12000, downtimeHours: 3, parts: [{ name: "Battery pack", quantity: 1, unitCost: 60000 }] } });
    expect(r.recordId).toBeTruthy();
    await transitionWorkOrder(mgr, wo.id, { to: "VERIFIED" }); await transitionWorkOrder(mgr, wo.id, { to: "CLOSED" });
    const done = await db.workOrder.findUniqueOrThrow({ where: { id: wo.id }, include: { events: { orderBy: { at: "asc" } }, records: true } });
    expect(done.status).toBe("CLOSED"); expect(done.closedAt).not.toBeNull(); expect(done.resolvedAt).not.toBeNull();
    expect(done.events.map((e) => e.type)).toEqual(expect.arrayContaining(["Created", "Assigned", "Started", "Resolved", "Verified", "Closed"]));
    expect(done.records[0].partsCost).toBe(60000);
    const logs = await db.auditLog.findMany({ where: { orgId: A_.orgId, entityId: `WO-${wo.number}` } });
    expect(logs.map((l) => l.action)).toEqual(expect.arrayContaining(["workorder.created", "workorder.assigned", "workorder.in_progress", "workorder.resolved", "workorder.verified", "workorder.closed"]));
    expect((await db.asset.findUniqueOrThrow({ where: { id: asset.id } })).maintenanceCount).toBeGreaterThanOrEqual(1);
  });
  it("rejects illegal transitions and permission violations", async () => {
    const mgr = A_.sessions.ICT_MANAGER, tech = A_.sessions.TECHNICIAN;
    const wo = await createWorkOrder(mgr, { title: "Net fault", assetId: A_.assets[0].id });
    await expect(transitionWorkOrder(mgr, wo.id, { to: "CLOSED" })).rejects.toThrow(/Cannot move/);
    await expect(transitionWorkOrder(tech, wo.id, { to: "ASSIGNED", assigneeId: tech.userId })).rejects.toThrow(/permission|access/i);
    await transitionWorkOrder(mgr, wo.id, { to: "ASSIGNED", assigneeId: tech.userId });
    await expect(transitionWorkOrder(A_.tech2, wo.id, { to: "IN_PROGRESS" })).rejects.toThrow(/not assigned to you/);
    await expect(transitionWorkOrder(mgr, wo.id, { to: "ASSIGNED", assigneeId: A_.sessions.AUDITOR.userId })).rejects.toThrow();
  });
  it("requires a resolution to resolve", async () => {
    const mgr = A_.sessions.ICT_MANAGER, tech = A_.sessions.TECHNICIAN;
    const wo = await createWorkOrder(mgr, { title: "Fault", assetId: A_.assets[0].id, assigneeId: tech.userId });
    await transitionWorkOrder(tech, wo.id, { to: "IN_PROGRESS" });
    await expect(transitionWorkOrder(tech, wo.id, { to: "RESOLVED" })).rejects.toThrow(/resolution/i);
  });
  it("lets a department user report an issue only against their own department", async () => {
    const dept = A_.sessions.DEPARTMENT_USER;
    const wo = await createWorkOrder(dept, { title: "Printer jams", assetId: A_.assets[0].id, priority: "CRITICAL" }, { asReport: true });
    expect(wo.priority).toBe("MEDIUM"); expect(wo.assigneeId).toBeNull();
    await expect(createWorkOrder(dept, { title: "Other dept", assetId: A_.assets[1].id }, { asReport: true })).rejects.toThrow(/not found/i);
    await expect(createWorkOrder(dept, { title: "x y z", assetId: A_.assets[0].id })).rejects.toThrow(/access|permission/i);
  });
});

describe("QR generation & scanning", () => {
  it("resolves a token to its asset and generates a scannable SVG that encodes only the token URL", async () => {
    const a = A_.assets[0]; const found = await assetByToken(a.qrToken);
    expect(found?.id).toBe(a.id);
    const svg = await qrSvg("https://app.example", a.qrToken);
    expect(svg).toContain("<svg"); expect(scanPath(a.qrToken)).toBe(`/scan/${a.qrToken}`); expect(svg).not.toContain(a.id);
  });
  it("unknown tokens resolve to nothing", async () => { expect(await assetByToken("nope")).toBeNull(); });
});

describe("tenant isolation", () => {
  it("asset scope never leaks across organisations", async () => {
    const aIds = (await db.asset.findMany({ where: assetScope(A_.sessions.SUPER_ADMIN), select: { id: true } })).map((x) => x.id);
    expect(aIds).not.toContain(B_.assets[0].id);
    expect(await db.asset.findFirst({ where: assetScope(A_.sessions.SUPER_ADMIN, { id: B_.assets[0].id }) })).toBeNull();
  });
  it("department users are further limited to their own department", async () => {
    const rows = await db.asset.findMany({ where: assetScope(A_.sessions.DEPARTMENT_USER) });
    expect(rows.length).toBeGreaterThan(0); rows.forEach((r) => expect(r.departmentId).toBe(A_.deptId));
  });
  it("work orders cannot be transitioned from another organisation", async () => {
    const wo = await createWorkOrder(A_.sessions.ICT_MANAGER, { title: "Private", assetId: A_.assets[0].id });
    await expect(transitionWorkOrder(B_.sessions.SUPER_ADMIN, wo.id, { to: "CANCELLED" })).rejects.toThrow(/not found/i);
  });
  it("analytics are organisation-scoped", async () => {
    const oa = await A.overview(A_.orgId), ob = await A.overview(B_.orgId);
    expect(ob.totalAssets).toBe(2); expect(oa.totalAssets).toBe(5); expect(ob.maintenanceEvents).toBe(0);
  });
  it("reports are scoped and permission-checked", async () => {
    const r = await buildReport(A_.sessions.AUDITOR, "asset-register");
    expect(r.rows.every((row) => String(row[0]).includes("PRN-LAG-A") || String(row[0]).startsWith("ICT-LAG-009001"))).toBe(true);
    await expect(buildReport(A_.sessions.TECHNICIAN, "asset-register")).rejects.toThrow();
  });
});

describe("analytics from the database", () => {
  let W: World;
  beforeAll(async () => {
    W = await makeWorld("V", { assets: 6 });
    const slow = await db.vendor.create({ data: { orgId: W.orgId, name: "Slow Vendor", slaHours: 24 } });
    // 10 work orders: vendor Kingsway resolves on time, Slow Vendor late
    for (let i = 0; i < 10; i++) {
      const late = i % 2 === 0; const created = daysAgo(20 - i);
      await db.workOrder.create({ data: { orgId: W.orgId, number: 40000 + i, title: "t", assetId: W.assets[i % 6].id, vendorId: late ? slow.id : W.vendorId, slaHours: 24, createdAt: created, dueAt: new Date(+created + 24 * 36e5), resolvedAt: new Date(+created + (late ? 48 : 10) * 36e5), status: "CLOSED" } });
    }
    await addRecords(W, W.assets[0].id, 4, "Printer", 60, { cost: 25000, downtime: 5 });   // asset 0 (Finance): recurring
    await addRecords(W, W.assets[1].id, 1, "Battery", 60, { cost: 5000, downtime: 1 });     // asset 1 (Legal)
    await db.workOrder.create({ data: { orgId: W.orgId, number: 40100, title: "overdue", assetId: W.assets[2].id, slaHours: 4, createdAt: daysAgo(3), dueAt: daysAgo(2), status: "IN_PROGRESS" } });
  });
  it("vendor SLA compliance and spend are calculated from work orders and records", async () => {
    const v = await A.vendorMetrics(W.orgId);
    const fast = v.find((x) => x.name === "Kingsway Technologies")!, slow = v.find((x) => x.name === "Slow Vendor")!;
    expect(slow.slaCompliance).toBe(0); expect(fast.slaCompliance).toBe(100); expect(slow.workOrders).toBe(5);
    expect(fast.spend12m).toBe(4 * 25000 + 5000); expect(fast.repeatRepairs).toBe(3);
  });
  it("department analytics aggregate assets, costs and repeat rate", async () => {
    const d = await A.dimensionMetrics(W.orgId, "department");
    const fin = d.find((x) => x.name === "Finance")!, legal = d.find((x) => x.name === "Legal")!;
    expect(fin.assets).toBe(3); expect(fin.cost12m).toBe(100000); expect(fin.repeatRate).toBe(100); expect(legal.cost12m).toBe(5000); expect(legal.repeatRate).toBe(0);
    expect(fin.openWorkOrders).toBe(1);
  });
  it("recurring failures and failure patterns come from records", async () => {
    expect((await A.recurringFailures(W.orgId)).assets).toBe(1);
    const f = await A.failurePatterns(W.orgId, 90); expect(f[0]).toMatchObject({ name: "Printer", count: 4 });
  });
  it("maintenance debt is computed from live overdue/recurring/aging/warranty data", async () => {
    const d = await A.maintenanceDebt(W.orgId);
    expect(d.overdue_work_orders).toBe(1); expect(d.recurring_failures).toBe(1); expect(d.label).toBe("estimate");
    expect(d.estimated_exposure).toBeGreaterThan(0);
  });
  it("detects a maintenance anomaly against baseline", async () => {
    const w = await makeWorld("X", { assets: 5 });
    for (const a of w.assets) await addRecords(w, a.id, 6, "Printer", 25);          // 30 recent
    for (const a of w.assets) await db.maintenanceRecord.createMany({ data: [60, 80, 100].map((d) => ({ orgId: w.orgId, assetId: a.id, categoryId: w.catIds.Printer, description: "old", performedAt: daysAgo(d) })) }); // baseline 5/mo
    const an = await A.detectAnomalies(w.orgId);
    expect(an).toHaveLength(1); expect(an[0]).toMatchObject({ category: "Printer", recent: 30 }); expect(an[0].departments).toBe(2); expect(an[0].vendors[0]).toBe("Kingsway Technologies");
    expect(await A.detectAnomalies(B_.orgId)).toHaveLength(0);
  });
  it("lifecycle scenario reflects asset ages", async () => {
    const r = await A.lifecycleScenario(W.orgId, 2);
    expect(r.scenario.assets).toBe(6); expect(r.scenario.replacementCost).toBe(6 * 500000);
  });
});

describe("import validation", () => {
  it("detects columns, flags every error class and never silently drops rows", async () => {
    const csv = ["Asset ID,Serial Number,Make,Model,Type,Department,Location,Acquired", "NEW-1,S1,HP,X,Printer,Finance,Lagos HQ,01/02/2023", "NEW-1,S2,HP,X,Printer,Finance,Lagos HQ,01/02/2023", ",S3,HP,X,Printer,Finance,Lagos HQ,01/02/2023", "NEW-4,,HP,X,Printer,Finance,Lagos HQ,01/02/2023", "NEW-5,S5,HP,X,Printer,Finance,Lagos HQ,not-a-date", `${A_.assets[0].tag},S6,HP,X,Printer,Finance,Lagos HQ,01/02/2023`].join("\n");
    const rows = parseFile("a.csv", Buffer.from(csv));
    const { analysis } = await analyze(A_.orgId, "assets", rows);
    expect(analysis.total).toBe(6); expect(analysis.valid).toBe(2); // NEW-1 and NEW-4 (missing serial is a warning)
    expect(analysis.counts).toMatchObject({ duplicate: 2, missing_id: 1, missing_serial: 1, invalid_date: 1 });
    expect(analysis.errors.length).toBe(5); expect(analysis.errors.find((e) => e.code === "invalid_date")?.row).toBe(6);
  });
  it("reports missing required columns", async () => {
    const { analysis } = await analyze(A_.orgId, "assets", parseFile("a.csv", Buffer.from("foo,bar\n1,2")));
    expect(analysis.missingRequired).toContain("tag"); expect(analysis.valid).toBe(0);
  });
  it("rejects unsupported file types and oversize files", () => {
    expect(() => parseFile("a.exe", Buffer.from("x"))).toThrow(/Unsupported/);
    expect(() => parseFile("a.csv", Buffer.alloc(11 * 1024 * 1024))).toThrow(/10 MB/);
  });
  it("validates maintenance imports against known assets and acquisition dates", async () => {
    const csv = ["Asset ID,Category,Description,Date", `${A_.assets[0].tag},Battery,Replaced,01/02/2025`, "UNKNOWN-1,Battery,Replaced,01/02/2025", `${A_.assets[0].tag},Battery,Replaced,01/02/2001`].join("\n");
    const { analysis } = await analyze(A_.orgId, "maintenance", parseFile("m.csv", Buffer.from(csv)));
    expect(analysis.valid).toBe(1); expect(analysis.counts).toMatchObject({ unknown_asset: 1, invalid_date: 1 });
  });
});

describe("audit logging", () => {
  it("is append-only by construction and records before/after", async () => {
    await audit({ id: A_.sessions.SUPER_ADMIN.userId, name: "Admin", orgId: A_.orgId, ip: "10.0.0.1" }, "test.event", "Thing", "T-1", { a: 1 }, { a: 2 });
    const row = await db.auditLog.findFirstOrThrow({ where: { orgId: A_.orgId, action: "test.event" } });
    expect(row).toMatchObject({ actorName: "Admin", ip: "10.0.0.1", before: { a: 1 }, after: { a: 2 } });
    const mod = await import("@/lib/audit"); expect(Object.keys(mod)).toEqual(["audit"]);
  });
});
