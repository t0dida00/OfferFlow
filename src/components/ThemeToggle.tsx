import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  const [isMobile, setIsMobile] = useState(false);

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
      className={`fixed w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition-transform duration-200 z-50 group ${
        isMobile 
          ? 'top-6 right-6' 
          : 'bottom-6 right-6'
      }`}
      aria-label="Toggle theme"
      style={{ zIndex: 60 }}
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-yellow-500 group-hover:rotate-180 transition-transform duration-300" />
      ) : (
        <Moon className="w-6 h-6 text-gray-700 group-hover:rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
