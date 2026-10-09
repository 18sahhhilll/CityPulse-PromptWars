import { useState, useEffect } from 'react';
import { useCityStore } from '../store/useCityStore';
import { useFilterStore } from '../store/useFilterStore';
import { fetchPlacesOverpass } from '../services/overpass';
import { calculateDistanceKm } from '../utils/geo';

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

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchPlacesOverpass(currentCity.lat, currentCity.lng)
      .then((data) => {
        if (!isMounted) return;
        setPlaces(data);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching places:', err);
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

  return { places: filteredPlaces, allPlaces: places, loading, error };
};
