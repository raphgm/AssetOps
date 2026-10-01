import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { buildReport } from "@/lib/services/reports";
import PrintButton from "@/components/PrintButton";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";
export default async function ReportView({ params }: { params: Promise<{ kind: string }> }) {
  const s = await requireSession();
  const r = await buildReport(s, (await params).kind).catch(() => null);
  if (!r) notFound();
  const rows = r.rows.slice(0, 500);
  return <div><PageHeader title={r.title} subtitle={`Generated ${new Date().toLocaleString("en-GB")} · ${r.rows.length.toLocaleString()} rows${r.rows.length > 500 ? " (first 500 shown; CSV has all)" : ""}`} actions={<PrintButton />} />
    <div className="overflow-x-auto card"><table className="w-full text-xs"><thead><tr>{r.headers.map((h) => <th key={h} className="th">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j} className="td">{c ?? ""}</td>)}</tr>)}</tbody></table></div></div>;
}
