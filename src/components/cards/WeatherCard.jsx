import React from 'react';
import { Sun, Wind, Droplets, RefreshCw } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { Skeleton } from '../ui/Skeleton';
import { Badge } from '../ui/Badge';

export const WeatherCard = () => {
  const { weather, loading } = useWeather();

  if (loading || !weather) {
    return <Skeleton className="h-36 w-full" />;
  }

  const badgeVariant = weather.dataBadge === 'LIVE' ? 'verified' : weather.dataBadge === 'Cached' ? 'estimated' : 'sample';

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between h-full relative overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-amber-400" /> Weather & Air Quality
        </span>
        <div className="flex items-center gap-1.5">
          <Badge variant={badgeVariant}>{weather.dataBadge}</Badge>
          <span className="text-[10px] text-slate-500">{weather.updatedStr}</span>
        </div>
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
          <span>AQI {weather.aqi} ({weather.aqiStatus})</span>
        </div>
      </div>
    </div>
  );
};
