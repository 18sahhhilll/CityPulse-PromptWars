import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Heart } from 'lucide-react';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import { useMapStore } from '../../store/useMapStore';
import { Badge } from '../ui/Badge';
import { getScoreBadge } from '../../utils/scoring';
import { resolvePlaceImage } from '../../services/imageResolver';
import { formatApproxPrice } from '../../utils/format';

export const PlaceCard = ({ place, isSelected = false }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const { flyToPlace, closeActivePopup, hoveredPlaceId } = useMapStore();

  const bookmarked = isFavorite(place.id);
  const isHovered = hoveredPlaceId === place.id || isSelected;
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

  const handleMouseEnter = () => {
    flyToPlace(place, 15);
  };

  const handleMouseLeave = () => {
    closeActivePopup();
  };

  const handleClick = () => {
    flyToPlace(place, 15);
    navigate(`/explore/${place.id}`);
  };

  const handleViewOnMapOnly = (e) => {
    e.preventDefault();
    e.stopPropagation();
    flyToPlace(place, 15);
  };

  const isSampleScore = place.isSample || place.id.startsWith('osm-') || !place.liveSafetyScore;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col h-full group cursor-pointer transition-all duration-300 ${
        isHovered ? 'ring-2 ring-indigo-500/60 shadow-xl shadow-indigo-500/10' : 'hover:border-indigo-400/40 hover:shadow-lg'
      }`}
    >
      {/* Image Thumbnail Header */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={imgData.src}
          alt={place.name}
          data-img-source={imgData.source}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.dataset.imgSource = 'category_placeholder';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Top-Right Action Buttons: View on Map & Bookmark */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleViewOnMapOnly}
            className="p-1.5 rounded-xl bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-600 hover:text-white transition-colors shadow-sm"
            title="View on map"
            aria-label="View on map"
          >
            <MapPin className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(place.id);
            }}
            className="p-1.5 rounded-xl bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 transition-colors shadow-sm"
            title="Bookmark place"
            aria-label="Bookmark place"
          >
            <Heart className={`w-3.5 h-3.5 ${bookmarked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Category & Budget Badges */}
        <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="violet">{place.category.toUpperCase()}</Badge>
          <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-white/90 dark:bg-slate-950/80 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1">
            <span>{place.priceLevel}</span>
            <span className="text-[11px] font-semibold opacity-90">{formatApproxPrice(place)}</span>
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
            <h3 className="font-bold text-base font-display text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
              {place.name}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {place.rating}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2 line-clamp-1">
            <MapPin className="w-3 h-3 text-indigo-500 dark:text-cyan-400 shrink-0" />
            {place.address} {place.distanceKm ? `(${place.distanceKm} km)` : ''}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{place.description}</p>
        </div>

        {/* Footer info: tags & safety score */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800" title={isSampleScore ? "Safety score estimated from sample incident dataset" : "Calculated from live citizen reports"}>
            Safety: {place.scores?.safety || 85}%
            {isSampleScore && <sup className="ml-0.5 text-[9px] font-normal opacity-80 text-amber-600 dark:text-amber-300">sample</sup>}
          </span>
          <span className="text-indigo-600 dark:text-cyan-400 font-bold flex items-center gap-1 group-hover:underline">
            Details →
          </span>
        </div>
      </div>
    </motion.div>
  );
};
