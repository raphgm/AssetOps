"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, { Background, Controls, MarkerType, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import type { GEdge, GNode } from "@/lib/services/graph";

const COLOR: Record<string, string> = { network: "#5eead4", asset: "#e8eaed", department: "#7aa2ff", location: "#fbbf24", vendor: "#c4b5fd", event: "#f87171", workorder: "#4ade80" };
const LABEL: Record<string, string> = { network: "Network device", asset: "Asset", department: "Department", location: "Location", vendor: "Vendor", event: "Maintenance events", workorder: "Open work orders" };
const ROW: Record<string, number> = { vendor: 0, department: 0, location: 0, network: 1, asset: 2, event: 3, workorder: 3 };

export default function GraphView({ nodes, edges, centerId }: { nodes: GNode[]; edges: GEdge[]; centerId: string | null }) {
  const router = useRouter();
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const { rfNodes, rfEdges } = useMemo(() => {
    const vis = nodes.filter((n) => !hidden.has(n.type));
    const PER = 7, W = 175, H = 80;
    const rows = new Map<number, GNode[]>(); vis.forEach((n) => rows.set(ROW[n.type], [...(rows.get(ROW[n.type]) ?? []), n]));
    const pos = new Map<string, { x: number; y: number }>(); let y = 0;
    [0, 1, 2, 3].forEach((r) => { const list = rows.get(r) ?? []; for (let c = 0; c * PER < list.length; c++) { const chunk = list.slice(c * PER, c * PER + PER); chunk.forEach((n, i) => pos.set(n.id, { x: (i - (chunk.length - 1) / 2) * W, y: y + c * H })); } y += Math.max(1, Math.ceil(list.length / PER)) * H + 60; });
    const rn: Node[] = vis.map((n) => ({ id: n.id, position: pos.get(n.id)!, data: { label: <div className="text-left"><div className="font-medium text-[11px] leading-tight">{n.label}</div>{n.sub && <div className="text-[9px] opacity-60 leading-tight">{n.sub}</div>}</div>, href: n.href },
      style: { background: "#101216", color: "#e8eaed", border: `1px solid ${COLOR[n.type]}`, borderRadius: 8, padding: "6px 8px", width: 150, boxShadow: n.id === centerId ? `0 0 0 2px ${COLOR[n.type]}55` : undefined } }));
    const ids = new Set(vis.map((n) => n.id));
    const re: Edge[] = edges.filter((e) => ids.has(e.source) && ids.has(e.target)).map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label, labelStyle: { fill: "#9aa1ab", fontSize: 9 }, labelBgStyle: { fill: "#0a0b0d" }, style: { stroke: "#3b4350" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b4350" } }));
    return { rfNodes: rn, rfEdges: re };
  }, [nodes, edges, hidden, centerId]);
  const toggle = (t: string) => setHidden((h) => { const n = new Set(h); n.has(t) ? n.delete(t) : n.add(t); return n; });
  const types = [...new Set(nodes.map((n) => n.type))];
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-2" role="group" aria-label="Filter node types">{types.map((t) => <label key={t} className="flex items-center gap-1.5 text-xs text-mute cursor-pointer"><input type="checkbox" checked={!hidden.has(t)} onChange={() => toggle(t)} /><span className="h-2 w-2 rounded-full" style={{ background: COLOR[t] }} aria-hidden />{LABEL[t]}</label>)}</div>
      <div className="h-[560px] card overflow-hidden" role="img" aria-label="Asset relationship graph">
        <ReactFlow nodes={rfNodes} edges={rfEdges} fitView minZoom={0.15} onNodeClick={(_, n) => n.data.href && router.push(n.data.href as string)} proOptions={{ hideAttribution: true }}>
          <Background color="#1a1d23" gap={20} /><Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}
