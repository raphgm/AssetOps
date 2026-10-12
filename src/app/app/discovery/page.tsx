"use client";

import { useEffect, useState } from "react";
import { PageHeader, Card, Badge } from "@/components/ui";
import { Wifi, Server, Check, ArrowRight, RefreshCw, Laptop, Send } from "lucide-react";

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
}

export default function DiscoveryPage() {
  const [subnet, setSubnet] = useState("10.0.1.0/24");
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [enrollingIp, setEnrollingIp] = useState<string | null>(null);
  const [enrolledIps, setEnrolledIps] = useState<Set<string>>(new Set());
  const [mdmTesting, setMdmTesting] = useState(false);
  const [mdmStatus, setMdmStatus] = useState("");

  const runScan = async (targetSubnet = subnet) => {
    setScanning(true);
    try {
      const res = await fetch(`/api/discovery?subnet=${encodeURIComponent(targetSubnet)}`);
      const data = await res.json();
      if (data.devices) {
        setDevices(data.devices);
      }
    } catch (e) {
      console.error("Scan failed", e);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    runScan();
  }, []);

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

  const handleTestMdm = async () => {
    setMdmTesting(true);
    setMdmStatus("");
    try {
      const res = await fetch("/api/mdm/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "intune",
          devices: [
            {
              serialNumber: `DELL${Math.floor(10000000 + Math.random() * 90000000)}X`,
              model: "Latitude 7440",
              manufacturer: "Dell",
              osVersion: "Windows 11 Enterprise 23H2",
              batteryHealthPct: 92,
              userEmail: "tech.engineer@assetops.local",
            },
            {
              serialNumber: `HPEB${Math.floor(10000000 + Math.random() * 90000000)}Z`,
              model: "EliteBook 840 G8",
              manufacturer: "HP",
              osVersion: "Windows 11 Pro",
              batteryHealthPct: 38, // Degraded battery
              userEmail: "director@assetops.local",
            },
          ],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMdmStatus(`✓ Successfully synced 2 devices from Microsoft Intune (${data.created} enrolled, ${data.updated} updated)`);
      } else {
        setMdmStatus("Failed to sync MDM webhook.");
      }
    } catch {
      setMdmStatus("Connection error during MDM test.");
    } finally {
      setMdmTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network & MDM Auto-Discovery"
        subtitle="Zero-manual data entry: probe enterprise subnets via ICMP/SNMP and ingest laptops automatically via Microsoft Intune & Jamf."
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

      {/* Subnet Scanner HUD */}
      <div className="card p-4 border border-line bg-surface flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent">
            <Wifi className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-fg uppercase tracking-wider">Subnet Probe Target</div>
            <div className="text-xs text-dim">
              Scanning active ARP tables, ICMP echo replies, and SNMP sysDescr ports.
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
            <option value="10.0.1.0/24">10.0.1.0/24 (HQ Data Center & Core Network)</option>
            <option value="192.168.1.0/24">192.168.1.0/24 (Lagos Victoria Island Office)</option>
            <option value="172.16.20.0/24">172.16.20.0/24 (Abuja CBD Operations Subnet)</option>
            <option value="10.40.0.0/24">10.40.0.0/24 (Ibadan Substation Project Site)</option>
          </select>
        </div>
      </div>

      {/* Discovered Devices Table */}
      <Card pad={false} title={`Discovered Network Equipment (${devices.length} Live Hosts)`}>
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
                    <td className="td font-mono text-accent text-xs font-semibold">{d.ip}</td>
                    <td className="td font-medium text-fg">{d.hostname}</td>
                    <td className="td font-mono text-dim text-xs">{d.mac}</td>
                    <td className="td">
                      <div className="font-medium text-fg">{d.vendor}</div>
                      <div className="text-[11px] text-dim">{d.model}</div>
                    </td>
                    <td className="td">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-line bg-surface uppercase font-mono">
                        {d.typeCode}
                      </span>
                    </td>
                    <td className="td text-dim text-xs font-mono">
                      {d.ports.join(", ")}
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

      {/* MDM Webhook Card */}
      <Card title="MDM Cloud Ingestion (Microsoft Intune · Jamf · Google Workspace)">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 text-xs">
            <p className="text-dim leading-relaxed">
              Eliminate manual laptop spreadsheets forever. Point your MDM provider&apos;s webhook to AssetOps to automatically register every deployed machine, synchronize real-time battery health percentages, and update user assignments when laptops are issued.
            </p>
            <div className="p-2.5 rounded bg-raised/60 border border-line font-mono text-[11px] text-fg break-all">
              POST https://your-domain.com/api/mdm/sync
            </div>
            <div className="text-dim text-[11px]">
              Headers: <code className="font-mono text-fg">Authorization: Bearer [API_KEY]</code>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-line bg-surface/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-fg mb-1">
                <Laptop className="h-4 w-4 text-accent" />
                Live MDM Webhook Test Simulator
              </div>
              <p className="text-[11px] text-dim mb-3">
                Simulates an incoming Intune device enrollment event with 2 enterprise laptops.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={handleTestMdm}
                disabled={mdmTesting}
                className="btn btn-ghost border border-line text-xs py-1.5 px-3 w-full flex items-center justify-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5 text-accent" />
                {mdmTesting ? "Simulating Webhook…" : "Test Intune Webhook Sync"}
              </button>

              {mdmStatus && (
                <p className="text-[11px] text-ok mt-2 font-medium">{mdmStatus}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
