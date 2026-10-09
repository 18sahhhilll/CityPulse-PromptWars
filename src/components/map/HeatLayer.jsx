import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export const HeatLayer = ({ points = [], radius = 30, blur = 20, max = 1.0 }) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0 || !L.heatLayer) return;

    // Convert points array into exact [lat, lng, intensity] format
    const heatPoints = points.map((pt) => {
      if (Array.isArray(pt)) return pt;
      const intensity = Math.max(0.3, Math.min(1.0, (pt.severity || 3) / 5));
      return [pt.lat, pt.lng, intensity];
    });

    const heatLayer = L.heatLayer(heatPoints, {
      radius,
      blur,
      maxZoom: 17,
      max,
      gradient: {
        0.2: '#3B82F6',
        0.4: '#10B981',
        0.6: '#F59E0B',
        0.8: '#EF4444',
        1.0: '#DC2626',
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
  }, [map, points, radius, blur, max]);

  return null;
};
