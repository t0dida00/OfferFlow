/**
 * Footer helper functions
 */

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const hasBottomNavigation = (pathname: string): boolean => {
  return pathname.startsWith('/dashboard');
};

