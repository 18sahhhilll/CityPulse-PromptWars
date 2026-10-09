import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useMapStore } from '../../store/useMapStore';
import { APP_CONFIG } from '../../config/app.config';
import { RotateCcw } from 'lucide-react';

// Component to dynamically register map instance with useMapStore
const MapRegister = () => {
  const map = useMap();
  const setMapInstance = useMapStore((state) => state.setMapInstance);

  useEffect(() => {
    if (map) {
      setMapInstance(map);
    }
    return () => {
      setMapInstance(null);
    };
  }, [map, setMapInstance]);

  return null;
};

// Component to dynamically re-center map when city center prop changes
const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && typeof center.lat === 'number' && typeof center.lng === 'number') {
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
  showResetButton = true,
}) => {
  const { theme } = useSettingsStore();
  const resetMapCenter = useMapStore((state) => state.resetMapCenter);

  const cartoApiKey = import.meta.env.VITE_CARTO_KEY || 'cb1_4f0r_1_0b93d5b8f1e4b20459859d1c';
  const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;

  // Tile priority level (1: CARTO, 2: MapTiler, 3: OpenStreetMap fallback)
  const [priorityLevel, setPriorityLevel] = useState(1);

  let currentTileConfig = APP_CONFIG.mapTilePriorities.carto;
  let tileUrl = '';

  if (priorityLevel === 1) {
    currentTileConfig = APP_CONFIG.mapTilePriorities.carto;
    tileUrl = theme === 'dark' ? currentTileConfig.dark(cartoApiKey) : currentTileConfig.light(cartoApiKey);
  } else if (priorityLevel === 2 && maptilerKey) {
    currentTileConfig = APP_CONFIG.mapTilePriorities.maptiler;
    tileUrl = theme === 'dark' ? currentTileConfig.dark(maptilerKey) : currentTileConfig.light(maptilerKey);
  } else {
    currentTileConfig = APP_CONFIG.mapTilePriorities.osm;
    tileUrl = theme === 'dark' ? currentTileConfig.dark() : currentTileConfig.light();
  }

  const defaultCenter = [center?.lat || 18.5204, center?.lng || 73.8567];
  const isOsmDarkFallback = priorityLevel === 3 && theme === 'dark';

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl ${className} ${isOsmDarkFallback ? 'dark-map-filter' : ''}`}>
      {showResetButton && (
        <button
          onClick={() => resetMapCenter(center, zoom)}
          title="Reset map to city center"
          aria-label="Reset map view"
          className="absolute top-3 right-3 z-[450] px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-950/85 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 shadow-md backdrop-blur-md transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
          <span>Reset view</span>
        </button>
      )}

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
        <MapRegister />
        <MapRecenter center={center} zoom={zoom} />
        {children}
      </MapContainer>
    </div>
  );
};
