import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { ThemeToggle } from './components/ThemeToggle';
import { LoginSuccess } from './components/LoginSuccess';
import { ProtectedRoute } from './components/ProtectedRoute';
import { User } from './types';
import { fetchCurrentUser } from './services/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Check for existing token on mount
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/login-success"
            element={<LoginSuccess onLogin={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard
                  user={user}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
      </div>
    </BrowserRouter>
  );
}