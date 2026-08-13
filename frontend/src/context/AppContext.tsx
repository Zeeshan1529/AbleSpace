'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  isGuest: boolean;
}

interface AppContextType {
  user: User | null;
  loadingUser: boolean;
  loginAsGuest: (name?: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => void;
  apiBaseUrl: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const apiBaseUrl = 'http://localhost:4000';

  useEffect(() => {
    const checkSession = async () => {
      const savedUserId = localStorage.getItem('userId');
      if (savedUserId) {
        try {
          const res = await fetch(`${apiBaseUrl}/users/${savedUserId}`);
          if (res.ok) {
            const userData = await res.json();
            if (userData) {
              setUser(userData);
            } else {
              localStorage.removeItem('userId');
            }
          } else {
            localStorage.removeItem('userId');
          }
        } catch (err) {
          console.error('Error fetching user session:', err);
        }
      }

      setLoadingUser(false);
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (!loadingUser) {
      if (!user && pathname !== '/login') {
        router.replace('/login');
      } else if (user && pathname === '/login') {
        router.replace('/tasks');
      }
    }
  }, [user, loadingUser, pathname, router]);

  const loginAsGuest = async (name?: string) => {
    try {
      const res = await fetch(`${apiBaseUrl}/users/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Guest login failed');
      const userData = await res.json();
      setUser(userData);
      localStorage.setItem('userId', userData.id);
      router.push('/tasks');
      return userData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    // Simulate google login by fetching the seeded 'Dexter' user or creating a mock
    try {
      // Find or default to Dexter
      const res = await fetch(`${apiBaseUrl}/users`);
      if (res.ok) {
        const users = await res.json();
        const dexter = users.find((u: any) => u.name === 'Dexter');
        if (dexter) {
          setUser(dexter);
          localStorage.setItem('userId', dexter.id);
          router.push('/tasks');
          return dexter;
        }
      }
      // Fallback: create mock google user
      const guestRes = await fetch(`${apiBaseUrl}/users/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Dexter Google' }),
      });
      const mockUser = await guestRes.json();
      setUser(mockUser);
      localStorage.setItem('userId', mockUser.id);
      router.push('/tasks');
      return mockUser;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    router.push('/login');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loadingUser,
        loginAsGuest,
        loginWithGoogle,
        logout,
        apiBaseUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
