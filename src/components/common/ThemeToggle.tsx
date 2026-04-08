import { Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import styles from './ThemeToggle.module.scss';
import { useResponsive } from '../../hooks/useResponsive';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  const { isMobile } = useResponsive(1024);

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
