import { useMemo, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import { ViewToggle } from "./components/ViewToggle";
import { CategoryFilter } from "./components/CategoryFilter";
import { SearchBar } from "./components/SearchBar";
import { MapView } from "./components/MapView";
import { ListView } from "./components/ListView";
import { AddResourceModal } from "./components/AddResourceModal";
import { useResources } from "./hooks/useResources";
import { useGeolocation } from "./hooks/useGeolocation";
import { CATEGORIES, type Category } from "./lib/categories";
import { distanceKm } from "./lib/distance";
import { MapPin } from "lucide-react";

const GITHUB_URL = "https://github.com/Zephyrex21/neighbornet";
const LIVE_URL = "https://neighbornet-ten.vercel.app/";

function App() {
  const { resources, loading } = useResources();
  const { location, locate, loading: locating } = useGeolocation();

  const [view, setView] = useState<"map" | "list">("map");
  const [selectedCategories, setSelectedCategories] =
    useState<Category[]>(CATEGORIES);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const userLocation: [number, number] | null = location
    ? [location.lat, location.lng]
    : null;

  const filtered = useMemo(() => {
    let result = resources.filter((r) =>
      selectedCategories.includes(r.category)
    );
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q)
      );
    }
    if (userLocation) {
      result = [...result].sort(
        (a, b) =>
          distanceKm(userLocation[0], userLocation[1], a.lat, a.lng) -
          distanceKm(userLocation[0], userLocation[1], b.lat, b.lng)
      );
    }
    return result;
  }, [resources, selectedCategories, search, userLocation]);

  return (
    <div className="min-h-screen bg-paper-50">
      <Navbar onAdd={() => setShowAddModal(true)} githubUrl={GITHUB_URL} />
      <Hero onAdd={() => setShowAddModal(true)} />

      <section id="explore" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-medium text-ink-950 sm:text-3xl">
              Explore the map
            </h2>
            <p className="mt-1 text-[0.9rem] text-ash-500">
              {filtered.length} resource{filtered.length !== 1 ? "s" : ""}{" "}
              {selectedCategories.length < CATEGORIES.length ? "matching your filters" : "in New Delhi"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-t-3xl border border-b-0 border-ink-800/10 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <ViewToggle view={view} onChange={setView} />
        </div>
        <div className="border-x border-ink-800/10 bg-white px-5 py-4">
          <CategoryFilter
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>

        <div className="h-[70vh] overflow-hidden rounded-b-3xl border border-t-0 border-ink-800/10 shadow-sm">
          {loading ? (
            <div className="flex h-full items-center justify-center text-ash-500">
              Loading resources…
            </div>
          ) : view === "map" ? (
            <MapView resources={filtered} userLocation={userLocation} />
          ) : (
            <ListView resources={filtered} userLocation={userLocation} />
          )}
        </div>

        <button
          onClick={locate}
          disabled={locating}
          className="mt-4 flex items-center gap-1.5 rounded-full border border-ink-800/15 bg-white px-4 py-2 text-sm font-medium text-ink-800 shadow-sm transition hover:border-ink-800/30 disabled:opacity-50"
        >
          <MapPin size={15} />
          {locating ? "Locating…" : "Use my location"}
        </button>
      </section>

      <Footer githubUrl={GITHUB_URL} liveUrl={LIVE_URL} />

      {showAddModal && (
        <AddResourceModal
          onClose={() => setShowAddModal(false)}
          userLocation={userLocation}
        />
      )}
    </div>
  );
}

export default App;
