import React from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const startIcon = L.divIcon({
  html: '<div style="background:#10B981;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 10px #10B981;"></div>',
  className: 'route-start-icon',
});

const endIcon = L.divIcon({
  html: '<div style="background:#EF4444;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 10px #EF4444;"></div>',
  className: 'route-end-icon',
});

export const RouteLayer = ({ coordinates = [], color = '#8B5CF6', weight = 5, isSafest = false }) => {
  if (!coordinates || coordinates.length < 2) return null;

  const startPt = coordinates[0];
  const endPt = coordinates[coordinates.length - 1];

  return (
    <>
      <Polyline
        positions={coordinates}
        pathOptions={{
          color: isSafest ? '#10B981' : color,
          weight: isSafest ? 6 : weight,
          opacity: 0.85,
          dashArray: isSafest ? undefined : '8, 8',
        }}
      />
      <Marker position={startPt} icon={startIcon}>
        <Popup><span className="text-xs font-bold text-slate-100">Route Start</span></Popup>
      </Marker>
      <Marker position={endPt} icon={endIcon}>
        <Popup><span className="text-xs font-bold text-slate-100">Destination</span></Popup>
      </Marker>
    </>
  );
};
