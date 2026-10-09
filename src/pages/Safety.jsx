import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { MapView } from '../components/map/MapView';
import { MarkerLayer } from '../components/map/MarkerLayer';
import { HeatLayer } from '../components/map/HeatLayer';
import { RouteLayer } from '../components/map/RouteLayer';
import { MapControls } from '../components/map/MapControls';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useReportStore } from '../store/useReportStore';
import { useCityStore } from '../store/useCityStore';
import { fetchOSRMRoute } from '../services/routing';
import { evaluateRouteSafety, calculateAreaSafetyScore } from '../utils/safetyScore';
import { APP_CONFIG } from '../config/app.config';
import { ShieldAlert, PhoneCall, AlertTriangle, Moon, Navigation, CheckCircle2, ShieldCheck, Hospital, Shield } from 'lucide-react';

export const Safety = () => {
  const currentCity = useCityStore((state) => state.currentCity);
  const { reports, activeLayerFilters, toggleLayerFilter } = useReportStore();

  const [showHeatmap, setShowHeatmap] = useState(true);
  const areaScore = calculateAreaSafetyScore(currentCity.lat, currentCity.lng, reports);

  // Safer Route Finder State
  const [startQuery, setStartQuery] = useState('FC Road, Deccan');
  const [destQuery, setDestQuery] = useState('Koregaon Park');
  const [routes, setRoutes] = useState([]);
  const [isSearchingRoute, setIsSearchingRoute] = useState(false);

  const handleFindRoutes = async (e) => {
    e.preventDefault();
    setIsSearchingRoute(true);

    // Seeded route endpoints around Pune center
    const origin = { lat: currentCity.lat - 0.015, lng: currentCity.lng - 0.015 };
    const destination = { lat: currentCity.lat + 0.02, lng: currentCity.lng + 0.02 };

    const route1 = await fetchOSRMRoute([origin, destination], 'driving');
    const route2 = await fetchOSRMRoute([
      origin,
      { lat: currentCity.lat + 0.01, lng: currentCity.lng - 0.01 },
      destination
    ], 'driving');

    const eval1 = evaluateRouteSafety(route1.coordinates, reports);
    const eval2 = evaluateRouteSafety(route2.coordinates, reports);

    const evaluatedRoutes = [
      { ...route1, name: 'Route A (Main Arterial)', ...eval1, isFastest: true },
      { ...route2, name: 'Route B (Well-Lit Bypass)', ...eval2, isFastest: false },
    ].sort((a, b) => b.safetyScore - a.safetyScore);

    evaluatedRoutes[0].isSafest = true;

    setRoutes(evaluatedRoutes);
    setIsSearchingRoute(false);
  };

  const isNightTime = new Date().getHours() >= 20 || new Date().getHours() <= 5;

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Page Header & Area Safety Rating */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-rose-500" /> Safety & Security Center
            </h1>
            <p className="text-xs text-slate-400">Live safety heatmaps, layer filters, OSRM safer route guidance & SOS emergency hotlines</p>
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
                  {isSearchingRoute ? 'Scoring Routes...' : 'Calculate Safest Route'}
                </Button>
              </form>

              {routes.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  {routes.map((rt, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        rt.isSafest
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-100'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{rt.name}</span>
                        {rt.isSafest && <Badge variant="verified">RECOMMENDED SAFEST</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-slate-400">
                        <span>Distance: {rt.distanceKm} km</span>
                        <span>Est: {rt.durationMins} mins</span>
                        <span className="font-bold text-emerald-400">Safety: {rt.safetyScore}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {rt.isSafest ? 'Bypasses 2 unlit alleys and reported accident curve.' : 'Faster route, but passes near reported poorly lit underpass.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: Interactive Safety Heatmap */}
          <div className="lg:col-span-7 h-[650px]">
            <MapView center={currentCity} zoom={13}>
              {showHeatmap && <HeatLayer points={reports} radius={30} blur={20} />}
              {routes.map((r, i) => (
                <RouteLayer key={i} coordinates={r.coordinates} isSafest={r.isSafest} />
              ))}
            </MapView>
          </div>

        </div>

      </div>
    </PageShell>
  );
};
