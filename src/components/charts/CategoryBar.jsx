import React from 'react';
import { REPORT_CATEGORIES } from '../../config/categories';

export const CategoryBar = ({ reports = [] }) => {
  const total = reports.length || 1;

  const categoryCounts = REPORT_CATEGORIES.map((cat) => {
    const count = reports.filter((r) => r.category === cat.id).length;
    const percentage = Math.round((count / total) * 100);
    return { ...cat, count, percentage };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-3">
      {categoryCounts.map((item) => (
        <div key={item.id} className="text-xs">
          <div className="flex justify-between items-center mb-1 font-medium">
            <span className="text-slate-200 flex items-center gap-1.5">
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </span>
            <span className="text-slate-400 font-semibold">{item.count} ({item.percentage}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(item.percentage, 4)}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
