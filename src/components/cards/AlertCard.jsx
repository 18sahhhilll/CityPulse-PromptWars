import React from 'react';
import { AlertTriangle, Info, Bell, X } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const AlertCard = ({ title, message, type = 'warning', timestamp, onDismiss }) => {
  const typeStyles = {
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      icon: AlertTriangle,
      badge: 'caution',
    },
    danger: {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
      icon: AlertTriangle,
      badge: 'danger',
    },
    info: {
      bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      icon: Info,
      badge: 'default',
    },
  };

  const style = typeStyles[type] || typeStyles.warning;
  const Icon = style.icon;

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-md flex items-start gap-3 relative ${style.bg}`}>
      <div className="p-2 rounded-xl bg-slate-950/40 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 pr-6">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-sm text-slate-100">{title}</h4>
          <Badge variant={style.badge}>{type.toUpperCase()}</Badge>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
        {timestamp && <span className="text-[10px] text-slate-400 mt-2 block">{timestamp}</span>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
