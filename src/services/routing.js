import { APP_CONFIG } from '../config/app.config';
import { getCachedData, setCachedData } from '../utils/cache';

export const fetchOSRMRoute = async (waypoints = [], profile = 'driving') => {
  if (waypoints.length < 2) return null;

  const coordStr = waypoints.map((wp) => `${wp.lng},${wp.lat}`).join(';');
  const cacheKey = `osrm_${profile}_${coordStr}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const url = `${APP_CONFIG.apiEndpoints.osrmRouting}/${profile}/${coordStr}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OSRM routing request failed');

    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const result = {
        coordinates: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        distanceKm: Math.round((route.distance / 1000) * 10) / 10,
        durationMins: Math.round(route.duration / 60),
        steps: route.legs?.[0]?.steps?.map(s => s.maneuver?.instruction || s.name) || [],
      };

      setCachedData(cacheKey, result, 12 * 60 * 60 * 1000);
      return result;
    }
  } catch (err) {
    console.warn('OSRM route fetch failed, using straight-line fallback route:', err);
  }

  // Straight-line fallback geometry
  const fallbackCoords = waypoints.map(wp => [wp.lat, wp.lng]);
  let estDist = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const dLat = Math.abs(waypoints[i+1].lat - waypoints[i].lat);
    const dLng = Math.abs(waypoints[i+1].lng - waypoints[i].lng);
    estDist += Math.sqrt(dLat * dLat + dLng * dLng) * 111;
  }

  return {
    coordinates: fallbackCoords,
    distanceKm: Math.round(estDist * 10) / 10,
    durationMins: Math.round((estDist / 30) * 60),
    steps: ['Follow main road towards target destination'],
  };
};
