import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { CATEGORIES, CATEGORY_META, type Category } from "../lib/categories";
import { addResource } from "../lib/resources";

const DELHI_CENTER: [number, number] = [28.6139, 77.209];

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
  return position ? <Marker position={position} /> : null;
}

const inputClass =
  "w-full rounded-xl border border-ink-800/12 px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-ash-500 transition focus:outline-none focus:ring-2 focus:ring-ink-800/20 focus:border-ink-800/30";

const labelClass = "mb-1.5 block text-[0.8rem] font-semibold text-ink-800";

export function AddResourceModal({
  onClose,
  userLocation,
}: {
  onClose: () => void;
  userLocation: [number, number] | null;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("health");
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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-paper-50 shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-800/10 px-6 py-5">
          <h2 className="font-display text-xl font-semibold text-ink-950">
            Add a resource
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ash-500 transition hover:bg-ink-800/8 hover:text-ink-950"
            aria-label="Close"
          >
            ✕
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
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                      active
                        ? "border-transparent text-white shadow-sm"
                        : "border-ink-800/12 text-ash-600"
                    }`}
                    style={active ? { backgroundColor: meta.color } : undefined}
                  >
                    <span aria-hidden>{meta.icon}</span>
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>Pin the location (click on the map)</label>
            <div className="h-56 rounded-2xl overflow-hidden border border-ink-800/12">
              <MapContainer
                center={userLocation ?? DELHI_CENTER}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <PinPicker position={position} onPick={setPosition} />
              </MapContainer>
            </div>
            {position && (
              <p className="mt-1.5 text-[0.78rem] text-ash-500">
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
            <p className="mt-1 text-[0.72rem] text-ash-500">
              {description.length}/200
            </p>
          </div>

          {error && <p className="text-sm text-cat-health">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-ink-800/10 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-ash-600 transition hover:bg-ink-800/8"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-full bg-ink-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving…" : "Add resource"}
          </button>
        </div>
      </div>
    </div>
  );
}
