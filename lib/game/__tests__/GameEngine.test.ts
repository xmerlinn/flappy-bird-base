import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { GameEngine } from '../GameEngine';
import { GAME_CONFIG } from '../constants';

describe('GameEngine', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
  });

  describe('Property 1: Jump applies consistent force', () => {
    it('should always set bird velocity to JUMP_FORCE when jumping', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 10 }), (numJumps) => {
          engine.start();
          
          for (let i = 0; i < numJumps; i++) {
            // Jump sets velocity immediately
            engine.jump();
            const afterJump = engine.getState().bird.velocity;
            expect(afterJump).toBe(GAME_CONFIG.JUMP_FORCE);
          }
        })
      );
    });

    it('should apply jump force regardless of current velocity', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -20, max: 20 }),
          (initialVelocity) => {
            engine.start();
            const state = engine.getState();
            state.bird.velocity = initialVelocity;
            
            engine.jump();
            const newState = engine.getState();
            
            expect(newState.bird.velocity).toBe(GAME_CONFIG.JUMP_FORCE);
          }
        )
      );
    });
  });

  describe('Property 2: Gravity applies continuously', () => {
    it('should increase bird velocity by GRAVITY each update', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 50 }), (numUpdates) => {
          engine.start();
          const initialState = engine.getState();
          const initialVelocity = initialState.bird.velocity;

          for (let i = 0; i < numUpdates; i++) {
            engine.update(16);
          }

          const finalState = engine.getState();
          const expectedVelocity = Math.min(
            initialVelocity + GAME_CONFIG.GRAVITY * numUpdates,
            GAME_CONFIG.MAX_VELOCITY
          );

          expect(finalState.bird.velocity).toBeCloseTo(expectedVelocity, 1);
        })
      );
    });

    it('should continuously apply gravity until max velocity', () => {
      engine.start();
      
      // Update many times to reach max velocity
      for (let i = 0; i < 100; i++) {
        engine.update(16);
      }

      const state = engine.getState();
      expect(state.bird.velocity).toBe(GAME_CONFIG.MAX_VELOCITY);
    });
  });

  describe('Property 3: Collision triggers game over', () => {
    it('should set game status to gameOver when bird hits ground', () => {
      engine.start();
      const state = engine.getState();
      
      // Force bird to ground
      state.bird.y = GAME_CONFIG.CANVAS_HEIGHT;
      
      engine.update(16);
      
      const finalState = engine.getState();
      expect(finalState.status).toBe('gameOver');
    });

    it('should set game status to gameOver when bird hits ceiling', () => {
      engine.start();
      const state = engine.getState();
      
      // Force bird to ceiling
      state.bird.y = -10;
      
      engine.update(16);
      
      const finalState = engine.getState();
      expect(finalState.status).toBe('gameOver');
    });

    it('should detect collision with pipes', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50, max: 550 }),
          (gapY) => {
            engine.start();
            const state = engine.getState();
            
            // Add pipe at bird position
            state.pipes.push({
              x: state.bird.x,
              gapY,
              passed: false,
              id: 'test-pipe',
            });
            
            // Position bird to collide with top pipe
            state.bird.y = gapY - GAME_CONFIG.PIPE_GAP / 2 - 10;
            
            engine.update(16);
            
            const finalState = engine.getState();
            expect(finalState.status).toBe('gameOver');
          }
        )
      );
    });
  });

  describe('Property 4: Passing pipes increments score', () => {
    it('should increment score by 1 when bird passes a pipe', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 10 }), (numPipes) => {
          engine.start();
          const state = engine.getState();
          
          // Add pipes behind the bird
          for (let i = 0; i < numPipes; i++) {
            state.pipes.push({
              x: state.bird.x - GAME_CONFIG.PIPE_WIDTH - 10,
              gapY: GAME_CONFIG.CANVAS_HEIGHT / 2,
              passed: false,
              id: `pipe-${i}`,
            });
          }
          
          engine.update(16);
          
          const finalState = engine.getState();
          expect(finalState.score).toBe(numPipes);
        })
      );
    });

    it('should not double-count passed pipes', () => {
      engine.start();
      const state = engine.getState();
      
      // Add pipe behind bird
      state.pipes.push({
        x: state.bird.x - GAME_CONFIG.PIPE_WIDTH - 10,
        gapY: GAME_CONFIG.CANVAS_HEIGHT / 2,
        passed: false,
        id: 'test-pipe',
      });
      
      // Update multiple times
      engine.update(16);
      engine.update(16);
      engine.update(16);
      
      const finalState = engine.getState();
      expect(finalState.score).toBe(1);
    });

    it('should only increment score when pipe is fully passed', () => {
      engine.start();
      const state = engine.getState();
      
      // Add pipe partially passed
      state.pipes.push({
        x: state.bird.x - GAME_CONFIG.PIPE_WIDTH / 2,
        gapY: GAME_CONFIG.CANVAS_HEIGHT / 2,
        passed: false,
        id: 'test-pipe',
      });
      
      engine.update(16);
      
      const partialState = engine.getState();
      expect(partialState.score).toBe(0);
      
      // Move pipe fully past bird
      partialState.pipes[0].x = state.bird.x - GAME_CONFIG.PIPE_WIDTH - 1;
      
      engine.update(16);
      
      const finalState = engine.getState();
      expect(finalState.score).toBe(1);
    });
  });

  describe('Pipe generation and management', () => {
    it('should spawn pipes at regular intervals', () => {
      engine.start();
      
      // Initial pipe spawned on start
      expect(engine.getState().pipes.length).toBeGreaterThan(0);
    });

    it('should remove off-screen pipes', () => {
      engine.start();
      const state = engine.getState();
      
      // Add pipe far off-screen
      state.pipes.push({
        x: -GAME_CONFIG.PIPE_WIDTH - 100,
        gapY: GAME_CONFIG.CANVAS_HEIGHT / 2,
        passed: true,
        id: 'offscreen-pipe',
      });
      
      const beforeCount = state.pipes.length;
      engine.update(16);
      const afterCount = engine.getState().pipes.length;
      
      expect(afterCount).toBeLessThan(beforeCount);
    });

    it('should maintain maximum pipes on screen', () => {
      engine.start();
      
      // Update many times to spawn multiple pipes
      for (let i = 0; i < 100; i++) {
        engine.update(16);
      }
      
      const state = engine.getState();
      expect(state.pipes.length).toBeLessThanOrEqual(
        GAME_CONFIG.MAX_PIPES_ON_SCREEN
      );
    });

    it('should generate pipes with random gap positions', () => {
      const gapPositions = new Set<number>();
      
      for (let i = 0; i < 10; i++) {
        engine.start();
        const state = engine.getState();
        if (state.pipes.length > 0) {
          gapPositions.add(state.pipes[0].gapY);
        }
      }
      
      // Should have some variation in gap positions
      expect(gapPositions.size).toBeGreaterThan(1);
    });
  });

  describe('Game state management', () => {
    it('should start with idle status', () => {
      const state = engine.getState();
      expect(state.status).toBe('idle');
    });

    it('should change to playing when started', () => {
      engine.start();
      const state = engine.getState();
      expect(state.status).toBe('playing');
    });

    it('should update high score when current score exceeds it', () => {
      engine.start();
      
      // Manually set score higher than high score
      engine.getState().score = 10;
      engine.getState().highScore = 5;
      
      // Trigger game over by hitting ground
      engine.getState().bird.y = GAME_CONFIG.CANVAS_HEIGHT;
      engine.update(16);
      
      const finalState = engine.getState();
      expect(finalState.highScore).toBe(10);
    });

    it('should not update high score when current score is lower', () => {
      engine.start();
      
      // Manually set score lower than high score
      engine.getState().score = 3;
      engine.getState().highScore = 10;
      
      // Trigger game over by hitting ground
      engine.getState().bird.y = GAME_CONFIG.CANVAS_HEIGHT;
      engine.update(16);
      
      const finalState = engine.getState();
      expect(finalState.highScore).toBe(10);
    });

    it('should pause and resume correctly', () => {
      engine.start();
      engine.pause();
      
      expect(engine.getState().status).toBe('paused');
      
      engine.resume();
      expect(engine.getState().status).toBe('playing');
    });

    it('should reset game state while preserving high score', () => {
      engine.start();
      
      // Set score and high score
      engine.getState().score = 15;
      engine.getState().highScore = 15;
      engine.getState().bird.y = 200;
      
      engine.reset();
      
      const resetState = engine.getState();
      expect(resetState.score).toBe(0);
      expect(resetState.highScore).toBe(15);
      expect(resetState.bird.y).toBe(GAME_CONFIG.CANVAS_HEIGHT / 2);
    });
  });
});
