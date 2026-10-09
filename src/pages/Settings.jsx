import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { useSettingsStore } from '../store/useSettingsStore';
import { useReportStore } from '../store/useReportStore';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { Settings as SettingsIcon, Sun, Moon, Sliders, Globe, RefreshCw, Check } from 'lucide-react';

export const Settings = () => {
  const { theme, setTheme, distanceUnit, setDistanceUnit, scoringWeights, setScoringWeights, resetWeights } = useSettingsStore();
  const [resetDone, setResetDone] = useState(false);

  const handleResetDemoData = () => {
    localStorage.clear();
    resetWeights();
    setResetDone(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <SettingsIcon className="w-7 h-7 text-indigo-600 dark:text-cyan-400" /> App Settings & Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure theme, distance units, and customize livability score algorithm weights.</p>
        </div>

        {/* Reset Demo Data Button */}
        <div className="glass-panel p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-rose-500" /> Reset Demo Data
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Reset stored citizen reports, bookmarks, custom trails & scoring weights to default seeded state.</p>
            </div>
            <Button
              onClick={handleResetDemoData}
              variant="danger"
              size="sm"
              icon={resetDone ? Check : RefreshCw}
              className="shrink-0"
            >
              {resetDone ? 'Reset Complete!' : 'Reset Demo Data'}
            </Button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-violet-500 dark:text-violet-400" /> : <Sun className="w-4 h-4 text-amber-500" />} Theme Mode
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Dark Theme Mode
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Light Theme Mode
            </button>
          </div>
        </div>

        {/* Units Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Distance Unit
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setDistanceUnit('km')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                distanceUnit === 'km'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Kilometers (km)
            </button>
            <button
              onClick={() => setDistanceUnit('mi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                distanceUnit === 'mi'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Miles (mi)
            </button>
          </div>
        </div>

        {/* Scoring Weight Customizer */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-amber-400" /> Livability Scoring Weights
            </h3>
            <button onClick={resetWeights} className="text-xs text-indigo-600 dark:text-cyan-400 font-semibold hover:underline">Reset Defaults</button>
          </div>

          <div className="space-y-3 text-xs">
            {Object.keys(scoringWeights).map((key) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-slate-800 dark:text-slate-300 font-semibold capitalize">
                  <span>{key} Weight</span>
                  <span className="text-indigo-600 dark:text-cyan-400 font-bold">{Math.round(scoringWeights[key] * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={scoringWeights[key]}
                  onChange={(e) => setScoringWeights({ ...scoringWeights, [key]: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-600 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  );
};
