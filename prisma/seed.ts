/**
 * Synthetic demo organisation. ALL data here is fabricated; no real organisation is represented.
 * Deterministic (seeded PRNG) so the demo is reproducible. Run: npm run db:seed
 */
import { PrismaClient, type AssetStatus, type Priority, type WorkOrderStatus, type Role } from "@prisma/client";
import { randomBytes, randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { computeRisk, warrantyState, type RiskResult } from "../src/lib/engines/risk";

const db = new PrismaClient();
let seed = 20260101;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const ri = (a: number, b: number) => Math.floor(rnd() * (b - a + 1)) + a;
const pick = <T,>(a: T[]): T => a[Math.floor(rnd() * a.length)];
const wpick = <T,>(items: [T, number][]): T => { let r = rnd() * items.reduce((s, i) => s + i[1], 0); for (const [v, w] of items) { if ((r -= w) <= 0) return v; } return items[0][0]; };
const poisson = (l: number) => { let L = Math.exp(-l), k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; };
const DAY = 864e5, NOW = Date.now();
const daysAgo = (d: number) => new Date(NOW - d * DAY);
const id = () => randomUUID();
const token = () => randomBytes(18).toString("base64url");
async function chunked<T>(rows: T[], fn: (c: T[]) => Promise<unknown>, size = 2000) { for (let i = 0; i < rows.length; i += size) await fn(rows.slice(i, i + size)); }

const CITIES: Record<string, string> = { "Lagos HQ": "LAG", "Lagos Island": "LAG", "Abuja HQ": "ABJ", "Abuja Garki": "ABJ", Ibadan: "IBD", Kano: "KAN", "Port Harcourt": "PHC", Enugu: "ENU", Kaduna: "KAD", "Benin City": "BEN", Jos: "JOS", Abeokuta: "ABK", Owerri: "OWR", Calabar: "CAL", Ilorin: "ILR" };
const COORDS: Record<string, [number, number]> = { "Lagos HQ": [6.45, 3.4], "Lagos Island": [6.43, 3.42], "Abuja HQ": [9.06, 7.49], "Abuja Garki": [9.03, 7.49], Ibadan: [7.38, 3.94], Kano: [12.0, 8.52], "Port Harcourt": [4.82, 7.03], Enugu: [6.45, 7.5], Kaduna: [10.52, 7.44], "Benin City": [6.34, 5.63], Jos: [9.9, 8.86], Abeokuta: [7.16, 3.35], Owerri: [5.48, 7.03], Calabar: [4.96, 8.33], Ilorin: [8.5, 4.55] };
const DEPTS = ["Finance", "Human Resources", "Operations", "ICT", "Procurement", "Legal", "Administration", "Communications", "Audit & Compliance", "Customer Service", "Engineering", "Facilities", "Research", "Records", "Security", "Training", "Treasury", "Planning", "Logistics", "Estate", "Corporate Affairs", "Risk Management", "Medical Services", "Library", "Registry"];
const CATS = ["Battery", "Network", "Operating System", "Power Supply", "Printer", "Display", "Keyboard", "Storage", "Overheating", "Firmware"];

interface TypeDef { code: string; prefix: string; name: string; lifespan: number; replacement: number; value: [number, number]; rate: number; count: number; cats: [string, number][]; models: [string, string][] }
const TYPES: TypeDef[] = [
  { code: "LAP", prefix: "ICT", name: "Laptop", lifespan: 4, replacement: 1_200_000, value: [650_000, 1_600_000], rate: 1.6, count: 1700, cats: [["Battery", 35], ["Operating System", 20], ["Keyboard", 15], ["Display", 10], ["Storage", 10], ["Overheating", 10]], models: [["Dell", "Latitude 7440"], ["Dell", "Latitude 5420"], ["HP", "EliteBook 840 G8"], ["Lenovo", "ThinkPad T14"], ["HP", "ProBook 450 G9"]] },
  { code: "DSK", prefix: "ICT", name: "Desktop", lifespan: 5, replacement: 650_000, value: [380_000, 800_000], rate: 0.9, count: 1200, cats: [["Operating System", 30], ["Power Supply", 20], ["Storage", 20], ["Network", 15], ["Display", 15]], models: [["Dell", "OptiPlex 7090"], ["HP", "ProDesk 400 G7"], ["Lenovo", "ThinkCentre M70"]] },
  { code: "PRN", prefix: "PRN", name: "Printer", lifespan: 5, replacement: 520_000, value: [280_000, 900_000], rate: 0.55, count: 520, cats: [["Printer", 88], ["Power Supply", 7], ["Network", 5]], models: [["Epson", "WorkForce Pro WF-C5790"], ["Ricoh", "SP 3710DN"], ["Xerox", "VersaLink B405"], ["Kyocera", "ECOSYS P3145dn"], ["Pantum", "BM5100ADW"], ["Sharp", "MX-B476W"]] },
  { code: "SRV", prefix: "SRV", name: "Server", lifespan: 7, replacement: 8_200_000, value: [4_500_000, 9_500_000], rate: 0.7, count: 150, cats: [["Power Supply", 30], ["Storage", 30], ["Overheating", 20], ["Firmware", 10], ["Network", 10]], models: [["Dell", "PowerEdge R750"], ["HPE", "ProLiant DL380 Gen10"], ["Lenovo", "ThinkSystem SR650"]] },
  { code: "SWT", prefix: "NET", name: "Network Switch", lifespan: 7, replacement: 900_000, value: [450_000, 1_400_000], rate: 0.5, count: 350, cats: [["Network", 65], ["Power Supply", 20], ["Firmware", 15]], models: [["Cisco", "Catalyst 2960X"], ["Juniper", "EX2300"], ["Aruba", "2930F"]] },
  { code: "RTR", prefix: "NET", name: "Router", lifespan: 6, replacement: 450_000, value: [220_000, 700_000], rate: 0.4, count: 120, cats: [["Network", 70], ["Firmware", 15], ["Power Supply", 15]], models: [["MikroTik", "CCR1036"], ["Cisco", "ISR 1100"]] },
  { code: "UPS", prefix: "PWR", name: "UPS", lifespan: 5, replacement: 380_000, value: [200_000, 600_000], rate: 0.7, count: 350, cats: [["Battery", 70], ["Power Supply", 30]], models: [["APC", "Smart-UPS 1500"], ["Eaton", "5P 1550"], ["Mercury", "Elite 2000"]] },
  { code: "APT", prefix: "NET", name: "Access Point", lifespan: 6, replacement: 180_000, value: [90_000, 260_000], rate: 0.35, count: 450, cats: [["Network", 70], ["Power Supply", 15], ["Firmware", 15]], models: [["Ubiquiti", "U6-Pro"], ["Aruba", "AP-515"]] },
  { code: "PRJ", prefix: "AVX", name: "Projector", lifespan: 6, replacement: 700_000, value: [350_000, 900_000], rate: 0.5, count: 200, cats: [["Display", 50], ["Overheating", 25], ["Power Supply", 25]], models: [["Epson", "EB-X49"], ["BenQ", "MH733"]] },
  { code: "STO", prefix: "SRV", name: "Storage Array", lifespan: 6, replacement: 4_500_000, value: [2_500_000, 6_000_000], rate: 0.5, count: 80, cats: [["Storage", 60], ["Power Supply", 20], ["Firmware", 20]], models: [["NetApp", "FAS2720"], ["Synology", "RS3621xs+"]] },
];
const SPIKE_MODELS: [string, string][] = [["HP", "LaserJet Pro M404dn"], ["Canon", "imageRUNNER 2224"], ["Brother", "HL-L6200DW"]];
const SPIKE_LOCS = ["Lagos HQ", "Abuja HQ", "Ibadan"];
const SPIKE_DEPTS = ["Finance", "Human Resources", "Operations", "Procurement", "Administration", "Communications", "Legal"];

const VENDOR_NAMES = ["ABC Technologies", "Kingsway Technologies", "Apex NetServe Ltd", "Meridian IT Services", "Niger Delta Systems", "Savanna Compute", "Harmattan Networks", "Lagoon Digital", "Atlas Office Solutions", "Bluegate Infotech", "Cardinal Print Services", "Delta Power Systems", "Eko Hardware Care", "Frontier ICT Ltd", "Greenfield Systems", "Horizon Datacom", "Ibadan TechWorks", "Jebba Electronics", "Kano Micro Services", "Lekki Infrastructure", "Mainland Support Co", "Northgate Computing", "Oyo Tech Repairs", "Platform Care Ltd", "Quorum Systems", "Rivers Equipment", "Sahel Datacare", "Tinubu Square ICT", "Unity Hardware", "Victoria Island Tech", "Westbank Systems", "Xcel Maintenance", "Yaba Devices Ltd", "Zenith Support Group", "Anchor ICT Care", "Beacon Computing", "Crown Netcare", "Dune Systems", "Everest Office Tech", "Fortis Hardware", "Gateway Repairs Ltd", "Harbor Compute", "Indigo Services", "Jade Micro Systems", "Keystone ICT", "Lattice Networks", "Monarch Devices", "Nimbus Support", "Orchid Hardware", "Pinnacle ICT Care"];
const TECHS = ["A. Ibrahim", "C. Okafor", "T. Adeyemi", "F. Bello", "N. Eze", "M. Suleiman", "O. Balogun", "K. Nwosu", "S. Danjuma", "R. Afolabi", "E. Obi", "H. Yusuf"];
const NOTES: Record<string, string[]> = {
  Battery: ["Battery swelling detected, replaced cell pack", "Battery not holding charge, replaced", "Battery health below 40%, replaced"],
  Network: ["Intermittent connectivity, reseated uplink", "Port flapping, replaced patch cable", "Switch port errors, cleared and re-tested"],
  "Operating System": ["OS corrupted after update, reimaged", "Boot loop, repaired boot sector", "Profile corruption, rebuilt user profile"],
  "Power Supply": ["PSU failure, replaced unit", "Intermittent shutdowns traced to PSU", "Power brick replaced"],
  Printer: ["Paper-feed roller worn, replaced", "Paper jam recurring, cleaned feed path", "Fuser fault, serviced", "Toner sensor fault, replaced cartridge"],
  Display: ["Screen flicker, replaced display cable", "Dead pixels cluster, panel replaced", "Lamp failure, replaced"],
  Keyboard: ["Keys unresponsive, replaced keyboard", "Liquid damage to keyboard, replaced"],
  Storage: ["Disk SMART warning, replaced drive", "Slow I/O, replaced SSD and restored image"],
  Overheating: ["Fan failure, replaced fan and re-pasted", "Thermal shutdowns, cleaned vents"],
  Firmware: ["Firmware update applied after fault", "Firmware rollback after unstable release"],
};

interface A { id: string; orgId: string; tag: string; qrToken: string; serial: string | null; make: string; model: string; typeId: string; typeCode: string; departmentId: string; locationId: string; vendorId: string | null; acquiredAt: Date; acquisitionValue: number; warrantyEndsAt: Date | null; networkParentId: string | null; lifespan: number }
interface R { id: string; assetId: string; categoryId: string; description: string; resolution: string; performedAt: Date; technicianId: string | null; vendorId: string | null; workOrderId: string | null; laborCost: number; partsCost: number; downtimeHours: number }
interface W { id: string; number: number; title: string; status: WorkOrderStatus; priority: Priority; assetId: string; categoryId: string | null; assigneeId: string | null; vendorId: string | null; slaHours: number; createdAt: Date; dueAt: Date; resolvedAt: Date | null; closedAt: Date | null; description?: string; fleetKey?: string | null }
interface E { id: string; workOrderId: string; type: string; actor: string; note: string; at: Date }

const SLA: Record<Priority, number> = { CRITICAL: 4, HIGH: 24, MEDIUM: 72, LOW: 120 };

async function main() {
  console.log("Resetting database…");
  await db.$executeRawUnsafe(`TRUNCATE "Organization","User","PasswordReset","Department","Location","AssetType","Vendor","VendorContract","Asset","AssetAssignment","AssetStatusHistory","Warranty","RiskScore","MaintenanceCategory","MaintenanceRecord","WorkOrder","WorkOrderEvent","Part","PartUsage","Attachment","AIInvestigation","AIMessage","AuditLog","Notification","ImportJob","ImportError" CASCADE`);
  const org = await db.organization.create({ data: { name: "Meridian Institute (Synthetic Demo)", slug: "demo", isDemo: true, plan: "ENTERPRISE" } });
  const orgId = org.id;
  const hash = await bcrypt.hash("demo1234!", 10);

  const depts = await Promise.all(DEPTS.map((name) => db.department.create({ data: { orgId, name } })));
  const D = new Map(depts.map((d) => [d.name, d.id]));
  const locs = await Promise.all(Object.entries(CITIES).map(([name, code]) => db.location.create({ data: { orgId, name, city: name.split(" ")[0], code, lat: COORDS[name][0], lng: COORDS[name][1] } })));
  const L = new Map(locs.map((l) => [l.name, l]));
  const types = await Promise.all(TYPES.map((t) => db.assetType.create({ data: { orgId, name: t.name, code: t.code, lifespanYears: t.lifespan, replacementCost: t.replacement } })));
  const TY = new Map(types.map((t) => [t.code, t.id]));
  const cats = await Promise.all(CATS.map((name) => db.maintenanceCategory.create({ data: { orgId, name } })));
  const C = new Map(cats.map((c) => [c.name, c.id]));
  const vendors = await Promise.all(VENDOR_NAMES.map((name, i) => db.vendor.create({ data: { orgId, name, slaHours: [24, 48, 72][i % 3], email: `support@${name.toLowerCase().replace(/[^a-z]+/g, "")}.example` } })));
  const V = new Map(vendors.map((v) => [v.name, v]));

  // Users
  const mk = (email: string, name: string, role: Role, dept?: string) => ({ id: id(), orgId, email, name, role, passwordHash: hash, departmentId: dept ? D.get(dept)! : null });
  const users = [
    mk("demo@assetops.local", "Demo Super Admin", "SUPER_ADMIN"), mk("director@assetops.local", "Ngozi Adekunle", "ICT_DIRECTOR"), mk("manager@assetops.local", "Tunde Bakare", "ICT_MANAGER"),
    mk("auditor@assetops.local", "Hauwa Mohammed", "AUDITOR"), mk("finance@assetops.local", "Chidi Okonkwo", "DEPARTMENT_USER", "Finance"),
    ...TECHS.map((n, i) => mk(i === 0 ? "technician@assetops.local" : `tech${i}@assetops.local`, n, "TECHNICIAN")),
  ];
  await db.user.createMany({ data: users });
  const techs = users.filter((u) => u.role === "TECHNICIAN");
  const tech = (name: string) => techs.find((t) => t.name === name)!;

  // ---------- Assets ----------
  const RESERVED = new Map<number, string>([[4821, "ICT-LAG-004821"], [381, "NET-LAG-000381"], [41, "SRV-ABJ-000041"], [921, "PRN-IBD-000921"]]);
  let counter = 0;
  const nextIdx = () => { do counter++; while (RESERVED.has(counter)); return counter; };
  const assets: A[] = [];
  const tagOf = (prefix: string, city: string, idx: number) => `${prefix}-${city}-${String(idx).padStart(6, "0")}`;
  const locWeights: [string, number][] = [["Lagos HQ", 20], ["Lagos Island", 8], ["Abuja HQ", 16], ["Abuja Garki", 7], ["Ibadan", 9], ["Kano", 8], ["Port Harcourt", 8], ["Enugu", 6], ["Kaduna", 5], ["Benin City", 3], ["Jos", 3], ["Abeokuta", 2], ["Owerri", 2], ["Calabar", 2], ["Ilorin", 1]];
  const deptWeights: [string, number][] = DEPTS.map((d, i) => [d, i < 8 ? 10 : 3]);
  function newAsset(t: TypeDef, over: Partial<A> & { locName?: string; deptName?: string; idx?: number } = {}): A {
    const locName = over.locName ?? wpick(locWeights);
    const idx = over.idx ?? nextIdx();
    const ageY = over.acquiredAt ? 0 : t.code === "LAP" ? wpick([[ri(0, 3), 6], [ri(4, 7), 4]]) + rnd() : rnd() * (t.lifespan + 2.5);
    const acquiredAt = over.acquiredAt ?? new Date(NOW - ageY * 365.25 * DAY);
    const [make, model] = pick(t.models);
    const warrantyYears = pick([1, 2, 3]);
    return {
      id: id(), orgId, tag: over.tag ?? tagOf(t.prefix, CITIES[locName], idx), qrToken: token(), serial: `${make.slice(0, 3).toUpperCase()}${ri(10000000, 99999999)}${String.fromCharCode(65 + ri(0, 25))}`,
      make: over.make ?? make, model: over.model ?? model, typeId: TY.get(t.code)!, typeCode: t.code, departmentId: D.get(over.deptName ?? wpick(deptWeights))!, locationId: L.get(locName)!.id, vendorId: wpick([[pick(vendors).id, 8], [null as unknown as string, 2]]),
      acquiredAt, acquisitionValue: ri(t.value[0], t.value[1]), warrantyEndsAt: new Date(acquiredAt.getTime() + warrantyYears * 365.25 * DAY), networkParentId: null, lifespan: t.lifespan, ...over.serial === undefined ? {} : { serial: over.serial },
    } as A;
  }
  const spikePopulation: A[] = [];
  for (const t of TYPES) {
    let n = t.count;
    if (t.code === "PRN") { // dedicated spike population: 3 models x 3 locations x 7 departments
      for (let i = 0; i < 112; i++) { const [make, model] = SPIKE_MODELS[i % 3]; const a = newAsset(t, { make, model, locName: SPIKE_LOCS[i % 3], deptName: SPIKE_DEPTS[i % 7], acquiredAt: daysAgo(ri(500, 1700)) }); assets.push(a); spikePopulation.push(a); }
      n -= 112;
    }
    for (let i = 0; i < n; i++) assets.push(newAsset(t));
  }
  const T = (c: string) => TYPES.find((t) => t.code === c)!;

  // Hand-built specials referenced by the demo story
  const lap = newAsset(T("LAP"), { tag: "ICT-LAG-004821", make: "Dell", model: "Latitude 7440", locName: "Lagos HQ", deptName: "Finance", acquiredAt: new Date(NOW - 2.1 * 365.25 * DAY), idx: 4821 });
  lap.acquisitionValue = 1_450_000; lap.vendorId = V.get("ABC Technologies")!.id; lap.warrantyEndsAt = new Date(NOW + 200 * DAY); lap.serial = "DEL48210774";
  const swt = newAsset(T("SWT"), { tag: "NET-LAG-000381", make: "Cisco", model: "Catalyst 2960X", locName: "Lagos HQ", deptName: "Finance", acquiredAt: daysAgo(365 * 5), idx: 381 });
  swt.vendorId = V.get("Apex NetServe Ltd")!.id;
  const srv = newAsset(T("SRV"), { tag: "SRV-ABJ-000041", make: "Dell", model: "PowerEdge R750", locName: "Abuja HQ", deptName: "ICT", acquiredAt: daysAgo(365 * 5.5), idx: 41 });
  srv.acquisitionValue = 8_200_000; srv.warrantyEndsAt = daysAgo(400);
  const prn921 = newAsset(T("PRN"), { tag: "PRN-IBD-000921", make: "HP", model: "LaserJet Pro M404dn", locName: "Ibadan", deptName: "Operations", acquiredAt: daysAgo(900), idx: 921 });
  assets.push(lap, swt, srv, prn921); spikePopulation.push(prn921);
  // Pattern B: 18 devices on one Finance switch
  const financeLagos = [...assets.filter((a) => a.locationId === L.get("Lagos HQ")!.id && a.departmentId === D.get("Finance") && ["DSK", "APT", "PRN"].includes(a.typeCode) && a.id !== lap.id)].slice(0, 18);
  financeLagos.forEach((a) => (a.networkParentId = swt.id));
  // generic network parents: each AP/desktop/printer without parent attaches to a switch in its location
  const switchesByLoc = new Map<string, A[]>();
  assets.filter((a) => a.typeCode === "SWT").forEach((s) => switchesByLoc.set(s.locationId, [...(switchesByLoc.get(s.locationId) ?? []), s]));
  assets.forEach((a) => { if (!a.networkParentId && ["DSK", "APT", "PRN"].includes(a.typeCode) && rnd() < 0.7) { const sw = switchesByLoc.get(a.locationId); if (sw?.length) a.networkParentId = pick(sw).id; } });
  // Data-quality demo: 147 missing serials, 42 duplicate serials
  const pool = assets.filter((a) => !RESERVED_SET(a));
  function RESERVED_SET(a: A) { return [lap, swt, srv, prn921].includes(a); }
  for (let i = 0; i < 147; i++) pool[i * 31 % pool.length].serial = null;
  for (let i = 0; i < 42; i++) { const a = pool[(i * 53 + 7) % pool.length], b = pool[(i * 97 + 400) % pool.length]; if (a.serial && a !== b) b.serial = a.serial; }
  // Pattern E: warranties expiring within 30 days
  pool.filter((a) => ["LAP", "DSK"].includes(a.typeCode)).slice(500, 509).forEach((a, i) => (a.warrantyEndsAt = new Date(NOW + (3 + i * 3) * DAY)));
  for (const a of assets) if (a.acquiredAt.getTime() > NOW) a.acquiredAt = daysAgo(30);

  const vendorOf = () => pick(vendors).id;
  const kingsway = V.get("Kingsway Technologies")!.id, abc = V.get("ABC Technologies")!.id, apex = V.get("Apex NetServe Ltd")!.id;

  // ---------- Maintenance records ----------
  const recs: R[] = [], wos: W[] = [], evs: E[] = [];
  let woNum = 21000;
  const mkNote = (cat: string) => pick(NOTES[cat]);
  const rec = (a: A, cat: string, at: Date, o: Partial<R> = {}, t?: TypeDef): R => {
    const tt = t ?? TYPES.find((x) => x.code === a.typeCode)!;
    const base = tt.replacement;
    const labor = o.laborCost ?? Math.round((base * (0.0015 + rnd() * 0.005)) / 500) * 500;
    const parts = o.partsCost ?? Math.round((base * (rnd() < 0.55 ? 0.003 + rnd() * 0.012 : 0)) / 500) * 500;
    return { id: id(), assetId: a.id, categoryId: C.get(cat)!, description: o.description ?? mkNote(cat), resolution: o.resolution ?? "Resolved and verified by technician.", performedAt: at, technicianId: pick(techs).id, vendorId: rnd() < 0.55 ? (a.vendorId ?? vendorOf()) : null, workOrderId: null, laborCost: labor, partsCost: parts, downtimeHours: o.downtimeHours ?? Math.round((2 + rnd() * 30) * 2) / 2, ...o };
  };
  const unreservedFor = (a: A) => [lap, swt, srv].includes(a);
  for (const a of assets) {
    if (unreservedFor(a)) continue;
    const t = TYPES.find((x) => x.code === a.typeCode)!;
    const ageY = (NOW - a.acquiredAt.getTime()) / (365.25 * DAY);
    const winYears = Math.min(3, ageY);
    const aging = ageY > t.lifespan ? 1.8 : 1;
    const dept = depts.find((d) => d.id === a.departmentId)!.name;
    const procurementBoost = dept === "Procurement" ? 1.9 : 1; // Pattern G
    const n = poisson(t.rate * 1.22 * winYears * aging * procurementBoost);
    for (let k = 0; k < n; k++) {
      let cat = wpick(t.cats);
      if (dept === "Procurement" && rnd() < 0.5) cat = t.cats[0][0]; // repeat same category
      let when = rnd() * winYears * 365;
      if (a.typeCode === "PRN" && cat === "Printer" && when < 30) when = 31 + rnd() * 90; // keep last 30d clean for spike
      recs.push(rec(a, cat, daysAgo(when)));
    }
  }
  // Pattern A: printer spike, 84 events, 69 (~82%) via one vendor
  const spikeAssets = spikePopulation.filter((a) => a !== prn921);
  for (let i = 0; i < 84; i++) {
    const a = spikeAssets[i % spikeAssets.length];
    recs.push(rec(a, "Printer", daysAgo(rnd() * 28 + 0.2), { vendorId: i < 69 ? kingsway : (a.vendorId ?? vendorOf()), description: i % 4 === 0 ? "Paper-feed roller worn, replaced" : pick(["Paper-feed failure, roller replaced", "Repeated paper jam at feed assembly", "Pickup roller slipping, replaced"]), laborCost: ri(6, 18) * 1000, partsCost: ri(8, 30) * 1000, downtimeHours: ri(2, 12) }));
  }
  // Pattern B: network failure cluster around NET-LAG-000381
  for (const a of financeLagos.slice(0, 14)) for (let k = 0; k < ri(3, 5); k++) recs.push(rec(a, "Network", daysAgo(ri(5, 170)), { description: "Intermittent connectivity on switch uplink", downtimeHours: ri(1, 6), laborCost: 8000, partsCost: 0 }));
  for (let k = 0; k < 6; k++) recs.push(rec(swt, "Network", daysAgo(ri(5, 150)), { description: "Port group flapping, power-cycled stack", downtimeHours: ri(2, 8) }));
  // Pattern F: high-cost server (acquisition 8.2M, lifetime ≈3.1M, 18 incidents, 146h downtime)
  const srvCosts = [260_000, 180_000, 90_000, 320_000, 140_000, 210_000, 75_000, 400_000, 130_000, 95_000, 150_000, 280_000, 110_000, 160_000, 60_000, 190_000, 120_000, 130_000];
  const srvCats = ["Power Supply", "Storage", "Overheating", "Storage", "Power Supply", "Firmware", "Overheating", "Storage", "Power Supply", "Network", "Storage", "Power Supply", "Overheating", "Storage", "Firmware", "Power Supply", "Storage", "Overheating"];
  const srvDown = [12, 6, 4, 18, 8, 10, 5, 22, 7, 3, 9, 14, 6, 5, 2, 7, 4, 4];
  srvCosts.forEach((c, i) => recs.push(rec(srv, srvCats[i], daysAgo(20 + i * 55 + ri(0, 20)), { laborCost: Math.round(c * 0.3), partsCost: c - Math.round(c * 0.3), downtimeHours: srvDown[i], description: `${srvCats[i]} fault, vendor intervention` })));
  // Special laptop: 7 events with a visible timeline
  const lapRecs: [string, string, number, number][] = [["Battery", "2026-09-21", 92_000, 6], ["Operating System", "2026-08-14", 38_000, 5], ["Keyboard", "2026-07-29", 64_000, 8], ["Battery", "2026-06-18", 92_000, 6], ["Display", "2026-03-04", 110_000, 5], ["Storage", "2025-11-12", 56_000, 4], ["Operating System", "2025-06-02", 20_000, 4]];
  lapRecs.forEach(([cat, d, cost, down]) => recs.push(rec(lap, cat, new Date(d + "T10:00:00Z"), { laborCost: Math.round(cost * 0.3), partsCost: cost - Math.round(cost * 0.3), downtimeHours: down, vendorId: abc })));
  // PRN-IBD-000921 baseline history
  for (let k = 0; k < 3; k++) recs.push(rec(prn921, "Printer", daysAgo(ri(40, 400))));
  // Data-quality: 20 maintenance dates earlier than asset acquisition (invalid)
  for (let i = 0; i < 20; i++) { const a = assets[(i * 211 + 17) % assets.length]; if (unreservedFor(a)) continue; recs.push(rec(a, wpick(T(a.typeCode).cats), new Date(a.acquiredAt.getTime() - ri(10, 60) * DAY))); }
  // Clamp: no record before acquisition except deliberate ones (those are the last 20 pushed) and none in the future
  const aById = new Map(assets.map((a) => [a.id, a]));
  const deliberate = new Set(recs.slice(-20));
  for (const r of recs) { const a = aById.get(r.assetId)!; if (!deliberate.has(r) && r.performedAt < a.acquiredAt) r.performedAt = new Date(a.acquiredAt.getTime() + rnd() * (NOW - a.acquiredAt.getTime())); if (r.performedAt.getTime() > NOW) r.performedAt = new Date(NOW - 3600e3); }

  // ---------- Historical work orders (link ~45% of records) ----------
  const lateVendorPeriod = daysAgo(90).getTime();
  for (const r of recs) {
    if (r.workOrderId || rnd() > 0.45 || wos.length >= 8200) continue;
    const a = aById.get(r.assetId)!;
    const prio = wpick<Priority>([["LOW", 20], ["MEDIUM", 50], ["HIGH", 25], ["CRITICAL", 5]]);
    const sla = SLA[prio];
    const vendor = r.vendorId;
    const vendorDeclining = vendor === apex && r.performedAt.getTime() > lateVendorPeriod; // Pattern C
    const lateProb = vendorDeclining ? 0.65 : vendor === kingsway ? 0.18 : 0.1;
    const took = rnd() < lateProb ? sla * (1.2 + rnd() * 1.5) : sla * (0.2 + rnd() * 0.7);
    const resolvedAt = r.performedAt; const createdAt = new Date(resolvedAt.getTime() - took * 3600e3);
    const num = ++woNum; if (num >= 29200) break;
    const status: WorkOrderStatus = rnd() < 0.85 ? "CLOSED" : "VERIFIED";
    const w: W = { id: id(), number: num, title: `${CATS.find((c) => C.get(c) === r.categoryId)} issue: ${a.tag}`, status, priority: prio, assetId: r.assetId, categoryId: r.categoryId, assigneeId: r.technicianId, vendorId: vendor, slaHours: sla, createdAt, dueAt: new Date(createdAt.getTime() + sla * 3600e3), resolvedAt, closedAt: status === "CLOSED" ? new Date(resolvedAt.getTime() + 6 * 3600e3) : null };
    r.workOrderId = w.id; wos.push(w);
    const tname = users.find((u) => u.id === r.technicianId)?.name ?? "System";
    const steps: [string, string, number][] = [["Created", "Reporter", 0], ["Assigned", "ICT Manager", 0.1], ["Started", tname, took * 0.25], ["Resolved", tname, took], ["Verified", "ICT Manager", took + 3]];
    if (status === "CLOSED") steps.push(["Closed", "ICT Manager", took + 6]);
    steps.forEach(([type, actor, h]) => evs.push({ id: id(), workOrderId: w.id, type, actor, note: "", at: new Date(createdAt.getTime() + h * 3600e3) }));
  }

  // ---------- Open work orders ----------
  let openNum = 29200;
  const nextOpen = () => { do openNum++; while (openNum === 29381); return openNum; };
  const openStatuses: [WorkOrderStatus, number][] = [["OPEN", 120], ["ASSIGNED", 100], ["IN_PROGRESS", 140], ["AWAITING_PARTS", 55], ["RESOLVED", 30]];
  const mkOpen = (a: A, o: Partial<W> & { number?: number } = {}) => {
    const prio = o.priority ?? wpick<Priority>([["LOW", 15], ["MEDIUM", 50], ["HIGH", 28], ["CRITICAL", 7]]);
    const sla = SLA[prio]; const overdue = rnd() < 0.11;
    const age = overdue ? sla * (1.1 + rnd() * 2) : rnd() * sla * 0.85;
    const createdAt = o.createdAt ?? new Date(NOW - age * 3600e3);
    const status = o.status ?? wpick(openStatuses);
    const cat = wpick(T(a.typeCode).cats);
    const asg = status === "OPEN" ? null : pick(techs).id;
    const w: W = { id: id(), number: o.number ?? nextOpen(), title: o.title ?? `${cat} issue: ${a.tag}`, status, priority: prio, assetId: a.id, categoryId: C.get(cat)!, assigneeId: o.assigneeId !== undefined ? o.assigneeId : asg, vendorId: a.vendorId, slaHours: sla, createdAt, dueAt: new Date(createdAt.getTime() + sla * 3600e3), resolvedAt: status === "RESOLVED" ? new Date(NOW - 2 * 3600e3) : null, closedAt: null, ...o };
    wos.push(w);
    const t = (type: string, off: number, actor = "System") => evs.push({ id: id(), workOrderId: w.id, type, actor, note: "", at: new Date(createdAt.getTime() + off * 3600e3) });
    t("Created", 0, "Reporter");
    if (status !== "OPEN") t("Assigned", 0.5, "ICT Manager");
    if (["IN_PROGRESS", "AWAITING_PARTS", "RESOLVED"].includes(status)) t("Started", 1.5, users.find((u) => u.id === w.assigneeId)?.name);
    if (status === "AWAITING_PARTS") t("Awaiting parts", 3, users.find((u) => u.id === w.assigneeId)?.name);
    if (status === "RESOLVED") t("Resolved", Math.max(2, (NOW - createdAt.getTime()) / 3600e3 - 2), users.find((u) => u.id === w.assigneeId)?.name);
  };
  const openPool = assets.filter((a) => !unreservedFor(a));
  for (let i = 0; i < 380; i++) mkOpen(pick(openPool));
  // The demo story WO (spec example): WO-29381 for the Dell Latitude, assigned to A. Ibrahim
  mkOpen(lap, { number: 29381, title: "Battery failure", priority: "HIGH", status: "ASSIGNED", assigneeId: tech("A. Ibrahim").id, createdAt: new Date(NOW - 6 * 3600e3) });
  // A. Ibrahim's queue for Technician Mode
  for (let i = 0; i < 5; i++) mkOpen(pick(openPool), { assigneeId: tech("A. Ibrahim").id, status: i < 3 ? "IN_PROGRESS" : "ASSIGNED", priority: i < 2 ? "HIGH" : "MEDIUM" });
  // Pattern C: SLA breaches by Apex NetServe (open and late)
  for (let i = 0; i < 12; i++) { const a = pick(openPool.filter((x) => x.typeCode === "SWT" || x.typeCode === "RTR" || x.typeCode === "APT")); mkOpen(a, { vendorId: apex, priority: "HIGH", status: "IN_PROGRESS", createdAt: new Date(NOW - (30 + rnd() * 90) * 3600e3) }); }

  // ---------- Compute asset aggregates + risk ----------
  const recsBy = new Map<string, R[]>(); recs.forEach((r) => (recsBy.get(r.assetId) ?? recsBy.set(r.assetId, []).get(r.assetId)!).push(r));
  const openBy = new Map<string, W[]>(); wos.filter((w) => ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"].includes(w.status)).forEach((w) => (openBy.get(w.assetId) ?? openBy.set(w.assetId, []).get(w.assetId)!).push(w));
  const y1 = NOW - 365 * DAY, d30 = NOW - 30 * DAY;
  const agg = new Map<string, { count: number; down: number; cost: number; last: Date | null; res: RiskResult; status: AssetStatus }>();
  const statusRows: { id: string; assetId: string; from: AssetStatus | null; to: AssetStatus; at: Date }[] = [];
  const riskRows: { id: string; assetId: string; score: number; level: string; factors: object; at: Date }[] = [];
  for (const a of assets) {
    const rs = recsBy.get(a.id) ?? []; const r12 = rs.filter((r) => r.performedAt.getTime() >= y1);
    const cc = new Map<string, number>(); r12.forEach((r) => cc.set(r.categoryId, (cc.get(r.categoryId) ?? 0) + 1));
    const open = openBy.get(a.id) ?? [];
    const res = computeRisk({ ageYears: (NOW - a.acquiredAt.getTime()) / (365.25 * DAY), lifespanYears: a.lifespan, eventsLast12m: r12.length, recentFailures30d: r12.filter((r) => r.performedAt.getTime() >= d30).length, downtimeHours12m: r12.reduce((s, r) => s + r.downtimeHours, 0), maintenanceCost12m: r12.reduce((s, r) => s + r.laborCost + r.partsCost, 0), acquisitionValue: a.acquisitionValue, repeatFailures: Math.max(0, Math.max(0, ...cc.values()) - 1), warranty: warrantyState(a.warrantyEndsAt), overdueWorkOrders: open.filter((w) => w.dueAt.getTime() < NOW).length });
    const active = open.some((w) => w.status === "IN_PROGRESS" || w.status === "AWAITING_PARTS");
    const status: AssetStatus = active ? "UNDER_MAINTENANCE" : res.score >= 60 ? "AT_RISK" : "OPERATIONAL";
    agg.set(a.id, { count: rs.length, down: rs.reduce((s, r) => s + r.downtimeHours, 0), cost: rs.reduce((s, r) => s + r.laborCost + r.partsCost, 0), last: rs.length ? new Date(Math.max(...rs.map((r) => r.performedAt.getTime()))) : null, res, status });
    if (res.level !== "healthy") riskRows.push({ id: id(), assetId: a.id, score: res.score, level: res.level, factors: res.factors, at: new Date() });
    if (status !== "OPERATIONAL") statusRows.push({ id: id(), assetId: a.id, from: "OPERATIONAL", to: status, at: new Date() });
  }

  console.log(`Inserting ${assets.length} assets, ${recs.length} records, ${wos.length} work orders…`);
  await chunked(assets, (c) => db.asset.createMany({ data: c.map((a) => { const g = agg.get(a.id)!; return { id: a.id, orgId, tag: a.tag, qrToken: a.qrToken, serial: a.serial, make: a.make, model: a.model, typeId: a.typeId, departmentId: a.departmentId, locationId: a.locationId, vendorId: a.vendorId, status: g.status, acquiredAt: a.acquiredAt, acquisitionValue: a.acquisitionValue, warrantyEndsAt: a.warrantyEndsAt, maintenanceCount: g.count, downtimeHours: g.down, lifetimeCost: g.cost, lastMaintenanceAt: g.last, healthScore: g.res.health, riskScore: g.res.score, riskLevel: g.res.level }; }) }), 1000);
  // network parents after all assets exist (self FK)
  const withParent = assets.filter((a) => a.networkParentId);
  for (let i = 0; i < withParent.length; i += 500) await Promise.all(withParent.slice(i, i + 500).map((a) => db.asset.update({ where: { id: a.id }, data: { networkParentId: a.networkParentId } })));
  await chunked(wos, (c) => db.workOrder.createMany({ data: c.map((w) => ({ id: w.id, orgId, number: w.number, title: w.title, description: w.description ?? "", status: w.status, priority: w.priority, assetId: w.assetId, categoryId: w.categoryId, assigneeId: w.assigneeId, vendorId: w.vendorId, slaHours: w.slaHours, createdAt: w.createdAt, dueAt: w.dueAt, resolvedAt: w.resolvedAt, closedAt: w.closedAt })) }));
  await chunked(recs, (c) => db.maintenanceRecord.createMany({ data: c.map((r) => ({ ...r, orgId })) }));
  await chunked(evs, (c) => db.workOrderEvent.createMany({ data: c }));
  await chunked(statusRows, (c) => db.assetStatusHistory.createMany({ data: c }));
  await chunked(riskRows, (c) => db.riskScore.createMany({ data: c.map((r) => ({ ...r, factors: r.factors as object })) }));
  await chunked(assets.filter((a) => a.warrantyEndsAt), (c) => db.warranty.createMany({ data: c.map((a) => ({ assetId: a.id, provider: "Manufacturer", endsAt: a.warrantyEndsAt! })) }));
  await db.assetAssignment.createMany({ data: [{ assetId: lap.id, assignee: "Chidi Okonkwo (Finance)", fromDate: daysAgo(600) }] });
  await db.vendorContract.createMany({ data: vendors.slice(0, 12).map((v) => ({ vendorId: v.id, startsAt: daysAgo(400), endsAt: new Date(NOW + 330 * DAY), slaHours: v.slaHours, value: ri(2, 9) * 1_000_000 })) });

  // Audit log + notifications (synthetic history)
  const admin = users[0];
  await db.auditLog.createMany({ data: [
    { orgId, actorId: admin.id, actorName: admin.name, action: "organization.created", entity: "Organization", entityId: org.slug, after: { synthetic: true }, at: daysAgo(40) },
    { orgId, actorId: admin.id, actorName: admin.name, action: "import.completed", entity: "ImportJob", entityId: "seed", after: { assets: assets.length }, at: daysAgo(39) },
    { orgId, actorId: users[2].id, actorName: users[2].name, action: "asset.assignment_changed", entity: "Asset", entityId: lap.tag, before: { assignee: "Unassigned" }, after: { assignee: "Chidi Okonkwo (Finance)" }, at: daysAgo(20) },
  ] });
  await db.notification.createMany({ data: [
    { orgId, kind: "maintenance_anomaly", title: "Maintenance anomaly detected", body: "Printer failures are well above their recent baseline.", href: "/app" },
    { orgId, kind: "sla_breached", title: "Vendor SLA threshold exceeded", body: "Apex NetServe Ltd has work orders past SLA.", href: "/app/vendors" },
    { orgId, kind: "warranty_expiring", title: "9 warranties expire within 30 days", href: "/app/assets?warranty=expiring" },
  ] });
  console.log("Seed complete. Login: demo@assetops.local / demo1234!");
}
main().finally(() => db.$disconnect());
