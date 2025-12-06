import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface SettingsStore {
  // Theme
  theme: Theme;
  
  // Sound
  soundEnabled: boolean;
  
  // Tutorial
  tutorialCompleted: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleSound: () => void;
  completeTutorial: () => void;
  resetSettings: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storeConfig = (set: any) => ({
  theme: 'system' as Theme,
  soundEnabled: true,
  tutorialCompleted: false,

  setTheme: (theme: Theme) =>
    set(() => ({
      theme,
    })),

  toggleSound: () =>
    set((state: SettingsStore) => ({
      soundEnabled: !state.soundEnabled,
    })),

  completeTutorial: () =>
    set(() => ({
      tutorialCompleted: true,
    })),

  resetSettings: () =>
    set(() => ({
      theme: 'system' as Theme,
      soundEnabled: true,
      tutorialCompleted: false,
    })),
});

export const useSettingsStore = create<SettingsStore>()(
  (typeof window !== 'undefined'
    ? persist(storeConfig, {
        name: 'flappy-bird-settings-storage',
        storage: createJSONStorage(() => localStorage),
      })
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storeConfig) as any
);
