/**
 * Custom hook for Dashboard business logic
 */

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApplications } from '../services/api';
import { useGmailSync } from './useGmailSync';
import { useResponsive } from './useResponsive';

export const useDashboard = (userLastSyncTime?: string) => {
  const [currentView, setCurrentView] = useState('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncSuccessModalOpen, setIsSyncSuccessModalOpen] = useState(false);
  const { isMobile } = useResponsive(1024);
  const { handleSync, isSyncing, lastSync, setLastSync } = useGmailSync();
  const prevIsSyncingRef = useRef(false);

  // Initialize lastSync from user data
  useEffect(() => {
    if (userLastSyncTime && !lastSync) {
      setLastSync(new Date(userLastSyncTime));
    }
  }, [userLastSyncTime, lastSync, setLastSync]);

  const { data: rawApplications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
  });
  const applications = rawApplications?.data || [];

  const handleGmailSync = () => {
    handleSync();
  };

  // Open sync success modal when sync completes
  useEffect(() => {
    if (prevIsSyncingRef.current && !isSyncing && lastSync) {
      setIsSyncSuccessModalOpen(true);
    }
    prevIsSyncingRef.current = isSyncing;
  }, [isSyncing, lastSync]);

  const handleBottomNavNavigate = (view: string) => {
    if (view === 'account') {
      setCurrentView('settings');
    } else {
      setCurrentView(view);
    }
  };

  return {
    currentView,
    setCurrentView,
    isAddModalOpen,
    setIsAddModalOpen,
    isSyncSuccessModalOpen,
    setIsSyncSuccessModalOpen,
    isMobile,
    applications,
    isLoading,
    handleGmailSync,
    isSyncing,
    lastSync,
    handleBottomNavNavigate,
  };
};

