import React from 'react';
import { useMap } from 'react-leaflet';
import { Plus, Minus, LocateFixed, Layers } from 'lucide-react';

export const MapControls = ({ onRecenter, showLayerToggle, onToggleLayers }) => {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
      <div className="flex flex-col rounded-xl overflow-hidden glass-panel border border-slate-700/60 shadow-lg">
        <button
          onClick={() => map.zoomIn()}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 transition-colors border-b border-slate-800"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 transition-colors"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {onRecenter && (
        <button
          onClick={onRecenter}
          className="p-2 rounded-xl glass-panel border border-slate-700/60 bg-slate-900/90 hover:bg-slate-800 text-slate-200 shadow-lg transition-colors"
          title="Recenter map"
        >
          <LocateFixed className="w-4 h-4 text-cyan-400" />
        </button>
      )}

      {showLayerToggle && onToggleLayers && (
        <button
          onClick={onToggleLayers}
          className="p-2 rounded-xl glass-panel border border-slate-700/60 bg-slate-900/90 hover:bg-slate-800 text-slate-200 shadow-lg transition-colors"
          title="Toggle heatmap & layers"
        >
          <Layers className="w-4 h-4 text-violet-400" />
        </button>
      )}
    </div>
  );
};
