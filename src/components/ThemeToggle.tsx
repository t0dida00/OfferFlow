import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

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
      className={`fixed w-8 h-8 rounded-full shadow-lg border flex items-center justify-center hover:scale-110 transition-transform duration-200 group ${isMobile
        ? 'top-6 right-6'
        : 'bottom-6 right-6'
        }`}
      aria-label="Toggle theme"
      style={{
        zIndex: 9999,
        backgroundColor: isDark ? '#FFF' : '#232F3F',
        color: isDark ? '#232F3F' : '#FFF',
        borderColor: isDark ? '#232F3F' : '#FFF'
      }}
    >
      {isDark ? (
        <Sun className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" style={{ color: '#232F3F' }} />
      ) : (
        <Moon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" style={{ color: '#FFF' }} />
      )}
    </button>
  );
}
