import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ShieldAlert, History, BarChart3, Radio, Heart, Sun, Moon, MapPin, Search, Plus, User } from 'lucide-react';
import { useCityStore } from '../../store/useCityStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthModal } from '../auth/AuthModal';
import { searchCityNominatim } from '../../services/nominatim';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useDebounce } from '../../hooks/useDebounce';

export const Navbar = () => {
  const location = useLocation();
  const { currentCity, setCity } = useCityStore();
  const { theme, setTheme } = useSettingsStore();
  const { user } = useAuthStore();
  const { getCurrentLocation, loading: geoLoading } = useGeolocation();

  const [isAuthOpen, setIsAuthOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
      {/* Primary Top Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="CityPulse Home">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-indigo-600 dark:text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
              CityPulse
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-sm">
              Live
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'text-indigo-600 dark:text-cyan-400 font-semibold border-b-2 border-indigo-600 dark:border-cyan-400 bg-indigo-50/50 dark:bg-slate-900/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls (File Report, Profile, Favorites & Theme toggle) */}
        <div className="flex items-center gap-2">
          <Link
            to="/report"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white text-xs font-bold shadow-md transition-all hover:shadow-lg"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>File Report</span>
          </Link>
          <Link
            to="/profile"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title={user ? `Profile (${user.fullName})` : 'Sign In / Profile'}
            aria-label="View profile"
          >
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden xl:inline text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
              {user ? user.fullName.split(' ')[0] : 'Profile'}
            </span>
          </Link>
          <Link
            to="/saved"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Saved places"
            aria-label="View saved places"
          >
            <Heart className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Toggle theme (Light / Dark)"
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline text-[11px]">Dark</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden xl:inline text-[11px]">Light</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Secondary Location Sub-Bar: Centered City Search & Active Location Chip */}
      <div className="bg-slate-50/90 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left: Active City Location Chip */}
          <div className="flex items-center justify-start gap-2 shrink-0 sm:w-1/4 w-full">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 shrink-0" />
              <span>Active City: <strong className="font-bold text-slate-900 dark:text-white">{currentCity.name}</strong></span>
              {currentCity.state && (
                <span className="text-slate-400 text-[11px] font-normal hidden md:inline">({currentCity.state})</span>
              )}
            </div>
          </div>

          {/* Center: City Autocomplete Search Bar */}
          <div className="relative flex-1 max-w-xl w-full mx-auto">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(results.length > 0)}
                placeholder={`Search city or location (e.g. Pune, Mumbai, Delhi)...`}
                aria-label="Search city name"
                className="w-full pl-9 pr-24 py-1.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xs transition-all placeholder:text-slate-400"
              />
              <button
                onClick={getCurrentLocation}
                disabled={geoLoading}
                title="Use my current GPS location"
                aria-label="Use current GPS location"
                className="absolute right-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-xs transition-all flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <MapPin className="w-3 h-3 text-white" />
                <span>{geoLoading ? 'GPS...' : 'Near me'}</span>
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50">
                {results.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCity(item)}
                    className="w-full px-4 py-2.5 text-left text-xs hover:bg-indigo-50 dark:hover:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800/60 last:border-none text-slate-800 dark:text-slate-200 transition-colors flex flex-col focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{item.display_name.split(',')[0]}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Spacer to maintain perfect center alignment */}
          <div className="hidden sm:block sm:w-1/4 shrink-0" />
        </div>
      </div>
    </header>
  );
};
