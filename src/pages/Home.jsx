import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldAlert, History, BarChart3, Radio, MapPin, ArrowRight, ExternalLink, Plus } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { WeatherCard } from '../components/cards/WeatherCard';
import { ScoreCard } from '../components/cards/ScoreCard';
import { AlertCard } from '../components/cards/AlertCard';
import { PlaceCard } from '../components/cards/PlaceCard';
import { MapView } from '../components/map/MapView';
import { MarkerLayer } from '../components/map/MarkerLayer';
import { Badge } from '../components/ui/Badge';
import { useCityStore } from '../store/useCityStore';
import { usePlaces } from '../hooks/usePlaces';
import { useReportStore } from '../store/useReportStore';
import { getTrafficMood } from '../services/traffic';

export const Home = () => {
  const currentCity = useCityStore((state) => state.currentCity);
  const { places, loading } = usePlaces();
  const reports = useReportStore((state) => state.reports);
  const trafficInfo = getTrafficMood(reports);

  const quickTiles = [
    { title: 'Explore City', desc: 'Attractions, Food & Stays', icon: Compass, path: '/explore', color: 'from-indigo-500 to-violet-500' },
    { title: 'Safety Heatmap', desc: 'Safer routes & accident zones', icon: ShieldAlert, path: '/safety', color: 'from-red-500 to-orange-400' },
    { title: 'History & Culture', desc: 'Landmarks & Heritage Trails', icon: History, path: '/history', color: 'from-amber-400 to-orange-500' },
    { title: 'Compare Spots', desc: 'Radar score comparisons', icon: BarChart3, path: '/compare', color: 'from-blue-500 to-cyan-400' },
    { title: 'Smart Insights', desc: 'Live citizen pulse & charts', icon: Radio, path: '/insights', color: 'from-emerald-500 to-teal-400' },
  ];

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Hero Banner Header with Interactive Mini Map */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 text-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/10 pointer-events-none" />
          
          <div className="lg:col-span-7 space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-wider uppercase shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>EXPLORING {currentCity.name.toUpperCase()}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white drop-shadow-sm">
              The Real-Time Pulse of <span className="underline decoration-pink-300 decoration-wavy decoration-2">{currentCity.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
              Discover top hospitality spots, explore heritage walking trails, navigate safety heatmaps, and access verified citizen insights.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-slate-50 text-xs font-bold shadow-lg transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4 text-pink-500" />
                <span>Submit Citizen Report</span>
              </Link>
              <Link
                to="/safety"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
                <span>View Heatmap</span>
              </Link>
            </div>
          </div>

          {/* Hero Right: Compact Interactive Mini Map */}
          <div className="lg:col-span-5 h-56 rounded-2xl overflow-hidden border border-white/30 shadow-2xl relative group bg-white">
            <MapView center={currentCity} zoom={13} className="h-full w-full">
              <MarkerLayer places={places.slice(0, 5)} />
            </MapView>
            <div className="absolute bottom-3 right-3 z-[400]">
              <Link
                to="/explore"
                className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-slate-200 text-xs font-bold text-indigo-600 flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all"
              >
                <span>Open full map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Live Metrics Row: Weather, City Pulse Score, Traffic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WeatherCard />
          <ScoreCard cityName={currentCity.name} trafficLevel={trafficInfo.level} />

          {/* Traffic Mood Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Traffic Mood</span>
              <div className="flex items-center gap-1.5">
                <Badge variant="estimated">Estimated</Badge>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${trafficInfo.bg}`}>
                  {trafficInfo.mood}
                </span>
              </div>
            </div>
            <div className="my-3">
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{trafficInfo.mood}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{trafficInfo.description}</p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Time-of-day heuristic</span>
              <Link to="/safety" className="text-indigo-600 dark:text-cyan-400 font-semibold hover:underline">Check Safer Routes →</Link>
            </div>
          </div>
        </div>

        {/* Live Top Alert Banner */}
        <AlertCard
          title="[Sample Alert] Monsoon Waterlogging Alert near Shivajinagar"
          message="Moderate waterlogging reported near Shivajinagar railway underpass. Vehicles advised to use University flyover route."
          type="warning"
          timestamp="Updated 15 mins ago"
        />

        {/* Quick Action Tiles */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">Explore CityPulse Modules</h2>
            <div className="h-0.5 w-10 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickTiles.map((tile, idx) => {
              const Icon = tile.icon;
              return (
                <Link
                  key={idx}
                  to={tile.path}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex flex-col justify-between h-36 group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tile.color} p-2 text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                      {tile.title}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{tile.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Featured Spots & Interactive Overview Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">Top Local Highlights</h2>
              <Link to="/explore" className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline">
                View All Spots ({places.length}) →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {places.slice(0, 4).map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>

          {/* Quick City Map */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">City Overview Map</h2>
            <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white">
              <MapView center={currentCity} zoom={12}>
                <MarkerLayer places={places} />
              </MapView>
            </div>
          </div>
        </div>

      </div>
    </PageShell>
  );
};
