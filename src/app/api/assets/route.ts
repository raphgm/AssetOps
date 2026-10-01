import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { createAsset } from "@/lib/services/assets";
import { assetFilters, assetOrder } from "@/lib/services/asset-query";
import { toCsv, csvResponse } from "@/lib/csv";
import { audit } from "@/lib/audit";
import { actorOf } from "@/lib/services/assets";

export const GET = handle(async (req) => {
  const s = await requireSession("asset:read");
  const url = new URL(req.url); const sp = Object.fromEntries(url.searchParams) as Record<string, string>;
  if (url.searchParams.getAll("ids").length) sp.ids = url.searchParams.getAll("ids").join(",");
  const where = assetFilters(s, sp);
  const include = { department: true, location: true, type: true, vendor: true };
  if (sp.format === "csv") {
    const rows = await db.asset.findMany({ where, orderBy: assetOrder(sp), take: 20000, include });
    await audit(actorOf(s), "export.asset_register", "Asset", "csv", undefined, { rows: rows.length });
    return csvResponse("asset-register.csv", toCsv([["Asset ID", "Serial", "Make", "Model", "Type", "Department", "Location", "Vendor", "Status", "Health", "Risk", "Warranty ends", "Acquired", "Acquisition value (NGN)", "Maintenance events", "Lifetime cost (NGN)"], ...rows.map((a) => [a.tag, a.serial, a.make, a.model, a.type.name, a.department.name, a.location.name, a.vendor?.name, a.status, a.healthScore, a.riskLevel, a.warrantyEndsAt?.toISOString().slice(0, 10), a.acquiredAt.toISOString().slice(0, 10), a.acquisitionValue, a.maintenanceCount, a.lifetimeCost])]));
  }
  const page = Math.max(1, Number(sp.page) || 1), size = Math.min(100, Number(sp.size) || 50);
  const [total, items] = await Promise.all([db.asset.count({ where }), db.asset.findMany({ where, orderBy: assetOrder(sp), skip: (page - 1) * size, take: size, include })]);
  return { total, page, size, items };
});
export const POST = handle(async (req) => {
  const s = await requireSession("asset:write");
  return createAsset(s, await req.json());
});
