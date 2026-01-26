/**
 * Custom hook for recent applications list business logic
 */

import { useMemo } from 'react';
import { Application } from '../types';
import { getRecentApplications } from '../helpers/application';

export const useRecentApplications = (
  applications: Application[],
  limit: number = 5
) => {
  const recentApplications = useMemo(() => {
    return getRecentApplications(applications, limit);
  }, [applications, limit]);

  return {
    recentApplications,
  };
};

