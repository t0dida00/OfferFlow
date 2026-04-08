/**
 * Statistics calculation helpers
 * Domain-specific helpers for calculating application statistics
 */

import { Application } from '../types';

export interface ApplicationStats {
  totalApplications: number;
  applied: number;
  interviews: number;
  offers: number;
  rejected: number;
  responseRate: number;
}

export const calculateApplicationStats = (applications: Application[]): ApplicationStats => {
  const totalApplications = applications.length;
  const interviews = applications.filter(app => app.status === 'Interview').length;
  const offers = applications.filter(app => app.status === 'Offer').length;
  const applied = applications.filter(app => app.status === 'Applied').length;
  const rejected = applications.filter(app => app.status === 'Rejected').length;

  const responseRate = totalApplications > 0
    ? Math.round(((interviews + offers + rejected) / totalApplications) * 100)
    : 0;

  return {
    totalApplications,
    applied,
    interviews,
    offers,
    rejected,
    responseRate,
  };
};

