import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { usePlaces } from '../hooks/usePlaces';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Star, MapPin, Heart, Clock, ShieldCheck, Sparkles, Navigation, ArrowLeft } from 'lucide-react';
import { MapView } from '../components/map/MapView';
import { MarkerLayer } from '../components/map/MarkerLayer';

export const PlaceDetail = () => {
  const { id } = useParams();
  const { allPlaces } = usePlaces();
  const { isFavorite, toggleFavorite } = useFavoriteStore();

  const place = allPlaces.find((p) => p.id === id) || allPlaces[0];
  const bookmarked = isFavorite(place?.id);

  if (!place) return null;

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Back Link */}
        <Link to="/explore" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>

        {/* Hero Header */}
        <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden glass-panel border border-slate-800">
          <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(place.id)}
              className="p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-rose-400"
            >
              <Heart className={`w-5 h-5 ${bookmarked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="violet">{place.category.toUpperCase()}</Badge>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-950/80 text-emerald-400 border border-slate-800">
                  {place.priceLevel}
                </span>
                {place.isBudget && <Badge variant="verified">Budget Spot</Badge>}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white">{place.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4 text-cyan-400" /> {place.address}
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-amber-400 font-bold text-lg">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>{place.rating}</span>
              <span className="text-xs text-slate-400 font-normal">({place.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Detailed Scores Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" /> Multi-Metric Livability Breakdown
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">Safety</span>
              <span className="text-emerald-400 font-bold text-lg">{place.scores?.safety || 90}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">Cleanliness</span>
              <span className="text-cyan-400 font-bold text-lg">{place.scores?.cleanliness || 85}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">Affordability</span>
              <span className="text-amber-400 font-bold text-lg">{place.scores?.affordability || 88}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">User Rating</span>
              <span className="text-pink-400 font-bold text-lg">{place.scores?.rating || 92}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center col-span-2 sm:col-span-1">
              <span className="text-slate-400 text-[10px]">Accessibility</span>
              <span className="text-violet-400 font-bold text-lg">{place.scores?.accessibility || 85}%</span>
            </div>
          </div>
        </div>

        {/* Location Map & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100">About {place.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{place.description}</p>
            
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Opening Hours: <strong>{place.openHours}</strong></span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {place.tags?.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700/60">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="h-72 rounded-2xl overflow-hidden border border-slate-800">
            <MapView center={{ lat: place.lat, lng: place.lng }} zoom={15}>
              <MarkerLayer places={[place]} selectedPlaceId={place.id} />
            </MapView>
          </div>
        </div>

      </div>
    </PageShell>
  );
};
