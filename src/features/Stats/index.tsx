import { FileText, Send, Video, Award, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Application } from '../../types';
import { calculateApplicationStats } from '../../helpers/stats';
import styles from './StatsSection.module.scss';

interface StatsSectionProps {
  applications: Application[];
}

export function StatsSection({ applications }: StatsSectionProps) {
  const {
    totalApplications,
    applied,
    interviews,
    offers,
    rejected,
    responseRate,
  } = calculateApplicationStats(applications);

  const stats = [
    {
      label: 'Total Applications',
      value: totalApplications,
      icon: FileText,
      color: 'blue' as const,
    },
    {
      label: 'Applied',
      value: applied,
      icon: Send,
      color: 'gray' as const,
    },
    {
      label: 'Interviews',
      value: interviews,
      icon: Video,
      color: 'yellow' as const,
    },
    {
      label: 'Offers',
      value: offers,
      icon: Award,
      color: 'green' as const,
    },
    {
      label: 'Response Rate',
      value: `${responseRate}%`,
      icon: TrendingUp,
      color: 'indigo' as const,
    },
  ];

  return (
    <div className={styles.statsSection}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}

