import { useQuery } from '@tanstack/react-query';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { DashboardOutletContext } from '../../layouts/Dashboard';
import { fetchApplications } from '../../services/api';
import { ChartsSection } from './ChartsSection';
import { RecentApplicationsList } from './RecentApplicationsList';
import { RecentEmailsList } from './RecentEmailsList';
import styles from '../../layouts/Dashboard/Dashboard.module.scss';

export function OverviewPage() {
  const { lastSync, isSyncing, handleGmailSync, openAddModal, isMobile } = useOutletContext<DashboardOutletContext>();
  const navigate = useNavigate();

  const { data: rawApplications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
  });
  const applications = rawApplications?.data || [];

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
            onClick={openAddModal}
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
            <RecentApplicationsList
              applications={applications}
              onViewAll={() => navigate('/applications')}
            />

            <RecentEmailsList
              onSync={handleGmailSync}
              isSyncing={isSyncing}
              limit={5}
              className="h-full"
              onViewAll={() => navigate('/emails')}
            />
          </div>
        </>
      )}
    </div>
  );
}
