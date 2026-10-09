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
  const [useOsmFallback, setUseOsmFallback] = useState(false);

  const cartoApiKey = import.meta.env.VITE_CARTO_KEY || import.meta.env.VITE_CARTO_API_KEY || 'cb1_4f0r_1_0b93d5b8f1e4b20459859d1c';
  const keyQuery = cartoApiKey ? `?key=${cartoApiKey}` : '';

  let tileUrl = useOsmFallback
    ? APP_CONFIG.mapTiles.osmFallback
    : theme === 'dark'
    ? `${APP_CONFIG.mapTiles.cartoDark}${keyQuery}`
    : `${APP_CONFIG.mapTiles.cartoLight}${keyQuery}`;

  const defaultCenter = [center?.lat || 18.5204, center?.lng || 73.8567];

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className={`w-full h-full z-10 ${theme === 'dark' && useOsmFallback ? 'dark-map-filter' : ''}`}
      >
        <TileLayer
          url={tileUrl}
          attribution={APP_CONFIG.mapTiles.attribution}
          maxZoom={19}
          eventHandlers={{
            tileerror: () => {
              if (!useOsmFallback) {
                console.warn('CARTO map tile load error; engaging OpenStreetMap tile fallback.');
                setUseOsmFallback(true);
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
