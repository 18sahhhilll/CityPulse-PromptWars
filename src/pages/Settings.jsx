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
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 flex items-center gap-2">
            <SettingsIcon className="w-7 h-7 text-cyan-400" /> App Settings & Preferences
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure theme, distance units, and customize livability score algorithm weights.</p>
        </div>

        {/* Reset Demo Data Button */}
        <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 bg-rose-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-rose-400" /> Reset Demo Data
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Reset stored citizen reports, bookmarks, custom trails & scoring weights to default seeded state.</p>
            </div>
            <Button
              onClick={handleResetDemoData}
              variant="danger"
              size="sm"
              icon={resetDone ? Check : RefreshCw}
            >
              {resetDone ? 'Reset Complete!' : 'Reset Demo Data'}
            </Button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-violet-400" /> : <Sun className="w-4 h-4 text-amber-400" />} Theme Mode
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                theme === 'dark' ? 'bg-violet-600 text-white border-violet-500' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Dark Theme (Default)
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                theme === 'light' ? 'bg-violet-600 text-white border-violet-500' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Light Theme
            </button>
          </div>
        </div>

        {/* Units Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" /> Distance Unit
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setDistanceUnit('km')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                distanceUnit === 'km' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Kilometers (km)
            </button>
            <button
              onClick={() => setDistanceUnit('mi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                distanceUnit === 'mi' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Miles (mi)
            </button>
          </div>
        </div>

        {/* Scoring Weight Customizer */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" /> Livability Scoring Weights
            </h3>
            <button onClick={resetWeights} className="text-xs text-cyan-400 hover:underline">Reset Defaults</button>
          </div>

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
                  onChange={(e) => setScoringWeights({ ...scoringWeights, [key]: parseFloat(e.target.value) })}
                  className="w-full accent-brand-violet bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  );
};
