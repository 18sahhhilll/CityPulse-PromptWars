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
import { History as HistoryIcon, Landmark, Utensils, Sparkles, MapPin, Compass, CheckCircle2 } from 'lucide-react';

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
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 flex items-center gap-2">
              <HistoryIcon className="w-7 h-7 text-amber-400" /> History & Culture of {currentCity.name}
            </h1>
            <p className="text-xs text-slate-400">Discover historic Peshwa monuments, local food traditions & build custom walking trails</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('heritage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === 'heritage' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Heritage Sites
            </button>
            <button
              onClick={() => setActiveTab('traditions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === 'traditions' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Local Traditions
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === 'builder' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
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
                    className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800 cursor-pointer group"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                      <img src={site.image} alt={site.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <Badge variant="violet" className="absolute top-3 left-3">{site.era}</Badge>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold font-display text-slate-100 group-hover:text-cyan-400 transition-colors">{site.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{site.whyItMatters}</p>
                      <button className="text-xs font-semibold text-cyan-400 hover:underline pt-1">
                        Read Story →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Heritage Map */}
            <div className="lg:col-span-5 h-[600px] sticky top-20">
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
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Celebrated Festivals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {traditionsData.festivals.map((fest, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <img src={fest.image} alt={fest.name} className="w-24 h-24 rounded-lg object-cover shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-amber-400">{fest.timing}</span>
                      <h4 className="font-bold text-sm text-slate-100">{fest.name}</h4>
                      <p className="text-xs text-slate-300 line-clamp-3">{fest.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Culinary heritage */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-400" /> Iconic Culinary Dishes
                </h3>
                <div className="space-y-3">
                  {traditionsData.cuisines.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <h5 className="font-bold text-amber-300 text-sm mb-1">{c.name}</h5>
                      <p className="text-slate-300 mb-1">{c.specialty}</p>
                      <span className="text-[10px] text-slate-400">Famous Spots: {c.famousSpots.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crafts */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-violet-400" /> GI-Tagged Craft Traditions
                </h3>
                <div className="space-y-3">
                  {traditionsData.crafts.map((cr, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="font-bold text-violet-300 text-sm">{cr.name}</h5>
                        <Badge variant="violet">{cr.status}</Badge>
                      </div>
                      <p className="text-slate-300">{cr.description}</p>
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
            <div className="lg:col-span-5 space-y-4 glass-panel p-6 rounded-2xl border border-slate-800">
              <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" /> Build a Heritage Walking Trail
              </h2>
              <p className="text-xs text-slate-400">Select 2 to 6 heritage landmarks to calculate an ordered walking route via OSRM foot navigation.</p>

              <div className="space-y-2">
                {heritageData.map((site) => {
                  const isSelected = selectedTrailIds.includes(site.id);
                  return (
                    <button
                      key={site.id}
                      onClick={() => toggleSiteForTrail(site.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-violet-600/20 border-violet-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold">{site.name}</h4>
                        <span className="text-[10px] text-slate-400">{site.era}</span>
                      </div>
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px] ${
                        isSelected ? 'bg-violet-600 border-violet-400 text-white' : 'border-slate-700 text-slate-500'
                      }`}>
                        {isSelected ? selectedTrailIds.indexOf(site.id) + 1 : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={handleBuildTrail}
                disabled={selectedTrailIds.length < 2 || isGeneratingRoute}
                variant="primary"
                className="w-full"
              >
                {isGeneratingRoute ? 'Calculating OSRM Foot Route...' : `Generate Trail (${selectedTrailIds.length} sites)`}
              </Button>

              {routeGeometry && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                    <span className="font-bold text-emerald-400 block mb-1">Route Calculated Successfully</span>
                    <p className="text-slate-300">Total Distance: <strong>{routeGeometry.distanceKm} km</strong></p>
                    <p className="text-slate-300">Est. Walk Time: <strong>{routeGeometry.durationMins} mins</strong></p>
                  </div>
                  <Button onClick={handleSaveTrail} variant="secondary" size="sm" className="w-full">
                    {trailSaved ? '✓ Trail Saved to Favorites!' : 'Save Trail to Bookmarks'}
                  </Button>
                </div>
              )}
            </div>

            {/* Map showing route */}
            <div className="lg:col-span-7 h-[600px]">
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
