"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Map as LeafletMap, CircleMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapLocationData {
  id: string;
  name: string;
  city?: string | null;
  code?: string | null;
  lat: number;
  lng: number;
  assets: number;
  atRisk: number;
  openWorkOrders: number;
  cost12m: number;
}

interface LocationMapProps {
  locations: MapLocationData[];
  selectedId?: string;
  heightClass?: string;
}

const TILE_LAYERS = {
  dark: {
    name: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  },
  streets: {
    name: "Streets",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 19,
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    subdomains: "",
    maxZoom: 18,
  },
};

function formatNaira(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

export default function LocationMap({
  locations,
  selectedId,
  heightClass = "h-[460px]",
}: LocationMapProps) {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<CircleMarker[]>([]);

  const [activeLayer, setActiveLayer] = useState<keyof typeof TILE_LAYERS>("dark");
  const [selectedLocation, setSelectedLocation] = useState<MapLocationData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;
    if (!mapContainerRef.current) return;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default bounds: center of Nigeria
      const defaultCenter: [number, number] = [9.082, 8.6753];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 6,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
      });

      // Add zoom control in top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Add Base Tile Layer
      const layerCfg = TILE_LAYERS[activeLayer];
      const tileLayer = L.tileLayer(layerCfg.url, {
        attribution: layerCfg.attribution,
        subdomains: layerCfg.subdomains,
        maxZoom: layerCfg.maxZoom,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;

      // Add markers
      const validLocs = locations.filter((loc) => typeof loc.lat === "number" && typeof loc.lng === "number");
      const maxAssets = Math.max(1, ...validLocs.map((l) => l.assets));
      const markers: CircleMarker[] = [];
      const latLngBounds: [number, number][] = [];

      validLocs.forEach((loc) => {
        const radius = Math.max(7, Math.min(22, 7 + (loc.assets / maxAssets) * 15));
        const hasRisk = loc.atRisk > 0;
        const color = hasRisk ? "#f87171" : "#2dd4bf";
        const fillColor = hasRisk ? "#ef4444" : "#14b8a6";

        const marker = L.circleMarker([loc.lat, loc.lng], {
          radius,
          color,
          weight: loc.id === selectedId ? 3 : 1.5,
          fillColor,
          fillOpacity: loc.id === selectedId ? 0.75 : 0.45,
        });

        // Tooltip
        marker.bindTooltip(
          `<div class="font-medium text-xs">${loc.name}</div><div class="text-[10px] text-gray-300">${loc.assets} assets &bull; ${loc.atRisk} at risk</div>`,
          {
            direction: "top",
            offset: [0, -radius],
            className: "leaflet-dark-tooltip",
          }
        );

        // Click popup & selection
        marker.on("click", () => {
          setSelectedLocation(loc);
          map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 8), { duration: 0.8 });
        });

        marker.addTo(map);
        markers.push(marker);
        latLngBounds.push([loc.lat, loc.lng]);
      });

      markersRef.current = markers;

      // Fit map to bounds
      if (latLngBounds.length > 0) {
        if (selectedId) {
          const sel = validLocs.find((l) => l.id === selectedId);
          if (sel) {
            map.setView([sel.lat, sel.lng], 10);
            setSelectedLocation(sel);
          } else {
            map.fitBounds(latLngBounds, { padding: [40, 40] });
          }
        } else {
          map.fitBounds(latLngBounds, { padding: [40, 40] });
        }
      }

      setIsLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, selectedId]);

  // Handle Tile Layer Switch
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    import("leaflet").then((L) => {
      if (!mapInstanceRef.current) return;
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const layerCfg = TILE_LAYERS[activeLayer];
      const newLayer = L.tileLayer(layerCfg.url, {
        attribution: layerCfg.attribution,
        subdomains: layerCfg.subdomains,
        maxZoom: layerCfg.maxZoom,
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    });
  }, [activeLayer]);

  // Reset View handler
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    const validLocs = locations.filter((loc) => typeof loc.lat === "number" && typeof loc.lng === "number");
    const bounds = validLocs.map((l) => [l.lat, l.lng] as [number, number]);
    if (bounds.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
      setSelectedLocation(null);
    }
  };

  return (
    <div className="relative rounded-lg border border-line overflow-hidden bg-bg">
      {/* Map Header / Layer Controls */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 bg-surface/90 backdrop-blur-md px-2 py-1.5 rounded-md border border-line text-xs shadow-md">
        <span className="text-[11px] text-dim font-medium uppercase tracking-wider mr-1">Layer:</span>
        {(Object.keys(TILE_LAYERS) as Array<keyof typeof TILE_LAYERS>).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveLayer(key)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              activeLayer === key
                ? "bg-accent/20 text-accent border border-accent/40"
                : "text-dim hover:text-fg hover:bg-raised"
            }`}
          >
            {TILE_LAYERS[key].name}
          </button>
        ))}
        <div className="w-[1px] h-3 bg-line mx-1" />
        <button
          type="button"
          onClick={handleResetView}
          className="px-2 py-0.5 rounded text-[11px] text-dim hover:text-fg hover:bg-raised transition"
          title="Reset to show all locations"
        >
          Fit All
        </button>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-0`} />

      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-bg flex items-center justify-center text-dim text-xs z-10">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            Loading estate map...
          </div>
        </div>
      )}

      {/* Bottom overlay for selected location card */}
      {selectedLocation && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-[1000] bg-surface/95 backdrop-blur-md border border-line rounded-lg p-3 shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold text-fg text-sm flex items-center gap-1.5">
                {selectedLocation.name}
                {selectedLocation.code && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-raised border border-line text-dim">
                    {selectedLocation.code}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-dim">
                {selectedLocation.city ?? "Nigeria"} &bull; {selectedLocation.lat.toFixed(2)}°N, {selectedLocation.lng.toFixed(2)}°E
              </div>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-dim hover:text-fg text-xs p-1"
              title="Close"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-line text-center">
            <div className="bg-raised/40 rounded p-1.5">
              <div className="text-[10px] text-dim">Assets</div>
              <div className="font-medium text-xs text-fg">{selectedLocation.assets}</div>
            </div>
            <div className={`rounded p-1.5 ${selectedLocation.atRisk > 0 ? "bg-bad/10 text-bad" : "bg-raised/40 text-fg"}`}>
              <div className="text-[10px] text-dim">At Risk</div>
              <div className="font-medium text-xs">{selectedLocation.atRisk}</div>
            </div>
            <div className="bg-raised/40 rounded p-1.5">
              <div className="text-[10px] text-dim">Cost (12m)</div>
              <div className="font-medium text-xs text-fg">{formatNaira(selectedLocation.cost12m)}</div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[11px] text-dim">
              {selectedLocation.openWorkOrders} open work order{selectedLocation.openWorkOrders === 1 ? "" : "s"}
            </span>
            <Link
              href={`/app/locations/${selectedLocation.id}`}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
            >
              View detail &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Custom Styles for Leaflet Dark Mode popups and tooltips */}
      <style jsx global>{`
        .leaflet-dark-tooltip {
          background: rgba(16, 18, 22, 0.95) !important;
          border: 1px solid #2e333c !important;
          color: #e8eaed !important;
          border-radius: 6px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
          padding: 4px 8px !important;
        }
        .leaflet-dark-tooltip:before {
          border-top-color: #2e333c !important;
        }
        .leaflet-container {
          background: #0a0b0d !important;
          font-family: inherit !important;
        }
        .leaflet-bar a {
          background-color: #15181d !important;
          color: #e8eaed !important;
          border-bottom: 1px solid #2e333c !important;
        }
        .leaflet-bar a:hover {
          background-color: #1e2229 !important;
          color: #ffffff !important;
        }
        .leaflet-control-attribution {
          background: rgba(10, 11, 13, 0.8) !important;
          color: #717885 !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a {
          color: #2dd4bf !important;
        }
      `}</style>
    </div>
  );
}
