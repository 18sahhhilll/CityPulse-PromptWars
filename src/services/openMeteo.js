import { APP_CONFIG } from '../config/app.config';
import { getCachedData, setCachedData } from '../utils/cache';

export const fetchWeatherAndAQI = async (lat, lng) => {
  const cacheKey = `weather_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const weatherUrl = `${APP_CONFIG.apiEndpoints.openMeteoWeather}?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability`;
    const aqiUrl = `${APP_CONFIG.apiEndpoints.openMeteoAirQuality}?latitude=${lat}&longitude=${lng}&current=us_aqi,pm2_5,pm10`;

    const [wRes, aRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl),
    ]);

    if (!wRes.ok) throw new Error('Weather API error');

    const wData = await wRes.json();
    const aData = aRes.ok ? await aRes.json() : null;

    const currentW = wData.current_weather || {};
    const currentAQI = aData?.current?.us_aqi || 45;

    const weatherObj = {
      temp: Math.round(currentW.temperature || 27),
      weatherCode: currentW.weathercode || 0,
      windSpeed: currentW.windspeed || 12,
      isDay: currentW.is_day === 1,
      aqi: Math.round(currentAQI),
      aqiStatus: currentAQI <= 50 ? 'Good' : currentAQI <= 100 ? 'Moderate' : 'Unhealthy',
      humidity: wData.hourly?.relative_humidity_2m?.[0] || 65,
      precipitationProb: wData.hourly?.precipitation_probability?.[0] || 10,
    };

    setCachedData(cacheKey, weatherObj, APP_CONFIG.cacheTTL.weather);
    return weatherObj;
  } catch (err) {
    console.warn('Open-Meteo fetch failed, returning mock weather fallback:', err);
    const mockFallback = {
      temp: 28,
      weatherCode: 1,
      windSpeed: 10,
      isDay: true,
      aqi: 42,
      aqiStatus: 'Good',
      humidity: 60,
      precipitationProb: 5,
    };
    return mockFallback;
  }
};
