import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useSettingsStore } from '../../store/useSettingsStore';

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

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  const defaultCenter = [center?.lat || 18.5204, center?.lng || 73.8567];

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-10"
      >
        <TileLayer url={tileUrl} attribution={attribution} maxZoom={19} />
        <MapRecenter center={center} zoom={zoom} />
        {children}
      </MapContainer>
    </div>
  );
};
