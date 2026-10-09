import { create } from 'zustand';

const FAVORITES_KEY = 'citypulse_favorites';
const TRAILS_KEY = 'citypulse_saved_trails';

export const useFavoriteStore = create((set, get) => ({
  favoriteIds: JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'),
  savedTrails: JSON.parse(localStorage.getItem(TRAILS_KEY) || '[]'),

  toggleFavorite: (placeId) => {
    const current = get().favoriteIds;
    const exists = current.includes(placeId);
    const updated = exists
      ? current.filter((id) => id !== placeId)
      : [...current, placeId];

    set({ favoriteIds: updated });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  },

  isFavorite: (placeId) => get().favoriteIds.includes(placeId),

  saveTrail: (trail) => {
    const updated = [trail, ...get().savedTrails];
    set({ savedTrails: updated });
    localStorage.setItem(TRAILS_KEY, JSON.stringify(updated));
  },

  removeTrail: (trailId) => {
    const updated = get().savedTrails.filter((t) => t.id !== trailId);
    set({ savedTrails: updated });
    localStorage.setItem(TRAILS_KEY, JSON.stringify(updated));
  },
}));
