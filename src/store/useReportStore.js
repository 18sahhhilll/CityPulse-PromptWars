import { create } from 'zustand';
import initialIncidents from '../data/incidents.json';

const LOCAL_STORAGE_REPORTS_KEY = 'citypulse_citizen_reports';

const loadStoredReports = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return [...parsed, ...initialIncidents.filter(inc => !parsed.some(p => p.id === inc.id))];
    }
  } catch (err) {
    console.error('Error loading stored reports:', err);
  }
  return initialIncidents;
};

export const useReportStore = create((set, get) => ({
  reports: loadStoredReports(),
  activeLayerFilters: {
    unsafe: true,
    accident: true,
    lighting: true,
    police: true,
    hospital: true,
  },

  addReport: (newReport) => {
    const updated = [newReport, ...get().reports];
    set({ reports: updated });
    try {
      const userAddedOnly = updated.filter(r => r.id.startsWith('user-'));
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(userAddedOnly));
    } catch (err) {
      console.error('Failed to save report to local storage:', err);
    }
  },

  upvoteReport: (reportId) => {
    const updated = get().reports.map((r) => {
      if (r.id === reportId) {
        const newUpvotes = (r.upvotes || 0) + 1;
        const newVerified = newUpvotes >= 3 ? true : r.verified;
        return { ...r, upvotes: newUpvotes, verified: newVerified };
      }
      return r;
    });
    set({ reports: updated });
  },

  toggleLayerFilter: (layerKey) => set((state) => ({
    activeLayerFilters: {
      ...state.activeLayerFilters,
      [layerKey]: !state.activeLayerFilters[layerKey],
    }
  })),
}));
