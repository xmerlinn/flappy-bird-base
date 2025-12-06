import { GAME_CONFIG } from './constants';
import type { GameState } from './types';
import { PipePool } from './ObjectPool';

export class GameEngine {
  private state: GameState;
  private config = GAME_CONFIG;
  private lastPipeSpawn = 0;
  private pipePool: PipePool;

  constructor() {
    this.state = this.getInitialState();
    this.pipePool = new PipePool(10);
  }

  private getInitialState(): GameState {
    return {
      bird: {
        x: this.config.BIRD_X,
        y: this.config.CANVAS_HEIGHT / 2,
        velocity: 0,
        rotation: 0,
      },
      pipes: [],
      score: 0,
      highScore: 0,
      status: 'idle',
      lastUpdateTime: Date.now(),
    };
  }

  // Get current game state (returns reference for testing, not a copy)
  getState(): GameState {
    return this.state;
  }

  // Start a new game
  start(): void {
    this.state = this.getInitialState();
    this.state.status = 'playing';
    this.lastPipeSpawn = Date.now();
    this.spawnPipe();
  }

  // Jump action - applies upward force to bird
  jump(): void {
    if (this.state.status !== 'playing') return;
    this.state.bird.velocity = this.config.JUMP_FORCE;
  }

  // Main update loop - called every frame
  update(_deltaTime?: number): void {
    if (this.state.status !== 'playing') return;

    // Apply gravity to bird
    this.state.bird.velocity += this.config.GRAVITY;
    
    // Clamp velocity
    if (this.state.bird.velocity > this.config.MAX_VELOCITY) {
      this.state.bird.velocity = this.config.MAX_VELOCITY;
    }

    // Update bird position
    this.state.bird.y += this.state.bird.velocity;

    // Update bird rotation based on velocity
    this.state.bird.rotation = Math.min(
      Math.max(this.state.bird.velocity * 3, -30),
      90
    );

    // Check ground and ceiling collision
    if (
      this.state.bird.y > this.config.CANVAS_HEIGHT - this.config.BIRD_SIZE ||
      this.state.bird.y < 0
    ) {
      this.gameOver();
      return;
    }

    // Update pipes
    this.updatePipes();

    // Spawn new pipes
    const now = Date.now();
    if (now - this.lastPipeSpawn > this.config.PIPE_SPAWN_INTERVAL) {
      this.spawnPipe();
      this.lastPipeSpawn = now;
    }

    // Check collisions
    if (this.checkCollisions()) {
      this.gameOver();
    }
  }

  // Update pipe positions and handle scoring
  private updatePipes(): void {
    for (let i = this.state.pipes.length - 1; i >= 0; i--) {
      const pipe = this.state.pipes[i];
      
      // Move pipe left
      pipe.x -= this.config.PIPE_SPEED;

      // Check if bird passed the pipe
      if (
        !pipe.passed &&
        pipe.x + this.config.PIPE_WIDTH < this.state.bird.x
      ) {
        pipe.passed = true;
        this.state.score++;
      }

      // Remove off-screen pipes and return to pool
      if (pipe.x + this.config.PIPE_WIDTH < 0) {
        this.pipePool.release(pipe);
        this.state.pipes.splice(i, 1);
      }
    }
  }

  // Spawn a new pipe with random gap position
  private spawnPipe(): void {
    if (this.state.pipes.length >= this.config.MAX_PIPES_ON_SCREEN) {
      return;
    }

    const minGapY = this.config.MIN_PIPE_HEIGHT + this.config.PIPE_GAP / 2;
    const maxGapY =
      this.config.CANVAS_HEIGHT -
      this.config.MIN_PIPE_HEIGHT -
      this.config.PIPE_GAP / 2;

    const gapY = Math.random() * (maxGapY - minGapY) + minGapY;

    // Get pipe from pool
    const pipe = this.pipePool.acquire(this.config.CANVAS_WIDTH, gapY);

    this.state.pipes.push(pipe);
  }

  // AABB collision detection
  private checkCollisions(): boolean {
    const bird = this.state.bird;
    const birdLeft = bird.x;
    const birdRight = bird.x + this.config.BIRD_SIZE;
    const birdTop = bird.y;
    const birdBottom = bird.y + this.config.BIRD_SIZE;

    for (const pipe of this.state.pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + this.config.PIPE_WIDTH;
      const topPipeBottom = pipe.gapY - this.config.PIPE_GAP / 2;
      const bottomPipeTop = pipe.gapY + this.config.PIPE_GAP / 2;

      // Check if bird is horizontally aligned with pipe
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check collision with top pipe
        if (birdTop < topPipeBottom) {
          return true;
        }
        // Check collision with bottom pipe
        if (birdBottom > bottomPipeTop) {
          return true;
        }
      }
    }

    return false;
  }

  // Handle game over
  private gameOver(): void {
    this.state.status = 'gameOver';
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
    }
  }

  // Pause game
  pause(): void {
    if (this.state.status === 'playing') {
      this.state.status = 'paused';
    }
  }

  // Resume game
  resume(): void {
    if (this.state.status === 'paused') {
      this.state.status = 'playing';
    }
  }

  // Reset game
  reset(): void {
    const highScore = this.state.highScore;
    // Return all pipes to pool before reset
    for (const pipe of this.state.pipes) {
      this.pipePool.release(pipe);
    }
    this.state = this.getInitialState();
    this.state.highScore = highScore;
  }
}
