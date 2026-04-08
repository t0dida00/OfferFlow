/**
 * Email-specific helpers
 * Domain-specific helpers for email-related operations
 */

import { Email } from '../types';

/**
 * Get recent emails sorted by date
 */
export const getRecentEmails = (
  emails: Email[],
  limit?: number
): Email[] => {
  const sorted = [...emails].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
};

/**
 * Get emails by application email IDs
 */
export const getRelatedEmails = (
  allEmails: Email[],
  emailIds: string[]
): Email[] => {
  return allEmails.filter(email => emailIds.includes(email.emailId));
};

/**
 * Generate Gmail inbox URL
 */
export const getGmailInboxUrl = (emailId: string): string => {
  return `https://mail.google.com/mail/u/0/#inbox/${emailId}`;
};

