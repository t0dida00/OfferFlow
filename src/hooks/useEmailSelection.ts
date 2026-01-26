/**
 * Custom hook for email selection modal business logic
 */

import { useState, useEffect, useMemo } from 'react';
import { Email } from '../types';
import { filterEmails } from '../utils/filtering';

export const useEmailSelection = (
  allEmails: Email[],
  selectedEmailIds: string[],
  isOpen: boolean
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState<Set<string>>(new Set(selectedEmailIds));

  useEffect(() => {
    if (isOpen) {
      setTempSelectedIds(new Set(selectedEmailIds));
    }
  }, [isOpen, selectedEmailIds]);

  const filteredEmails = useMemo(() => {
    return filterEmails(allEmails, searchQuery);
  }, [allEmails, searchQuery]);

  const toggleEmail = (id: string) => {
    const newSet = new Set(tempSelectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setTempSelectedIds(newSet);
  };

  const getSelectedIds = (): string[] => {
    return Array.from(tempSelectedIds);
  };

  return {
    searchQuery,
    setSearchQuery,
    tempSelectedIds,
    filteredEmails,
    toggleEmail,
    getSelectedIds,
  };
};

