import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile } from '../auth';

interface UserStore {
  // User profile
  profile: UserProfile | null;
  
  // User stats
  totalGames: number;
  totalScore: number;
  
  // Actions
  setProfile: (profile: UserProfile | null) => void;
  incrementGames: () => void;
  addScore: (score: number) => void;
  clearStats: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storeConfig = (set: any) => ({
  profile: null,
  totalGames: 0,
  totalScore: 0,

  setProfile: (profile: UserProfile | null) =>
    set(() => ({
      profile,
    })),

  incrementGames: () =>
    set((state: UserStore) => ({
      totalGames: state.totalGames + 1,
    })),

  addScore: (score: number) =>
    set((state: UserStore) => ({
      totalScore: state.totalScore + score,
    })),

  clearStats: () =>
    set(() => ({
      totalGames: 0,
      totalScore: 0,
    })),
});

export const useUserStore = create<UserStore>()(
  (typeof window !== 'undefined'
    ? persist(storeConfig, {
        name: 'flappy-bird-user-storage',
        storage: createJSONStorage(() => localStorage),
      })
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storeConfig) as any
);
