import { Building2, MapPin, DollarSign, Calendar, FileText } from 'lucide-react';
import clsx from 'clsx';
import styles from './ApplicationCard.module.scss';

type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';

interface Application {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdate: string;
  salary: string;
  location: string;
  notes: string;
}

interface ApplicationCardProps {
  application: Application;
}

const statusConfig = {
  applied: {
    label: 'Applied',
    statusClass: 'applied',
  },
  interview: {
    label: 'Interview',
    statusClass: 'interview',
  },
  offer: {
    label: 'Offer Received',
    statusClass: 'offer',
  },
  rejected: {
    label: 'Rejected',
    statusClass: 'rejected',
  },
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const status = statusConfig[application.status];

  return (
    <div className={styles.applicationCard}>
      <div className={styles.applicationCard__header}>
        <div className={styles.applicationCard__main}>
          <div className={styles.applicationCard__info}>
            <div className={styles.applicationCard__icon}>
              <Building2 />
            </div>
            <div className={styles.applicationCard__details}>
              <h3 className={styles.applicationCard__position}>{application.position}</h3>
              <p className={styles.applicationCard__company}>{application.company}</p>
            </div>
          </div>
        </div>

        <div
          className={clsx(
            styles.applicationCard__status,
            styles[`applicationCard__status--${status.statusClass}`],
          )}
        >
          <div
            className={clsx(
              styles.applicationCard__statusDot,
              styles[`applicationCard__statusDot--${status.statusClass}`],
            )}
          />
          <span>{status.label}</span>
        </div>
      </div>

      <div className={styles.applicationCard__grid}>
        <div className={styles.applicationCard__meta}>
          <MapPin />
          <span>{application.location}</span>
        </div>
        <div className={styles.applicationCard__meta}>
          <DollarSign />
          <span>{application.salary}</span>
        </div>
        <div className={styles.applicationCard__meta}>
          <Calendar />
          <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
        </div>
        <div className={styles.applicationCard__meta}>
          <Calendar />
          <span>Updated: {new Date(application.lastUpdate).toLocaleDateString()}</span>
        </div>
      </div>

      {application.notes && (
        <div className={styles.applicationCard__notes}>
          <FileText />
          <p>{application.notes}</p>
        </div>
      )}
    </div>
  );
}
