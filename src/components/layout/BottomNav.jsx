import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MapPin, ShieldAlert, Radio, Plus, User } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Compass },
    { path: '/explore', label: 'Explore', icon: MapPin },
    { path: '/report', label: 'Report', icon: Plus, isAction: true },
    { path: '/safety', label: 'Safety', icon: ShieldAlert },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isAction) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -top-5 flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 via-violet-600 to-indigo-600 p-0.5 shadow-xl shadow-indigo-500/30 group-active:scale-95 transition-transform flex items-center justify-center">
                  <div className="w-full h-full bg-white dark:bg-slate-950 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-indigo-600 dark:text-cyan-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
