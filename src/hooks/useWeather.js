import { useState, useEffect } from 'react';
import { useCityStore } from '../store/useCityStore';
import { fetchWeatherAndAQI } from '../services/openMeteo';

export const useWeather = () => {
  const currentCity = useCityStore((state) => state.currentCity);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchWeatherAndAQI(currentCity.lat, currentCity.lng)
      .then((data) => {
        if (mounted) {
          setWeatherData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.warn('Weather hook error:', err);
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [currentCity.lat, currentCity.lng]);

  return { weather: weatherData, loading };
};
