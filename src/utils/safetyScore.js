import { calculateDistanceKm } from './geo';

export const calculateAreaSafetyScore = (centerLat, centerLng, incidents = [], radiusKm = 5) => {
  if (!centerLat || !centerLng) return 85;

  const nearbyIncidents = incidents.filter((inc) => {
    const dist = calculateDistanceKm(centerLat, centerLng, inc.lat, inc.lng);
    return dist <= radiusKm;
  });

  if (nearbyIncidents.length === 0) return 92;

  let totalDeduction = 0;
  let harassmentCount = 0;
  let accidentCount = 0;

  nearbyIncidents.forEach((inc) => {
    const severity = inc.severity || 3;
    if (inc.category === 'harassment') harassmentCount++;
    if (inc.category === 'accident') accidentCount++;

    totalDeduction += severity * 2.5;
  });

  // Base score 100 minus cumulative weighted deductions
  let score = 100 - Math.min(totalDeduction, 55);

  // Time-of-day penalty heuristic (night time)
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 21 || currentHour <= 5;
  if (isNight) {
    score -= 8;
  }

  return Math.max(Math.round(score), 25);
};

export const evaluateRouteSafety = (routeGeometryCoords, incidents = []) => {
  let safetyScore = 95;
  let riskFactorCount = 0;
  const risksDetected = [];

  routeGeometryCoords.forEach(([lat, lng]) => {
    incidents.forEach((inc) => {
      const dist = calculateDistanceKm(lat, lng, inc.lat, inc.lng);
      if (dist < 0.4) { // within 400m of route
        riskFactorCount++;
        if (!risksDetected.some(r => r.id === inc.id)) {
          risksDetected.push(inc);
        }
      }
    });
  });

  safetyScore -= Math.min(riskFactorCount * 6, 60);

  return {
    safetyScore: Math.max(safetyScore, 30),
    risksDetected,
  };
};
