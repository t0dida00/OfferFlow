/**
 * Application-specific helpers
 * Domain-specific helpers for application-related operations
 */

import { Application } from '../types';
import { normalizeStatus } from '../utils/status';

/**
 * Get recent applications sorted by date
 */
export const getRecentApplications = (
  applications: Application[],
  limit: number = 5
): Application[] => {
  return [...applications]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

/**
 * Get applications by status
 */
export const getApplicationsByStatus = (
  applications: Application[],
  status: string
): Application[] => {
  return applications.filter(app => normalizeStatus(app.status) === status);
};

/**
 * Get application status count
 */
export const getStatusCount = (
  applications: Application[],
  status: string
): number => {
  return applications.filter(app => normalizeStatus(app.status) === status).length;
};

