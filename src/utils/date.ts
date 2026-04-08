/**
 * Date formatting utilities
 */

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString();
};

export const formatDateForInput = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

export const getYear = (date: string | Date): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getFullYear();
};

export const getMonth = (date: string | Date): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getMonth();
};

export const getAvailableYears = (dates: (string | Date)[], currentYear?: number): number[] => {
  const years = new Set<number>();
  if (currentYear) {
    years.add(currentYear);
  }
  dates.forEach(date => {
    years.add(getYear(date));
  });
  return Array.from(years).sort((a, b) => b - a);
};

