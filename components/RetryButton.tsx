'use client';

import { useState } from 'react';

interface RetryButtonProps {
  onRetry: () => Promise<void>;
  label?: string;
  className?: string;
}

export function RetryButton({
  onRetry,
  label = 'Retry',
  className = '',
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <button
      onClick={handleRetry}
      disabled={isRetrying}
      className={`
        px-4 py-2 rounded-lg font-medium
        bg-blue-600 hover:bg-blue-700
        text-white
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${className}
      `}
    >
      {isRetrying ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Retrying...
        </span>
      ) : (
        label
      )}
    </button>
  );
}
