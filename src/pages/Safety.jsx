import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { MapView } from '../components/map/MapView';
import { MarkerLayer } from '../components/map/MarkerLayer';
import { HeatLayer } from '../components/map/HeatLayer';
import { RouteLayer } from '../components/map/RouteLayer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useReportStore } from '../store/useReportStore';
import { useCityStore } from '../store/useCityStore';
import { fetchOSRMAlternativeRoutes } from '../services/routing';
import { evaluateRouteSafety, calculateAreaSafetyScore } from '../utils/safetyScore';
import { APP_CONFIG } from '../config/app.config';
import { ShieldAlert, PhoneCall, Moon, Navigation, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
      // Find genuinely fastest route (lowest duration)
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

      // Find genuinely safest route (highest safety score)
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
    if (score >= 70) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (score >= 40) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Page Header & Area Safety Rating */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-rose-500" /> Safety & Security Center
            </h1>
            <p className="text-xs text-slate-400">Live safety heatmaps, incident layer filters, OSRM safer route guidance & SOS emergency hotlines</p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl glass-panel border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Area Safety Score</span>
              <span className="text-2xl font-bold font-display text-emerald-400">{areaScore} / 100</span>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        {/* Night Mode Warning Banner */}
        {isNightTime && (
          <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 flex items-center gap-3 shadow-lg">
            <Moon className="w-6 h-6 text-indigo-400 shrink-0 animate-pulse" />
            <div className="text-xs">
              <h4 className="font-bold text-sm text-white">Nighttime Advisory Active</h4>
              <p>Late night hours (after 8 PM). Prefer well-lit main thoroughfares and use the Safer Route Finder below.</p>
            </div>
          </div>
        )}

        {/* SOS Emergency Card & Hotlines */}
        <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 bg-rose-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-500 animate-bounce" /> Emergency SOS Contacts
            </h2>
            <Badge variant="danger">24/7 National Emergency</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <a
              href={`tel:${APP_CONFIG.emergencyContacts.national}`}
              className="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-center flex flex-col items-center justify-center gap-1 shadow-lg shadow-rose-600/20 transition-all"
            >
              <span className="text-lg font-display">Dial 112</span>
              <span className="text-[10px] font-normal opacity-90">National Emergency</span>
            </a>
            <a
              href={`tel:${APP_CONFIG.emergencyContacts.police}`}
              className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-100 font-bold text-center flex flex-col items-center justify-center gap-1 transition-all"
            >
              <span className="text-lg font-display text-indigo-400">100</span>
              <span className="text-[10px] text-slate-400 font-normal">Police Control Room</span>
            </a>
            <a
              href={`tel:${APP_CONFIG.emergencyContacts.ambulance}`}
              className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-100 font-bold text-center flex flex-col items-center justify-center gap-1 transition-all"
            >
              <span className="text-lg font-display text-pink-400">108</span>
              <span className="text-[10px] text-slate-400 font-normal">Ambulance Service</span>
            </a>
            <a
              href={`tel:${APP_CONFIG.emergencyContacts.womenHelpline}`}
              className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-100 font-bold text-center flex flex-col items-center justify-center gap-1 transition-all"
            >
              <span className="text-lg font-display text-violet-400">1091</span>
              <span className="text-[10px] text-slate-400 font-normal">Women Helpline</span>
            </a>
          </div>
        </div>

        {/* Heatmap & Safety Map View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Layers Control & Route Finder */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Map Layer Toggles */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-display text-slate-100">Safety Layer Toggles</h3>
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    showHeatmap ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
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
                      activeLayerFilters[key]
                        ? 'bg-slate-800 text-slate-100 border-slate-700'
                        : 'bg-slate-900/40 text-slate-500 border-slate-800'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayerFilters[key] ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                    {key} zones
                  </button>
                ))}
              </div>
            </div>

            {/* Safer Route Finder */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" /> Safer Route Finder
              </h3>

              <form onSubmit={handleFindRoutes} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Origin Location</label>
                  <input
                    type="text"
                    value={startQuery}
                    onChange={(e) => setStartQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 text-slate-100 text-xs rounded-xl border border-slate-700/60"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Destination Location</label>
                  <input
                    type="text"
                    value={destQuery}
                    onChange={(e) => setDestQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 text-slate-100 text-xs rounded-xl border border-slate-700/60"
                  />
                </div>

                <Button type="submit" disabled={isSearchingRoute} variant="primary" className="w-full">
                  {isSearchingRoute ? 'Calculating OSRM Routes...' : 'Find Safest Route Options'}
                </Button>
              </form>

              {routes.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  {routes.map((rt) => (
                    <div
                      key={rt.id}
                      className={`p-3 rounded-xl border text-xs space-y-2 ${
                        rt.isSafest
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-100'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100 text-sm">{rt.name}</span>
                        <div className="flex items-center gap-1">
                          {rt.isSafest && <Badge variant="verified">RECOMMENDED SAFEST</Badge>}
                          {rt.isFastest && <Badge variant="estimated">FASTEST</Badge>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span>Distance: <strong>{rt.distanceKm} km</strong></span>
                        <span>Est: <strong>{rt.durationMins} mins</strong></span>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getScoreBadgeColor(rt.safetyScore)}`}>
                          Safety: {rt.safetyScore}%
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                        💡 {rt.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: Interactive Safety Heatmap & Route Polylines */}
          <div className="lg:col-span-7 h-[650px]">
            <MapView center={currentCity} zoom={12}>
              {showHeatmap && <HeatLayer points={reports} radius={30} blur={20} />}
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
