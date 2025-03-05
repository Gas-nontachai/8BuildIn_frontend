import { createContext, useState, useContext } from 'react';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = () => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refresh_token'));

  const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setRefreshToken(null);
  };

  const logout = () => {
    clearTokens();
    window.location.href = '/login';
  };

  return {
    accessToken,
    refreshToken,
    setTokens,
    logout,
    getAccessToken: () => accessToken,
    getRefreshToken: () => refreshToken
  };
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
