/**
 * Responsive utilities for detecting screen size
 */

export const isMobile = (width: number): boolean => {
  return width <= 767;
};

export const isTablet = (width: number): boolean => {
  return width > 767 && width <= 1024;
};

export const isDesktop = (width: number): boolean => {
  return width > 1024;
};

