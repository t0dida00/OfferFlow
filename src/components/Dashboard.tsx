import { useState, useEffect } from 'react';
import {
  Plus,
  RefreshCw,
  Calendar,
  Moon,
  Sun,
  Menu,
  Home
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApplicationsTable } from './ApplicationsTable';
import { ChartsSection } from './ChartsSection';
import { AddApplicationModal } from './AddApplicationModal';
import { RecentEmailsList } from './RecentEmailsList';
import { RecentApplicationsList } from './RecentApplicationsList';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { fetchApplications, syncGmail } from '../services/api';
import { User } from '../types';
import './Dashboard.css';


interface DashboardProps {
  user: User | null;
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function Dashboard({ user, onLogout, isDarkMode = false, onToggleTheme }: DashboardProps) {
  const queryClient = useQueryClient();
  const [currentView, setCurrentView] = useState('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(user?.lastSyncTime ? new Date(user.lastSyncTime) : null);
  // Initialize with a check to avoid flash of sidebar on mobile
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 1024;
    }
    // Default to mobile to be safe (will be corrected by useEffect)
    return true;
  });

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const mobile = width <= 1024;
      setIsMobile(mobile);
    };
    
    // Check immediately on mount
    checkMobile();
    
    // Also check on resize
    window.addEventListener('resize', checkMobile);
    
    // Check on orientation change (for mobile devices)
    window.addEventListener('orientationchange', () => {
      // Small delay to ensure orientation change is complete
      setTimeout(checkMobile, 100);
    });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Map bottom nav items to views
  const handleBottomNavNavigate = (view: string) => {
    if (view === 'account') {
      setCurrentView('settings');
    } else {
      setCurrentView(view);
    }
  };

  const { data: rawApplications } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
  });
  const applications = rawApplications?.data || [];

  const { mutate: handleSync, isPending: isSyncing } = useMutation({
    mutationFn: syncGmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      setLastSync(new Date());
    },
    onError: (error) => {
      console.error('Failed to sync Gmail:', error);
    }
  });

  const handleGmailSync = () => {
    handleSync();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return (
          <div className={`${isMobile ? 'space-y-4' : 'space-y-8'}`}>
            <div className="flex flex-col gap-4">
              <div className="responsive-flex-header">
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`} style={{ paddingLeft: isMobile ? '2px' : '0' }}>Overview</h2>
                <div className="responsive-flex items-center">
                  {lastSync && (
                    <div className="last-sync-desktop flex-row items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Calendar className="w-4 h-4" />
                      <span>Last sync: {lastSync.toLocaleString()}</span>
                    </div>
                  )}
                  <button
                    onClick={handleGmailSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50 overview-sync-btn"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span className="overview-sync-text">{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg btn-primary overview-add-btn"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="overview-add-text">Add Application</span>
                  </button>
                </div>
              </div>

              {lastSync && (
                <div className="last-sync-mobile flex-row items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 w-full">
                  <Calendar className="w-4 h-4" />
                  <span>Last sync: {lastSync.toLocaleString()}</span>
                </div>
              )}
            </div>

            {applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-2xl font-semibold dark:text-white mb-2">No Data</div>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Sync your Gmail to get started tracking your job applications.</p>
                <button
                  onClick={handleGmailSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 rounded-lg disabled:opacity-50 font-medium btn-primary"
                >
                  <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
                </button>
              </div>
            ) : (
              <>
                <ChartsSection applications={applications} />

                <div className="responsive-grid mt-8">
                  {/* Recent Applications List */}
                  <RecentApplicationsList
                    applications={applications}
                    onViewAll={() => setCurrentView('applications')}
                  />

                  {/* Recent Emails List */}
                  <RecentEmailsList
                    onSync={handleGmailSync}
                    isSyncing={isSyncing}
                    limit={5}
                    className="h-full"
                    onViewAll={() => setCurrentView('emails')}
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'applications':
        return (
          <div className={`${isMobile ? 'space-y-4' : 'space-y-8'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`} style={{ paddingLeft: isMobile ? '2px' : '0' }}>Applications</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 rounded-lg btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span>Add Application</span>
              </button>
            </div>
            <ApplicationsTable applications={applications} />
          </div>
        );

      case 'emails':
        return (
          <div className={`${isMobile ? 'space-y-4' : 'space-y-8'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`} style={{ paddingLeft: isMobile ? '2px' : '0' }}>Recent Emails</h2>
              <button
                onClick={handleGmailSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
              </button>
            </div>
            <RecentEmailsList onSync={handleGmailSync} isSyncing={isSyncing} />
          </div>
        );

      case 'calendar':
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Calendar Coming Soon</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              We're working hard to bring you a fully integrated calendar view. Stay tuned!
            </p>
          </div>
        );

      case 'settings':
      case 'account':
        return (
          <div className={`max-w-4xl ${isMobile ? 'space-y-4' : 'space-y-8'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`} style={{ paddingLeft: isMobile ? '2px' : '0' }}>Account Settings</h2>
              {/* Only show theme toggle in Account Settings on mobile/tablet */}
              {onToggleTheme && isMobile && (
                <button
                  onClick={onToggleTheme}
                  className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg border transition-all hover:scale-110 group"
                  aria-label="Toggle theme"
                  style={{
                    backgroundColor: isDarkMode ? '#FFF' : '#232F3F',
                    borderColor: isDarkMode ? '#232F3F' : '#FFF'
                  }}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" style={{ color: '#232F3F' }} />
                  ) : (
                    <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" style={{ color: '#FFF' }} />
                  )}
                </button>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your account's profile information and email address.</p>
              </div>
              <div className="p-6 space-y-8">
                <div className="responsive-grid">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input
                      type="text"
                      value={user?.email || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className={`flex min-h-screen bg-gray-50 dark:bg-gray-900 ${isMobile ? 'mobile-view' : 'desktop-view'}`}>
      {/* Mobile Header - fixed at top */}
      {isMobile && (
        <header className="mobile-header">
          <div className="mobile-header__content">
            <button
              type="button"
              className="mobile-header__icon-button"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="mobile-header__icon-button"
              aria-label="Go to overview"
              onClick={() => setCurrentView('overview')}
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="mobile-header__icon-button"
              aria-label="Sync Gmail"
              onClick={handleGmailSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>
      )}
      {/* Desktop Sidebar - only render on desktop (> 1024px) */}
      {!isMobile && (
        <Sidebar
          user={user}
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={onLogout}
        />
      )}

      <main className="flex-1 min-w-0 transition-all duration-300">
        <div className={`max-w-[1440px] mx-auto ${isMobile ? 'p-4' : 'p-4 sm:p-6 lg:p-6'} ${isMobile ? 'mt-2' : 'mt-6'}`}>
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation - shown on mobile/tablet */}
      {isMobile && (
        <BottomNavigation
          currentView={currentView === 'settings' ? 'account' : currentView}
          onNavigate={handleBottomNavNavigate}
          onAddClick={() => setIsAddModalOpen(true)}
        />
      )}

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <AddApplicationModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}
