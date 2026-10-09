import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No results found',
  description = 'Try adjusting your filters or search term to discover more spots.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 my-4 shadow-sm">
      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-cyan-400 mb-4 border border-indigo-100 dark:border-indigo-800">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
