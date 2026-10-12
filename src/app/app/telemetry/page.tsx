"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Badge } from "@/components/ui";
import { Activity, BatteryCharging, Thermometer, Zap, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

interface TelemetryItem {
  assetId: string;
  tag: string;
  name: string;
  type: string;
  location: string;
  batteryHealthPct: number | null;
  temperatureC: number;
  lineVoltageV: number;
  loadPct: number;
  status: "ALERT" | "NORMAL";
  lastTelemetryTime: string;
}

export default function TelemetryPage() {
  const [telemetry, setTelemetry] = useState<TelemetryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchedWo, setDispatchedWo] = useState<{ id: string; number: number; title: string } | null>(null);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch("/api/telemetry");
      const d = await res.json();
      if (d.telemetry) setTelemetry(d.telemetry);
    } catch (e) {
      console.error("Failed to load telemetry", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  const triggerTrap = async (sensorType: "BATTERY_LOW" | "THERMAL_SPIKE", assetId: string, value: number) => {
    setDispatching(true);
    setDispatchedWo(null);
    try {
      const res = await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId, sensorType, value }),
      });
      const data = await res.json();
      if (res.ok && data.workOrder) {
        setDispatchedWo(data.workOrder);
        fetchTelemetry();
      } else {
        alert(data.error ?? "Failed to trigger automated trap");
      }
    } catch {
      alert("Connection error during trap test");
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live IoT & SNMP Infrastructure Telemetry"
        subtitle="Continuous sensor polling for smart UPS batteries, server room environmental probes, and grid voltages with automatic Critical Work Order dispatch."
        actions={
          <button
            onClick={fetchTelemetry}
            className="btn btn-ghost text-xs border border-line flex items-center gap-1.5"
          >
            <Activity className="h-3.5 w-3.5 text-accent animate-pulse" />
            Live Polling Active (10s)
          </button>
        }
      />

      {/* Auto-Dispatch Rules Banner */}
      <div className="card p-4 border border-line bg-surface/90 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dim">
          <ShieldAlert className="h-4 w-4 text-warn" />
          Active IoT Automated Dispatch Guardrails
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-bad/30 bg-bad/5 flex items-start gap-2.5">
            <BatteryCharging className="h-4 w-4 text-bad shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-fg block">Rule 1: UPS Battery Health &lt; 40%</span>
              <span className="text-dim">
                Automatically dispatches a Critical Work Order with a guaranteed 4-hour vendor SLA before power backup fails.
              </span>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-warn/30 bg-warn/5 flex items-start gap-2.5">
            <Thermometer className="h-4 w-4 text-warn shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-fg block">Rule 2: Ambient Temperature &gt; 28.0°C</span>
              <span className="text-dim">
                Triggers immediate cooling maintenance dispatch to prevent thermal throttling and server motherboard damage.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Dispatched Notice */}
      {dispatchedWo && (
        <div className="card p-4 border border-ok/40 bg-ok/10 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-ok shrink-0" />
            <div>
              <div className="text-xs font-bold text-fg">
                Automated Critical Work Order Created: WO-{dispatchedWo.number}
              </div>
              <div className="text-xs text-mute">{dispatchedWo.title}</div>
            </div>
          </div>
          <Link
            href={`/app/work-orders/${dispatchedWo.id}`}
            className="btn btn-primary text-xs shrink-0 flex items-center gap-1 font-bold"
          >
            Open Work Order <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Telemetry Sensor Feeds Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {telemetry.map((t) => {
          const isAlert = t.status === "ALERT";

          return (
            <Card key={t.assetId} className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <Link
                      href={`/app/assets/${t.assetId}`}
                      className="font-mono text-xs text-accent hover:underline font-semibold block"
                    >
                      {t.tag}
                    </Link>
                    <div className="font-semibold text-sm text-fg">{t.name}</div>
                  </div>
                  {isAlert ? (
                    <Badge tone="bad">Alert</Badge>
                  ) : (
                    <Badge tone="ok">Normal</Badge>
                  )}
                </div>

                <div className="text-xs text-dim mb-4">
                  📍 {t.location} • <span className="font-mono">{t.type}</span>
                </div>

                {/* Sensor Gauges */}
                <div className="space-y-3 pt-3 border-t border-line text-xs">
                  {t.batteryHealthPct !== null && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-dim flex items-center gap-1">
                          <BatteryCharging className="h-3.5 w-3.5" /> Battery Health
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            t.batteryHealthPct < 40 ? "text-bad" : "text-ok"
                          }`}
                        >
                          {t.batteryHealthPct}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-raised overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            t.batteryHealthPct < 40 ? "bg-bad" : "bg-ok"
                          }`}
                          style={{ width: `${t.batteryHealthPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-dim flex items-center gap-1">
                      <Thermometer className="h-3.5 w-3.5" /> Core Temperature
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        t.temperatureC > 28 ? "text-bad" : "text-fg"
                      }`}
                    >
                      {t.temperatureC}°C
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-dim flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5" /> Line Voltage
                    </span>
                    <span className="font-mono font-medium text-fg">
                      {t.lineVoltageV} V
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Trigger Buttons for Testing */}
              <div className="pt-4 border-t border-line mt-4 flex items-center gap-2">
                {t.batteryHealthPct !== null && t.batteryHealthPct < 40 ? (
                  <button
                    type="button"
                    onClick={() => triggerTrap("BATTERY_LOW", t.assetId, t.batteryHealthPct!)}
                    disabled={dispatching}
                    className="btn btn-primary w-full text-xs py-1.5 flex items-center justify-center gap-1 font-bold"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Auto-Dispatch Battery WO (4h SLA)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => triggerTrap("THERMAL_SPIKE", t.assetId, 32.5)}
                    disabled={dispatching}
                    className="btn btn-ghost w-full border border-line text-xs py-1.5 flex items-center justify-center gap-1 text-dim hover:text-fg"
                  >
                    Simulate Thermal Trap (32.5°C)
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
