import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  activeCategory: 'all',
  searchQuery: '',
  priceLevel: 'all', // 'all', '₹', '₹₹', '₹₹₹'
  budgetMode: false,
  minRating: 0,
  openNowOnly: false,
  accessibleOnly: false,

  setActiveCategory: (cat) => set({ activeCategory: cat }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriceLevel: (level) => set({ priceLevel: level }),
  setBudgetMode: (val) => set((state) => ({
    budgetMode: typeof val === 'boolean' ? val : !state.budgetMode,
    priceLevel: (!state.budgetMode || val) ? '₹' : 'all',
  })),
  setMinRating: (rating) => set({ minRating: rating }),
  setOpenNowOnly: (val) => set({ openNowOnly: val }),
  setAccessibleOnly: (val) => set({ accessibleOnly: val }),

  resetFilters: () => set({
    activeCategory: 'all',
    searchQuery: '',
    priceLevel: 'all',
    budgetMode: false,
    minRating: 0,
    openNowOnly: false,
    accessibleOnly: false,
  }),
}));
