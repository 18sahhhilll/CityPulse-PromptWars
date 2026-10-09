import { APP_CONFIG } from '../config/app.config';
import { getCachedData, setCachedData } from '../utils/cache';
import mockPlaces from '../data/places.json';

export const fetchPlacesOverpass = async (centerLat, centerLng, radiusMeters = 5000) => {
  const cacheKey = `overpass_${centerLat.toFixed(2)}_${centerLng.toFixed(2)}_${radiusMeters}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const query = `
    [out:json][timeout:15];
    (
      node["tourism"~"attraction|hotel|hostel"](around:${radiusMeters},${centerLat},${centerLng});
      node["amenity"~"restaurant|cafe|hospital|police"](around:${radiusMeters},${centerLat},${centerLng});
      node["leisure"="park"](around:${radiusMeters},${centerLat},${centerLng});
    );
    out body 40;
  `;

  for (const endpoint of APP_CONFIG.apiEndpoints.overpass) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!res.ok) continue;

      const data = await res.json();
      if (data.elements && data.elements.length > 0) {
        const parsedPlaces = data.elements.map((el) => {
          const category = el.tags.tourism === 'hotel' || el.tags.tourism === 'hostel'
            ? (el.tags.tourism === 'hostel' ? 'budget' : 'hotel')
            : el.tags.amenity === 'restaurant'
            ? 'food'
            : el.tags.amenity === 'cafe'
            ? 'cafe'
            : el.tags.amenity === 'hospital'
            ? 'hospital'
            : el.tags.amenity === 'police'
            ? 'police'
            : el.tags.leisure === 'park'
            ? 'park'
            : 'attraction';

          const areaName = el.tags['addr:suburb'] || el.tags['addr:street'] || 'Pune';
          const cuisineTag = el.tags.cuisine ? `specializing in ${el.tags.cuisine}` : 'offering great local menu choices';
          let generatedDescription = el.tags.description;

          if (!generatedDescription) {
            if (category === 'food' || category === 'cafe') {
              generatedDescription = `A popular ${category} spot in ${areaName}, ${cuisineTag}.`;
            } else if (category === 'park') {
              generatedDescription = `A peaceful green park and recreational space in ${areaName}.`;
            } else if (category === 'attraction') {
              generatedDescription = `A prominent cultural attraction and historical landmark in ${areaName}.`;
            } else if (category === 'hotel' || category === 'budget') {
              generatedDescription = `Comfortable lodging and accommodation in ${areaName}.`;
            } else if (category === 'hospital') {
              generatedDescription = `Healthcare facility and emergency medical services in ${areaName}.`;
            } else if (category === 'police') {
              generatedDescription = `Local emergency police station and safety unit in ${areaName}.`;
            } else {
              generatedDescription = `A popular ${category} destination located in ${areaName}.`;
            }
          }

          return {
            id: `osm-${el.id}`,
            name: el.tags.name || el.tags['name:en'] || 'Local Landmark',
            category,
            lat: el.lat,
            lng: el.lon,
            address: el.tags['addr:street'] || el.tags['addr:suburb'] || 'City Center',
            rating: (4 + Math.random() * 0.9).toFixed(1),
            reviewsCount: Math.floor(Math.random() * 500 + 50),
            priceLevel: category === 'budget' ? '₹' : category === 'hotel' ? '₹₹₹' : '₹₹',
            openHours: el.tags.opening_hours || '09:00 AM - 09:00 PM',
            image: mockPlaces.find(m => m.category === category)?.image || mockPlaces[0].image,
            tags: [category.toUpperCase(), el.tags.cuisine || 'Local Spot'],
            scores: {
              safety: Math.floor(Math.random() * 20 + 80),
              cleanliness: Math.floor(Math.random() * 25 + 75),
              affordability: category === 'budget' ? 95 : 75,
              rating: 88,
              accessibility: 85,
            },
            isBudget: category === 'budget' || el.tags.tourism === 'hostel',
            description: generatedDescription,
          };
        });

        // Combine live OSM places with curated mock places for richness
        const combined = [...parsedPlaces, ...mockPlaces.filter(m => !parsedPlaces.some(p => p.name === m.name))];
        setCachedData(cacheKey, combined, APP_CONFIG.cacheTTL.places);
        return combined;
      }
    } catch (err) {
      console.warn(`Overpass mirror ${endpoint} failed, trying next...`);
    }
  }

  // Graceful fallback to mock data
  console.warn('Overpass API mirrors unreachable, falling back to local mock places');
  setCachedData(cacheKey, mockPlaces, APP_CONFIG.cacheTTL.places);
  return mockPlaces;
};
