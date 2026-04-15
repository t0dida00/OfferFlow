import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from '../../layouts/Dashboard';
import { fetchApplications } from '../../services/api';
import { ApplicationsTable } from './ApplicationsTable';
import styles from '../../layouts/Dashboard/Dashboard.module.scss';

export function ApplicationsPage() {
  const { openAddModal, isMobile } = useOutletContext<DashboardOutletContext>();

  const { data: rawApplications } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
  });
  const applications = rawApplications?.data || [];

  return (
    <div className={`${isMobile ? 'space-y-4' : 'space-y-8'}`}>
      <div className={styles.dashboard__header}>
        <h2 className={styles.dashboard__title}>Applications</h2>
        <button
          onClick={openAddModal}
          className={styles.dashboard__addButton}
        >
          <Plus className={styles.dashboard__iconSm} />
          <span className={styles.dashboard__addText}>Add Application</span>
        </button>
      </div>
      <ApplicationsTable applications={applications} />
    </div>
  );
}
