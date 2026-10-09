import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Github, Globe, Shield } from 'lucide-react';
import { APP_CONFIG } from '../../config/app.config';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl text-slate-400 text-xs py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand info */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <span className="font-display font-bold text-slate-100 text-sm">{APP_CONFIG.appName}</span>
          </div>
          <p className="text-slate-400 max-w-sm text-center md:text-left text-[11px]">
            {APP_CONFIG.tagline}. Powered by open data, Leaflet maps, and client AI.
          </p>
        </div>

        {/* Data Credits & Attributions */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          <span>© 2026 CityPulse</span>
          <span>•</span>
          <span>OpenStreetMap & Overpass</span>
          <span>•</span>
          <span>Open-Meteo Weather</span>
          <span>•</span>
          <span>Wikipedia & OSRM</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <Link to="/about" className="hover:text-slate-200 transition-colors">About & Sources</Link>
          <Link to="/settings" className="hover:text-slate-200 transition-colors">Settings</Link>
        </div>
      </div>
    </footer>
  );
};
