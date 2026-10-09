import { create } from 'zustand';

export const useMapStore = create((set, get) => ({
  mapInstance: null,
  activePlaceId: null,
  hoveredPlaceId: null,
  markerRefs: {},

  setMapInstance: (map) => set({ mapInstance: map }),

  registerMarker: (id, markerInstance) => {
    if (!id || !markerInstance) return;
    set((state) => ({
      markerRefs: { ...state.markerRefs, [id]: markerInstance },
    }));
  },

  unregisterMarker: (id) => {
    if (!id) return;
    set((state) => {
      const next = { ...state.markerRefs };
      delete next[id];
      return { markerRefs: next };
    });
  },

  flyToPlace: (place, zoom = 15) => {
    if (!place || typeof place.lat !== 'number' || typeof place.lng !== 'number') return;
    
    set({ hoveredPlaceId: place.id, activePlaceId: place.id });

    const { mapInstance, markerRefs } = get();
    if (mapInstance) {
      mapInstance.flyTo([place.lat, place.lng], zoom, { duration: 0.8 });
    }

    if (markerRefs[place.id]) {
      markerRefs[place.id].openPopup();
    }
  },

  closeActivePopup: () => {
    const { hoveredPlaceId, activePlaceId, markerRefs } = get();
    const targetId = hoveredPlaceId || activePlaceId;
    
    if (targetId && markerRefs[targetId]) {
      markerRefs[targetId].closePopup();
    }
    
    set({ hoveredPlaceId: null });
  },

  resetMapCenter: (center, zoom = 12) => {
    const { mapInstance, closeActivePopup } = get();
    closeActivePopup();
    
    if (mapInstance && center && typeof center.lat === 'number' && typeof center.lng === 'number') {
      mapInstance.flyTo([center.lat, center.lng], zoom, { duration: 0.8 });
    }
  },
}));
