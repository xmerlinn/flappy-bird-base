// Authentication types

export interface UserProfile {
  fid: string;
  username: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  walletAddress?: string;
}

export interface AuthSession {
  user: UserProfile;
  isAuthenticated: boolean;
  timestamp: number;
}

export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error';

export interface AuthError {
  code: string;
  message: string;
  timestamp: number;
}
