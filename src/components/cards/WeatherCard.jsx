import React from 'react';
import { CloudRain, Sun, Wind, Droplets, Gauge } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { Skeleton } from '../ui/Skeleton';

export const WeatherCard = () => {
  const { weather, loading } = useWeather();

  if (loading || !weather) {
    return <Skeleton className="h-36 w-full" />;
  }

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (aqi <= 100) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between h-full relative overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-amber-400" /> Weather & Air Quality
        </span>
        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getAQIColor(weather.aqi)}`}>
          AQI {weather.aqi} • {weather.aqiStatus}
        </span>
      </div>

      <div className="flex items-baseline justify-between my-2">
        <div>
          <div className="text-3xl font-bold font-display text-slate-100">{weather.temp}°C</div>
          <div className="text-xs text-slate-400">Clear Skies • Daylight</div>
        </div>
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Sun className="w-8 h-8 animate-spin-slow" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-cyan-400" />
          <span>{weather.windSpeed} km/h wind</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-indigo-400" />
          <span>{weather.humidity}% humidity</span>
        </div>
      </div>
    </div>
  );
};
