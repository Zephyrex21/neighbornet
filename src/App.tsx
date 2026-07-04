import { useMemo, useState } from "react";
import { Header } from "./components/Header";
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
    <div className="flex h-screen flex-col bg-paper-50">
      <Header onLocate={locate} locating={locating} onAdd={() => setShowAddModal(true)} />

      <div className="flex flex-col gap-3 border-b border-paper-300 bg-paper-50 px-5 py-3.5">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <ViewToggle view={view} onChange={setView} />
        </div>
        <CategoryFilter
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />
      </div>

      <main className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex h-full items-center justify-center text-ash-500">
            Loading resources…
          </div>
        ) : view === "map" ? (
          <MapView resources={filtered} userLocation={userLocation} />
        ) : (
          <ListView resources={filtered} userLocation={userLocation} />
        )}
      </main>

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
