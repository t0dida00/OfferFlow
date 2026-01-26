/**
 * Custom hook for recent emails list business logic
 */

import { useMemo } from 'react';
import { Email } from '../types';
import { getRecentEmails } from '../helpers/email';

export const useRecentEmails = (emails: Email[], limit?: number) => {
  const recentEmails = useMemo(() => {
    return getRecentEmails(emails, limit);
  }, [emails, limit]);

  return {
    recentEmails,
    totalEmails: emails.length,
  };
};

