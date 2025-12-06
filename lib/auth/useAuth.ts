'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount } from 'wagmi';
import type { UserProfile, AuthSession, AuthStatus, AuthError } from './types';

const SESSION_STORAGE_KEY = 'flappy_bird_auth_session';
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useAuth() {
  const miniKit = useMiniKit();
  const context = miniKit?.context;
  const isReady = !!context;
  const { address, isConnected } = useAccount();
  
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<AuthError | null>(null);

  // Load session from localStorage
  useEffect(() => {
    const loadSession = () => {
      try {
        const stored = localStorage.getItem(SESSION_STORAGE_KEY);
        if (!stored) return;

        const session: AuthSession = JSON.parse(stored);
        
        // Check if session is expired
        const now = Date.now();
        if (now - session.timestamp > SESSION_EXPIRY_MS) {
          localStorage.removeItem(SESSION_STORAGE_KEY);
          return;
        }

        setUser(session.user);
        setStatus('authenticated');
      } catch (err) {
        console.error('Failed to load session:', err);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    };

    loadSession();
  }, []);

  // Extract user data from MiniKit context
  useEffect(() => {
    if (!isReady || !context?.user) return;

    const miniKitUser = context.user;
    
    const userProfile: UserProfile = {
      fid: miniKitUser.fid?.toString() || '',
      username: miniKitUser.username || '',
      displayName: miniKitUser.displayName,
      pfpUrl: miniKitUser.pfpUrl,
      walletAddress: address,
    };

    setUser(userProfile);
    setStatus('authenticated');

    // Save session to localStorage
    const session: AuthSession = {
      user: userProfile,
      isAuthenticated: true,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }, [isReady, context, address]);

  // Update wallet address when connected
  useEffect(() => {
    if (isConnected && address && user) {
      setUser((prev) => (prev ? { ...prev, walletAddress: address } : null));
      
      // Update session
      const session: AuthSession = {
        user: { ...user, walletAddress: address },
        isAuthenticated: true,
        timestamp: Date.now(),
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  }, [isConnected, address, user]);

  // Authenticate user (progressive sign-in)
  const authenticate = useCallback(async () => {
    try {
      setStatus('authenticating');
      setError(null);

      // MiniKit handles authentication automatically
      // We just need to wait for the context to be ready
      if (!isReady) {
        throw new Error('MiniKit is not ready');
      }

      if (!context?.user) {
        throw new Error('User not found in MiniKit context');
      }

      setStatus('authenticated');
    } catch (err) {
      const authError: AuthError = {
        code: 'AUTH_FAILED',
        message: err instanceof Error ? err.message : 'Authentication failed',
        timestamp: Date.now(),
      };
      setError(authError);
      setStatus('error');
      throw err;
    }
  }, [isReady, context]);

  // Sign out
  const signOut = useCallback(() => {
    setUser(null);
    setStatus('idle');
    setError(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  // Retry after error
  const retry = useCallback(() => {
    setError(null);
    setStatus('idle');
  }, []);

  return {
    user,
    status,
    error,
    isAuthenticated: status === 'authenticated' && !!user,
    isLoading: status === 'authenticating',
    isReady,
    authenticate,
    signOut,
    retry,
  };
}
