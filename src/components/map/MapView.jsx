import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useSettingsStore } from '../../store/useSettingsStore';
import { APP_CONFIG } from '../../config/app.config';

// Component to dynamically re-center map when city center changes
const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

export const MapView = ({
  center,
  zoom = 13,
  children,
  className = 'h-full w-full min-h-[400px]',
}) => {
  const { theme } = useSettingsStore();

  const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;
  const stadiaKey = import.meta.env.VITE_STADIA_KEY;

  // Initial Priority Level:
  // Level 1: MapTiler if key present
  // Level 2: Stadia
  // Level 3: OSM (with dark mode CSS filter)
  const initialPriority = maptilerKey ? 1 : 2;
  const [priorityLevel, setPriorityLevel] = useState(initialPriority);

  let currentTileConfig = APP_CONFIG.mapTilePriorities.maptiler;
  let tileUrl = '';

  if (priorityLevel === 1 && maptilerKey) {
    currentTileConfig = APP_CONFIG.mapTilePriorities.maptiler;
    tileUrl = theme === 'dark' ? currentTileConfig.dark(maptilerKey) : currentTileConfig.light(maptilerKey);
  } else if (priorityLevel <= 2) {
    currentTileConfig = APP_CONFIG.mapTilePriorities.stadia;
    tileUrl = theme === 'dark' ? currentTileConfig.dark(stadiaKey) : currentTileConfig.light(stadiaKey);
  } else {
    currentTileConfig = APP_CONFIG.mapTilePriorities.osm;
    tileUrl = theme === 'dark' ? currentTileConfig.dark() : currentTileConfig.light();
  }

  const defaultCenter = [center?.lat || 18.5204, center?.lng || 73.8567];
  const isOsmDarkFallback = priorityLevel === 3 && theme === 'dark';

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={true}
        className={`w-full h-full z-10 ${isOsmDarkFallback ? 'dark-map-filter' : ''}`}
      >
        <TileLayer
          key={`${priorityLevel}-${theme}`}
          url={tileUrl}
          attribution={currentTileConfig.attribution}
          maxZoom={19}
          eventHandlers={{
            tileerror: () => {
              if (priorityLevel < 3) {
                console.warn(`Tile load error on priority level ${priorityLevel}; stepping down map priority.`);
                setPriorityLevel((prev) => Math.min(prev + 1, 3));
              }
            }
          }}
        />
        <MapRecenter center={center} zoom={zoom} />
        {children}
      </MapContainer>
    </div>
  );
};
