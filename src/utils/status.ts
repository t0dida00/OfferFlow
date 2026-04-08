/**
 * Status mapping and validation utilities
 */

export type StatusKey = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export const STATUS_MAP: Record<string, StatusKey> = {
  Applied: 'Applied',
  Interview: 'Interview',
  Offer: 'Offer',
  Rejected: 'Rejected',
};

export const STATUS_OPTIONS: StatusKey[] = ['Applied', 'Interview', 'Offer', 'Rejected'];

export const normalizeStatus = (status: string): StatusKey => {
  return STATUS_MAP[status] || 'Applied';
};

export const isValidStatus = (status: string): boolean => {
  return status in STATUS_MAP;
};

