import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { PlaceCard } from '../components/cards/PlaceCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { usePlaces } from '../hooks/usePlaces';
import { Heart, Compass, Trash2, MapPin } from 'lucide-react';

export const Saved = () => {
  const { favoriteIds, savedTrails, removeTrail } = useFavoriteStore();
  const { allPlaces } = usePlaces();

  const savedPlaces = allPlaces.filter((p) => favoriteIds.includes(p.id));

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" /> Saved Places & Custom Trails
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Your local collection of bookmarked places and saved heritage walking itineraries.</p>
        </div>

        {/* Saved Places Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">Bookmarked Places ({savedPlaces.length})</h2>
          {savedPlaces.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No saved places yet"
              description="Explore the city and tap the heart icon on any place card to bookmark it."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>

        {/* Saved Trails Section */}
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">Saved Heritage Trails ({savedTrails.length})</h2>
          {savedTrails.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No saved walking trails"
              description="Build custom walking itineraries in the History & Culture module."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedTrails.map((trail) => (
                <div key={trail.id} className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{trail.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Distance: {trail.distanceKm} km • Est duration: {trail.durationMins} mins
                    </p>
                  </div>
                  <Button
                    onClick={() => removeTrail(trail.id)}
                    variant="ghost"
                    size="sm"
                    className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </PageShell>
  );
};
