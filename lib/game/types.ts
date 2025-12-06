// Game state types and interfaces

export interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

export interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
  id: string;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';

export interface GameState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  highScore: number;
  status: GameStatus;
  lastUpdateTime: number;
}

export interface GameConfig {
  gravity: number;
  jumpForce: number;
  pipeSpeed: number;
  pipeGap: number;
  pipeWidth: number;
  birdSize: number;
  canvasWidth: number;
  canvasHeight: number;
  pipeSpawnInterval: number;
}
