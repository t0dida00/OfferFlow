import { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { ThemeToggle } from './components/ThemeToggle';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (email: string, token?: string) => {
    setUserEmail(email);
    if (token) setAccessToken(token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setAccessToken('');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {!isLoggedIn ? (

          <LoginPage onLogin={handleLogin} />
        ) : (
          <Dashboard userEmail={userEmail} accessToken={accessToken} onLogout={handleLogout} />
        )}
        <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
      </div>
    </GoogleOAuthProvider>
  );
}