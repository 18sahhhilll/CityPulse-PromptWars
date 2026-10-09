import { calculateDistanceKm } from './geo';

export const calculateAreaSafetyScore = (centerLat, centerLng, incidents = [], radiusKm = 5) => {
  if (!centerLat || !centerLng) return 85;

  const nearbyIncidents = incidents.filter((inc) => {
    const dist = calculateDistanceKm(centerLat, centerLng, inc.lat, inc.lng);
    return dist <= radiusKm;
  });

  if (nearbyIncidents.length === 0) return 92;

  let totalDeduction = 0;
  nearbyIncidents.forEach((inc) => {
    const severity = inc.severity || 3;
    totalDeduction += severity * 2.5;
  });

  let score = 100 - Math.min(totalDeduction, 55);
  const currentHour = new Date().getHours();
  if (currentHour >= 21 || currentHour <= 5) {
    score -= 8;
  }

  return Math.max(Math.round(score), 25);
};

export const evaluateRouteSafety = (routeGeometryCoords = [], incidents = []) => {
  if (!routeGeometryCoords || routeGeometryCoords.length === 0) {
    return {
      safetyScore: 90,
      nearbyIncidentCount: 0,
      severitySum: 0,
      explanation: 'No safety incidents reported along route.',
    };
  }

  const nearbyIncidentsMap = new Map();

  // Find all incidents within 300m (0.3km) of any polyline coordinate
  routeGeometryCoords.forEach(([lat, lng]) => {
    incidents.forEach((inc) => {
      const dist = calculateDistanceKm(lat, lng, inc.lat, inc.lng);
      if (dist <= 0.3) {
        nearbyIncidentsMap.set(inc.id, inc);
      }
    });
  });

  const nearbyIncidents = Array.from(nearbyIncidentsMap.values());
  const nearbyCount = nearbyIncidents.length;
  const severitySum = nearbyIncidents.reduce((sum, inc) => sum + (inc.severity || 3), 0);

  // Exact Block 4 Requirement: safetyScore = 100 - (incidents_nearby * 8) - (severity_sum * 3)
  const rawScore = 100 - (nearbyCount * 8) - (severitySum * 3);
  const safetyScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Plain-English Explanation
  let explanation = 'Well-lit corridor with zero nearby reported hazards.';
  if (nearbyCount > 0) {
    const categories = Array.from(new Set(nearbyIncidents.map(i => i.category)));
    const catStr = categories.slice(0, 2).join(' & ');
    explanation = `Passes near ${nearbyCount} reported ${catStr} zones (Severity ${severitySum}).`;
  } else {
    explanation = 'Bypasses all active reported accident and unlit alley zones.';
  }

  return {
    safetyScore,
    nearbyIncidentCount: nearbyCount,
    severitySum,
    explanation,
  };
};
