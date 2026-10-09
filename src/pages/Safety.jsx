import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { MapView } from '../components/map/MapView';
import { HeatLayer } from '../components/map/HeatLayer';
import { RouteLayer } from '../components/map/RouteLayer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useReportStore } from '../store/useReportStore';
import { useCityStore } from '../store/useCityStore';
import { fetchOSRMAlternativeRoutes } from '../services/routing';
import { evaluateRouteSafety, calculateAreaSafetyScore } from '../utils/safetyScore';
import { APP_CONFIG } from '../config/app.config';
import { ShieldAlert, PhoneCall, Moon, Navigation, ShieldCheck } from 'lucide-react';

export const Safety = () => {
  const currentCity = useCityStore((state) => state.currentCity);
  const { reports, activeLayerFilters, toggleLayerFilter } = useReportStore();

  const [showHeatmap, setShowHeatmap] = useState(true);
  const areaScore = calculateAreaSafetyScore(currentCity.lat, currentCity.lng, reports);

  // Safer Route Finder State
  const [startQuery, setStartQuery] = useState('Akurdi, Pune');
  const [destQuery, setDestQuery] = useState('Koregaon Park, Pune');
  const [routes, setRoutes] = useState([]);
  const [isSearchingRoute, setIsSearchingRoute] = useState(false);

  const handleFindRoutes = async (e) => {
    e.preventDefault();
    setIsSearchingRoute(true);

    const waypoints = [
      { lat: 18.6492, lng: 73.7634 }, // Akurdi
      { lat: 18.5362, lng: 73.8940 }  // Koregaon Park
    ];

    const rawRoutes = await fetchOSRMAlternativeRoutes(waypoints, 'driving');

    // Evaluate each route's safety score using Haversine 300m polyline check
    const evaluated = rawRoutes.map((rt) => {
      const safetyEval = evaluateRouteSafety(rt.coordinates, reports);
      return {
        ...rt,
        ...safetyEval,
        isFastest: false,
        isSafest: false,
      };
    });

    if (evaluated.length > 0) {
      let minDurationIndex = 0;
      let minDuration = evaluated[0].rawDurationSec || evaluated[0].durationMins * 60;

      evaluated.forEach((r, idx) => {
        const dur = r.rawDurationSec || r.durationMins * 60;
        if (dur < minDuration) {
          minDuration = dur;
          minDurationIndex = idx;
        }
      });

      evaluated[minDurationIndex].isFastest = true;

      let maxSafetyIndex = 0;
      let maxSafety = evaluated[0].safetyScore;

      evaluated.forEach((r, idx) => {
        if (r.safetyScore > maxSafety) {
          maxSafety = r.safetyScore;
          maxSafetyIndex = idx;
        }
      });

      evaluated[maxSafetyIndex].isSafest = true;
    }

    setRoutes(evaluated);
    setIsSearchingRoute(false);
  };

  const isNightTime = new Date().getHours() >= 20 || new Date().getHours() <= 5;

  const getScoreBadgeColor = (score) => {
    if (score >= 70) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400';
    if (score >= 40) return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400';
    return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400';
  };

  // Layer pill styling map per STEP 9 rules
  const layerPillStyles = {
    unsafe: activeLayerFilters.unsafe
      ? 'bg-red-100 text-red-800 border-red-300 font-bold'
      : 'bg-red-50/60 text-red-600 border-red-200 hover:bg-red-100',
    accident: activeLayerFilters.accident
      ? 'bg-orange-100 text-orange-800 border-orange-300 font-bold'
      : 'bg-orange-50/60 text-orange-600 border-orange-200 hover:bg-orange-100',
    lighting: activeLayerFilters.lighting
      ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
      : 'bg-amber-50/60 text-amber-600 border-amber-200 hover:bg-amber-100',
    police: activeLayerFilters.police
      ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold'
      : 'bg-blue-50/60 text-blue-600 border-blue-200 hover:bg-blue-100',
    hospital: activeLayerFilters.hospital
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
      : 'bg-emerald-50/60 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
  };

  const layerDotColors = {
    unsafe: 'bg-red-600',
    accident: 'bg-orange-500',
    lighting: 'bg-amber-500',
    police: 'bg-blue-600',
    hospital: 'bg-emerald-600',
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Page Header & Area Safety Rating */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-rose-500" /> Safety & Security Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live safety heatmaps, incident layer filters, OSRM safer route guidance & SOS emergency hotlines</p>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Area Safety Score</span>
              <span className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">{areaScore} / 100</span>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        {/* Night Mode Warning Banner */}
        {isNightTime && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-violet-900 text-white flex items-center gap-3 shadow-lg">
            <Moon className="w-6 h-6 text-amber-300 shrink-0 animate-pulse" />
            <div className="text-xs">
              <h4 className="font-bold text-sm text-white">Nighttime Advisory Active</h4>
              <p className="text-indigo-100">Late night hours (after 8 PM). Prefer well-lit main thoroughfares and use the Safer Route Finder below.</p>
            </div>
          </div>
        )}

        {/* SOS Emergency Card & Hotlines */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-500 animate-bounce" /> Emergency SOS Contacts
            </h2>
            <Badge variant="danger">24/7 National Emergency</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <a
              href={`tel:${APP_CONFIG.emergencyContacts.national}`}
              className="p-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-center flex flex-col items-center justify-center gap-1 shadow-md transition-all"
            >
              <span className="text-lg font-display">Dial 112</span>
              <span className="text-[10px] font-normal opacity-90">National Emergency</span>
            </a>
            <a
              href={`tel:${APP_CONFIG.emergencyContacts.police}`}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-900 dark:text-slate-100 font-bold text-center flex flex-col items-center justify-center gap-1 transition-all"
            >
              <span className="text-lg font-display text-indigo-600 dark:text-indigo-400">100</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Police Control Room</span>
            </a>
            <a
              href={`tel:${APP_CONFIG.emergencyContacts.ambulance}`}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-900 dark:text-slate-100 font-bold text-center flex flex-col items-center justify-center gap-1 transition-all"
            >
              <span className="text-lg font-display text-pink-600 dark:text-pink-400">108</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Ambulance Service</span>
            </a>
            <a
              href={`tel:${APP_CONFIG.emergencyContacts.womenHelpline}`}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-900 dark:text-slate-100 font-bold text-center flex flex-col items-center justify-center gap-1 transition-all"
            >
              <span className="text-lg font-display text-violet-600 dark:text-violet-400">1091</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Women Helpline</span>
            </a>
          </div>
        </div>

        {/* Heatmap & Safety Map View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Layers Control & Route Finder */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Map Layer Toggles */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">Safety Layer Toggles</h3>
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                    showHeatmap ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white border-transparent shadow-sm' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {showHeatmap ? 'Heatmap ON' : 'Heatmap OFF'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.keys(activeLayerFilters).map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleLayerFilter(key)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all capitalize flex items-center gap-2 ${
                      layerPillStyles[key] || 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${layerDotColors[key] || 'bg-slate-400'}`} />
                    {key} zones
                  </button>
                ))}
              </div>
            </div>

            {/* Safer Route Finder */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Safer Route Finder
              </h3>

              <form onSubmit={handleFindRoutes} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">Origin Location</label>
                  <input
                    type="text"
                    value={startQuery}
                    onChange={(e) => setStartQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">Destination Location</label>
                  <input
                    type="text"
                    value={destQuery}
                    onChange={(e) => setDestQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSearchingRoute}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isSearchingRoute ? 'Calculating OSRM Routes...' : 'Find Safest Route Options'}
                </button>
              </form>

              {routes.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {routes.map((rt) => (
                    <div
                      key={rt.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        rt.isSafest
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 text-slate-900 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{rt.name}</span>
                        <div className="flex items-center gap-1">
                          {rt.isSafest && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500 text-white font-bold">
                              RECOMMENDED SAFEST
                            </span>
                          )}
                          {rt.isFastest && <Badge variant="estimated">FASTEST</Badge>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>Distance: <strong>{rt.distanceKm} km</strong></span>
                        <span>Est: <strong>{rt.durationMins} mins</strong></span>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getScoreBadgeColor(rt.safetyScore)}`}>
                          Safety: {rt.safetyScore}%
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        💡 {rt.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: Interactive Safety Heatmap & Route Polylines */}
          <div className="lg:col-span-7 h-[650px] bg-white rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
            <MapView center={currentCity} zoom={12}>
              {showHeatmap && <HeatLayer points={reports} radius={40} blur={15} minOpacity={0.7} maxZoom={14} />}
              {routes.map((r) => (
                <RouteLayer key={r.id} coordinates={r.coordinates} isSafest={r.isSafest} />
              ))}
            </MapView>
          </div>

        </div>

      </div>
    </PageShell>
  );
};
