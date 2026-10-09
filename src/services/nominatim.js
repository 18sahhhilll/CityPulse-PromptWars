import { APP_CONFIG } from '../config/app.config';
import { getCachedData, setCachedData } from '../utils/cache';

export const searchCityNominatim = async (query) => {
  if (!query || query.trim().length < 2) return [];

  const cacheKey = `nom_search_${query.trim().toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const url = `${APP_CONFIG.apiEndpoints.nominatim}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CityPulse/1.0 (contact@citypulse.app)',
      },
    });

    if (!res.ok) throw new Error(`Nominatim error ${res.status}`);
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
    const url = `${APP_CONFIG.apiEndpoints.nominatim}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CityPulse/1.0',
      },
    });

    if (!res.ok) throw new Error(`Reverse geocode failed ${res.status}`);
    const data = await res.json();
    setCachedData(cacheKey, data, APP_CONFIG.cacheTTL.search);
    return data;
  } catch (err) {
    console.warn('Nominatim reverse geocode failed:', err);
    return { display_name: `Location (${lat.toFixed(3)}, ${lng.toFixed(3)})` };
  }
};
