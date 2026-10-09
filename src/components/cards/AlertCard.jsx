import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const AlertCard = ({ title, message, type = 'warning', timestamp, onDismiss }) => {
  const typeStyles = {
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-200',
      iconColor: 'text-amber-500',
      badge: 'bg-amber-500 text-white font-bold',
    },
    danger: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-slate-800 dark:text-slate-200',
      iconColor: 'text-rose-500',
      badge: 'bg-rose-500 text-white font-bold',
    },
    info: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60 text-slate-800 dark:text-slate-200',
      iconColor: 'text-cyan-500',
      badge: 'bg-cyan-500 text-white font-bold',
    },
  };

  const style = typeStyles[type] || typeStyles.warning;
  const Icon = type === 'info' ? Info : AlertTriangle;

  return (
    <div className={`p-4 rounded-2xl border flex items-start gap-3 relative shadow-sm ${style.bg}`}>
      <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/60 shadow-sm shrink-0">
        <Icon className={`w-5 h-5 ${style.iconColor}`} />
      </div>
      <div className="flex-1 pr-6">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 rounded px-2 py-0.5 text-[11px] font-mono font-bold">
            [Sample Alert]
          </span>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{title}</h4>
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${style.badge}`}>
            {type}
          </span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{message}</p>
        {timestamp && <span className="text-[10px] text-slate-400 mt-2 block">{timestamp}</span>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
