import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Badge } from '../components/ui/Badge';
import { Compass, ShieldCheck, Database, Code, Cpu } from 'lucide-react';

export const About = () => {
  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Compass className="w-7 h-7 text-indigo-600 dark:text-cyan-400" /> About CityPulse
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Smart, interactive city exploration & navigation web application.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600 dark:text-violet-400" /> Free-Only Open Data Architecture
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            CityPulse relies 100% on keyless open-source APIs and free-tier services. Every external endpoint features dual-layer caching (in-memory + localStorage) with automatic graceful fallback to curated local datasets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100">Map & POI Data</span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">OpenStreetMap & Overpass API (attractions, food, hotels, cafes, parks, hospitals, police)</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100">Geocoding & Search</span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">Nominatim Geocoding API with 400ms debouncing and user-agent rate compliance</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100">Weather & Air Quality</span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">Open-Meteo Weather & Air Quality API endpoints</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100">Heritage & Stories</span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">Wikipedia REST API & Wikidata summaries</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100">Routing & Navigation</span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">OSRM Public Routing API (driving and foot walking polylines)</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100">Client AI NLP</span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">Gemini Free Tier API with client-side keyword sentiment classifier fallback</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">Offline-Demo Readiness</h3>
          <p>
            If internet connection or external APIs are unavailable, CityPulse seamlessly falls back to pre-seeded datasets located in <code className="text-indigo-600 dark:text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-slate-800">src/data/</code>, guaranteeing zero blank screens.
          </p>
        </div>

      </div>
    </PageShell>
  );
};
