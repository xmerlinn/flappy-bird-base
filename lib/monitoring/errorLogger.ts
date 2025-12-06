import * as Sentry from '@sentry/nextjs';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an error to Sentry with additional context
 */
export function logError(error: Error, context?: ErrorContext): void {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error, 'Context:', context);
  }

  Sentry.withScope((scope) => {
    if (context?.component) {
      scope.setTag('component', context.component);
    }
    if (context?.action) {
      scope.setTag('action', context.action);
    }
    if (context?.userId) {
      scope.setUser({ id: context.userId });
    }
    if (context?.metadata) {
      scope.setContext('metadata', context.metadata);
    }
    
    Sentry.captureException(error);
  });
}

/**
 * Log a message to Sentry
 */
export function logMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: ErrorContext
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level.toUpperCase()}]`, message, context);
  }

  Sentry.withScope((scope) => {
    if (context?.component) {
      scope.setTag('component', context.component);
    }
    if (context?.action) {
      scope.setTag('action', context.action);
    }
    if (context?.metadata) {
      scope.setContext('metadata', context.metadata);
    }
    
    Sentry.captureMessage(message, level);
  });
}

/**
 * Set user context for error tracking
 */
export function setUserContext(userId: string, username?: string): void {
  Sentry.setUser({
    id: userId,
    username,
  });
}

/**
 * Clear user context
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
}
