import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { SearchBar } from '../components/forms/SearchBar';
import { PlaceCard } from '../components/cards/PlaceCard';
import { MapView } from '../components/map/MapView';
import { MarkerLayer } from '../components/map/MarkerLayer';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { usePlaces } from '../hooks/usePlaces';
import { useCityStore } from '../store/useCityStore';
import { useFilterStore } from '../store/useFilterStore';
import { Map, List, Tag, SlidersHorizontal } from 'lucide-react';

export const Explore = () => {
  const currentCity = useCityStore((state) => state.currentCity);
  const { places, loading, isUsingFallback } = usePlaces();
  const { budgetMode, resetFilters } = useFilterStore();

  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'list', 'map'

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Page Header & View Mode Switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100">
                Explore {currentCity.name}
              </h1>
              {isUsingFallback && (
                <Badge variant="sample">Sample Data</Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Discover attractions, food, hotels, cafes & budget spots ({places.length} places available)</p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 self-end">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'split' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'map' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" /> Map
            </button>
          </div>
        </div>

        {/* Search Bar & Category Chips */}
        <SearchBar />

        {/* Main Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        ) : places.length === 0 ? (
          <EmptyState
            title="No places match your filters"
            description="Try clearing search filters or turning off Budget Mode."
            actionLabel="Reset All Filters"
            onAction={resetFilters}
          />
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'list'
              ? 'grid-cols-1'
              : viewMode === 'map'
              ? 'grid-cols-1'
              : 'grid-cols-1 lg:grid-cols-12'
          }`}>
            
            {/* Places Cards List */}
            {viewMode !== 'map' && (
              <div className={`${
                viewMode === 'split' ? 'lg:col-span-6 space-y-4 max-h-[750px] overflow-y-auto pr-1' : 'w-full'
              }`}>
                <div className={`grid gap-4 ${
                  viewMode === 'split'
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {places.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      isSelected={selectedPlaceId === place.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Leaflet Map */}
            {viewMode !== 'list' && (
              <div className={`${viewMode === 'split' ? 'lg:col-span-6 h-[750px] sticky top-20' : 'h-[700px]'}`}>
                <MapView center={currentCity} zoom={13}>
                  <MarkerLayer
                    places={places}
                    selectedPlaceId={selectedPlaceId}
                    onSelectPlace={(p) => setSelectedPlaceId(p.id)}
                  />
                </MapView>
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
};
