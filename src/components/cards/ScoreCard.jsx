import React from 'react';
import { Activity, ShieldCheck, Wind, Car, Sparkles } from 'lucide-react';
import { getScoreBadge } from '../../utils/scoring';

export const ScoreCard = ({ score = 84, cityName = 'Pune' }) => {
  const badgeInfo = getScoreBadge(score);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="font-bold text-sm font-display text-slate-100">City Pulse Score</h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${badgeInfo.bg}`}>
          {badgeInfo.label}
        </span>
      </div>

      <div className="flex items-center justify-between my-3">
        <div>
          <div className="text-4xl font-extrabold font-display bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            {score}<span className="text-xl text-slate-400 font-normal">/100</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Composite live pulse for {cityName}</p>
        </div>

        {/* Circular Dial Visual */}
        <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-slate-900 border-4 border-indigo-500/30 shadow-inner">
          <span className="text-lg font-bold text-slate-100">{score}</span>
        </div>
      </div>

      {/* Sub-Metric Pill Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-[11px]">
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-emerald-400 font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> 88%</span>
          <span className="text-slate-400 text-[10px]">Safety</span>
        </div>
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-cyan-400 font-bold flex items-center gap-1"><Wind className="w-3 h-3"/> 42 AQI</span>
          <span className="text-slate-400 text-[10px]">Air Quality</span>
        </div>
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-amber-400 font-bold flex items-center gap-1"><Car className="w-3 h-3"/> Moderate</span>
          <span className="text-slate-400 text-[10px]">Traffic</span>
        </div>
      </div>
    </div>
  );
};
