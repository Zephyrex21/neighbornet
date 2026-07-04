import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import { useEffect } from "react";
import type { Resource } from "../lib/resources";
import { CATEGORY_META } from "../lib/categories";

const DELHI_CENTER: [number, number] = [28.6139, 77.209];

function categoryIcon(category: Resource["category"]) {
  const meta = CATEGORY_META[category];
  return divIcon({
    className: "",
    html: `<div style="background:${meta.color};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);">
      <span style="transform:rotate(45deg);font-size:13px;">${meta.icon}</span>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

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
        <Marker
          position={userLocation}
          icon={divIcon({
            className: "",
            html: `<div style="background:#111827;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 2px #111827;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })}
        >
          <Popup>You are here</Popup>
        </Marker>
      )}
      {resources.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]} icon={categoryIcon(r.category)}>
          <Popup>
            <div style={{ minWidth: 190, fontFamily: "'IBM Plex Sans', sans-serif" }}>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#10161f",
                }}
              >
                {r.name}
              </div>
              <div
                style={{
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
              <div style={{ fontSize: 13, color: "#3a4048" }}>{r.address}</div>
              {r.hours && (
                <div style={{ fontSize: 12, color: "#756f63", marginTop: 4 }}>
                  🕒 {r.hours}
                </div>
              )}
              {r.contact && (
                <div style={{ fontSize: 12, color: "#756f63" }}>
                  📞 {r.contact}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
