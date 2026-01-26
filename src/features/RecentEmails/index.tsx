import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

import { Mail, RefreshCw, ArrowRight } from 'lucide-react';
import { fetchEmails } from '../../services/api';
import { useRecentEmails } from '../../hooks/useRecentEmails';
import { normalizeStatus } from '../../utils/status';
import { formatDate } from '../../utils/date';
import { getGmailInboxUrl } from '../../helpers/email';
import styles from './RecentEmailsList.module.scss';

interface RecentEmailsListProps {
  onSync: () => void;
  isSyncing: boolean;
  limit?: number;
  className?: string;
  onViewAll?: () => void;
}

export function RecentEmailsList({ onSync, isSyncing, limit, className, onViewAll }: RecentEmailsListProps) {
  const { data: rawEmails, isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: fetchEmails,
  });

  const allEmails = rawEmails?.data || [];
  const { recentEmails, totalEmails } = useRecentEmails(allEmails, limit);

  return (
    <div className={clsx(styles.recentEmails, className)} style={{ height: 'fit-content' }}>
      <div className={styles.recentEmails__sidebar}>
        <div>
          <h2 className={styles.recentEmails__title}>
            <Mail className={styles.recentEmails__icon} />
            Recent Related Emails
          </h2>
          {limit ? (
            <p className={styles.recentEmails__subtitle}>Last {limit} items</p>
          ) : (
            <p className={styles.recentEmails__subtitle}>Total {totalEmails} emails</p>
          )}
        </div>
        {onViewAll && (
          <button type="button" onClick={onViewAll} className={styles.recentEmails__button}>
            View All <ArrowRight className={styles.recentEmails__buttonIcon} />
          </button>
        )}
      </div>

      <div className={styles.recentEmails__listWrapper} style={{ height: 'fit-content' }}>
        {isLoading ? (
          <div className={styles.recentEmails__loader}>
            <RefreshCw className={styles.recentEmails__spinner} />
          </div>
        ) : recentEmails.length > 0 ? (
          <div className={styles.recentEmails__list}>
            {recentEmails.map((email) => {
              const statusKey = normalizeStatus(email.status);
              const statusClass = clsx(
                styles.recentEmails__status,
                styles[`recentEmails__status--${statusKey}`],
              );

              return (
                <div
                  key={email.emailId}
                  className={styles.recentEmails__item}
                  onClick={() =>
                    window.open(getGmailInboxUrl(email.emailId), '_blank')
                  }
                >
                  <div className={styles.recentEmails__itemHeader}>
                    <div>
                      <h4 className={styles.recentEmails__subject}>{email.subject}</h4>
                      <p className={styles.recentEmails__snippet}>{email.snippet}</p>
                    </div>
                    <div className={styles.recentEmails__statusWrapper}>
                      <span className={statusClass}>{email.status}</span>
                      <span className={styles.recentEmails__date}>
                        {formatDate(email.date)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.recentEmails__empty}>
            <p className={styles['recentEmails__empty-title']}>No Recent Emails</p>
            <p className={styles['recentEmails__empty-text']}>
              Sync your Gmail to see your recent job-related emails here.
            </p>
            <button
              type="button"
              onClick={onSync}
              disabled={isSyncing}
              className={styles['recentEmails__empty-button']}
            >
              <RefreshCw className={isSyncing ? styles.recentEmails__spinner : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

