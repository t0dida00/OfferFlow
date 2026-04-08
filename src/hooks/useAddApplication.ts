/**
 * Custom hook for AddApplication form business logic
 */

import { useState } from 'react';
import { formatDateForInput } from '../utils/date';

export interface AddApplicationFormData {
  company: string;
  role: string;
  location: string;
  dateApplied: string;
  result: string;
}

const getDefaultDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useAddApplication = () => {
  const [formData, setFormData] = useState<AddApplicationFormData>({
    company: '',
    role: '',
    location: '',
    dateApplied: getDefaultDate(),
    result: 'Applied',
  });

  const updateField = <K extends keyof AddApplicationFormData>(
    field: K,
    value: AddApplicationFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      location: '',
      dateApplied: getDefaultDate(),
      result: 'Applied',
    });
  };

  const handleSubmit = (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    // In production with Supabase, this would save to database
    console.log('Adding application:', formData);
    if (onSuccess) {
      onSuccess();
    }
    resetForm();
  };

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
    handleSubmit,
  };
};

