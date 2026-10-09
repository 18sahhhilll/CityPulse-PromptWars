import { create } from 'zustand';
import { APP_CONFIG } from '../config/app.config';

export const useCityStore = create((set) => ({
  currentCity: APP_CONFIG.defaultCity,
  isGeolocating: false,
  error: null,

  setCity: (cityData) => set({
    currentCity: {
      name: cityData.name || cityData.display_name.split(',')[0],
      state: cityData.state || cityData.address?.state || '',
      country: cityData.country || cityData.address?.country || 'India',
      lat: parseFloat(cityData.lat),
      lng: parseFloat(cityData.lon || cityData.lng),
      zoom: cityData.zoom || 13,
      boundingbox: cityData.boundingbox || [
        parseFloat(cityData.lat) - 0.08,
        parseFloat(cityData.lat) + 0.08,
        parseFloat(cityData.lon || cityData.lng) - 0.08,
        parseFloat(cityData.lon || cityData.lng) + 0.08,
      ]
    },
    error: null,
  }),

  setGeolocating: (status) => set({ isGeolocating: status }),
  setError: (err) => set({ error: err }),
}));
