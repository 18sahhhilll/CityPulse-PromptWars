import { APP_CONFIG } from '../config/app.config';
import { getCachedData, setCachedData } from '../utils/cache';

const getContactEmail = () => {
  return import.meta.env.VITE_CONTACT_EMAIL || 'sahilsangle81@gmail.com';
};

export const searchCityNominatim = async (query) => {
  if (!query || query.trim().length < 2) return [];

  const cacheKey = `nom_search_${query.trim().toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const email = getContactEmail();
    const url = `${APP_CONFIG.apiEndpoints.nominatim}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&email=${encodeURIComponent(email)}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Nominatim search HTTP error ${res.status}`);
    const data = await res.json();
    setCachedData(cacheKey, data, APP_CONFIG.cacheTTL.search);
    return data;
  } catch (err) {
    console.warn('Nominatim search failed, returning empty fallback:', err);
    return [];
  }
};

export const reverseGeocodeNominatim = async (lat, lng) => {
  const cacheKey = `nom_rev_${lat.toFixed(3)}_${lng.toFixed(3)}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const email = getContactEmail();
    const url = `${APP_CONFIG.apiEndpoints.nominatim}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&email=${encodeURIComponent(email)}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Reverse geocode HTTP error ${res.status}`);
    const data = await res.json();
    setCachedData(cacheKey, data, APP_CONFIG.cacheTTL.search);
    return data;
  } catch (err) {
    console.warn('Nominatim reverse geocode failed:', err);
    return { display_name: `Location (${lat.toFixed(3)}, ${lng.toFixed(3)})` };
  }
};
