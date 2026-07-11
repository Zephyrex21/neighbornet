import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { divIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { X, MapPin } from "lucide-react";
import { CATEGORIES, CATEGORY_META, type Category } from "../lib/categories";
import { ACCESS_TYPES, ACCESS_META, type AccessType } from "../lib/access";
import { addResource } from "../lib/resources";
import type { Theme } from "../hooks/useTheme";

const INDIA_CENTER: [number, number] = [21.1458, 79.0882];

const TILE_URLS: Record<Theme, string> = {
  light: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

const pickerIcon = divIcon({
  className: "",
  html: `<div style="display:flex;align-items:center;justify-content:center;transform:translateY(-50%);filter:drop-shadow(0 2px 4px rgba(16,22,31,0.4));">
    ${renderToStaticMarkup(<MapPin size={32} color="#c026d3" fill="#e879f9" strokeWidth={1.75} />)}
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function PinPicker({
  position,
  onPick,
}: {
  position: [number, number] | null;
  onPick: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} icon={pickerIcon} /> : null;
}

const inputClass =
  "w-full rounded-lg border border-ink-800/12 bg-white px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-ash-500 transition focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500/50 dark:border-white/12 dark:bg-ink-800 dark:text-white dark:placeholder:text-paper-300/40";

const labelClass = "mb-1.5 block font-mono text-[0.72rem] font-semibold uppercase tracking-wide text-ink-700 dark:text-paper-300/70";

export function AddResourceModal({
  onClose,
  userLocation,
  theme,
}: {
  onClose: () => void;
  userLocation: [number, number] | null;
  theme: Theme;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("health");
  const [access, setAccess] = useState<AccessType>("open");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState<[number, number] | null>(
    userLocation
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim() && address.trim() && position && !submitting;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSubmit = async () => {
    if (!position) {
      setError("Please pick a location by clicking the map.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await addResource({
        name: name.trim(),
        category,
        access,
        lat: position[0],
        lng: position[1],
        address: address.trim(),
        hours: hours.trim(),
        contact: contact.trim() || undefined,
        description: description.trim() || undefined,
        source: "user",
      });
      onClose();
    } catch (e) {
      setError("Couldn't save. Please try again.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-paper-50 shadow-2xl dark:bg-ink-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink-800/10 px-6 py-5 dark:border-white/10">
          <h2 className="font-display text-xl font-semibold text-ink-950 dark:text-white">
            Add a resource
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ash-500 transition hover:bg-ink-800/8 hover:text-ink-950 dark:text-paper-300/60 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className={labelClass}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Community Health Clinic"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat];
                const Icon = meta.icon;
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 font-mono text-[0.8rem] font-medium uppercase tracking-wide transition-all ${
                      active
                        ? "border-transparent text-white shadow-sm"
                        : "border-ink-800/12 text-ash-600 dark:border-white/12 dark:text-paper-300/70"
                    }`}
                    style={active ? { backgroundColor: meta.color } : undefined}
                  >
                    <Icon size={15} strokeWidth={2.25} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>Who can use it?</label>
            <div className="flex flex-wrap gap-2">
              {ACCESS_TYPES.map((a) => {
                const meta = ACCESS_META[a];
                const active = access === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAccess(a)}
                    className={`rounded-lg border px-3.5 py-1.5 text-left text-[0.8rem] font-medium transition-all ${
                      active
                        ? "border-transparent text-white shadow-sm"
                        : "border-ink-800/12 text-ash-600 dark:border-white/12 dark:text-paper-300/70"
                    }`}
                    style={active ? { backgroundColor: meta.color } : undefined}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[0.78rem] text-ash-500 dark:text-paper-300/50">
              {ACCESS_META[access].description}
            </p>
          </div>

          <div>
            <label className={labelClass}>Pin the location (click on the map)</label>
            <div className="relative isolate z-0 h-56 rounded-lg overflow-hidden border border-ink-800/12 dark:border-white/12">
              <MapContainer
                center={userLocation ?? INDIA_CENTER}
                zoom={userLocation ? 13 : 5}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  key={theme}
                  attribution='&copy; OpenStreetMap &copy; CARTO'
                  url={TILE_URLS[theme]}
                />
                <PinPicker position={position} onPick={setPosition} />
              </MapContainer>
            </div>
            {position && (
              <p className="mt-1.5 text-[0.78rem] text-ash-500 dark:text-paper-300/50">
                Pinned at {position[0].toFixed(4)}, {position[1].toFixed(4)}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, area, landmark"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Hours</label>
              <input
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Mon–Sat 9am–5pm"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Contact (optional)</label>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Phone or email"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              placeholder="What this place offers…"
              rows={2}
              className={inputClass}
            />
            <p className="mt-1 text-[0.72rem] text-ash-500 dark:text-paper-300/40">
              {description.length}/200
            </p>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-ink-800/10 px-6 py-4 dark:border-white/10">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-ash-600 transition hover:bg-ink-800/8 dark:text-paper-300/70 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-gradient-brand bg-gradient-brand-hover rounded-lg px-5 py-2 text-sm font-medium text-white shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving…" : "Add resource"}
          </button>
        </div>
      </div>
    </div>
  );
}
