import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { MapView } from '../components/map/MapView';
import { MarkerLayer } from '../components/map/MarkerLayer';
import { RouteLayer } from '../components/map/RouteLayer';
import { StoryCard } from '../components/cards/StoryCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useCityStore } from '../store/useCityStore';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { fetchOSRMRoute } from '../services/routing';
import heritageData from '../data/heritage.json';
import traditionsData from '../data/traditions.json';
import { History as HistoryIcon, Landmark, Utensils, Sparkles, Compass } from 'lucide-react';

export const History = () => {
  const currentCity = useCityStore((state) => state.currentCity);
  const { saveTrail } = useFavoriteStore();

  const [selectedSite, setSelectedSite] = useState(null);
  const [activeTab, setActiveTab] = useState('heritage'); // 'heritage', 'traditions', 'builder'

  // Trail Builder State
  const [selectedTrailIds, setSelectedTrailIds] = useState([]);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);
  const [trailSaved, setTrailSaved] = useState(false);

  const toggleSiteForTrail = (siteId) => {
    if (selectedTrailIds.includes(siteId)) {
      setSelectedTrailIds(selectedTrailIds.filter((id) => id !== siteId));
    } else {
      if (selectedTrailIds.length < 6) {
        setSelectedTrailIds([...selectedTrailIds, siteId]);
      }
    }
  };

  const handleBuildTrail = async () => {
    if (selectedTrailIds.length < 2) return;
    setIsGeneratingRoute(true);

    const waypoints = selectedTrailIds.map((id) => {
      const site = heritageData.find((h) => h.id === id);
      return { lat: site.lat, lng: site.lng };
    });

    const routeData = await fetchOSRMRoute(waypoints, 'foot');
    setRouteGeometry(routeData);
    setIsGeneratingRoute(false);
  };

  const handleSaveTrail = () => {
    if (!routeGeometry) return;
    saveTrail({
      id: `trail-${Date.now()}`,
      name: `Heritage Walking Trail (${selectedTrailIds.length} sites)`,
      siteIds: selectedTrailIds,
      distanceKm: routeGeometry.distanceKm,
      durationMins: routeGeometry.durationMins,
      createdAt: new Date().toISOString(),
    });
    setTrailSaved(true);
    setTimeout(() => setTrailSaved(false), 3000);
  };

  const formattedPlaces = heritageData.map((h) => ({
    id: h.id,
    name: h.name,
    category: 'attraction',
    lat: h.lat,
    lng: h.lng,
    address: `${h.era} • ${h.builder}`,
    rating: 4.8,
    priceLevel: 'Free',
    image: h.image,
    description: h.summary,
  }));

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Hero Banner for History & Culture */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display flex items-center gap-2 drop-shadow-sm">
              <HistoryIcon className="w-8 h-8 text-amber-100" /> History & Culture of {currentCity.name}
            </h1>
            <p className="text-xs sm:text-sm text-amber-50 leading-relaxed">Discover historic Peshwa monuments, local food traditions & build custom walking trails</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab('heritage')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'heritage' ? 'bg-white text-orange-600 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Heritage Sites
            </button>
            <button
              onClick={() => setActiveTab('traditions')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'traditions' ? 'bg-white text-orange-600 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Local Traditions
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'builder' ? 'bg-white text-orange-600 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Trail Builder
            </button>
          </div>
        </div>

        {/* Tab 1: Heritage Sites Map & Story Cards */}
        {activeTab === 'heritage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {heritageData.map((site) => (
                  <div
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-amber-400 shadow-md hover:shadow-lg cursor-pointer group transition-all"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                      <img src={site.image} alt={site.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      <Badge variant="violet" className="absolute top-3 left-3">{site.era}</Badge>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold font-display text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{site.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{site.whyItMatters}</p>
                      <button className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline pt-1">
                        Read Story →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Heritage Map */}
            <div className="lg:col-span-5 h-[600px] sticky top-20 bg-white rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <MapView center={currentCity} zoom={13}>
                <MarkerLayer
                  places={formattedPlaces}
                  onSelectPlace={(p) => {
                    const found = heritageData.find((h) => h.id === p.id);
                    if (found) setSelectedSite(found);
                  }}
                />
              </MapView>
            </div>
          </div>
        )}

        {/* Tab 2: Local Traditions & Culinary Heritage */}
        {activeTab === 'traditions' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Celebrated Festivals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {traditionsData.festivals.map((fest, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700/60">
                    <img src={fest.image} alt={fest.name} className="w-24 h-24 rounded-lg object-cover shrink-0 shadow-sm" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">{fest.timing}</span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{fest.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">{fest.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Culinary heritage */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-500" /> Iconic Culinary Dishes
                </h3>
                <div className="space-y-3">
                  {traditionsData.cuisines.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                      <h5 className="font-bold text-orange-600 dark:text-amber-300 text-sm mb-1">{c.name}</h5>
                      <p className="text-slate-700 dark:text-slate-300 mb-1">{c.specialty}</p>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Famous Spots: {c.famousSpots.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crafts */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-indigo-500" /> GI-Tagged Craft Traditions
                </h3>
                <div className="space-y-3">
                  {traditionsData.crafts.map((cr, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="font-bold text-indigo-600 dark:text-indigo-300 text-sm">{cr.name}</h5>
                        <Badge variant="violet">{cr.status}</Badge>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{cr.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Heritage Trail Builder */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600 dark:text-cyan-400" /> Build a Heritage Walking Trail
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select 2 to 6 heritage landmarks to calculate an ordered walking route via OSRM foot navigation.</p>

              <div className="space-y-2">
                {heritageData.map((site) => {
                  const isSelected = selectedTrailIds.includes(site.id);
                  return (
                    <button
                      key={site.id}
                      onClick={() => toggleSiteForTrail(site.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-50 border-amber-400 text-slate-900 font-bold dark:bg-slate-800 dark:text-white'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold">{site.name}</h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{site.era}</span>
                      </div>
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px] ${
                        isSelected ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-white' : 'border-slate-300 text-slate-400'
                      }`}>
                        {isSelected ? selectedTrailIds.indexOf(site.id) + 1 : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleBuildTrail}
                disabled={selectedTrailIds.length < 2 || isGeneratingRoute}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {isGeneratingRoute ? 'Calculating OSRM Foot Route...' : `Generate Trail (${selectedTrailIds.length} sites)`}
              </button>

              {routeGeometry && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">Route Calculated Successfully</span>
                    <p className="text-slate-700 dark:text-slate-300">Total Distance: <strong>{routeGeometry.distanceKm} km</strong></p>
                    <p className="text-slate-700 dark:text-slate-300">Est. Walk Time: <strong>{routeGeometry.durationMins} mins</strong></p>
                  </div>
                  <Button onClick={handleSaveTrail} variant="secondary" size="sm" className="w-full">
                    {trailSaved ? '✓ Trail Saved to Favorites!' : 'Save Trail to Bookmarks'}
                  </Button>
                </div>
              )}
            </div>

            {/* Map showing route */}
            <div className="lg:col-span-7 h-[600px] bg-white rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <MapView center={currentCity} zoom={13}>
                <MarkerLayer places={formattedPlaces.filter(p => selectedTrailIds.includes(p.id))} />
                {routeGeometry && (
                  <RouteLayer coordinates={routeGeometry.coordinates} isSafest={true} />
                )}
              </MapView>
            </div>
          </div>
        )}

        {/* Story Modal */}
        <Modal isOpen={Boolean(selectedSite)} onClose={() => setSelectedSite(null)} title={selectedSite?.name || 'Story'}>
          <StoryCard site={selectedSite} />
        </Modal>

      </div>
    </PageShell>
  );
};
