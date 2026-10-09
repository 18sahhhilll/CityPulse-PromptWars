import React, { useState } from 'react';
import { Activity, ShieldCheck, Wind, Car, Info, X } from 'lucide-react';
import { getScoreBadge } from '../../utils/scoring';
import { useWeather } from '../../hooks/useWeather';

export const ScoreCard = ({ cityName = 'Pune', safetyScore = 88, trafficLevel = 'moderate' }) => {
  const { weather } = useWeather();
  const [showTooltip, setShowTooltip] = useState(false);

  const airScore = weather?.airScore ?? 83;
  const aqiVal = weather?.aqi ?? 42;

  const trafficScore = trafficLevel === 'heavy' ? 35 : trafficLevel === 'moderate' ? 65 : 90;
  const weatherScore = (weather?.precipitationProb || 0) > 60 ? 50 : 90;

  const compositeScore = Math.round(
    safetyScore * 0.35 +
    airScore * 0.25 +
    trafficScore * 0.20 +
    weatherScore * 0.20
  );

  const badgeInfo = getScoreBadge(compositeScore);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600 dark:text-cyan-400 animate-pulse" />
          <h3 className="font-bold text-sm font-display text-slate-900 dark:text-slate-100">City Pulse Score</h3>
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
            title="How City Pulse Score is computed"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${badgeInfo.bg}`}>
          {badgeInfo.label}
        </span>
      </div>

      {/* Info Tooltip Overlay */}
      {showTooltip && (
        <div className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-950/95 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-500/40 text-xs text-slate-700 dark:text-slate-200 flex flex-col justify-between shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="font-bold text-indigo-600 dark:text-cyan-300">Pulse Score Formula</span>
            <button onClick={() => setShowTooltip(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1 my-1 text-[11px] text-slate-600 dark:text-slate-300">
            <p>• <strong>Safety Score (35%)</strong>: {safetyScore} pts</p>
            <p>• <strong>Air Score (25%)</strong>: {airScore} pts (AQI {aqiVal})</p>
            <p>• <strong>Traffic Mood (20%)</strong>: {trafficScore} pts ({trafficLevel})</p>
            <p>• <strong>Weather Index (20%)</strong>: {weatherScore} pts ({weather?.temp || 28}°C)</p>
          </div>
          <span className="text-[10px] text-slate-400 italic">Scores decrease under poor AQI, storm rain, or heavy traffic.</span>
        </div>
      )}

      <div className="flex items-center justify-between my-2">
        <div>
          <div className="text-4xl font-extrabold font-display text-indigo-600 dark:text-indigo-400">
            {compositeScore}<span className="text-xl text-slate-400 font-normal">/100</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Composite live pulse for {cityName}</p>
        </div>

        {/* Circular Dial Visual */}
        <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-slate-900 border-4 border-indigo-500/30 shadow-inner">
          <span className="text-lg font-bold text-indigo-700 dark:text-slate-100">{compositeScore}</span>
        </div>
      </div>

      {/* Sub-Metric Pill Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-emerald-50 dark:bg-slate-900/60 border border-emerald-200 dark:border-slate-800">
          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> {safetyScore}%</span>
          <span className="text-slate-500 dark:text-slate-400 text-[10px]">Safety</span>
        </div>
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-cyan-50 dark:bg-slate-900/60 border border-cyan-200 dark:border-slate-800">
          <span className="text-cyan-700 dark:text-cyan-400 font-bold flex items-center gap-1"><Wind className="w-3 h-3"/> {airScore}/100</span>
          <span className="text-slate-500 dark:text-slate-400 text-[10px]">Air score</span>
        </div>
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-amber-50 dark:bg-slate-900/60 border border-amber-200 dark:border-slate-800">
          <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1 capitalize"><Car className="w-3 h-3"/> {trafficLevel}</span>
          <span className="text-slate-500 dark:text-slate-400 text-[10px]">Traffic</span>
        </div>
      </div>
    </div>
  );
};
