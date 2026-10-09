import React from 'react';

export const Chip = ({
  label,
  emoji,
  active = false,
  onClick,
  count,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer select-none ${
        active
          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-violet-400/30'
          : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white border border-slate-700/50'
      } ${className}`}
    >
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'}`}>
          {count}
        </span>
      )}
    </button>
  );
};
