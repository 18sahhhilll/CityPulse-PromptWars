import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MapPin, ShieldAlert, Radio, Plus, Settings } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Compass },
    { path: '/explore', label: 'Explore', icon: MapPin },
    { path: '/report', label: 'Report', icon: Plus, isAction: true },
    { path: '/safety', label: 'Safety', icon: ShieldAlert },
    { path: '/insights', label: 'Pulse', icon: Radio },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800 bg-slate-950/90 backdrop-blur-xl px-2 py-1.5">
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/40 group-active:scale-95 transition-transform flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-300 mt-0.5">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
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
