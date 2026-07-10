import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { divIcon, type DivIcon } from "leaflet";
import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Navigation, Clock, Phone } from "lucide-react";
import type { Resource } from "../lib/resources";
import { CATEGORIES, CATEGORY_META, type Category } from "../lib/categories";
import { ACCESS_META } from "../lib/access";
import type { Theme } from "../hooks/useTheme";

const INDIA_CENTER: [number, number] = [21.1458, 79.0882];

const TILE_URLS: Record<Theme, string> = {
  light: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

function buildCategoryIconCache(): Record<Category, DivIcon> {
  const cache = {} as Record<Category, DivIcon>;
  for (const category of CATEGORIES) {
    const meta = CATEGORY_META[category];
    const Icon = meta.icon;
    const svg = renderToStaticMarkup(
      <Icon color="white" size={14} strokeWidth={2.25} />
    );
    cache[category] = divIcon({
      className: "",
      html: `<div style="background:${meta.color};width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(16,22,31,0.35);">
        <div style="transform:rotate(45deg);display:flex;">${svg}</div>
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  }
  return cache;
}

const CATEGORY_ICONS = buildCategoryIconCache();

const userIcon = divIcon({
  className: "",
  html: `<div style="background:#16202e;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 2px #16202e;display:flex;align-items:center;justify-content:center;">
    ${renderToStaticMarkup(<Navigation color="white" size={8} fill="white" />)}
  </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function createClusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 34 : count < 50 ? 40 : count < 200 ? 46 : 52;
  return divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#4f46e5;border:3px solid white;box-shadow:0 2px 8px rgba(16,22,31,0.4);display:flex;align-items:center;justify-content:center;color:white;font-family:'JetBrains Mono',monospace;font-weight:600;font-size:${count < 100 ? 12 : 11}px;">${count}</div>`,
    className: "",
    iconSize: [size, size],
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
  theme,
}: {
  resources: Resource[];
  userLocation: [number, number] | null;
  theme: Theme;
}) {
  const popupText = theme === "dark" ? "#f1f3f6" : "#0a0e17";
  const popupMuted = theme === "dark" ? "#94a3b8" : "#64748b";
  const popupSecondary = theme === "dark" ? "#cbd5e1" : "#334155";

  return (
    <MapContainer
      center={userLocation ?? INDIA_CENTER}
      zoom={userLocation ? 12 : 5}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        key={theme}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={TILE_URLS[theme]}
      />
      <RecenterMap center={userLocation} />
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={55}
        spiderfyOnMaxZoom
        iconCreateFunction={createClusterIcon}
      >
        {resources.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]} icon={CATEGORY_ICONS[r.category]}>
          <Popup>
            <div style={{ minWidth: 190, fontFamily: "'Inter', sans-serif" }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  color: popupText,
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
              <div style={{ fontSize: 13, color: popupSecondary }}>{r.address}</div>
              <div
                style={{
                  display: "inline-block",
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: ACCESS_META[r.access ?? "open"].color,
                  border: `1px solid ${ACCESS_META[r.access ?? "open"].color}55`,
                  borderRadius: 20,
                  padding: "2px 8px",
                  marginTop: 6,
                }}
              >
                {ACCESS_META[r.access ?? "open"].label}
              </div>
              {r.hours && (
                <div style={{ fontSize: 12, color: popupMuted, marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={12} color={popupMuted} />
                  {r.hours}
                </div>
              )}
              {r.contact && (
                <div style={{ fontSize: 12, color: popupMuted, marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                  <Phone size={12} color={popupMuted} />
                  {r.contact}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
