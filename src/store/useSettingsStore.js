import { create } from 'zustand';
import { DEFAULT_SCORING_WEIGHTS } from '../config/scoring.config';

const SETTINGS_KEY = 'citypulse_settings';

const initialSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');

export const useSettingsStore = create((set, get) => ({
  theme: initialSettings.theme || 'dark',
  distanceUnit: initialSettings.distanceUnit || 'km',
  scoringWeights: initialSettings.scoringWeights || DEFAULT_SCORING_WEIGHTS,

  setTheme: (newTheme) => {
    set({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    get().persist();
  },

  setDistanceUnit: (unit) => {
    set({ distanceUnit: unit });
    get().persist();
  },

  setScoringWeights: (weights) => {
    set({ scoringWeights: weights });
    get().persist();
  },

  resetWeights: () => {
    set({ scoringWeights: DEFAULT_SCORING_WEIGHTS });
    get().persist();
  },

  persist: () => {
    const { theme, distanceUnit, scoringWeights } = get();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme, distanceUnit, scoringWeights }));
  },
}));
