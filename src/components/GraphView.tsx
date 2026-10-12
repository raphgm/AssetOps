"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import type { GEdge, GNode } from "@/lib/services/graph";
import {
  Search,
  MapPin,
  Building2,
  Users,
  Server,
  Wrench,
  AlertCircle,
  Network,
  Maximize2,
  RotateCcw,
  Target,
  Layers,
  Sparkles,
} from "lucide-react";

const NODE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: any }
> = {
  location: {
    label: "Location",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#f59e0b",
    icon: MapPin,
  },
  department: {
    label: "Department",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#3b82f6",
    icon: Building2,
  },
  vendor: {
    label: "Vendor",
    color: "#7e22ce",
    bg: "#faf5ff",
    border: "#a855f7",
    icon: Users,
  },
  network: {
    label: "Core Network Switch",
    color: "#0e7490",
    bg: "#ecfeff",
    border: "#06b6d4",
    icon: Network,
  },
  asset: {
    label: "Connected Device",
    color: "#0f766e",
    bg: "#f0fdfa",
    border: "#14b8a6",
    icon: Server,
  },
  workorder: {
    label: "Open Work Order",
    color: "#15803d",
    bg: "#f0fdf4",
    border: "#22c55e",
    icon: Wrench,
  },
  event: {
    label: "Maintenance Event",
    color: "#b91c1c",
    bg: "#fef2f2",
    border: "#ef4444",
    icon: AlertCircle,
  },
};

