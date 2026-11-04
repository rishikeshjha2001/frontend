"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const fetchUser = async () => {
    try {
      const response: any = await apiClient.get('/auth/me');
      const currentUser = response.user || response.data || response;
      if (currentUser && currentUser.id) {
        setUser(currentUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      }
    } catch (error) {
      // If 401 or invalid token, clean stale user gracefully
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }
      if (storedToken) {
        await fetchUser();
        return;
      }
    }
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('accessToken');
    if (!hasCookie) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      await apiClient.post('/auth/refresh', {});
      await fetchUser();
    } catch (error) {
      if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
        setUser(null);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {}
    }
    refreshToken();

    const handleStorageChange = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        else setUser(null);
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res: any = await apiClient.post('/auth/login', { email, password }); const token = res?.token || res?.data?.token; if (token && typeof window !== 'undefined') localStorage.setItem('token', token);
      await fetchUser();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res: any = await apiClient.post('/auth/register', data); const token = res?.token || res?.data?.token; if (token && typeof window !== 'undefined') localStorage.setItem('token', token);
      await fetchUser();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/auth/logout', {}).catch(() => {});
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.clear();
      }
      setUser(null);
      setIsLoading(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
