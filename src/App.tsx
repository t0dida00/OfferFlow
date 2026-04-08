import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, LoginSuccess, ProtectedRoute } from './features/Auth';
import { Dashboard } from './features/Dashboard';
import { LandingPage } from './features/Landing';
import { ThemeToggle, Footer } from './components/common';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import styles from './styles/App.module.scss';

export default function App() {
  const { isLoggedIn, isLoading, user, handleLogin, handleLogout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  if (isLoading) {
    return (
      <div className={styles.app__loading}>
        <div className={styles.app__spinner}></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <div className={styles.app__content}>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to="/dashboard" replace /> : <LandingPage isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
              }
            />
            <Route
              path="/login"
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
                    isDarkMode={isDarkMode}
                    onToggleTheme={toggleTheme}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
        {/* ThemeToggle displayed on all pages */}
        <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
      </div>
    </BrowserRouter>
  );
}