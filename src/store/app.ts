import { create } from 'zustand';

interface AppState {
  currentLanguage: string;
  currentLevel: string;
  setLanguage: (lang: string) => void;
  setLevel: (level: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentLanguage: 'all',
  currentLevel: 'all',
  setLanguage: (lang) => set({ currentLanguage: lang }),
  setLevel: (level) => set({ currentLevel: level }),
}));
