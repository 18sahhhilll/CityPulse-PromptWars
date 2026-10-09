import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, ShieldCheck } from 'lucide-react';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import { Badge } from '../ui/Badge';
import { getScoreBadge } from '../../utils/scoring';
import { resolvePlaceImage } from '../../services/imageResolver';

export const PlaceCard = ({ place, isCompact = false }) => {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const bookmarked = isFavorite(place.id);
  const scoreInfo = getScoreBadge(place.scores?.safety || 85);

  const [imgData, setImgData] = useState({ src: place.image || '', source: 'curated' });

  useEffect(() => {
    let mounted = true;
    resolvePlaceImage(place).then((resolved) => {
      if (mounted && resolved?.src) {
        setImgData(resolved);
      }
    });
    return () => { mounted = false; };
  }, [place]);

  const isSampleScore = place.isSample || place.id.startsWith('osm-') || !place.liveSafetyScore;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col h-full group">
      {/* Image Thumbnail Header with Fixed Aspect Ratio (16:9) */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={imgData.src}
          alt={place.name}
          data-img-source={imgData.source}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            // Fallback to category vector SVG placeholder if image network load fails
            e.target.dataset.imgSource = 'category_placeholder';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Favorite Bookmark Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(place.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-rose-400 transition-colors z-10"
          aria-label="Bookmark place"
        >
          <Heart className={`w-4 h-4 ${bookmarked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Category & Budget Badges */}
        <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="violet">{place.category.toUpperCase()}</Badge>
          <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-950/80 text-emerald-400 border border-slate-800">
            {place.priceLevel}
          </span>
          {place.isBudget && (
            <Badge variant="verified" className="min-w-fit truncate">
              🏷️ Budget
            </Badge>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link to={`/explore/${place.id}`}>
              {/* Allow up to 2 lines for place name */}
              <h3 className="font-bold text-base font-display text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                {place.name}
              </h3>
            </Link>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0 mt-0.5">
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

        {/* Footer info: tags & safety score with sample superscript */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${scoreInfo.bg}`} title={isSampleScore ? "Safety score estimated from sample incident dataset" : "Calculated from live citizen reports"}>
            Safety: {place.scores?.safety || 85}%
            {isSampleScore && <sup className="ml-0.5 text-[9px] font-normal opacity-80 text-amber-300">sample</sup>}
          </span>
          <Link
            to={`/explore/${place.id}`}
            className="text-cyan-400 font-semibold hover:underline"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};
