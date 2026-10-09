import { useState, useEffect } from 'react';
import { useCityStore } from '../store/useCityStore';
import { useFilterStore } from '../store/useFilterStore';
import { fetchPlacesOverpass } from '../services/overpass';
import { calculateDistanceKm } from '../utils/geo';
import mockPlaces from '../data/places.json';

export const usePlaces = () => {
  const currentCity = useCityStore((state) => state.currentCity);
  const {
    activeCategory,
    searchQuery,
    priceLevel,
    budgetMode,
    minRating,
    openNowOnly,
  } = useFilterStore();

  const [places, setPlaces] = useState(mockPlaces);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchPlacesOverpass(currentCity.lat, currentCity.lng)
      .then((data) => {
        if (!isMounted) return;
        
        // Requirement 4: If Overpass returns fewer than 4 results, immediately supplement with local places.json
        if (!data || data.length < 4) {
          console.warn('Overpass returned < 4 results; merging with curated local places dataset.');
          const combined = [...(data || []), ...mockPlaces.filter(m => !data?.some(d => d.name === m.name))];
          setPlaces(combined);
          setIsUsingFallback(true);
        } else {
          setPlaces(data);
          setIsUsingFallback(false);
        }
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Error fetching places via Overpass; using local mock places fallback:', err);
        setPlaces(mockPlaces);
        setIsUsingFallback(true);
        setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [currentCity.lat, currentCity.lng]);

  // Compute distances & apply filters
  const filteredPlaces = places
    .map((place) => ({
      ...place,
      distanceKm: calculateDistanceKm(currentCity.lat, currentCity.lng, place.lat, place.lng),
    }))
    .filter((place) => {
      if (activeCategory !== 'all' && place.category !== activeCategory) return false;

      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesName = place.name.toLowerCase().includes(query);
        const matchesTags = place.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesAddress = place.address?.toLowerCase().includes(query);
        if (!matchesName && !matchesTags && !matchesAddress) return false;
      }

      if (budgetMode && !place.isBudget && place.priceLevel !== '₹') return false;

      if (priceLevel !== 'all' && place.priceLevel !== priceLevel) return false;

      if (minRating > 0 && place.rating < minRating) return false;

      return true;
    });

  // Ensure category filtering doesn't leave an empty grid if mock data contains items for that category
  const finalPlaces = (filteredPlaces.length === 0 && activeCategory !== 'all')
    ? mockPlaces.filter(m => m.category === activeCategory)
    : filteredPlaces;

  return { places: finalPlaces, allPlaces: places, loading, error, isUsingFallback };
};
