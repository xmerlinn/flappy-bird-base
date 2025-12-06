import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState } from '../game';

interface GameStore {
  // Current game state
  currentGame: GameState | null;
  
  // High scores
  localHighScore: number;
  
  // Game actions
  startGame: () => void;
  endGame: (score: number) => void;
  updateScore: (score: number) => void;
  resetGame: () => void;
  
  // High score actions
  updateHighScore: (score: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storeConfig = (set: any) => ({
  currentGame: null,
  localHighScore: 0,

  startGame: () =>
    set((state: GameStore) => ({
      currentGame: {
        ...state.currentGame,
        status: 'playing',
      } as GameState,
    })),

  endGame: (score: number) =>
    set((state: GameStore) => {
      const newHighScore = Math.max(score, state.localHighScore);
      return {
        currentGame: {
          ...state.currentGame,
          status: 'gameOver',
          score,
        } as GameState,
        localHighScore: newHighScore,
      };
    }),

  updateScore: (score: number) =>
    set((state: GameStore) => ({
      currentGame: {
        ...state.currentGame,
        score,
      } as GameState,
    })),

  resetGame: () =>
    set(() => ({
      currentGame: null,
    })),

  updateHighScore: (score: number) =>
    set((state: GameStore) => ({
      localHighScore: Math.max(score, state.localHighScore),
    })),
});

export const useGameStore = create<GameStore>()(
  (typeof window !== 'undefined'
    ? persist(storeConfig, {
        name: 'flappy-bird-game-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          localHighScore: state.localHighScore,
        }),
      })
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storeConfig) as any
);
