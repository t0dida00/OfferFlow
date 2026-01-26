/**
 * Custom hook for Gmail sync operations
 */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncGmail } from '../services/api';

export const useGmailSync = () => {
  const queryClient = useQueryClient();
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const { mutate: handleSync, isPending: isSyncing } = useMutation({
    mutationFn: syncGmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      setLastSync(new Date());
    },
    onError: (error) => {
      console.error('Failed to sync Gmail:', error);
    },
  });

  return {
    handleSync,
    isSyncing,
    lastSync,
    setLastSync,
  };
};

