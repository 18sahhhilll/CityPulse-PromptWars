import { APP_CONFIG } from '../config/app.config';
import { getCachedData, setCachedData } from '../utils/cache';

export const getEPCAQIStatus = (aqi) => {
  if (aqi <= 50) return { category: 'Good', color: '#10B981', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
  if (aqi <= 100) return { category: 'Moderate', color: '#F59E0B', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: '#F97316', bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30' };
  if (aqi <= 200) return { category: 'Unhealthy', color: '#EF4444', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  if (aqi <= 300) return { category: 'Very Unhealthy', color: '#8B5CF6', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
  return { category: 'Hazardous', color: '#881337', bg: 'bg-rose-950 text-rose-300 border-rose-800' };
};

export const fetchWeatherAndAQI = async (lat, lng) => {
  const cacheKey = `weather_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    const ageMins = Math.floor((Date.now() - (cached.fetchTimestamp || Date.now())) / 60000);
    return {
      ...cached,
      isLive: ageMins <= 15 && !cached.isFallback,
      dataBadge: ageMins <= 15 && !cached.isFallback ? 'LIVE' : 'Cached',
      updatedStr: ageMins === 0 ? 'Just now' : `${ageMins}m ago`,
    };
  }

  try {
    const weatherUrl = `${APP_CONFIG.apiEndpoints.openMeteoWeather}?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability`;
    const aqiUrl = `${APP_CONFIG.apiEndpoints.openMeteoAirQuality}?latitude=${lat}&longitude=${lng}&current=us_aqi,pm2_5,pm10`;

    const [wRes, aRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl),
    ]);

    if (!wRes.ok) throw new Error('Weather API HTTP error');

    const wData = await wRes.json();
    const aData = aRes.ok ? await aRes.json() : null;

    const currentW = wData.current_weather || {};
    const rawAQI = Math.round(aData?.current?.us_aqi || 45);
    const aqiInfo = getEPCAQIStatus(rawAQI);

    // Calculate Air Score (0-100, higher is better)
    const airScore = Math.max(0, Math.min(100, Math.round(100 - (rawAQI * 0.4))));

    const result = {
      temp: Math.round(currentW.temperature || 27),
      weatherCode: currentW.weathercode || 0,
      windSpeed: currentW.windspeed || 12,
      isDay: currentW.is_day === 1,
      aqi: rawAQI,
      airScore,
      aqiStatus: aqiInfo.category,
      aqiColor: aqiInfo.color,
      aqiBg: aqiInfo.bg,
      humidity: wData.hourly?.relative_humidity_2m?.[0] || 65,
      precipitationProb: wData.hourly?.precipitation_probability?.[0] || 10,
      fetchTimestamp: Date.now(),
      isFallback: false,
      isLive: true,
      dataBadge: 'LIVE',
      updatedStr: 'Just now',
    };

    setCachedData(cacheKey, result, APP_CONFIG.cacheTTL.weather);
    return result;
  } catch (err) {
    console.warn('Open-Meteo fetch failed, returning mock weather fallback:', err);
    const rawAQI = 42;
    const aqiInfo = getEPCAQIStatus(rawAQI);
    const mockFallback = {
      temp: 28,
      weatherCode: 1,
      windSpeed: 10,
      isDay: true,
      aqi: rawAQI,
      airScore: Math.round(100 - rawAQI * 0.4),
      aqiStatus: aqiInfo.category,
      aqiColor: aqiInfo.color,
      aqiBg: aqiInfo.bg,
      humidity: 60,
      precipitationProb: 5,
      fetchTimestamp: Date.now(),
      isFallback: true,
      isLive: false,
      dataBadge: 'Offline',
      updatedStr: 'Fallback Data',
    };
    return mockFallback;
  }
};
