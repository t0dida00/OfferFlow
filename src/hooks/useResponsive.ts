/**
 * Responsive hook for detecting screen size
 */

import { useState, useEffect } from 'react';
import { isMobile as checkIsMobile } from '../utils/responsive';

export const useResponsive = (breakpoint: number = 767) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= breakpoint;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [breakpoint]);

  return { isMobile };
};

