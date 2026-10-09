import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { RadarCompare } from '../components/charts/RadarCompare';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { usePlaces } from '../hooks/usePlaces';
import { useSettingsStore } from '../store/useSettingsStore';
import { calculateCompositeScore, getScoreBadge } from '../utils/scoring';
import { formatApproxPrice } from '../utils/format';
import { BarChart3, Sliders, Trophy, AlertTriangle, Sparkles, Check, Search, X, MapPin, Plus } from 'lucide-react';

export const Compare = () => {
  const { allPlaces } = usePlaces();
  const { scoringWeights, setScoringWeights, resetWeights } = useSettingsStore();

  const [selectedIds, setSelectedIds] = useState([
    allPlaces[0]?.id || 'place-001',
    allPlaces[1]?.id || 'place-002',
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  // Filter matching places based on search query
  const filteredPlaces = allPlaces.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.address && p.address.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

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
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-cyan-400" /> Best vs Worst Location Comparison
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Compare 2 to 4 places side-by-side on safety, cleanliness, affordability, ratings & transit accessibility</p>
          </div>
        </div>

        {/* Place Search & Selection Panel */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Select Locations to Compare ({selectedIds.length}/4 Selected)
            </h3>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Choose 2 to 4 locations
            </span>
          </div>

          {/* Currently Selected Badges Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedPlaces.map((p) => (
              <div
                key={p.id}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white border border-indigo-400/50 shadow-md flex items-center gap-2 group transition-all"
              >
                <span className="truncate max-w-[220px]">{p.name} <span className="text-[10px] text-indigo-200 font-normal">{formatApproxPrice(p)}</span></span>
                {selectedIds.length > 2 ? (
                  <button
                    onClick={() => toggleSelectPlace(p.id)}
                    className="p-0.5 hover:bg-white/20 rounded-full transition-colors shrink-0"
                    title={`Remove ${p.name}`}
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                ) : (
                  <span className="text-[10px] text-indigo-200 font-normal shrink-0" title="Minimum 2 locations required">(Min 2)</span>
                )}
              </div>
            ))}
          </div>

          {/* Location Search Bar & Autocomplete Dropdown */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search location by name, category or area (e.g. Shaniwar Wada, Goodluck Cafe, Marriott)..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Results List */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden z-30 max-h-72 overflow-y-auto">
                  {filteredPlaces.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching locations found for "{searchQuery}"
                    </div>
                  ) : (
                    filteredPlaces.map((p) => {
                      const isSelected = selectedIds.includes(p.id);
                      const isMaxReached = selectedIds.length >= 4 && !isSelected;

                      return (
                        <button
                          key={p.id}
                          disabled={isMaxReached}
                          onClick={() => {
                            toggleSelectPlace(p.id);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs border-b border-slate-100 dark:border-slate-800/60 last:border-none transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-violet-600/20 text-indigo-700 dark:text-cyan-300 font-semibold'
                              : isMaxReached
                              ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900/40 text-slate-400'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400 shrink-0" />
                            <div className="truncate">
                              <span className="font-semibold block text-slate-900 dark:text-slate-100 truncate flex items-center justify-between">
                                <span className="truncate">{p.name}</span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0 ml-1.5">{formatApproxPrice(p)}</span>
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{p.address} • {p.category.toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="shrink-0 ml-2">
                            {isSelected ? (
                              <span className="px-2.5 py-1 rounded-lg text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center gap-1 font-bold">
                                <Check className="w-3 h-3" /> Selected
                              </span>
                            ) : isMaxReached ? (
                              <span className="px-2.5 py-1 rounded-lg text-[10px] bg-slate-100 text-slate-400 font-medium">
                                Max 4
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg text-[10px] bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 transition-colors font-semibold flex items-center gap-1">
                                <Plus className="w-3 h-3" /> Add
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Multi-Metric Radar Chart & Scoring Transparency Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Radar Chart Visual */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-violet-400" /> Side-by-Side Radar Profile
              </h2>
              <Badge variant="verified">Data Confidence 92%</Badge>
            </div>
            <RadarCompare places={selectedPlaces} />
          </div>

          {/* Transparent Scoring Weight Sliders */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Custom Scoring Weights
              </h3>
              <button onClick={resetWeights} className="text-xs text-indigo-600 dark:text-cyan-400 font-semibold hover:underline">Reset</button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Adjust weight sliders to reflect your personal priorities (e.g. prioritizing safety over budget).</p>

            <div className="space-y-3 text-xs">
              {Object.keys(scoringWeights).map((key) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 font-semibold capitalize">
                    <span>{key} Weight</span>
                    <span className="text-indigo-600 dark:text-cyan-400 font-bold">{Math.round(scoringWeights[key] * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.05"
                    value={scoringWeights[key]}
                    onChange={(e) => handleWeightChange(key, e.target.value)}
                    className="w-full accent-indigo-600 bg-slate-100 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Detailed Side-by-Side Comparison Table */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-x-auto">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 mb-4">Detailed Metrics Table</h2>
          <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
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
                  <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                      <div>{p.name}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{formatApproxPrice(p)}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg}`}>
                        {compScore} / 100
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">{p.scores?.safety || 85}%</td>
                    <td className="p-3 font-semibold text-cyan-600 dark:text-cyan-400">{p.scores?.cleanliness || 80}%</td>
                    <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">{p.scores?.affordability || 80}%</td>
                    <td className="p-3 font-semibold text-pink-600 dark:text-pink-400">{p.scores?.rating || 88}%</td>
                    <td className="p-3 font-semibold text-indigo-600 dark:text-violet-400">{p.scores?.accessibility || 85}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* City Leaderboards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50/70 dark:bg-slate-900 p-6 rounded-2xl border border-emerald-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> "Best in City" Leaderboard
            </h3>
            <div className="space-y-3">
              {topPlaces.map((p, idx) => (
                <div key={p.id} className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700/60 flex items-center justify-between text-xs shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{p.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{p.category.toUpperCase()}</span>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{p.compositeScore} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-rose-50/70 dark:bg-slate-900 p-6 rounded-2xl border border-rose-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> "Needs Attention" Leaderboard
            </h3>
            <div className="space-y-3">
              {lowestPlaces.map((p, idx) => (
                <div key={p.id} className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-rose-100 dark:border-slate-700/60 flex items-center justify-between text-xs shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{p.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{p.category.toUpperCase()}</span>
                    </div>
                  </div>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">{p.compositeScore} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </PageShell>
  );
};
