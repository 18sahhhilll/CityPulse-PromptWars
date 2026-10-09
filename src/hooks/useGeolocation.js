import { useState, useCallback } from 'react';
import { useCityStore } from '../store/useCityStore';
import { reverseGeocodeNominatim } from '../services/nominatim';

export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const setCity = useCityStore((state) => state.setCity);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geoData = await reverseGeocodeNominatim(latitude, longitude);
          const cityName = geoData.address?.city || geoData.address?.town || geoData.address?.suburb || 'My Location';

          setCity({
            name: cityName,
            state: geoData.address?.state || '',
            country: geoData.address?.country || 'India',
            lat: latitude,
            lon: longitude,
            zoom: 14,
          });
        } catch (err) {
          setCity({
            name: 'Current Location',
            lat: latitude,
            lon: longitude,
            zoom: 14,
          });
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err.message);
        setErrorMsg('Location permission denied. Loaded default city (Pune).');
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [setCity]);

  return { getCurrentLocation, loading, errorMsg };
};