function FlowCanvas({
  nodes,
  edges,
  centerId,
}: {
  nodes: GNode[];
  edges: GEdge[];
  centerId: string | null;
}) {
  const router = useRouter();
  const reactFlowInstance = useReactFlow();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"focused" | "all">("focused");
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set());

  // In focused mode: limit endpoints to top 6 to prevent overwhelming scale reduction
  const filteredNodes = useMemo(() => {
    let result = nodes.filter((n) => !hiddenTypes.has(n.type));
    if (viewMode === "focused") {
      let assetCount = 0;
      let eventCount = 0;
      result = result.filter((n) => {
        if (n.id === centerId || n.type === "network" || n.type === "location" || n.type === "vendor" || n.type === "department") {
          return true;
        }
        if (n.type === "workorder") return true;
        if (n.type === "asset") {
          assetCount++;
          return assetCount <= 6;
        }
        if (n.type === "event") {
          eventCount++;
          return eventCount <= 4;
        }
        return true;
      });
    }
    return result;
  }, [nodes, hiddenTypes, viewMode, centerId]);

  // Compute balanced, readable horizontal & radial grid coordinates
  const { rfNodes, rfEdges } = useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();
    const positions = new Map<string, { x: number; y: number }>();

    // Identify hub node
    const hubNode = filteredNodes.find((n) => n.id === centerId) || filteredNodes.find((n) => n.type === "network") || filteredNodes[0];
    const hubId = hubNode?.id;

    // Hub center at (0, 0)
    if (hubId) positions.set(hubId, { x: 0, y: 0 });

    // Group remaining nodes by role
    const locations = filteredNodes.filter((n) => n.id !== hubId && n.type === "location");
    const depts = filteredNodes.filter((n) => n.id !== hubId && n.type === "department");
    const vendors = filteredNodes.filter((n) => n.id !== hubId && n.type === "vendor");
    const workorders = filteredNodes.filter((n) => n.id !== hubId && n.type === "workorder");
    const assets = filteredNodes.filter((n) => n.id !== hubId && n.type === "asset");
    const events = filteredNodes.filter((n) => n.id !== hubId && n.type === "event");

    const NODE_W = 260;
    const NODE_H = 100;

    // Top tier: Locations (North)
    locations.forEach((n, i) => {
      const offsetX = (i - (locations.length - 1) / 2) * (NODE_W + 40);
      positions.set(n.id, { x: offsetX, y: -240 });
    });

    // Tier 1: Departments & Vendors (North-West & North-East)
    const upperNodes = [...vendors, ...depts];
    upperNodes.forEach((n, i) => {
      const offsetX = (i - (upperNodes.length - 1) / 2) * (NODE_W + 30);
      positions.set(n.id, { x: offsetX, y: -120 });
    });

    // Tier 2: Open Work Orders & Events (East & West flanks)
    workorders.forEach((n, i) => {
      positions.set(n.id, { x: 380, y: i * (NODE_H + 20) - 40 });
    });

    events.forEach((n, i) => {
      positions.set(n.id, { x: -380, y: i * (NODE_H + 20) - 40 });
    });

    // Tier 3: Connected Assets (South, arranged in wide 3-column rows)
    const ASSETS_PER_ROW = 3;
    assets.forEach((n, i) => {
      const row = Math.floor(i / ASSETS_PER_ROW);
      const col = i % ASSETS_PER_ROW;
      const countInRow = Math.min(ASSETS_PER_ROW, assets.length - row * ASSETS_PER_ROW);
      const offsetX = (col - (countInRow - 1) / 2) * (NODE_W + 30);
      const offsetY = 140 + row * (NODE_H + 30);
      positions.set(n.id, { x: offsetX, y: offsetY });
    });

    // Connected set for focus isolate
    const connectedNodeIds = new Set<string>();
    if (selectedNodeId) {
      connectedNodeIds.add(selectedNodeId);
      edges.forEach((e) => {
        if (e.source === selectedNodeId) connectedNodeIds.add(e.target);
        if (e.target === selectedNodeId) connectedNodeIds.add(e.source);
      });
    }

    const flowNodes: Node[] = filteredNodes.map((n) => {
      const cfg = NODE_CONFIG[n.type] || NODE_CONFIG.asset;
      const Icon = cfg.icon;
      const pos = positions.get(n.id) || { x: 0, y: 0 };

      const isMatch =
        !searchLower ||
        n.label.toLowerCase().includes(searchLower) ||
        (n.sub && n.sub.toLowerCase().includes(searchLower));

      const isDimmed =
        (selectedNodeId && !connectedNodeIds.has(n.id)) ||
        (searchLower.length > 0 && !isMatch);

      const isHub = n.id === centerId || n.type === "network";
      const isSelected = n.id === selectedNodeId;

      return {
        id: n.id,
        position: pos,
        data: {
          label: (
            <div className="select-none p-2 text-left font-sans">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cfg.label.toUpperCase()}</span>
                </span>
                {isHub && (
                  <span className="text-[10px] font-mono font-bold text-cyan-900 bg-cyan-100 px-1.5 py-0.5 rounded border border-cyan-300">
                    HUB SWITCH
                  </span>
                )}
              </div>
              <div className="font-bold text-sm text-slate-950 truncate mt-1">
                {n.label}
              </div>
              {n.sub && (
                <div className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                  {n.sub}
                </div>
              )}
            </div>
          ),
          href: n.href,
        },
        style: {
          backgroundColor: "#ffffff",
          color: "#0f172a",
          border: isSelected
            ? `3px solid #0284c7`
            : isHub
            ? `2.5px solid ${cfg.border}`
            : `2px solid ${cfg.border}`,
          borderRadius: 14,
          width: isHub ? 280 : 250,
          boxShadow: isSelected
            ? "0 0 0 4px rgba(2, 132, 199, 0.25), 0 10px 25px -5px rgba(0,0,0,0.15)"
            : isHub
            ? "0 8px 20px -4px rgba(6, 182, 212, 0.2), 0 4px 6px -2px rgba(0,0,0,0.05)"
            : "0 4px 12px -2px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.04)",
          opacity: isDimmed ? 0.2 : 1,
          transition: "all 0.15s ease",
          cursor: "pointer",
        },
      };
    });

    const visibleIds = new Set(filteredNodes.map((n) => n.id));
    const flowEdges: Edge[] = edges
      .filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target))
      .map((e) => {
        const isConnected =
          !selectedNodeId ||
          e.source === selectedNodeId ||
          e.target === selectedNodeId;
        const isDimmed = selectedNodeId && !isConnected;

        return {
          id: e.id,
          source: e.source,
          target: e.target,
          type: "smoothstep",
          label: e.label,
          labelStyle: { fill: "#475569", fontSize: 11, fontWeight: 700, fontFamily: "sans-serif" },
          labelBgStyle: { fill: "#ffffff", fillOpacity: 0.95, rx: 6, ry: 6 },
          labelBgPadding: [6, 3] as [number, number],
          style: {
            stroke: isConnected && selectedNodeId ? "#0284c7" : "#94a3b8",
            strokeWidth: isConnected && selectedNodeId ? 3 : 2,
            opacity: isDimmed ? 0.1 : 0.85,
            transition: "all 0.15s ease",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isConnected && selectedNodeId ? "#0284c7" : "#64748b",
            width: 16,
            height: 16,
          },
        };
      });

    return { rfNodes: flowNodes, rfEdges: flowEdges };
  }, [filteredNodes, edges, centerId, selectedNodeId, searchQuery]);

  const handleResetScale = useCallback(() => {
    reactFlowInstance.setViewport({ x: 450, y: 220, zoom: 0.95 }, { duration: 400 });
  }, [reactFlowInstance]);

  const handleCenterHub = useCallback(() => {
    reactFlowInstance.setViewport({ x: 450, y: 220, zoom: 1.05 }, { duration: 400 });
    setSelectedNodeId(centerId);
  }, [reactFlowInstance, centerId]);

  return (
    <div className="space-y-3 font-sans">
      {/* Control Bar: Search, View Mode & 100% Reset Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter node or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setViewMode("focused");
                setTimeout(handleResetScale, 100);
              }}
              className={`px-3 py-1 rounded-lg transition ${
                viewMode === "focused"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Core Topology (Clean)
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("all");
                setTimeout(handleResetScale, 100);
              }}
              className={`px-3 py-1 rounded-lg transition ${
                viewMode === "all"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Nodes ({nodes.length})
            </button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCenterHub}
            className="btn btn-outline text-xs h-8 px-3 gap-1.5 font-bold"
            title="Center onto primary network switch"
          >
            <Target className="w-3.5 h-3.5 text-cyan-600" />
            Focus Core Switch
          </button>

          <button
            type="button"
            onClick={handleResetScale}
            className="btn btn-primary text-xs h-8 px-3 gap-1.5 font-bold shadow-xs"
            title="Reset to 100% visible zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            100% Readable Scale
          </button>
        </div>
      </div>

      {/* Main Flow Canvas with High-Contrast Nodes */}
      <div
        className="h-[620px] bg-slate-50 border-2 border-slate-200 rounded-3xl overflow-hidden relative shadow-sm"
        role="img"
        aria-label="Asset relationship graph"
      >
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          defaultViewport={{ x: 450, y: 220, zoom: 0.95 }}
          minZoom={0.65}
          maxZoom={1.6}
          onNodeClick={(_, n) => {
            setSelectedNodeId(n.id === selectedNodeId ? null : n.id);
          }}
          onNodeDoubleClick={(_, n) => {
            if (n.data.href) router.push(n.data.href as string);
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#cbd5e1" gap={28} size={1.5} />
          <Controls showInteractive={false} className="bg-white border border-slate-200 rounded-xl shadow-md p-1" />
          <MiniMap
            nodeColor={(n) => {
              const type = filteredNodes.find((orig) => orig.id === n.id)?.type || "asset";
              return NODE_CONFIG[type]?.border || "#0f766e";
            }}
            maskColor="rgba(241, 245, 249, 0.6)"
            className="bg-white border border-slate-200 rounded-xl shadow-sm"
          />
        </ReactFlow>

        {/* Legend Overlay at bottom */}
        <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-xs flex items-center gap-3">
          <span className="font-bold text-slate-700 text-[11px] uppercase">Legend:</span>
          <span className="flex items-center gap-1 font-semibold text-cyan-800">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Core Switch
          </span>
          <span className="flex items-center gap-1 font-semibold text-blue-800">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Department
          </span>
          <span className="flex items-center gap-1 font-semibold text-teal-800">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Endpoints
          </span>
          <span className="flex items-center gap-1 font-semibold text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Work Orders
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GraphView({
  nodes,
  edges,
  centerId,
}: {
  nodes: GNode[];
  edges: GEdge[];
  centerId: string | null;
}) {
  return (
    <ReactFlowProvider>
      <FlowCanvas nodes={nodes} edges={edges} centerId={centerId} />
    </ReactFlowProvider>
  );
}
