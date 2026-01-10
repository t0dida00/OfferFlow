import { FileText, Send, Video, Award, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface Application {
  _id: string;
  company: string;
  role: string;
  location: string;
  date: string;
  status: string;
}

interface StatsSectionProps {
  applications: Application[];
}

export function StatsSection({ applications }: StatsSectionProps) {
  const totalApplications = applications.length;
  const interviews = applications.filter(app => app.status === 'Interview').length;
  const offers = applications.filter(app => app.status === 'Offer').length;
  const applied = applications.filter(app => app.status === 'Applied').length;
  const rejected = applications.filter(app => app.status === 'Rejected').length;

  // Calculate response rate
  const responseRate = totalApplications > 0
    ? Math.round(((interviews + offers + rejected) / totalApplications) * 100)
    : 0;

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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