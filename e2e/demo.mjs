// Browser E2E for the demo scenario. Requires: seeded demo DB + app on :3000.  Run: node e2e/demo.mjs
import { chromium } from "playwright-core";
import { writeFileSync } from "fs";
const BASE = process.env.BASE ?? "http://localhost:3000";
const exe = process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const b = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
const step = (m) => console.log("✓", m);
const login = async (page, email) => { await page.goto(BASE + "/sign-in"); await page.fill("#email", email); await page.fill("#password", "demo1234!"); await page.click("button.btn-primary"); await page.waitForURL(/\/app/); };
const mgrCtx = await b.newContext({ viewport: { width: 1360, height: 900 } }); const mgr = await mgrCtx.newPage();
const errors = []; mgr.on("pageerror", (e) => errors.push(e.message));

await login(mgr, "manager@assetops.local"); step("manager signed in");
// anomaly visible
await mgr.waitForSelector("text=Maintenance anomaly detected"); step("dashboard shows maintenance anomaly");
const spendBefore = await mgr.locator("text=trailing 12 months").locator("xpath=preceding-sibling::div").first().innerText();
// investigate
await mgr.click("button:has-text('Investigate') >> nth=0"); await mgr.waitForURL(/investigations\//, { timeout: 30000 });
await mgr.waitForSelector("text=Evidence"); step("investigation opened with evidence retrieved");
const body = await mgr.innerText("body");
if (!/Printer incidents|Printer incidents, last 30 days|incidents, last 30 days/.test(body)) throw new Error("evidence missing");
if (!/temporarily unavailable|Observed facts/.test(body)) throw new Error("neither AI answer nor graceful degradation shown");
step(/temporarily unavailable/.test(body) ? "AI unavailable → graceful degradation with evidence intact" : "AI analysis rendered");
// fleet inspection
await mgr.click("text=Create fleet inspection…"); await mgr.waitForSelector("text=Nothing is created until you confirm");
await mgr.click("button:has-text('Confirm & create')"); await mgr.waitForURL(/work-orders\?fleet=/); step("fleet inspection work orders created");
await mgr.click("a:has-text('Table')"); await mgr.waitForSelector("table");
const firstWo = mgr.locator("tbody tr td a").first(); const woNo = (await firstWo.innerText()).trim(); await firstWo.click(); await mgr.waitForSelector(`h1:has-text('${woNo}')`);
step(`opened ${woNo}`);
const woUrl = mgr.url();
const tech = (await mgr.locator("dd:has-text('Unassigned')").count()) ? null : null;
await mgr.selectOption("select[aria-label=Technician]", { label: "A. Ibrahim" }); await mgr.click("button:has-text('Assign')"); await mgr.waitForSelector("text=Assigned >> nth=0"); step("assigned to A. Ibrahim");

// technician
const tctx = await b.newContext({ viewport: { width: 390, height: 800 } }); const t = await tctx.newPage(); t.on("pageerror", (e) => errors.push(e.message));
await login(t, "technician@assetops.local"); await t.goto(BASE + "/app/technician"); await t.waitForSelector("text=My work"); step("technician mode loaded (mobile)");
await t.goto(woUrl); await t.click("button:has-text('Start work')"); await t.waitForSelector("a:has-text('Resolve')"); step("technician started work");
await t.click("a:has-text('Resolve')"); await t.waitForSelector("text=Resolve work order");
await t.fill("#description", "Paper-feed failure, roller worn"); await t.fill("#resolution", "Replaced paper-feed roller and tested 20 pages");
await t.fill("#laborCost", "15000"); await t.fill("#downtimeHours", "2");
await t.click("button:has-text('+ Add part')"); await t.fill("input[aria-label='Part name']", "Feed roller kit"); await t.fill("input[aria-label='Unit cost']", "22000");
// 1x1 PNG photo
writeFileSync("/tmp/claude-0/evidence.png", Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64"));
await t.setInputFiles("#files", "/tmp/claude-0/evidence.png");
await t.click("button:has-text('Resolve work order')");
await t.waitForSelector("text=Parts & cost recorded", { timeout: 45000 }).catch(async () => { throw new Error("resolve failed: " + (await t.locator("[role=alert]").allInnerTexts()).join(" | ")); }); step("technician resolved with part, cost and photo evidence");
await t.waitForSelector("a:has-text('evidence.png')"); step("photo attached to the record");

// manager verifies + closes
await mgr.goto(woUrl); await mgr.click("button:has-text('Verify resolution')"); await mgr.waitForSelector("button:has-text('Close')", { timeout: 15000 }).catch(async () => { throw new Error("verify failed: " + (await mgr.locator("[role=alert]").allInnerTexts()).join("|") + " :: " + (await mgr.innerText("h1 + p")) ); }); await mgr.click("button:has-text('Close')");
await mgr.waitForSelector("ol li:has-text('Closed')", { timeout: 15000 }); step("manager verified and closed");
// asset history updated
await mgr.click("a.font-mono"); await mgr.waitForSelector("text=Why this score?"); await mgr.click("a[role=tab]:has-text('Maintenance')");
await mgr.waitForSelector("text=Feed roller kit"); step("asset passport history shows the new record + part");
// dashboard + audit
await mgr.goto(BASE + "/app"); await mgr.waitForSelector("text=Requires attention"); step("dashboard recalculated");
const dctx = await b.newContext(); const d = await dctx.newPage(); await login(d, "demo@assetops.local"); await d.goto(BASE + "/app/audit");
for (const [action, text] of [["workorder.created", "workorder created"], ["workorder.assigned", "workorder assigned"], ["workorder.in_progress", "workorder in progress"], ["workorder.resolved", "workorder resolved"], ["workorder.verified", "workorder verified"], ["workorder.closed", "workorder closed"], ["maintenance.recorded", "maintenance recorded"], ["ai.investigation", "ai investigation"], ["attachment.uploaded", "attachment uploaded"]]) {
  await d.goto(BASE + "/app/audit?action=" + action, { waitUntil: "networkidle" }); await d.waitForSelector("h1:has-text('Audit log')"); if (!(await d.innerText("body")).toLowerCase().includes(text)) throw new Error("audit missing: " + text);
}
step("audit log recorded every action");
if (errors.length) throw new Error("page errors: " + errors.join(" | "));
await b.close(); console.log("\nE2E PASSED");
