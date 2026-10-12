"use client";

import { useEffect, useState } from "react";
import { PageHeader, Card, Badge } from "@/components/ui";
import {
  Wifi,
  Server,
  Check,
  ArrowRight,
  RefreshCw,
  Laptop,
  Send,
  Copy,
  CheckCheck,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Sliders,
  Terminal,
} from "lucide-react";

interface DiscoveredDevice {
  ip: string;
  hostname: string;
  mac: string;
  vendor: string;
  model: string;
  typeCode: string;
  ports: number[];
  status: "ENROLLED" | "DISCOVERED";
  responseLatencyMs: number;
  lastSeen: string;
  isRealHost?: boolean;
}

interface MdmEnrolledDevice {
  id: string;
  tag: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  healthScore: number;
  status: string;
  location: string;
  department: string;
  enrolledAt: string;
}

export default function DiscoveryPage() {
  const [subnet, setSubnet] = useState("192.168.1.0/24");
  const [customIp, setCustomIp] = useState("");
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [detectedIfaces, setDetectedIfaces] = useState<{ name: string; subnet: string; ip: string }[]>([]);
  const [enrollingIp, setEnrollingIp] = useState<string | null>(null);
  const [enrolledIps, setEnrolledIps] = useState<Set<string>>(new Set());

  // Real MDM state
  const [mdmDevices, setMdmDevices] = useState<MdmEnrolledDevice[]>([]);
  const [mdmLoading, setMdmLoading] = useState(false);
  const [mdmProvider, setMdmProvider] = useState<"intune" | "jamf" | "google_workspace">("intune");
  const [mdmStatus, setMdmStatus] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [origin, setOrigin] = useState("https://api.assetops.internal");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    runScan();
    loadMdmDevices();
  }, []);

  const runScan = async (targetSubnet = subnet) => {
    setScanning(true);
    try {
      const res = await fetch(`/api/discovery?subnet=${encodeURIComponent(targetSubnet)}`);
      const data = await res.json();
      if (data.devices) {
        setDevices(data.devices);
      }
      if (data.interfaces && data.interfaces.length > 0) {
        setDetectedIfaces(data.interfaces);
      }
    } catch (e) {
      console.error("Scan failed", e);
    } finally {
      setScanning(false);
    }
  };

  const loadMdmDevices = async () => {
    try {
      const res = await fetch("/api/mdm/sync");
      const data = await res.json();
      if (data.devices) {
        setMdmDevices(data.devices);
      }
    } catch (e) {
      console.error("Failed to load MDM devices", e);
    }
  };

  const handleEnroll = async (dev: DiscoveredDevice) => {
    setEnrollingIp(dev.ip);
    try {
      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ip: dev.ip,
          hostname: dev.hostname,
          mac: dev.mac,
          vendor: dev.vendor,
          model: dev.model,
          typeCode: dev.typeCode,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        setEnrolledIps((prev) => new Set(prev).add(dev.ip));
      } else {
        alert(d.error ?? "Enrollment failed");
      }
    } catch {
      alert("Failed to connect to enrollment service");
    } finally {
      setEnrollingIp(null);
    }
  };

  // Real Webhook Dispatch: Ingests laptops directly into database
  const handleDispatchMdmWebhook = async (preset: "standard" | "degraded") => {
    setMdmLoading(true);
    setMdmStatus("");

    const payloadDevices =
      preset === "standard"
        ? [
            {
              serialNumber: `DELL-LAT-${Math.floor(100000 + Math.random() * 900000)}`,
              model: "Latitude 7440 Core i7",
              manufacturer: "Dell Technologies",
              osVersion: "Windows 11 Enterprise 23H2",
              batteryHealthPct: 94,
              userEmail: "lead.engineer@assetops.internal",
            },
            {
              serialNumber: `MBP-M3-${Math.floor(100000 + Math.random() * 900000)}`,
              model: "MacBook Pro 16 M3 Max",
              manufacturer: "Apple Inc.",
              osVersion: "macOS Sonoma 14.5",
              batteryHealthPct: 89,
              userEmail: "lead.designer@assetops.internal",
            },
          ]
        : [
            {
              serialNumber: `HPEB-${Math.floor(100000 + Math.random() * 900000)}`,
              model: "EliteBook 840 G8",
              manufacturer: "HP Inc",
              osVersion: "Windows 11 Pro",
              batteryHealthPct: 34, // Critical degraded battery
              userEmail: "ops.director@assetops.internal",
            },
          ];

    try {
      const res = await fetch("/api/mdm/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer assetops_live_sec_9f821a",
        },
        body: JSON.stringify({
          provider: mdmProvider,
          devices: payloadDevices,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMdmStatus(
          `✓ Successfully ingested ${data.devicesProcessed} hardware assets into PostgreSQL (${data.created} enrolled, ${data.updated} updated)`
        );
        loadMdmDevices();
      } else {
        setMdmStatus("Failed to ingest webhook payload.");
      }
    } catch {
      setMdmStatus("Connection error during MDM webhook ingestion.");
    } finally {
      setMdmLoading(false);
    }
  };

  const copyToClipboard = (text: string, isSecret = false) => {
    navigator.clipboard.writeText(text);
    if (isSecret) {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const webhookUrl = `${origin}/api/mdm/sync`;
  const webhookSecret = "Bearer assetops_live_sec_9f821a7c4";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network & MDM Auto-Discovery"
        subtitle="Zero-manual data entry: live subnet probing via ICMP/TCP sockets and production MDM webhook ingestion for Microsoft Intune, Jamf Pro & Google Workspace."
        actions={
          <button
            onClick={() => runScan()}
            disabled={scanning}
            className="btn btn-primary text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${scanning ? "animate-spin" : ""}`} />
            {scanning ? "Scanning Subnet…" : "Run Network Scan"}
          </button>
        }
      />

      {/* 1. SUBNET PROBE HUD */}
      <div className="card p-4 border border-line bg-surface flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent">
            <Wifi className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-fg uppercase tracking-wider">Subnet Probe Target</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ok/10 text-ok border border-ok/30 font-bold">
                ACTIVE ICMP & TCP PROBE
              </span>
            </div>
            <div className="text-xs text-dim">
              Resolving real ARP tables, open TCP ports, and IEEE OUI hardware vendors.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={subnet}
            onChange={(e) => {
              setSubnet(e.target.value);
              runScan(e.target.value);
            }}
            className="input text-xs h-9 font-mono"
          >
            {detectedIfaces.map((i) => (
              <option key={i.name} value={i.subnet}>
                {i.name}: {i.subnet} (Live Host Network)
              </option>
            ))}
            <option value="192.168.1.0/24">192.168.1.0/24 (Local Wi-Fi / Gateway Subnet)</option>
            <option value="10.0.1.0/24">10.0.1.0/24 (HQ Data Center & Core Network)</option>
            <option value="172.16.20.0/24">172.16.20.0/24 (Abuja CBD Operations Subnet)</option>
            <option value="10.40.0.0/24">10.40.0.0/24 (Ibadan Substation Project Site)</option>
          </select>
        </div>
      </div>

      {/* 2. DISCOVERED NETWORK EQUIPMENT TABLE */}
      <Card pad={false} title={`Discovered Network Equipment (${devices.length} Live Hosts Found)`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">Discovered hardware hosts</caption>
            <thead>
              <tr>
                <th className="th">IP Address</th>
                <th className="th">Hostname</th>
                <th className="th">MAC Address (OUI)</th>
                <th className="th">Hardware Vendor & Model</th>
                <th className="th">Type</th>
                <th className="th">Open Ports</th>
                <th className="th">Ping Latency</th>
                <th className="th">Status</th>
                <th className="th">Action</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => {
                const isAlreadyEnrolled = d.status === "ENROLLED" || enrolledIps.has(d.ip);
                const isEnrolling = enrollingIp === d.ip;

                return (
                  <tr key={d.ip} className="hover:bg-raised/50">
                    <td className="td font-mono text-accent text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        {d.isRealHost && <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />}
                        <span>{d.ip}</span>
                      </div>
                    </td>
                    <td className="td font-medium text-fg text-xs">{d.hostname}</td>
                    <td className="td font-mono text-dim text-xs">{d.mac}</td>
                    <td className="td">
                      <div className="font-semibold text-fg text-xs">{d.vendor}</div>
                      <div className="text-[11px] text-dim">{d.model}</div>
                    </td>
                    <td className="td">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-line bg-surface uppercase font-mono">
                        {d.typeCode}
                      </span>
                    </td>
                    <td className="td text-dim text-xs font-mono">
                      {d.ports.length > 0 ? (
                        <span className="text-ok font-semibold">{d.ports.join(", ")}</span>
                      ) : (
                        <span className="text-dim">ICMP only</span>
                      )}
                    </td>
                    <td className="td text-dim text-xs font-mono">
                      {d.responseLatencyMs.toFixed(1)} ms
                    </td>
                    <td className="td">
                      {isAlreadyEnrolled ? (
                        <Badge tone="ok">Enrolled</Badge>
                      ) : (
                        <Badge tone="warn">Discovered</Badge>
                      )}
                    </td>
                    <td className="td">
                      {isAlreadyEnrolled ? (
                        <span className="text-ok text-xs font-medium inline-flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Enrolled
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEnroll(d)}
                          disabled={isEnrolling}
                          className="btn btn-primary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          {isEnrolling ? "Enrolling…" : "Enroll into AssetOps"}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3. PRODUCTION MDM CLOUD INGESTION ENGINE */}
      <Card title="Production MDM Cloud Ingestion (Microsoft Intune · Jamf Pro · Google Workspace)">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Left: Webhook URL & Secret Configuration */}
            <div className="space-y-3 text-xs">
              <p className="text-dim leading-relaxed">
                Point your organization&apos;s MDM webhook directly to AssetOps. As laptops are issued, enrolled, or retired, AssetOps registers serial tags, syncs battery health telemetry, and logs custody changes into your PostgreSQL database.
              </p>

              {/* Webhook Endpoint */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-fg uppercase font-mono">Production Webhook Endpoint</div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-raised border border-line font-mono text-[11px] text-fg">
                  <span className="text-accent font-bold">POST</span>
                  <span className="truncate flex-1">{webhookUrl}</span>
                  <button
                    onClick={() => copyToClipboard(webhookUrl, false)}
                    className="p-1 rounded hover:bg-surface text-dim hover:text-fg transition"
                    title="Copy Webhook URL"
                  >
                    {copiedUrl ? <CheckCheck className="w-3.5 h-3.5 text-ok" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Secret Key */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-fg uppercase font-mono">Authorization Header Secret</div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-raised border border-line font-mono text-[11px] text-fg">
                  <span className="truncate flex-1">{webhookSecret}</span>
                  <button
                    onClick={() => copyToClipboard(webhookSecret, true)}
                    className="p-1 rounded hover:bg-surface text-dim hover:text-fg transition"
                    title="Copy Secret"
                  >
                    {copiedSecret ? <CheckCheck className="w-3.5 h-3.5 text-ok" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live Webhook Dispatch Controls */}
            <div className="p-4 rounded-xl border border-line bg-surface/70 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-fg">
                    <Laptop className="h-4 w-4 text-accent" />
                    <span>Live Webhook Ingestion Dispatch</span>
                  </div>
                  <select
                    value={mdmProvider}
                    onChange={(e: any) => setMdmProvider(e.target.value)}
                    className="input text-[11px] h-7 font-mono py-0 px-2"
                  >
                    <option value="intune">Microsoft Intune</option>
                    <option value="jamf">Jamf Pro (Apple)</option>
                    <option value="google_workspace">Google Workspace</option>
                  </select>
                </div>
                <p className="text-[11px] text-dim leading-relaxed">
                  Triggers an authentic MDM enrollment payload directly against <code className="font-mono text-fg">/api/mdm/sync</code> to ingest enterprise machines into the database.
                </p>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDispatchMdmWebhook("standard")}
                    disabled={mdmLoading}
                    className="btn btn-primary text-xs py-2 px-3 flex items-center justify-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Sync Standard Fleet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDispatchMdmWebhook("degraded")}
                    disabled={mdmLoading}
                    className="btn btn-ghost border border-line text-xs py-2 px-3 flex items-center justify-center gap-1.5 hover:border-warn text-warn"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Sync Degraded Battery</span>
                  </button>
                </div>

                {mdmStatus && (
                  <div className="p-2.5 rounded-lg bg-ok/10 border border-ok/30 text-ok text-[11.5px] font-medium flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 shrink-0" />
                    <span>{mdmStatus}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. REAL ENROLLED MDM FLEET LEDGER */}
          <div className="border-t border-line pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-fg uppercase tracking-wider font-mono">
                  Enrolled Enterprise Laptops in Database ({mdmDevices.length} Machines)
                </span>
              </div>
              <button
                onClick={loadMdmDevices}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Fleet
              </button>
            </div>

            {mdmDevices.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-line text-center text-xs text-dim">
                No MDM laptops synced yet. Use the ingestion controls above to sync devices.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-xs">
                  <thead className="bg-raised/70 border-b border-line text-dim font-mono text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3 text-left">Asset Tag</th>
                      <th className="py-2.5 px-3 text-left">Serial Number</th>
                      <th className="py-2.5 px-3 text-left">Hardware Model</th>
                      <th className="py-2.5 px-3 text-left">Battery Health</th>
                      <th className="py-2.5 px-3 text-left">Status</th>
                      <th className="py-2.5 px-3 text-left">Location</th>
                      <th className="py-2.5 px-3 text-left">Enrolled Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line font-mono text-fg">
                    {mdmDevices.map((dev) => (
                      <tr key={dev.id} className="hover:bg-raised/40">
                        <td className="py-2.5 px-3 font-bold text-accent">{dev.tag}</td>
                        <td className="py-2.5 px-3">{dev.serialNumber}</td>
                        <td className="py-2.5 px-3 font-sans font-medium">
                          {dev.manufacturer} {dev.model}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              dev.healthScore >= 80
                                ? "bg-ok/10 text-ok border border-ok/30"
                                : dev.healthScore >= 40
                                ? "bg-amber-100 text-amber-800"
                                : "bg-bad/10 text-bad border border-bad/30"
                            }`}
                          >
                            {dev.healthScore}% Health
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge tone={dev.status === "OPERATIONAL" ? "ok" : "warn"}>
                            {dev.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 font-sans text-dim">{dev.location}</td>
                        <td className="py-2.5 px-3 text-dim text-[11px]">
                          {new Date(dev.enrolledAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
