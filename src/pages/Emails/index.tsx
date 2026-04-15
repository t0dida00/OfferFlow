import { RefreshCw } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from '../../layouts/Dashboard';
import { EmailsTable } from './EmailsTable';
import styles from '../../layouts/Dashboard/Dashboard.module.scss';

export function EmailsPage() {
  const { isSyncing, handleGmailSync, isMobile } = useOutletContext<DashboardOutletContext>();

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
}
