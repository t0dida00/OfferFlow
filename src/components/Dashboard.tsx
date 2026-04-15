import { useState, useEffect } from 'react';
import {
  Plus,
  RefreshCw,
  Calendar,
  Moon,
  Sun,
  Menu,
  LogOut
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApplicationsTable } from './ApplicationsTable';
import { ChartsSection } from './ChartsSection';
import { AddApplicationModal } from './AddApplicationModal';
import { RecentEmailsList } from './RecentEmailsList';
import { EmailsTable } from './EmailsTable';
import { RecentApplicationsList } from './RecentApplicationsList';
import { SyncSuccessModal } from './SyncSuccessModal';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { fetchApplications, syncGmail } from '../services/api';
import { User } from '../types';
import './Dashboard.css';
import styles from './Dashboard.module.scss';
import logo from '../public/icons/logo.svg';


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
  const [isSyncSuccessModalOpen, setIsSyncSuccessModalOpen] = useState(false);
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

  const { data: rawApplications, isLoading } = useQuery({
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
      setIsSyncSuccessModalOpen(true);
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
            <div className={styles.dashboard__header}>
              <h2 className={styles.dashboard__title}>Overview</h2>
              <div className={styles.dashboard__actions}>
                {lastSync && (
                  <div className={styles.dashboard__lastSync}>
                    <Calendar className={styles.dashboard__iconSm} />
                    <span>Last sync: {lastSync.toLocaleString()}</span>
                  </div>
                )}
                <button
                  onClick={handleGmailSync}
                  disabled={isSyncing}
                  className={styles.dashboard__syncButton}
                >
                  <RefreshCw className={`${styles.dashboard__iconSm} ${isSyncing ? styles['dashboard__icon--spin'] : ''}`} />
                  <span className={styles.dashboard__syncText}>{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className={styles.dashboard__addButton}
                >
                  <Plus className={styles.dashboard__iconSm} />
                  <span className={styles.dashboard__addText}>Add Application</span>
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-2xl font-semibold dark:text-white">Data loading</div>
              </div>
            ) : applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-2xl font-semibold dark:text-white mb-2">No data</div>
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
            <div className={styles.dashboard__header}>
              <h2 className={styles.dashboard__title}>Applications</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className={styles.dashboard__addButton}
              >
                <Plus className={styles.dashboard__iconSm} />
                <span className={styles.dashboard__addText}>Add Application</span>
              </button>
            </div>
            <ApplicationsTable applications={applications} />
          </div>
        );

      case 'emails':
        return (
          <div className={`${isMobile ? 'space-y-4' : 'space-y-8'}`}>
            <div className={styles.dashboard__header}>
              <h2 className={styles.dashboard__title}>Emails</h2>
              <button
                onClick={handleGmailSync}
                disabled={isSyncing}
                className={styles.dashboard__syncButton}
              >
                <RefreshCw className={`${styles.dashboard__iconSm} ${isSyncing ? styles['dashboard__icon--spin'] : ''}`} />
                <span className={styles.dashboard__syncText}>{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
              </button>
            </div>
            <EmailsTable />
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
          <div className={`${isMobile ? 'space-y-4' : 'space-y-8'} ${styles.dashboard__sectionNarrow}`}>
            <div className={styles.dashboard__header}>
              <h2 className={styles.dashboard__title}>Account Settings</h2>
              {/* Only show theme toggle in Account Settings on mobile/tablet */}
              {onToggleTheme && isMobile && (
                <button
                  onClick={onToggleTheme}
                  className={styles.dashboard__themeButton}
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? (
                    <Sun className={styles.dashboard__iconSm} />
                  ) : (
                    <Moon className={styles.dashboard__iconSm} />
                  )}
                </button>
              )}
            </div>

            <div className={styles.dashboard__card}>
              <div className={styles.dashboard__cardHeader}>
                <h3>Profile Information</h3>
                <p>Update your account's profile information and email address.</p>
              </div>
              <div className={styles.dashboard__cardBody}>
                <div className={styles.dashboard__grid}>
                  <div className={styles.dashboard__field}>
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      readOnly
                    />
                  </div>
                  <div className={styles.dashboard__field}>
                    <label>Email Address</label>
                    <input
                      type="text"
                      value={user?.email || ''}
                      readOnly
                    />
                  </div>
                </div>

                <div className={styles.dashboard__cardFooter}>
                  <button
                    onClick={onLogout}
                    className={styles.dashboard__logoutButton}
                  >
                    <LogOut className={styles.dashboard__iconSm} />
                    Logout
                  </button>
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
              style={{ visibility: 'hidden' }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div

              // className="mobile-header__icon-button"
              aria-label="Go to overview"
              onClick={() => setCurrentView('overview')}
            >
              <img src={logo} alt="Logo" />
            </div>
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

      {/* Sync Success Modal */}
      {isSyncSuccessModalOpen && (
        <SyncSuccessModal onClose={() => setIsSyncSuccessModalOpen(false)} />
      )}
    </div>
  );
}
