/**
 * Custom hook for ApplicationDetailsModal business logic
 */

import { useState } from 'react';
import { Application } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import { getRelatedEmails } from '../helpers/email';

export const useApplicationDetails = (application: Application) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    company: application.company,
    role: application.role,
    location: application.location,
    date: application.date,
    status: application.status,
    emailIds: application.emailIds || [],
  });
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Get all emails from cache to find related ones
  const allEmails = queryClient.getQueryData<any>(['emails'])?.data || [];

  const relatedEmails = getRelatedEmails(allEmails, formData.emailIds);

  const handleEmailSelectionSave = (newEmailIds: string[]) => {
    setFormData(prev => ({ ...prev, emailIds: newEmailIds }));
  };

  return {
    formData,
    setFormData,
    isEmailModalOpen,
    setIsEmailModalOpen,
    allEmails,
    relatedEmails,
    handleEmailSelectionSave,
  };
};

