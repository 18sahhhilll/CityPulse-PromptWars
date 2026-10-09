import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldAlert, History, BarChart3, Radio, MapPin, Search, ArrowRight, Tag, AlertTriangle } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { WeatherCard } from '../components/cards/WeatherCard';
import { ScoreCard } from '../components/cards/ScoreCard';
import { AlertCard } from '../components/cards/AlertCard';
import { PlaceCard } from '../components/cards/PlaceCard';
import { MapView } from '../components/map/MapView';
import { MarkerLayer } from '../components/map/MarkerLayer';
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
    { title: 'Explore City', desc: 'Attractions, Food & Stays', icon: Compass, path: '/explore', color: 'from-violet-600 to-indigo-600' },
    { title: 'Safety Heatmap', desc: 'Safer routes & accident zones', icon: ShieldAlert, path: '/safety', color: 'from-rose-600 to-pink-600' },
    { title: 'History & Culture', desc: 'Landmarks & Heritage Trails', icon: History, path: '/history', color: 'from-amber-600 to-orange-600' },
    { title: 'Compare Spots', desc: 'Radar score comparisons', icon: BarChart3, path: '/compare', color: 'from-cyan-600 to-blue-600' },
    { title: 'Smart Insights', desc: 'Live citizen pulse & charts', icon: Radio, path: '/insights', color: 'from-emerald-600 to-teal-600' },
  ];

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Hero Banner Header */}
        <div className="relative rounded-3xl p-6 sm:p-10 glass-panel border border-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/60 via-slate-950/80 to-slate-950/90 -z-10" />
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPLORING {currentCity.name.toUpperCase()}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
              The Real-Time Pulse of <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">{currentCity.name}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Discover top hospitality spots, explore heritage walking trails, navigate safety heatmaps, and access verified citizen insights.
            </p>
          </div>
        </div>

        {/* Live Metrics Row: Weather, Traffic, City Pulse Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WeatherCard />
          <ScoreCard cityName={currentCity.name} />

          {/* Traffic Mood Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Traffic Mood</span>
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${trafficInfo.bg}`}>
                {trafficInfo.mood}
              </span>
            </div>
            <div className="my-3">
              <div className="text-xl font-bold text-slate-100">{trafficInfo.mood}</div>
              <p className="text-xs text-slate-400 mt-1">{trafficInfo.description}</p>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Status: Estimated</span>
              <Link to="/safety" className="text-cyan-400 font-semibold hover:underline">Check Safer Routes →</Link>
            </div>
          </div>
        </div>

        {/* Live Top Alert Banner */}
        <AlertCard
          title="Monsoon Waterlogging Alert near Shivajinagar"
          message="Moderate waterlogging reported near Shivajinagar railway underpass. Vehicles advised to use University flyover route."
          type="warning"
          timestamp="Updated 15 mins ago"
        />

        {/* Quick Action Tiles */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-display text-slate-100">Explore CityPulse Modules</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickTiles.map((tile, idx) => {
              const Icon = tile.icon;
              return (
                <Link
                  key={idx}
                  to={tile.path}
                  className="glass-panel glass-panel-hover rounded-2xl p-4 border border-slate-800 flex flex-col justify-between h-36 group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tile.color} p-2 text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                      {tile.title}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{tile.desc}</p>
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
              <h2 className="text-xl font-bold font-display text-slate-100">Top Local Highlights</h2>
              <Link to="/explore" className="text-xs font-semibold text-cyan-400 hover:underline">
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
            <h2 className="text-xl font-bold font-display text-slate-100">City Overview Map</h2>
            <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
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
