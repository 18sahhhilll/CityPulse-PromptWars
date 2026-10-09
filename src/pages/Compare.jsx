import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { RadarCompare } from '../components/charts/RadarCompare';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { usePlaces } from '../hooks/usePlaces';
import { useSettingsStore } from '../store/useSettingsStore';
import { calculateCompositeScore, getScoreBadge } from '../utils/scoring';
import { BarChart3, Sliders, Trophy, AlertTriangle, Sparkles, Check } from 'lucide-react';

export const Compare = () => {
  const { allPlaces } = usePlaces();
  const { scoringWeights, setScoringWeights, resetWeights } = useSettingsStore();

  const [selectedIds, setSelectedIds] = useState([allPlaces[0]?.id || 'place-001', allPlaces[1]?.id || 'place-002']);

  const selectedPlaces = allPlaces.filter((p) => selectedIds.includes(p.id));

  const toggleSelectPlace = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((i) => i !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleWeightChange = (key, val) => {
    const updated = { ...scoringWeights, [key]: parseFloat(val) };
    setScoringWeights(updated);
  };

  // Compute leaderboards
  const placesWithScores = allPlaces.map((p) => ({
    ...p,
    compositeScore: calculateCompositeScore(p.scores, scoringWeights),
  })).sort((a, b) => b.compositeScore - a.compositeScore);

  const topPlaces = placesWithScores.slice(0, 3);
  const lowestPlaces = [...placesWithScores].reverse().slice(0, 3);

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-cyan-400" /> Best vs Worst Location Comparison
            </h1>
            <p className="text-xs text-slate-400">Compare 2 to 4 places side-by-side on safety, cleanliness, affordability, ratings & transit accessibility</p>
          </div>
        </div>

        {/* Place Selection Bar */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold font-display text-slate-100">Select Places to Compare (Choose 2 to 4)</h3>
          <div className="flex flex-wrap gap-2">
            {allPlaces.map((p) => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleSelectPlace(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400/50 shadow-md'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{p.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Metric Radar Chart & Scoring Transparency Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Radar Chart Visual */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" /> Side-by-Side Radar Profile
              </h2>
              <Badge variant="verified">Data Confidence 92%</Badge>
            </div>
            <RadarCompare places={selectedPlaces} />
          </div>

          {/* Transparent Scoring Weight Sliders */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" /> Custom Scoring Weights
              </h3>
              <button onClick={resetWeights} className="text-xs text-cyan-400 hover:underline">Reset</button>
            </div>
            <p className="text-[11px] text-slate-400">Adjust weight sliders to reflect your personal priorities (e.g. prioritizing safety over budget).</p>

            <div className="space-y-3 text-xs">
              {Object.keys(scoringWeights).map((key) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-slate-300 font-semibold capitalize">
                    <span>{key} Weight</span>
                    <span>{Math.round(scoringWeights[key] * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.05"
                    value={scoringWeights[key]}
                    onChange={(e) => handleWeightChange(key, e.target.value)}
                    className="w-full accent-brand-violet bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Detailed Side-by-Side Comparison Table */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 overflow-x-auto">
          <h2 className="text-base font-bold font-display text-slate-100 mb-4">Detailed Metrics Table</h2>
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Place Name</th>
                <th className="p-3">Composite Score</th>
                <th className="p-3">Safety</th>
                <th className="p-3">Cleanliness</th>
                <th className="p-3">Affordability</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Accessibility</th>
              </tr>
            </thead>
            <tbody>
              {selectedPlaces.map((p) => {
                const compScore = calculateCompositeScore(p.scores, scoringWeights);
                const badge = getScoreBadge(compScore);
                return (
                  <tr key={p.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-slate-100">{p.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg}`}>
                        {compScore} / 100
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-400">{p.scores?.safety || 85}%</td>
                    <td className="p-3 font-semibold text-cyan-400">{p.scores?.cleanliness || 80}%</td>
                    <td className="p-3 font-semibold text-amber-400">{p.scores?.affordability || 80}%</td>
                    <td className="p-3 font-semibold text-pink-400">{p.scores?.rating || 88}%</td>
                    <td className="p-3 font-semibold text-violet-400">{p.scores?.accessibility || 85}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* City Leaderboards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> "Best in City" Leaderboard
            </h3>
            <div className="space-y-3">
              {topPlaces.map((p, idx) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-100">{p.name}</h4>
                      <span className="text-[10px] text-slate-400">{p.category.toUpperCase()}</span>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400 text-sm">{p.compositeScore} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> "Needs Attention" Leaderboard
            </h3>
            <div className="space-y-3">
              {lowestPlaces.map((p, idx) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-100">{p.name}</h4>
                      <span className="text-[10px] text-slate-400">{p.category.toUpperCase()}</span>
                    </div>
                  </div>
                  <span className="font-bold text-rose-400 text-sm">{p.compositeScore} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </PageShell>
  );
};
