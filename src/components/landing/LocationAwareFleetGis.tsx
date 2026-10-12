"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe2,
  MapPin,
  ArrowRight,
  Navigation,
  CheckCircle2,
  Radio,
  Server,
  Zap,
} from "lucide-react";

interface DetectedLocation {
  city: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  source: "timezone" | "ip" | "gps";
}

// Timezone to city/country mapping dictionary for instant client-side detection
const TIMEZONE_MAP: Record<string, { city: string; country: string; lat: number; lng: number }> = {
  "Africa/Lagos": { city: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
  "Africa/Abuja": { city: "Abuja", country: "Nigeria", lat: 9.0765, lng: 7.3986 },
  "Africa/Accra": { city: "Accra", country: "Ghana", lat: 5.6037, lng: -0.187 },
  "Africa/Nairobi": { city: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
  "Africa/Johannesburg": { city: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473 },
  "Europe/London": { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  "Europe/Paris": { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  "Europe/Berlin": { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  "America/New_York": { city: "New York", country: "United States", lat: 40.7128, lng: -74.006 },
  "America/Chicago": { city: "Chicago", country: "United States", lat: 41.8781, lng: -87.6298 },
  "America/Los_Angeles": { city: "Los Angeles", country: "United States", lat: 34.0522, lng: -118.2437 },
  "America/Toronto": { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  "Asia/Dubai": { city: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708 },
  "Asia/Singapore": { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  "Asia/Tokyo": { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  "Australia/Sydney": { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
};

export default function LocationAwareFleetGis() {
  const [loc, setLoc] = useState<DetectedLocation>({
    city: "Lagos",
    region: "Lagos State",
    country: "Nigeria",
    lat: 6.5244,
    lng: 3.3792,
    source: "timezone",
  });
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    // 1. Instant detection via client timezone (zero latency, no permissions required)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && TIMEZONE_MAP[tz]) {
        const mapped = TIMEZONE_MAP[tz];
        setLoc({
          city: mapped.city,
          region: mapped.city,
          country: mapped.country,
          lat: mapped.lat,
          lng: mapped.lng,
          source: "timezone",
        });
      } else if (tz) {
        // Fallback parse city name from standard tz string like "Europe/Dublin" -> "Dublin"
        const parts = tz.split("/");
        const cityGuess = parts[1]?.replace(/_/g, " ") || "Lagos";
        setLoc((prev) => ({
          ...prev,
          city: cityGuess,
          country: parts[0] || prev.country,
        }));
      }
    } catch {
      // Keep default
    }

    // 2. Non-blocking enhancement via fast IP location lookup
    const ac = new AbortController();
    fetch("https://ipapi.co/json/", { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        if (data && data.city) {
          setLoc({
            city: data.city,
            region: data.region || data.city,
            country: data.country_name || "Enterprise Region",
            lat: data.latitude || 6.5244,
            lng: data.longitude || 3.3792,
            source: "ip",
          });
        }
      })
      .catch(() => {
        // Soft fallback to timezone resolution already set
      });

    return () => ac.abort();
  }, []);

  function requestPreciseLocation() {
    if (!navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocode via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.state_district ||
              data.address?.state ||
              "Your Location";
            const country = data.address?.country || loc.country;
            setLoc({
              city,
              region: data.address?.state || city,
              country,
              lat: latitude,
              lng: longitude,
              source: "gps",
            });
          }
        } catch {
          setLoc((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            source: "gps",
          }));
        } finally {
          setIsDetecting(false);
        }
      },
      () => {
        setIsDetecting(false);
      },
      { timeout: 8000 }
    );
  }

  // Dynamic secondary facilities connected to user's city
  const isLagos = loc.city.toLowerCase().includes("lagos");
  const secondaryNode1 = isLagos ? "Abuja CBD Hub" : "Lagos Primary DC";
  const secondaryUnits1 = isLagos ? "4,120 Units" : "5,410 Units";
  const secondaryStatus1 = isLagos ? "Sub-Minute Sync" : "Tier III Active";

  const secondaryNode2 = "Regional Edge Grid";
  const secondaryUnits2 = "1,840 Units";
  const secondaryStatus2 = "Substation RTU";

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center font-sans">
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold">
            <Globe2 className="h-3.5 w-3.5 text-teal-600" />
            <span>Zero-License Fleet GIS</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>
              Detected: <b>{loc.city}</b>, {loc.country}
            </span>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
          Headquarter data centers to remote project sites.
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
          100% keyless OpenStreetMap vector clustering. Automatically routed to your nearest edge facility in{" "}
          <strong className="text-slate-900 font-bold">{loc.city}</strong> with zero Google Maps or Mapbox monthly billing invoices.
        </p>

        {/* Dynamic Location-Aware Visual Chips */}
        <div className="grid sm:grid-cols-3 gap-2.5 font-mono pt-2">
          {/* Active Local Node Card */}
          <div className="p-3 rounded-xl bg-teal-50/70 border-2 border-teal-300 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="text-[9px] text-teal-800 uppercase font-bold">
                {loc.city} Local Hub
              </div>
              <span className="text-[9px] font-bold text-teal-800 bg-teal-200/70 px-1.5 py-0.2 rounded">
                NEAREST
              </span>
            </div>
            <div className="font-black text-slate-950 mt-0.5 text-sm">5,410 Units</div>
            <div className="text-[10px] text-teal-700 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping" />
              Connected (~0.8ms)
            </div>
          </div>

          {/* Secondary Hub */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-[9px] text-slate-400 uppercase font-bold">{secondaryNode1}</div>
            <div className="font-black text-slate-900 mt-0.5 text-sm">{secondaryUnits1}</div>
            <div className="text-[10px] text-cyan-700 font-bold">{secondaryStatus1}</div>
          </div>

          {/* Third Hub */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-[9px] text-slate-400 uppercase font-bold">{secondaryNode2}</div>
            <div className="font-black text-slate-900 mt-0.5 text-sm">{secondaryUnits2}</div>
            <div className="text-[10px] text-amber-700 font-bold">{secondaryStatus2}</div>
          </div>
        </div>

        <div className="pt-3 font-mono flex items-center gap-3 flex-wrap">
          <Link
            href="/app/locations"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition"
          >
            Inspect {loc.city} Fleet Map <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={requestPreciseLocation}
            disabled={isDetecting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition"
          >
            <Navigation className={`h-3.5 w-3.5 text-teal-600 ${isDetecting ? "animate-spin" : ""}`} />
            <span>{isDetecting ? "Detecting GPS..." : "Detect Exact GPS"}</span>
          </button>
        </div>
      </div>

      {/* Visual Map Radar Canvas with Live User Node */}
      <div className="h-72 rounded-3xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center font-mono shadow-sm">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Connecting vector dashed line between user location and secondary node */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="28%"
            y1="38%"
            x2="68%"
            y2="28%"
            stroke="#0d9488"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <line
            x1="28%"
            y1="38%"
            x2="38%"
            y2="72%"
            stroke="#0d9488"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />
        </svg>

        {/* Node 1: User's Detected City */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
          <div className="w-8 h-8 rounded-full bg-teal-500/25 flex items-center justify-center animate-ping absolute" />
          <div className="w-5 h-5 rounded-full bg-teal-600 border-2 border-white shadow-md relative z-10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <div className="mt-1 bg-white px-2.5 py-1 rounded-xl shadow-md border-2 border-teal-300 text-[10.5px] font-bold text-teal-950 whitespace-nowrap flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
            {loc.city} Local Hub (Active)
          </div>
        </div>

        {/* Node 2: Secondary Hub */}
        <div className="absolute top-1/4 right-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-sm" />
          <div className="mt-1 bg-white/95 px-2.5 py-1 rounded-xl shadow-sm border border-slate-200 text-[10px] font-semibold text-slate-800 whitespace-nowrap">
            {secondaryNode1} ({secondaryUnits1})
          </div>
        </div>

        {/* Node 3: Third Hub */}
        <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm" />
          <div className="mt-1 bg-white/95 px-2.5 py-1 rounded-xl shadow-sm border border-slate-200 text-[10px] font-semibold text-slate-800 whitespace-nowrap">
            {secondaryNode2} ({secondaryUnits2})
          </div>
        </div>

        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-xl border border-slate-200 text-[10px] text-slate-600 shadow-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Vector Mesh · Localized to <b>{loc.city}</b> · ₦0 API Billing</span>
        </div>
      </div>
    </div>
  );
}
