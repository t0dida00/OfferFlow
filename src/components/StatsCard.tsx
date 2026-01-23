import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import styles from './StatsCard.module.scss';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'gray' | 'yellow' | 'green' | 'red' | 'indigo';
}

export function StatsCard({ label, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className={styles.statsCard}>
      <div className={styles.statsCard__header}>
        <p className={styles.statsCard__label}>
          {label}
        </p>
        <div className={clsx(styles.statsCard__iconWrapper, styles[`statsCard__iconWrapper--${color}`])}>
          <Icon />
        </div>
      </div>
      <div>
        <h3 className={styles.statsCard__value}>
          {value}
        </h3>
      </div>
    </div>
  );
}
