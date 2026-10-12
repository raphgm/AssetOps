"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPinPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  heightClass?: string;
}

const CITY_PRESETS: { name: string; lat: number; lng: number }[] = [
  { name: "Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Abuja", lat: 9.0765, lng: 7.3986 },
  { name: "Port Harcourt", lat: 4.8156, lng: 7.0498 },
  { name: "Ibadan", lat: 7.3775, lng: 3.947 },
  { name: "Kano", lat: 12.0022, lng: 8.592 },
  { name: "Enugu", lat: 6.4584, lng: 7.5464 },
  { name: "Kaduna", lat: 10.5105, lng: 7.4165 },
  { name: "Benin City", lat: 6.335, lng: 5.6037 },
  { name: "Jos", lat: 9.8965, lng: 8.8583 },
  { name: "Calabar", lat: 4.9757, lng: 8.3417 },
];

export default function MapPinPicker({
  initialLat,
  initialLng,
  onLocationChange,
  heightClass = "h-[300px]",
}: MapPinPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const [lat, setLat] = useState<number | "">(initialLat ?? "");
  const [lng, setLng] = useState<number | "">(initialLng ?? "");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!mapContainerRef.current) return;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const defaultLat = typeof initialLat === "number" ? initialLat : 9.0765; // Abuja default
      const defaultLng = typeof initialLng === "number" ? initialLng : 7.3986;

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: typeof initialLat === "number" ? 11 : 6,
        zoomControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      // OpenStreetMap standard tiles (100% free, open, no API key required)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        subdomains: "abc",
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Custom pulse icon for marker
      const customIcon = L.divIcon({
        className: "custom-pin-marker",
        html: `<div style="width: 22px; height: 22px; background: #2dd4bf; border: 2.5px solid #0a0b0d; border-radius: 50%; box-shadow: 0 0 10px rgba(45,212,191,0.8); cursor: grab;"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      // Place initial marker if coords exist
      if (typeof initialLat === "number" && typeof initialLng === "number") {
        const marker = L.marker([initialLat, initialLng], {
          icon: customIcon,
          draggable: true,
        }).addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          const newLat = parseFloat(pos.lat.toFixed(5));
          const newLng = parseFloat(pos.lng.toFixed(5));
          setLat(newLat);
          setLng(newLng);
          onLocationChange(newLat, newLng);
        });

        markerRef.current = marker;
      }

      // Click on map to place or move marker
      map.on("click", (e) => {
        const newLat = parseFloat(e.latlng.lat.toFixed(5));
        const newLng = parseFloat(e.latlng.lng.toFixed(5));
        setLat(newLat);
        setLng(newLng);
        onLocationChange(newLat, newLng);

        if (markerRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
        } else {
          const marker = L.marker([newLat, newLng], {
            icon: customIcon,
            draggable: true,
          }).addTo(map);

          marker.on("dragend", () => {
            const pos = marker.getLatLng();
            const dLat = parseFloat(pos.lat.toFixed(5));
            const dLng = parseFloat(pos.lng.toFixed(5));
            setLat(dLat);
            setLng(dLng);
            onLocationChange(dLat, dLng);
          });

          markerRef.current = marker;
        }
      });

      setIsLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const jumpToCity = (cLat: number, cLng: number) => {
    setLat(cLat);
    setLng(cLng);
    onLocationChange(cLat, cLng);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([cLat, cLng], 12, { duration: 1 });
      if (markerRef.current) {
        markerRef.current.setLatLng([cLat, cLng]);
      } else {
        import("leaflet").then((L) => {
          if (!mapInstanceRef.current) return;
          const customIcon = L.divIcon({
            className: "custom-pin-marker",
            html: `<div style="width: 22px; height: 22px; background: #2dd4bf; border: 2.5px solid #0a0b0d; border-radius: 50%; box-shadow: 0 0 10px rgba(45,212,191,0.8);"></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });
          const marker = L.marker([cLat, cLng], {
            icon: customIcon,
            draggable: true,
          }).addTo(mapInstanceRef.current);
          markerRef.current = marker;
        });
      }
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = parseFloat(pos.coords.latitude.toFixed(5));
        const uLng = parseFloat(pos.coords.longitude.toFixed(5));
        jumpToCity(uLat, uLng);
      },
      (err) => console.warn("Geolocation warning:", err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-dim">
          Click map to drop pin or choose quick city preset:
        </span>
        <button
          type="button"
          onClick={useCurrentLocation}
          className="text-accent hover:underline text-[11px] font-medium"
        >
          📍 Use current GPS location
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 pb-1">
        {CITY_PRESETS.map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={() => jumpToCity(city.lat, city.lng)}
            className="px-2 py-0.5 rounded text-[11px] bg-raised border border-line text-mute hover:text-fg hover:border-line2 transition"
          >
            {city.name}
          </button>
        ))}
      </div>

      <div className="relative rounded-lg border border-line overflow-hidden bg-bg">
        <div ref={mapContainerRef} className={`w-full ${heightClass}`} />
        {!isLoaded && (
          <div className="absolute inset-0 bg-bg flex items-center justify-center text-dim text-xs">
            Loading map picker...
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="label" htmlFor="loc-lat">
            Latitude (°N)
          </label>
          <input
            id="loc-lat"
            name="lat"
            type="number"
            step="0.0001"
            value={lat}
            onChange={(e) => {
              const v = e.target.value === "" ? "" : parseFloat(e.target.value);
              setLat(v);
              if (typeof v === "number" && typeof lng === "number") {
                onLocationChange(v, lng);
                markerRef.current?.setLatLng([v, lng]);
              }
            }}
            placeholder="e.g. 6.4500"
            className="input font-mono text-xs"
          />
        </div>
        <div>
          <label className="label" htmlFor="loc-lng">
            Longitude (°E)
          </label>
          <input
            id="loc-lng"
            name="lng"
            type="number"
            step="0.0001"
            value={lng}
            onChange={(e) => {
              const v = e.target.value === "" ? "" : parseFloat(e.target.value);
              setLng(v);
              if (typeof lat === "number" && typeof v === "number") {
                onLocationChange(lat, v);
                markerRef.current?.setLatLng([lat, v]);
              }
            }}
            placeholder="e.g. 3.4000"
            className="input font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}
