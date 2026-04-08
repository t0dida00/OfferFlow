import {
  Plus,
  RefreshCw,
  Calendar,
  Moon,
  Sun,
  Menu,
  LogOut
} from 'lucide-react';
import { ApplicationsTable } from '../ApplicationsTable';
import { ChartsSection } from '../Charts';
import { AddApplicationModal } from '../AddApplication';
import { RecentEmailsList } from '../RecentEmails';
import { RecentApplicationsList } from '../RecentApplications';
import { SyncSuccessModal } from '../Common/SyncSuccessModal';
import { Sidebar } from '../../components/layout';
import { BottomNavigation } from '../../components/layout';
import { User } from '../../types';
import { useDashboard } from '../../hooks/useDashboard';
import './Dashboard.css';
import styles from './Dashboard.module.scss';
import logo from '../../public/icons/logo.svg';


interface DashboardProps {
  user: User | null;
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function Dashboard({ user, onLogout, isDarkMode = false, onToggleTheme }: DashboardProps) {
  const {
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
  } = useDashboard(user?.lastSyncTime);

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return (
          <div className={`${styles.dashboard__section} ${isMobile ? styles['dashboard__section--spacing-sm'] : ''}`}>
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
              <div className={styles.dashboard__emptyState}>
                <div className={styles.dashboard__emptyStateTitle}>Data loading</div>
              </div>
            ) : applications.length === 0 ? (
              <div className={styles.dashboard__emptyState}>
                <div className={styles.dashboard__emptyStateTitle}>No data</div>
                <p className={styles.dashboard__emptyStateText}>Sync your Gmail to get started tracking your job applications.</p>
                <button
                  onClick={handleGmailSync}
                  disabled={isSyncing}
                  className={styles.dashboard__emptyStateButton}
                >
                  <RefreshCw className={`${styles.dashboard__emptyStateIcon} ${isSyncing ? styles['dashboard__emptyStateIcon--spinning'] : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
                </button>
              </div>
            ) : (
              <>
                <ChartsSection applications={applications} />

                <div className={styles.dashboard__responsiveGrid}>
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
                    className={styles.dashboard__fullHeight}
                    onViewAll={() => setCurrentView('emails')}
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'applications':
        return (
          <div className={`${styles.dashboard__section} ${isMobile ? styles['dashboard__section--spacing-sm'] : ''}`}>
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
          <div className={`${styles.dashboard__section} ${isMobile ? styles['dashboard__section--spacing-sm'] : ''}`}>
            <div className={styles.dashboard__header}>
              <h2 className={styles.dashboard__title}>Recent Emails</h2>
              <button
                onClick={handleGmailSync}
                disabled={isSyncing}
                className={styles.dashboard__syncButton}
              >
                <RefreshCw className={`${styles.dashboard__iconSm} ${isSyncing ? styles['dashboard__icon--spin'] : ''}`} />
                <span className={styles.dashboard__syncText}>{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
              </button>
            </div>
            <RecentEmailsList onSync={handleGmailSync} isSyncing={isSyncing} />
          </div>
        );

      case 'calendar':
        return (
          <div className={styles.dashboard__calendarPlaceholder}>
            <div className={styles.dashboard__calendarIconWrapper}>
              <Calendar />
            </div>
            <h2 className={styles.dashboard__calendarTitle}>Calendar Coming Soon</h2>
            <p className={styles.dashboard__calendarText}>
              We're working hard to bring you a fully integrated calendar view. Stay tuned!
            </p>
          </div>
        );

      case 'settings':
      case 'account':
        return (
          <div className={`${styles.dashboard__section} ${isMobile ? styles['dashboard__section--spacing-sm'] : ''} ${styles.dashboard__sectionNarrow}`}>
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
    <div className={`${styles.dashboard__container} ${isMobile ? styles['dashboard__container--mobile'] : styles['dashboard__container--desktop']}`}>
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
              <Menu className={styles.dashboard__iconXs} />
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
              <RefreshCw className={`${styles.dashboard__iconXs} ${isSyncing ? styles['dashboard__icon--spin'] : ''}`} />
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
        <div className={styles.dashboard__contentWrapper}>
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

