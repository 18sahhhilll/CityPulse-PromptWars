import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PLACE_CATEGORIES } from '../../config/categories';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMapStore } from '../../store/useMapStore';
import { formatApproxPrice } from '../../utils/format';

const createCategoryIcon = (category, isSelected = false) => {
  const catConfig = PLACE_CATEGORIES.find((c) => c.id === category) || PLACE_CATEGORIES[0];
  const color = catConfig.color;
  const emoji = catConfig.emoji;

  const html = `
    <div style="
      background-color: ${color};
      width: ${isSelected ? '38px' : '32px'};
      height: ${isSelected ? '38px' : '32px'};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2.5px solid #FFFFFF;
      box-shadow: 0 4px 14px rgba(0,0,0,0.5);
      font-size: ${isSelected ? '18px' : '15px'};
      transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
      transition: all 0.2s ease;
    ">
      ${emoji}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

export const MarkerLayer = ({ places = [], selectedPlaceId, onSelectPlace }) => {
  const registerMarker = useMapStore((state) => state.registerMarker);
  const hoveredPlaceId = useMapStore((state) => state.hoveredPlaceId);

  return (
    <>
      {places.map((place) => {
        const isSelected = place.id === selectedPlaceId || place.id === hoveredPlaceId;
        const icon = createCategoryIcon(place.category, isSelected);

        return (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={icon}
            ref={(markerInstance) => {
              if (markerInstance) {
                registerMarker(place.id, markerInstance);
              }
            }}
            eventHandlers={{
              click: () => onSelectPlace && onSelectPlace(place),
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 min-w-[200px]">
                {place.image && (
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                )}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">{place.name}</h4>
                  <span className="text-xs font-semibold text-amber-500 dark:text-amber-400 flex items-center gap-0.5 shrink-0">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {place.rating}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">{place.address || place.description}</p>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>{place.priceLevel}</span>
                    <span className="text-[10px] font-normal opacity-90">{formatApproxPrice(place)}</span>
                  </span>
                  <Link
                    to={`/explore/${place.id}`}
                    className="inline-flex items-center gap-1 text-indigo-600 dark:text-cyan-400 font-semibold hover:underline"
                  >
                    Details <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
