'use client';

import { useEffect, useState } from 'react';
import { offlineManager } from '@/lib/offline';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueLength, setQueueLength] = useState(0);

  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(offlineManager.getIsOnline());
      setQueueLength(offlineManager.getQueueLength());
    };

    // Initial check
    updateStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Poll queue length
    const interval = setInterval(updateStatus, 5000);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && queueLength === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`
        px-4 py-2 rounded-lg shadow-lg
        flex items-center gap-2
        ${
          isOnline
            ? 'bg-blue-600 text-white'
            : 'bg-yellow-600 dark:bg-yellow-700 text-white'
        }
      `}
      >
        {!isOnline && (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
            <span className="text-sm font-medium">Offline Mode</span>
          </>
        )}

        {isOnline && queueLength > 0 && (
          <>
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              stroke="currentColor"
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
            <span className="text-sm font-medium">
              Syncing {queueLength} {queueLength === 1 ? 'item' : 'items'}...
            </span>
          </>
        )}
      </div>
    </div>
  );
}
