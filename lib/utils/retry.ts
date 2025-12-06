import { logError } from '@/lib/monitoring';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  onRetry: () => {},
};

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;
  let delay = opts.initialDelay;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === opts.maxAttempts) {
        logError(lastError, {
          component: 'retryWithBackoff',
          action: 'max_attempts_reached',
          metadata: { attempts: attempt },
        });
        throw lastError;
      }

      opts.onRetry(attempt, lastError);

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Exponential backoff
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
    }
  }

  throw lastError!;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase();

  // Network errors
  if (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('fetch')
  ) {
    return true;
  }

  // Blockchain errors
  if (
    message.includes('nonce') ||
    message.includes('gas') ||
    message.includes('underpriced')
  ) {
    return true;
  }

  // Rate limiting
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return true;
  }

  return false;
}

/**
 * Retry only if the error is retryable
 */
export async function retryIfRetryable<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  try {
    return await retryWithBackoff(fn, {
      ...options,
      maxAttempts: 1, // First attempt
    });
  } catch (error) {
    if (isRetryableError(error as Error)) {
      return await retryWithBackoff(fn, options);
    }
    throw error;
  }
}
