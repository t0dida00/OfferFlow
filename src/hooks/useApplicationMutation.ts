/**
 * Custom hook for application mutation operations
 */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Application } from '../types';
import { updateApplication } from '../services/api';

export interface StatusModalState {
  type: 'success' | 'error' | 'loading';
  title: string;
  message: string;
}

export const useApplicationMutation = () => {
  const queryClient = useQueryClient();
  const [statusModal, setStatusModal] = useState<StatusModalState | null>(null);

  const { mutate: handleUpdateApp, isPending: isSaving } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Application> }) => {
      const start = Date.now();
      const result = await updateApplication(id, data);
      const elapsed = Date.now() - start;
      if (elapsed < 2000) {
        await new Promise(resolve => setTimeout(resolve, 2000 - elapsed));
      }
      return result;
    },
    onMutate: () => {
      setStatusModal({
        type: 'loading',
        title: 'Updating Application',
        message: 'Please wait while we update your application details...',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setStatusModal({
        type: 'success',
        title: 'Update Successful',
        message: 'The application details have been successfully updated.',
      });
    },
    onError: (error) => {
      console.error('Failed to update application', error);
      setStatusModal({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update application. Please try again.',
      });
    },
  });

  return {
    handleUpdateApp,
    isSaving,
    statusModal,
    setStatusModal,
  };
};

