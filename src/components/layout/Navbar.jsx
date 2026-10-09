import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ShieldAlert, History, BarChart3, Radio, Heart, Settings, Sun, Moon, MapPin, Search } from 'lucide-react';
import { useCityStore } from '../../store/useCityStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { searchCityNominatim } from '../../services/nominatim';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useDebounce } from '../../hooks/useDebounce';

export const Navbar = () => {
  const location = useLocation();
  const { currentCity, setCity } = useCityStore();
  const { theme, setTheme } = useSettingsStore();
  const { getCurrentLocation, loading: geoLoading } = useGeolocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 400);

  React.useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      setIsSearching(true);
      searchCityNominatim(debouncedQuery).then((data) => {
        setResults(data);
        setIsSearching(false);
        setShowDropdown(true);
      });
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [debouncedQuery]);

  const handleSelectCity = (item) => {
    setCity({
      name: item.display_name.split(',')[0],
      state: item.address?.state || '',
      country: item.address?.country || '',
      lat: item.lat,
      lon: item.lon,
      display_name: item.display_name,
    });
    setSearchQuery('');
    setShowDropdown(false);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Compass },
    { path: '/explore', label: 'Explore', icon: MapPin },
    { path: '/history', label: 'History', icon: History },
    { path: '/safety', label: 'Safety', icon: ShieldAlert },
    { path: '/compare', label: 'Compare', icon: BarChart3 },
    { path: '/insights', label: 'Insights', icon: Radio },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              CityPulse
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Live
            </span>
          </div>
        </Link>

        {/* City Autocomplete Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(results.length > 0)}
              placeholder={`Search city (Current: ${currentCity.name})...`}
              className="w-full pl-9 pr-24 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-slate-100 text-sm rounded-xl border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-brand-violet/50 transition-all placeholder:text-slate-500"
            />
            <button
              onClick={getCurrentLocation}
              disabled={geoLoading}
              title="Use my current GPS location"
              className="absolute right-1.5 px-2 py-1 text-xs font-medium rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 border border-violet-500/30 transition-all flex items-center gap-1"
            >
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>{geoLoading ? 'GPS...' : 'Near me'}</span>
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl border border-slate-700/80 shadow-2xl overflow-hidden z-50">
              {results.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCity(item)}
                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-violet-600/20 border-b border-slate-800/60 last:border-none text-slate-200 transition-colors flex flex-col"
                >
                  <span className="font-semibold text-slate-100">{item.display_name.split(',')[0]}</span>
                  <span className="text-[11px] text-slate-400 truncate">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-violet-600/20 text-cyan-300 border border-violet-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls (Favorites & Theme toggle) */}
        <div className="flex items-center gap-2">
          <Link
            to="/saved"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-800 transition-colors"
            title="Saved places"
          >
            <Heart className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
