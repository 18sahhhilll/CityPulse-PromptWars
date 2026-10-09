import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
    verified: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold border-transparent shadow-xs',
    estimated: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold border-transparent shadow-xs',
    sample: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold border-transparent shadow-xs',
    danger: 'bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold border-transparent shadow-xs',
    violet: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold border-transparent shadow-xs',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-lg border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
