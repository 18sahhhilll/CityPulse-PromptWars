import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export const HeatLayer = ({
  points = [],
  radius = 40,
  blur = 15,
  max = 1.0,
  minOpacity = 0.7,
  maxZoom = 14,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0 || !L.heatLayer) return;

    // Convert points array into exact [lat, lng, intensity] format with boosted visibility
    const heatPoints = points.map((pt) => {
      if (Array.isArray(pt)) return pt;
      const rawSeverity = pt.severity || 3;
      const intensity = Math.max(0.6, Math.min(1.0, (rawSeverity / 5) * 1.25));
      return [pt.lat, pt.lng, intensity];
    });

    const heatLayer = L.heatLayer(heatPoints, {
      radius,
      blur,
      maxZoom,
      max,
      minOpacity,
      gradient: {
        0.15: '#3b82f6',
        0.35: '#06b6d4',
        0.55: '#10b981',
        0.75: '#f59e0b',
        0.90: '#ef4444',
        1.00: '#b91c1c',
      },
    });

    heatLayer.addTo(map);

    return () => {
      try {
        map.removeLayer(heatLayer);
      } catch (err) {
        // Handle unmount cleanup gracefully
      }
    };
  }, [map, points, radius, blur, max, minOpacity, maxZoom]);

  return null;
};
