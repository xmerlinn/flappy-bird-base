'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@/lib/game';
import type { GameState } from '@/lib/game';
import { useGameStore } from '@/lib/store';
import { useUserStore } from '@/lib/store';

interface GameCanvasProps {
  onScoreUpdate?: (score: number) => void;
  onGameOver?: (score: number) => void;
}

export function GameCanvas({ onScoreUpdate, onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPortrait, setIsPortrait] = useState(true);
  
  // Zustand stores
  const { updateHighScore, endGame: storeEndGame } = useGameStore();
  const { incrementGames, addScore } = useUserStore();

  // Check orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Initialize game engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new GameEngine();
    }
  }, []);

  // Handle canvas sizing - responsive with safe area
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      // Get viewport dimensions
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Account for safe areas (notches, etc)
      const safeAreaTop = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--sat')
          .replace('px', '') || '0'
      );
      const safeAreaBottom = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--sab')
          .replace('px', '') || '0'
      );

      const availableHeight = vh - safeAreaTop - safeAreaBottom - 32; // 32px padding
      const availableWidth = Math.min(vw - 32, 600); // Max 600px width

      // Maintain 2:3 aspect ratio (400:600) for portrait
      const aspectRatio = 2 / 3;
      let width = availableWidth;
      let height = width / aspectRatio;

      if (height > availableHeight) {
        height = availableHeight;
        width = height * aspectRatio;
      }

      // Set internal canvas resolution
      canvas.width = 400;
      canvas.height = 600;

      // Set display size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = Date.now();

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      // Update game state
      engine.update(deltaTime);
      const state = engine.getState();
      setGameState(state);

      // Render
      render(ctx, state);

      // Check for game over
      if (state.status === 'gameOver') {
        // Update stores
        updateHighScore(state.score);
        storeEndGame(state.score);
        incrementGames();
        addScore(state.score);
        
        onGameOver?.(state.score);
        return;
      }

      // Update score
      if (state.status === 'playing') {
        onScoreUpdate?.(state.score);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onScoreUpdate, onGameOver, updateHighScore, storeEndGame, incrementGames, addScore]);

  // Handle input
  const handleInput = () => {
    const engine = engineRef.current;
    if (!engine) return;

    const state = engine.getState();
    if (state.status === 'idle') {
      engine.start();
    } else if (state.status === 'playing') {
      engine.jump();
    } else if (state.status === 'gameOver') {
      engine.reset();
      engine.start();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      handleInput();
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-b from-sky-light to-sky dark:from-sky-dark dark:to-sky">
      {/* Landscape orientation warning */}
      {!isPortrait && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="text-center text-white p-8">
            <svg
              className="w-16 h-16 mx-auto mb-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-2xl font-bold mb-2">Rotate Your Device</h3>
            <p className="text-gray-300">
              Please rotate your device to portrait mode for the best experience
            </p>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        onClick={handleInput}
        onTouchStart={(e) => {
          e.preventDefault();
          handleInput();
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="cursor-pointer focus:outline-none rounded-lg shadow-2xl"
      />
      
      {/* Score overlay */}
      {gameState && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white text-6xl font-bold drop-shadow-lg">
          {gameState.score}
        </div>
      )}

      {/* Game over overlay */}
      {gameState?.status === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 rounded-lg">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Game Over!
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 mb-2">
              Score: {gameState.score}
            </p>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
              Best: {gameState.highScore}
            </p>
            <button
              onClick={handleInput}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Start prompt */}
      {gameState?.status === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Flappy Bird
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Tap or press Space to start
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Rendering function
function render(ctx: CanvasRenderingContext2D, state: GameState) {
  const { bird, pipes } = state;

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw background
  drawBackground(ctx);

  // Draw pipes
  pipes.forEach((pipe) => drawPipe(ctx, pipe));

  // Draw bird
  drawBird(ctx, bird);
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Ground
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(0, ctx.canvas.height - 50, ctx.canvas.width, 50);
}

function drawBird(ctx: CanvasRenderingContext2D, bird: { x: number; y: number; rotation: number }) {
  ctx.save();
  ctx.translate(bird.x + 17, bird.y + 17);
  ctx.rotate((bird.rotation * Math.PI) / 180);

  // Bird body
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.fill();

  // Bird eye
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(5, -5, 3, 0, Math.PI * 2);
  ctx.fill();

  // Bird beak
  ctx.fillStyle = '#FF6347';
  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(25, -3);
  ctx.lineTo(25, 3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawPipe(
  ctx: CanvasRenderingContext2D,
  pipe: { x: number; gapY: number }
) {
  const pipeWidth = 60;
  const pipeGap = 150;

  // Pipe color
  ctx.fillStyle = '#228B22';
  ctx.strokeStyle = '#1a6b1a';
  ctx.lineWidth = 3;

  // Top pipe
  const topPipeHeight = pipe.gapY - pipeGap / 2;
  ctx.fillRect(pipe.x, 0, pipeWidth, topPipeHeight);
  ctx.strokeRect(pipe.x, 0, pipeWidth, topPipeHeight);

  // Top pipe cap
  ctx.fillRect(pipe.x - 5, topPipeHeight - 20, pipeWidth + 10, 20);
  ctx.strokeRect(pipe.x - 5, topPipeHeight - 20, pipeWidth + 10, 20);

  // Bottom pipe
  const bottomPipeY = pipe.gapY + pipeGap / 2;
  const bottomPipeHeight = ctx.canvas.height - 50 - bottomPipeY;
  ctx.fillRect(pipe.x, bottomPipeY, pipeWidth, bottomPipeHeight);
  ctx.strokeRect(pipe.x, bottomPipeY, pipeWidth, bottomPipeHeight);

  // Bottom pipe cap
  ctx.fillRect(pipe.x - 5, bottomPipeY, pipeWidth + 10, 20);
  ctx.strokeRect(pipe.x - 5, bottomPipeY, pipeWidth + 10, 20);
}
