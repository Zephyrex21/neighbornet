import { lazy, Suspense, useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import { ViewToggle } from "./components/ViewToggle";
import { CategoryFilter } from "./components/CategoryFilter";
import { AccessFilter } from "./components/AccessFilter";
import { SearchBar } from "./components/SearchBar";
import { MapView } from "./components/MapView";
import { useResources } from "./hooks/useResources";
import { useGeolocation } from "./hooks/useGeolocation";
import { useTheme } from "./hooks/useTheme";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { CATEGORIES, CATEGORY_META, type Category } from "./lib/categories";
import { ACCESS_TYPES, type AccessType } from "./lib/access";
import { filterAndSortResources } from "./lib/filterResources";
import { MapPin } from "lucide-react";

const GITHUB_URL = "https://github.com/Zephyrex21/neighbornet";
const LIVE_URL = "https://neighbornet-ten.vercel.app/";

const loadAddResourceModal = () =>
  import("./components/AddResourceModal").then((m) => ({ default: m.AddResourceModal }));
const loadListView = () =>
  import("./components/ListView").then((m) => ({ default: m.ListView }));

const AddResourceModal = lazy(loadAddResourceModal);
const ListView = lazy(loadListView);

function App() {
  const { resources, loading, error: resourcesError } = useResources();
  const { location, locate, loading: locating, error: locationError } = useGeolocation();
  const { theme, toggleTheme } = useTheme();

  const [view, setView] = useState<"map" | "list">("map");
  const [hasShownList, setHasShownList] = useState(false);
  const [selectedCategories, setSelectedCategoriesRaw] =
    useState<Category[]>(CATEGORIES);
  const [selectedAccess, setSelectedAccessRaw] =
    useState<AccessType[]>(ACCESS_TYPES);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 200);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Filter changes recompute the full resource list and rebuild map markers,
  // which is expensive at this data volume. Marking them as transitions lets
  // React keep the button's own click feedback instant while that heavier
  // work happens without blocking input. Wrapped in useCallback so memoized
  // child components (CategoryFilter, AccessFilter, ViewToggle) don't
  // re-render just because App re-rendered for an unrelated reason.
  const setSelectedCategories = useCallback((value: Category[]) => {
    startTransition(() => setSelectedCategoriesRaw(value));
  }, []);
  const setSelectedAccess = useCallback((value: AccessType[]) => {
    startTransition(() => setSelectedAccessRaw(value));
  }, []);
  const changeView = useCallback((value: "map" | "list") => {
    if (value === "list") {
      loadListView();
      setHasShownList(true);
    }
    startTransition(() => setView(value));
  }, []);
  const openAddModal = useCallback(() => setShowAddModal(true), []);
  const closeAddModal = useCallback(() => setShowAddModal(false), []);

  useEffect(() => {
    // The Add Resource modal is small and commonly used soon after landing —
    // prefetch it once the browser is idle so clicking it feels instant
    // instead of waiting on a network round-trip for the chunk.
    const idle =
      "requestIdleCallback" in window
        ? window.requestIdleCallback
        : (cb: () => void) => setTimeout(cb, 1500);
    const cancel =
      "cancelIdleCallback" in window ? window.cancelIdleCallback : clearTimeout;
    const id = idle(() => loadAddResourceModal());
    return () => cancel(id as number);
  }, []);

  const userLocation: [number, number] | null = useMemo(
    () => (location ? [location.lat, location.lng] : null),
    [location]
  );

  const filtered = useMemo(
    () =>
      filterAndSortResources(resources, {
        selectedCategories,
        selectedAccess,
        search: debouncedSearch,
        userLocation,
      }),
    [resources, selectedCategories, selectedAccess, debouncedSearch, userLocation]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      health: 0, food: 0, water: 0, shelter: 0, education: 0,
    };
    resources.forEach((r) => { counts[r.category]++; });
    return counts;
  }, [resources]);

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-950">
      <Navbar
        onAdd={openAddModal}
        githubUrl={GITHUB_URL}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <Hero onAdd={openAddModal} />

      <section id="explore" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-950 sm:text-3xl dark:text-white">
              Explore the map
            </h2>
            <p className="mt-1 font-mono text-[0.82rem] text-ash-500 dark:text-paper-300/50">
              {filtered.length} resource{filtered.length !== 1 ? "s" : ""}{" "}
              {selectedCategories.length < CATEGORIES.length ? "matching your filters" : "across 10 major Indian cities"}
              {isPending && <span className="ml-1 opacity-60">· updating…</span>}
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            return (
              <span
                key={cat}
                className="flex items-center gap-1.5 rounded-full border border-ink-800/8 bg-paper-100 px-2.5 py-1 text-[0.72rem] text-ash-500 dark:border-white/8 dark:bg-white/5 dark:text-paper-300/50"
                title={`${categoryCounts[cat]} ${meta.label.toLowerCase()} resources currently listed`}
              >
                <Icon size={12} style={{ color: meta.color }} />
                <span className="font-mono">{categoryCounts[cat]}</span>
                {meta.label}
              </span>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 rounded-t-2xl border border-b-0 border-ink-800/10 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-ink-900">
          <div className="flex-1 max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <ViewToggle view={view} onChange={changeView} />
        </div>
        <div className="space-y-3 border-x border-ink-800/10 bg-white px-5 py-4 dark:border-white/10 dark:bg-ink-900">
          <CategoryFilter
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />
          <AccessFilter selected={selectedAccess} onChange={setSelectedAccess} />
        </div>

        <div className="relative isolate z-0 h-[70vh] overflow-hidden rounded-b-2xl border border-t-0 border-ink-800/10 shadow-sm transition-opacity dark:border-white/10" style={{ opacity: isPending ? 0.7 : 1 }}>
          {resourcesError ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-paper-100 px-6 text-center dark:bg-ink-900">
              <p className="font-display text-lg text-ink-950 dark:text-white">
                Something went wrong
              </p>
              <p className="max-w-sm text-sm text-ash-500 dark:text-paper-300/50">
                {resourcesError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 rounded-lg border border-ink-800/15 px-4 py-2 text-sm font-medium text-ink-800 transition active:scale-95 hover:bg-ink-800/8 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
              >
                Reload
              </button>
            </div>
          ) : loading ? (
            <div className="flex h-full items-center justify-center text-ash-500 dark:bg-ink-900 dark:text-paper-300/50">
              Loading resources…
            </div>
          ) : (
            <>
              {/* Both views mount once and stay mounted — toggling `view`
                  only changes CSS visibility. Conditionally unmounting
                  MapView here would destroy and rebuild the entire Leaflet
                  map (tiles + all 744 clustered markers) every single time
                  the user clicked the view toggle, which was the single
                  biggest cause of that button feeling slow. */}
              <div
                className="absolute inset-0"
                style={
                  view === "map"
                    ? { visibility: "visible" }
                    : { visibility: "hidden", pointerEvents: "none" }
                }
              >
                <MapView resources={filtered} userLocation={userLocation} theme={theme} />
              </div>
              {hasShownList && (
                <div
                  className="absolute inset-0"
                  style={
                    view === "list"
                      ? { visibility: "visible" }
                      : { visibility: "hidden", pointerEvents: "none" }
                  }
                >
                  <Suspense
                    fallback={
                      <div className="flex h-full items-center justify-center text-ash-500 dark:bg-ink-900 dark:text-paper-300/50">
                        Loading list view…
                      </div>
                    }
                  >
                    <ListView resources={filtered} userLocation={userLocation} />
                  </Suspense>
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={locate}
          disabled={locating}
          className="mt-4 flex items-center gap-1.5 rounded-lg border border-ink-800/15 bg-white px-4 py-2 text-sm font-medium text-ink-800 shadow-sm transition active:scale-95 hover:border-ink-800/30 disabled:opacity-50 dark:border-white/15 dark:bg-ink-900 dark:text-white dark:hover:border-white/30"
        >
          <MapPin size={15} />
          {locating ? "Locating…" : "Use my location"}
        </button>
        {locationError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Couldn't get your location: {locationError}. You can still browse using search and filters.
          </p>
        )}
      </section>

      <Footer githubUrl={GITHUB_URL} liveUrl={LIVE_URL} />

      {showAddModal && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink-950/50 backdrop-blur-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>
          }
        >
          <AddResourceModal
            onClose={closeAddModal}
            userLocation={userLocation}
            theme={theme}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
