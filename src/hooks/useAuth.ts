/**
 * Authentication hook
 * Manages authentication state and operations
 */

import { useState, useEffect } from 'react';
import { User } from '../types';
import { fetchCurrentUser } from '../services/api';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async (token: string) => {
    localStorage.setItem('auth_token', token);
    try {
      const userData = await fetchCurrentUser();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await fetchCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
        } catch (e) {
          console.error("Invalid token found in storage", e);
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  return {
    isLoggedIn,
    isLoading,
    user,
    handleLogin,
    handleLogout,
  };
};

