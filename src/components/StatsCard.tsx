import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'gray' | 'yellow' | 'green' | 'red' | 'indigo';
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
  },
  gray: {
    bg: 'bg-gray-50 dark:bg-gray-500/10',
    text: 'text-gray-600 dark:text-gray-400',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-500/10',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
};

export function StatsCard({ label, value, icon: Icon, color }: StatsCardProps) {
  const styles = colorStyles[color];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <div className={`p-2 rounded-lg ${styles.bg} ${styles.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
      </div>
    </div>
  );
}
