import type { Pipe } from './types';

/**
 * Object pool for pipes to reduce garbage collection
 */
export class PipePool {
  private pool: Pipe[] = [];
  private maxSize: number;
  private nextId = 0;

  constructor(maxSize = 10) {
    this.maxSize = maxSize;
  }

  /**
   * Get a pipe from the pool or create a new one
   */
  acquire(x: number, gapY: number): Pipe {
    let pipe: Pipe;

    if (this.pool.length > 0) {
      // Reuse from pool
      pipe = this.pool.pop()!;
      pipe.x = x;
      pipe.gapY = gapY;
      pipe.passed = false;
    } else {
      // Create new pipe
      pipe = {
        x,
        gapY,
        passed: false,
        id: `pipe-${this.nextId++}`,
      };
    }

    return pipe;
  }

  /**
   * Return a pipe to the pool
   */
  release(pipe: Pipe): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(pipe);
    }
  }

  /**
   * Clear the pool
   */
  clear(): void {
    this.pool = [];
  }

  /**
   * Get pool size
   */
  getSize(): number {
    return this.pool.length;
  }
}
