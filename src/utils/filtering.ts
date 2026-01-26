/**
 * Filtering utilities for applications and emails
 */

import { Application, Email } from '../types';
import { normalizeStatus } from './status';

export interface FilterOptions {
  searchQuery?: string;
  statusFilter?: string;
}

export const filterApplications = (
  applications: Application[],
  options: FilterOptions
): Application[] => {
  const { searchQuery = '', statusFilter = 'all' } = options;

  return applications.filter(app => {
    const matchesSearch =
      (app.company?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (app.role?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (app.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });
};

export const filterEmails = (
  emails: Email[],
  searchQuery: string
): Email[] => {
  if (!searchQuery.trim()) {
    return emails;
  }

  const query = searchQuery.toLowerCase();
  return emails.filter(email =>
    email.subject.toLowerCase().includes(query) ||
    email.snippet.toLowerCase().includes(query)
  );
};

