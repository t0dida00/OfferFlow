import { useState, useEffect } from 'react';
import {
  Plus,
  RefreshCw,
  Calendar,
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
import styles from './Dashboard.module.scss';
import clsx from 'clsx';


interface DashboardProps {
  user: User | null;
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
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
          <div className={styles.dashboard__section}>
            <div className={styles.dashboard__headerRow}>
              <div className={styles.dashboard__header}>
                <h2 className={styles.dashboard__title}>Overview</h2>
                <div className={styles.dashboard__actions}>
                  {lastSync && (
                    <div className={styles['dashboard__last-sync--desktop']}>
                      <Calendar className={styles.dashboard__iconSm} />
                      <span>Last sync: {lastSync.toLocaleString()}</span>
                    </div>
                  )}
                  <button
                    onClick={handleGmailSync}
                    disabled={isSyncing}
                    className={styles.dashboard__syncButton}
                  >
                    <RefreshCw
                      className={clsx(styles.dashboard__iconSm, {
                        [styles['dashboard__icon--spin']]: isSyncing,
                      })}
                    />
                    <span className={styles.dashboard__syncText}>
                      {isSyncing ? 'Syncing...' : 'Sync Gmail'}
                    </span>
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

              {lastSync && (
                <div className={styles['dashboard__last-sync--mobile']}>
                  <Calendar className={styles.dashboard__iconSm} />
                  <span>Last sync: {lastSync.toLocaleString()}</span>
                </div>
              )}
            </div>

            {applications.length === 0 ? (
              <div className={styles.dashboard__empty}>
                <div className={styles.dashboard__emptyTitle}>No Data</div>
                <p className={styles.dashboard__emptyText}>
                  Sync your Gmail to get started tracking your job applications.
                </p>
                <button
                  onClick={handleGmailSync}
                  disabled={isSyncing}
                  className={styles.dashboard__primaryButton}
                >
                  <RefreshCw
                    className={clsx(styles.dashboard__iconMd, {
                      [styles['dashboard__icon--spin']]: isSyncing,
                    })}
                  />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
                </button>
              </div>
            ) : (
              <>
                <ChartsSection applications={applications} />

                <div className={styles.dashboard__grid}>
                  <RecentApplicationsList
                    applications={applications}
                    onViewAll={() => setCurrentView('applications')}
                  />

                  <RecentEmailsList
                    onSync={handleGmailSync}
                    isSyncing={isSyncing}
                    limit={5}
                    onViewAll={() => setCurrentView('emails')}
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'applications':
        return (
          <div className={styles.dashboard__section}>
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
          <div className={styles.dashboard__section}>
            <div className={styles.dashboard__header}>
              <h2 className={styles.dashboard__title}>Recent Emails</h2>
              <button
                onClick={handleGmailSync}
                disabled={isSyncing}
                className={styles.dashboard__syncButton}
              >
                <RefreshCw
                  className={clsx(styles.dashboard__iconSm, {
                    [styles['dashboard__icon--spin']]: isSyncing,
                  })}
                />
                <span className={styles.dashboard__syncText}>
                  {isSyncing ? 'Syncing...' : 'Sync Gmail'}
                </span>
              </button>
            </div>
            <RecentEmailsList onSync={handleGmailSync} isSyncing={isSyncing} />
          </div>
        );

      case 'calendar':
        return (
          <div className={styles.dashboard__calendar}>
            <div className={styles.dashboard__calendarIcon}>
              <Calendar />
            </div>
            <h2 className={styles.dashboard__title}>Calendar Coming Soon</h2>
            <p className={styles.dashboard__mutedText}>
              We're working hard to bring you a fully integrated calendar view. Stay tuned!
            </p>
          </div>
        );

      case 'settings':
      case 'account':
        return (
          <div className={clsx(styles.dashboard__section, styles.dashboard__sectionNarrow)}>
            <div className={styles.dashboard__header}>
              <h2 className={styles.dashboard__title}>Account Settings</h2>
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
                    <input type="text" value={user?.name || ''} readOnly />
                  </div>
                  <div className={styles.dashboard__field}>
                    <label>Email Address</label>
                    <input type="text" value={user?.email || ''} readOnly />
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
    <div
      className={clsx(styles.dashboard, {
        [styles['dashboard--mobile']]: isMobile,
        [styles['dashboard--desktop']]: !isMobile,
      })}
    >
      {/* Mobile Header - fixed at top */}
      {isMobile && (
        <header className={styles.dashboard__mobileHeader}>
          <div className={styles.dashboard__mobileContent}>
            <button
              type="button"
              className={styles.dashboard__mobileIcon}
              aria-label="Open menu"
            >
              <Menu className={styles.dashboard__iconSm} />
            </button>
            <button
              type="button"
              className={styles.dashboard__mobileIcon}
              aria-label="Go to overview"
              onClick={() => setCurrentView('overview')}
            >
              <Home className={styles.dashboard__iconSm} />
            </button>
            <button
              type="button"
              className={styles.dashboard__mobileIcon}
              aria-label="Sync Gmail"
              onClick={handleGmailSync}
              disabled={isSyncing}
            >
              <RefreshCw
                className={clsx(styles.dashboard__iconSm, {
                  [styles['dashboard__icon--spin']]: isSyncing,
                })}
              />
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

      <main className={styles.dashboard__main}>
        <div className={styles.dashboard__content}>
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
