import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, Clock, Tag } from 'lucide-react';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import { Badge } from '../ui/Badge';
import { getScoreBadge } from '../../utils/scoring';

export const PlaceCard = ({ place, isCompact = false }) => {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const bookmarked = isFavorite(place.id);
  const scoreInfo = getScoreBadge(place.scores?.safety || 85);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col h-full group">
      {/* Image Thumbnail Header */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-950">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Favorite Bookmark Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(place.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/60 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-rose-400 transition-colors"
          aria-label="Bookmark place"
        >
          <Heart className={`w-4 h-4 ${bookmarked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Category & Price Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Badge variant="violet">{place.category.toUpperCase()}</Badge>
          <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-950/80 text-emerald-400 border border-slate-800">
            {place.priceLevel}
          </span>
          {place.isBudget && (
            <Badge variant="verified">Budget Spot</Badge>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link to={`/explore/${place.id}`}>
              <h3 className="font-bold text-base font-display text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                {place.name}
              </h3>
            </Link>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {place.rating}
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-2 line-clamp-1">
            <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
            {place.address} {place.distanceKm ? `(${place.distanceKm} km)` : ''}
          </p>
          <p className="text-xs text-slate-300 line-clamp-2">{place.description}</p>
        </div>

        {/* Footer info: tags & score */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${scoreInfo.bg}`}>
            Safety: {place.scores?.safety || 85}%
          </span>
          <Link
            to={`/explore/${place.id}`}
            className="text-cyan-400 font-semibold hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};
