// Game physics and configuration constants

export const GAME_CONFIG = {
  // Physics
  GRAVITY: 0.6,
  JUMP_FORCE: -10,
  MAX_VELOCITY: 10,
  
  // Pipe settings
  PIPE_SPEED: 2,
  PIPE_GAP: 150,
  PIPE_WIDTH: 60,
  PIPE_SPAWN_INTERVAL: 2000, // ms
  MIN_PIPE_HEIGHT: 50,
  
  // Bird settings
  BIRD_SIZE: 34,
  BIRD_X: 80,
  
  // Canvas
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,
  
  // Game settings
  MAX_PIPES_ON_SCREEN: 4,
} as const;
