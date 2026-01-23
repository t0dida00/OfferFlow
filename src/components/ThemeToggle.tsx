import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './ThemeToggle.module.scss';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 1024;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkMobile, 100);
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return (
    <button
      onClick={onToggle}
      className={clsx(
        styles.themeToggle,
        isMobile ? styles['themeToggle--mobile'] : styles['themeToggle--desktop']
      )}
      aria-label="Toggle theme"
      style={{
        backgroundColor: isDark ? '#FFF' : '#232F3F',
        color: isDark ? '#232F3F' : '#FFF',
        borderColor: isDark ? '#232F3F' : '#FFF'
      }}
    >
      {isDark ? (
        <Sun className={clsx(styles.themeToggle__icon, styles['themeToggle__icon--sun'])} style={{ color: '#232F3F' }} />
      ) : (
        <Moon className={clsx(styles.themeToggle__icon, styles['themeToggle__icon--moon'])} style={{ color: '#FFF' }} />
      )}
    </button>
  );
}
