import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { assetScope } from "@/lib/services/assets";
import { qrSvg } from "@/lib/services/qr";
import { headers } from "next/headers";
import { PageHeader, EmptyState } from "@/components/ui";
import PrintButton from "@/components/PrintButton";

export default async function QrLabels({ searchParams }: { searchParams: Promise<{ ids?: string | string[]; id?: string }> }) {
  const s = await requireSession("asset:read");
  const sp = await searchParams;
  const ids = Array.isArray(sp.ids) ? sp.ids : sp.ids ? sp.ids.split(",") : sp.id ? [sp.id] : [];
  const assets = ids.length ? await db.asset.findMany({ where: assetScope(s, { id: { in: ids.slice(0, 120) } }) }) : [];
  const h = await headers(); const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  const svgs = await Promise.all(assets.map((a) => qrSvg(origin, a.qrToken)));
  return (
    <div>
      <PageHeader title="QR labels" subtitle="Each code encodes a secure scan token, not a database ID." actions={<PrintButton />} />
      {assets.length === 0 ? <EmptyState title="No assets selected" body="Select assets in the register, then choose Print QR labels." /> :
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 print:gap-1">{assets.map((a, i) => (
          <div key={a.id} className="bg-white text-black rounded p-3 text-center break-inside-avoid"><div className="w-28 mx-auto" dangerouslySetInnerHTML={{ __html: svgs[i] }} /><div className="font-mono text-xs mt-1 font-semibold">{a.tag}</div><div className="text-[10px]">{a.make} {a.model}</div></div>))}</div>}
    </div>
  );
}
