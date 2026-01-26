/**
 * Sorting utilities for applications
 */

import { Application } from '../types';

export type SortDirection = 'asc' | 'desc';
export type SortField = keyof Application;

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

export const sortApplications = (
  applications: Application[],
  options: SortOptions
): Application[] => {
  const { field, direction } = options;

  return [...applications].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    let comparison = 0;
    
    if (field === 'date') {
      comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
};

export const toggleSortDirection = (currentDirection: SortDirection): SortDirection => {
  return currentDirection === 'asc' ? 'desc' : 'asc';
};

