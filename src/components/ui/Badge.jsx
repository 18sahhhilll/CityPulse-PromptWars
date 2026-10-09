import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    verified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    estimated: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    sample: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-lg border backdrop-blur-sm ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
