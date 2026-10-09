import React from 'react';
import { Search, X, SlidersHorizontal, Tag } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { PLACE_CATEGORIES } from '../../config/categories';
import { Chip } from '../ui/Chip';

export const SearchBar = ({ onToggleFilters }) => {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    budgetMode,
    setBudgetMode,
  } = useFilterStore();

  return (
    <div className="space-y-3">
      {/* Search Input Box */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search attractions, food, hotels, cafes..."
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Budget Mode Toggle Chip */}
        <button
          onClick={() => setBudgetMode(!budgetMode)}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shrink-0 ${
            budgetMode
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40 shadow-sm'
              : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Budget Mode</span>
        </button>

        {onToggleFilters && (
          <button
            onClick={onToggleFilters}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-sm"
            title="More filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <Chip
          label="All Categories"
          emoji="✨"
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        />
        {PLACE_CATEGORIES.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.label}
            emoji={cat.emoji}
            active={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
          />
        ))}
      </div>
    </div>
  );
};
