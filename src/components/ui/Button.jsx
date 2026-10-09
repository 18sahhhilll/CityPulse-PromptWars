import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50';

  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg active:scale-95',
    secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 active:scale-95',
    outline: 'border border-indigo-500/40 hover:bg-indigo-50 text-indigo-600 dark:text-indigo-400 active:scale-95',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-md active:scale-95',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
};
