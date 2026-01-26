import { useState } from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

import { Application } from '../../types';
import { ApplicationDetailsModal } from '../ApplicationDetails';
import { StatusModal } from '../Common/StatusModal';
import { useRecentApplications } from '../../hooks/useRecentApplications';
import { useApplicationMutation } from '../../hooks/useApplicationMutation';
import { normalizeStatus } from '../../utils/status';
import { formatDate } from '../../utils/date';
import styles from './RecentApplicationsList.module.scss';

interface RecentApplicationsListProps {
  applications: Application[];
  onViewAll?: () => void;
}

export function RecentApplicationsList({ applications, onViewAll }: RecentApplicationsListProps) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const { recentApplications } = useRecentApplications(applications, 5);
  const { handleUpdateApp, isSaving, statusModal, setStatusModal } = useApplicationMutation();

  const handleSave = (id: string, updates: Partial<Application>) => {
    handleUpdateApp({ id, data: updates });
    setSelectedApp(null);
  };

  return (
    <div className={styles.recentApps} style={{ height: 'fit-content' }}>
      <div className={styles.recentApps__sidebar}>
        <div>
          <h2 className={styles.recentApps__title}>
            <Briefcase className={styles.recentApps__icon} />
            Recent Applications
          </h2>
          <p className={styles.recentApps__subtitle}>Last 5 applications</p>
        </div>
        {onViewAll && (
          <button type="button" onClick={onViewAll} className={styles.recentApps__button}>
            View All <ArrowRight className={styles.recentApps__buttonIcon} />
          </button>
        )}
      </div>

      <div className={styles.recentApps__listWrapper} style={{ height: 'fit-content' }}>
        {recentApplications.length > 0 ? (
          <div className={styles.recentApps__list}>
            {recentApplications.map((app) => {
              const statusKey = normalizeStatus(app.status);
              return (
                <div
                  key={app._id}
                  onClick={() => setSelectedApp(app)}
                  className={styles.recentApps__item}
                >
                  <div className={styles.recentApps__itemHeader}>
                    <div>
                      <h4 className={styles.recentApps__company}>{app.company}</h4>
                      <p className={styles.recentApps__role}>{app.role}</p>
                    </div>
                    <div className={styles.recentApps__statusWrapper}>
                      <span
                        className={clsx(
                          styles.recentApps__status,
                          styles[`recentApps__status--${statusKey}`],
                        )}
                      >
                        {app.status}
                      </span>
                      <span className={styles.recentApps__date}>
                        {formatDate(app.date)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.recentApps__meta}>
                    <span>{app.location}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.recentApps__empty}>
            <p className={styles['recentApps__empty-title']}>No applications yet</p>
            <p className={styles['recentApps__empty-text']}>Add an application to see it here</p>
          </div>
        )}
      </div>

      {selectedApp && (
        <ApplicationDetailsModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {statusModal && (
        <StatusModal
          type={statusModal.type}
          title={statusModal.title}
          message={statusModal.message}
          onClose={() => setStatusModal(null)}
        />
      )}
    </div>
  );
}

