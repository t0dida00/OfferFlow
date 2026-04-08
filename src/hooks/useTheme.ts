/**
 * Theme management hook
 */

import { useState, useEffect } from 'react';

export const useTheme = (initialDarkMode: boolean = false) => {
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return {
    isDarkMode,
    toggleTheme,
    setIsDarkMode,
  };
};

