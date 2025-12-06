import * as Sentry from '@sentry/nextjs';
import './lib/polyfills';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export function onRequestError(
  err: Error & { digest?: string },
  request: {
    path: string;
    method: string;
    headers: Headers;
  }
) {
  try {
    const headers: Record<string, string> = {};
    
    // Safely extract headers
    if (request.headers && typeof request.headers.forEach === 'function') {
      request.headers.forEach((value: string, key: string) => {
        headers[key] = value;
      });
    }

    Sentry.captureException(err, {
      contexts: {
        request: {
          url: request.path,
          method: request.method,
          headers,
        },
      },
    });
  } catch (error) {
    // Fallback if headers extraction fails
    Sentry.captureException(err, {
      contexts: {
        request: {
          url: request.path,
          method: request.method,
        },
      },
    });
  }
}
