/** CSV with formula-injection protection (cells starting with = + - @ are prefixed). */
export function toCsv(rows: (string | number | null | undefined | Date)[][]): string {
  const cell = (v: string | number | null | undefined | Date) => {
    let t = v == null ? "" : v instanceof Date ? v.toISOString() : String(v);
    if (/^[=+\-@\t\r]/.test(t) && typeof v === "string") t = "'" + t;
    return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  return rows.map((r) => r.map(cell).join(",")).join("\n");
}
export const csvResponse = (name: string, body: string) => new Response("﻿" + body, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${name}"`, "cache-control": "no-store" } });
