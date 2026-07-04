import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Navigation, Clock, Phone } from "lucide-react";
import type { Resource } from "../lib/resources";
import { CATEGORY_META } from "../lib/categories";

const DELHI_CENTER: [number, number] = [28.6139, 77.209];

function categoryIcon(category: Resource["category"]) {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  const svg = renderToStaticMarkup(
    <Icon color="white" size={14} strokeWidth={2.25} />
  );
  return divIcon({
    className: "",
    html: `<div style="background:${meta.color};width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(16,22,31,0.35);">
      <div style="transform:rotate(45deg);display:flex;">${svg}</div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

const userIcon = divIcon({
  className: "",
  html: `<div style="background:#16202e;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 2px #16202e;display:flex;align-items:center;justify-content:center;">
    ${renderToStaticMarkup(<Navigation color="white" size={8} fill="white" />)}
  </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function RecenterMap({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
  }, [center, map]);
  return null;
}

export function MapView({
  resources,
  userLocation,
}: {
  resources: Resource[];
  userLocation: [number, number] | null;
}) {
  return (
    <MapContainer
      center={userLocation ?? DELHI_CENTER}
      zoom={12}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap center={userLocation} />
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}
      {resources.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]} icon={categoryIcon(r.category)}>
          <Popup>
            <div style={{ minWidth: 190, fontFamily: "'Inter', sans-serif" }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#0a0e17",
                }}
              >
                {r.name}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: CATEGORY_META[r.category].color,
                  margin: "2px 0 6px",
                }}
              >
                {CATEGORY_META[r.category].label}
              </div>
              <div style={{ fontSize: 13, color: "#334155" }}>{r.address}</div>
              {r.hours && (
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={12} color="#64748b" />
                  {r.hours}
                </div>
              )}
              {r.contact && (
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                  <Phone size={12} color="#64748b" />
                  {r.contact}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
